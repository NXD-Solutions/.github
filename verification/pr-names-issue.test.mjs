import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  check, crossRepoClaims, decide, failureAnnotation, hintsFor, readLinked, scanLinkedBranch,
  EXEMPT_HEAD_PREFIXES, WAIT_MINUTES, POLL_SECONDS, SCAN_MAX_PAGES, SCAN_PAGE_SIZE, SCAN_EVERY,
} from '../scripts/pr-names-issue.mjs';

// The promise (NXD-Solutions/.github#408), one test per guarantee. Fixture reads only: no GitHub call anywhere in this suite. That the workflow does what these say
// is the run of the workflow on the scratch repository, recorded on the issue.

const MAIN = { baseRef: 'main', defaultBranch: 'main' };
const FEATURE = { baseRef: 'feature/x', defaultBranch: 'main' };
const issue = (number, extra = {}) => ({ repo: 'NXD-Solutions/dna', number, ...extra });

// A clock and sleeper that advance together: no real waiting.
const clock = () => { let t = 0; return { now: () => t, sleep: async (ms) => { t += ms; } }; };

test('a pull request into the default branch with at least one issue in its Development field passes, however it was linked', async () => {
  const { now, sleep } = clock();
  for (const body of ['Closes #1', 'nothing here', '']) {
    const r = await check({ ...MAIN, headRef: 'feature/x', body, read: async () => [issue(1)], scan: async () => assert.fail('no scan into the default branch'), now, sleep });
    assert.equal(r.status, 'pass', body);
    assert.match(r.message, /Has an issue in its Development field: NXD-Solutions\/dna#1\./);
  }
  assert.equal(decide({ ...MAIN, headRef: 'feature/x', linked: [issue(1), issue(2)] }).message, 'Has an issue in its Development field: NXD-Solutions/dna#1, NXD-Solutions/dna#2.');
});

test('one with none fails, naming the missing link and the ways to give one', async () => {
  const { now, sleep } = clock();
  const r = await check({ ...MAIN, headRef: 'feature/x', body: 'nothing', read: async () => [], scan: async () => assert.fail('no scan'), now, sleep, waitMinutes: 0 });
  assert.equal(r.status, 'fail');
  assert.match(r.message, /no issue in its Development field/);
  assert.match(r.message, /closing keyword/);
  assert.match(r.message, /branch created from the issue/);
  assert.match(r.message, /Development sidebar/);
});

test('the decision reads GitHub, not the text: a body full of keywords passes nothing when GitHub links nothing, and a linked issue passes whatever the body says', () => {
  assert.equal(decide({ ...MAIN, headRef: 'feature/x', linked: [], body: 'Closes #1\nFixes #2\nCloses the loop on #3' }).status, 'fail');
  assert.equal(decide({ ...MAIN, headRef: 'feature/x', linked: [issue(1)], body: 'Relates to #1' }).status, 'pass');
  assert.equal(decide({ ...MAIN, headRef: 'feature/x', linked: [issue(1)], body: '' }).status, 'pass');
});

test('`Closes <repo>#n` without its owner, which GitHub links to nothing, fails and the message says why; with the owner it is the same as any other link', () => {
  const r = decide({ ...MAIN, headRef: 'feature/x', linked: [], body: 'Closes Prototype#12' });
  assert.equal(r.status, 'fail');
  assert.match(r.message, /without its owner links to nothing: write `Closes <owner>\/<repo>#n`/);
  assert.deepEqual(hintsFor('Closes NXD-Solutions/Prototype#12'), []);
  assert.equal(decide({ ...MAIN, headRef: 'feature/x', linked: [{ repo: 'NXD-Solutions/Prototype', number: 12 }], body: 'Closes NXD-Solutions/Prototype#12' }).status, 'pass');
});

test('a closing keyword naming another repository with its owner passes when GitHub shows no link, and the message says the issue could not be confirmed (option 2, observed case 13)', async () => {
  const claim = (body, extra = {}) => decide({ ...MAIN, headRef: 'feature/x', linked: [], body, repo: 'NXD-Solutions/packages', ...extra });
  const r = claim('Closes NXD-Solutions/Manager-Assistant-Plan#349');
  assert.equal(r.status, 'pass');
  assert.match(r.message, /Names an issue in another repository, NXD-Solutions\/Manager-Assistant-Plan#349/);
  assert.match(r.message, /the check could not confirm that the issue exists/);
  assert.match(r.message, /token reads only this repository/);
  for (const body of ['Fixes other/repo#1', 'Resolves other/repo#1', '- Closes: other/repo#1', 'closes other/repo#1']) assert.equal(claim(body).status, 'pass', body);
  // A wrong number passes: GitHub's link is what would prove the issue exists.
  assert.equal(claim('Closes NXD-Solutions/Manager-Assistant-Plan#999999').status, 'pass');
  // What does not qualify.
  assert.equal(claim('Relates to NXD-Solutions/Manager-Assistant-Plan#349').status, 'fail', '`Relates to` never counts');
  assert.equal(claim('Closes Manager-Assistant-Plan#349').status, 'fail', 'without the owner GitHub links nothing');
  assert.equal(claim('Closes NXD-Solutions/packages#349').status, 'fail', 'a keyword naming this repository is read by GitHub: when it shows no link there is none');
  assert.equal(claim('Closes nxd-solutions/PACKAGES#349').status, 'fail', 'the repository is compared in any letter case');
  assert.equal(claim('<!-- Closes other/repo#1 -->\n```\nCloses other/repo#2\n```').status, 'fail', 'an example is no statement');
  assert.equal(claim('See other/repo#1 and Closes the loop on other/repo#2').status, 'fail', 'a mention is not a keyword line');
  assert.equal(decide({ ...FEATURE, headRef: 'task/x', linked: [], body: 'Closes other/repo#1', repo: 'NXD-Solutions/packages' }).status, 'fail', 'into a feature branch GitHub honours no keyword, so none counts');
  assert.equal(decide({ ...MAIN, headRef: 'feature/x', linked: [issue(1)], body: 'Closes other/repo#9', repo: 'NXD-Solutions/packages' }).message, 'Has an issue in its Development field: NXD-Solutions/dna#1.', 'what GitHub shows is preferred');
  const { now, sleep } = clock();
  const run = await check({ ...MAIN, headRef: 'feature/x', body: 'Closes NXD-Solutions/Manager-Assistant-Plan#349', repo: 'NXD-Solutions/Prototype', read: async () => [], scan: async () => assert.fail('no scan'), now, sleep });
  assert.equal(run.status, 'pass');
  assert.equal(run.waited, false, 'a claim passes at once, with no ten-minute wait');
  assert.deepEqual(crossRepoClaims('Closes a/b#1\nFixes a/b#2', 'x/y').map((c) => c.number), [1, 2]);
});

test('`Relates to` alone fails with no transition period, its message pointing to the leaf-issue rule', () => {
  const r = decide({ ...MAIN, headRef: 'feature/x', linked: [], body: 'Relates to NXD-Solutions/dna#1' });
  assert.equal(r.status, 'fail');
  assert.match(r.message, /`Relates to` links nothing and does not count/);
  assert.match(r.message, /Issue linkage and closure/);
  assert.match(r.message, /dna#1932/);
  assert.deepEqual(hintsFor('<!-- Relates to #1 -->\n```\nRelates to #2\n```'), [], 'a line inside a comment or a code fence is an example');
});

test('a distribution PR and a release PR are exempt by head branch, with no read and no scan, and say so', async () => {
  assert.deepEqual(EXEMPT_HEAD_PREFIXES, ['automated/', 'release/']);
  const { now, sleep } = clock();
  for (const headRef of ['automated/update-ai-coding-rules', 'automated/test-dna-ref/x', 'release/platform-33.2.0']) {
    const r = await check({ ...FEATURE, headRef, body: 'no issue', read: async () => assert.fail('no read'), scan: async () => assert.fail('no scan'), now, sleep });
    assert.equal(r.status, 'skip', headRef);
    assert.match(r.message, /names no issue by nature/);
  }
});

test('a branch that merely contains an exempt word is not exempt', () => {
  for (const headRef of ['feature/release/x', 'releases/x', 'automatedfix']) assert.equal(decide({ ...MAIN, headRef, linked: [] }).status, 'fail', headRef);
});

test('into a feature branch a sidebar link passes, a linked branch of an open issue passes, and a keyword alone does not', async () => {
  const { now, sleep } = clock();
  const run = (read, scan, body = '') => check({ ...FEATURE, headRef: 'task/x', body, read, scan, now, sleep, waitMinutes: 0 });
  const side = await run(async () => [issue(5)], async () => assert.fail('a link on the pull request needs no scan'));
  assert.equal(side.status, 'pass');
  const branch = await run(async () => [], async (headRef) => { assert.equal(headRef, 'task/x'); return { linked: [issue(6, { via: 'linked branch' })], truncated: false }; });
  assert.equal(branch.status, 'pass');
  assert.match(branch.message, /NXD-Solutions\/dna#6 \(linked branch\)/);
  const keyword = await run(async () => [], async () => ({ linked: [], truncated: false }), 'Closes #7');
  assert.equal(keyword.status, 'fail', 'GitHub honours a keyword only into the default branch, so the read sees none');
  assert.match(keyword.message, /Into `feature\/x`, a sidebar link or a branch created from an open issue counts; a closing keyword does not/);
});

test('the scan is bounded: it runs only into a branch other than the default, only when the pull request itself has no link, and at most every SCAN_EVERY polls', async () => {
  let scans = 0; let reads = 0;
  const { now, sleep } = clock();
  const r = await check({
    ...FEATURE, headRef: 'task/x', body: '', now, sleep, waitMinutes: 5, pollSeconds: 30,
    read: async () => { reads += 1; return []; },
    scan: async () => { scans += 1; return { linked: [], truncated: false }; },
  });
  assert.equal(r.status, 'fail');
  assert.equal(reads, 11, 'one read, then one per poll over five minutes');
  assert.equal(scans, Math.ceil(11 / SCAN_EVERY), 'the scan is cached between its runs');
  assert.ok(scans < reads);
  // A link found by the scan is kept between its runs, so the check does not fall back to failing.
  let n = 0;
  const kept = await check({ ...FEATURE, headRef: 'task/x', body: '', now, sleep, waitMinutes: 5, read: async () => [], scan: async () => { n += 1; return { linked: [issue(8, { via: 'linked branch' })], truncated: false }; } });
  assert.equal(kept.status, 'pass');
  assert.equal(n, 1);
});

test('a scan that hits its bound is not taken for "no linked branch": the check fails and says the scan was cut short, unless it found one', async () => {
  const { now, sleep } = clock();
  const cut = await check({ ...FEATURE, headRef: 'task/x', body: '', read: async () => [], scan: async () => ({ linked: [], truncated: true }), now, sleep, waitMinutes: 0 });
  assert.equal(cut.status, 'fail');
  assert.match(cut.message, new RegExp(`hit its bound of ${SCAN_MAX_PAGES * SCAN_PAGE_SIZE} issues`));
  const found = await check({ ...FEATURE, headRef: 'task/x', body: '', read: async () => [], scan: async () => ({ linked: [issue(9, { via: 'linked branch' })], truncated: true }), now, sleep, waitMinutes: 0 });
  assert.equal(found.status, 'pass');
});

test('a link added in the sidebar after the check failed clears it with no push and no body edit: the failing check re-reads and passes when the link appears', async () => {
  const { now, sleep } = clock();
  let reads = 0;
  const r = await check({ ...MAIN, headRef: 'feature/x', body: '', now, sleep, read: async () => { reads += 1; return reads >= 4 ? [issue(1)] : []; } });
  assert.equal(r.status, 'pass');
  assert.equal(r.waited, true);
  assert.equal(reads, 4, 'three polls after the first read, thirty seconds apart');
});

test('a link that never comes: the check waits its window, WAIT_MINUTES in POLL_SECONDS steps, and then fails; a pull request that passes at once never waits', async () => {
  const { now, sleep } = clock();
  let reads = 0;
  const r = await check({ ...MAIN, headRef: 'feature/x', body: '', now, sleep, read: async () => { reads += 1; return []; } });
  assert.equal(r.status, 'fail');
  assert.equal(r.waited, true);
  assert.equal(reads, 1 + (WAIT_MINUTES * 60) / POLL_SECONDS);
  assert.equal(WAIT_MINUTES, 10);
  assert.equal(POLL_SECONDS, 30);
  const quick = await check({ ...MAIN, headRef: 'feature/x', body: '', now, sleep, read: async () => [issue(1)] });
  assert.equal(quick.waited, false);
});

test('a failed read is never taken for "no link": the check rejects', async () => {
  const { now, sleep } = clock();
  await assert.rejects(check({ ...MAIN, headRef: 'feature/x', body: '', read: async () => { throw new Error('GitHub refused'); }, now, sleep }), /GitHub refused/);
  await assert.rejects(check({ ...FEATURE, headRef: 'task/x', body: '', read: async () => [], scan: async () => { throw new Error('scan failed'); }, now, sleep }), /scan failed/);
});

test('readLinked reads the pull request\'s own Development field and names each issue with its repository; a missing pull request throws', () => {
  const run = (args) => {
    assert.ok(args.some((a) => a.includes('closingIssuesReferences')));
    return JSON.stringify({ data: { repository: { pullRequest: { closingIssuesReferences: { nodes: [{ number: 1, repository: { nameWithOwner: 'o/r' } }, { number: 2, repository: { nameWithOwner: 'o/other' } }] } } } } });
  };
  assert.deepEqual(readLinked({ repo: 'o/r', number: 5 }, run), [{ repo: 'o/r', number: 1 }, { repo: 'o/other', number: 2 }]);
  assert.throws(() => readLinked({ repo: 'o/r', number: 5 }, () => JSON.stringify({ data: { repository: { pullRequest: null } } })), /was not found/);
});

test('scanLinkedBranch matches the head branch exactly across pages, and stops at its bound without calling "none" a finding', () => {
  const page = (nodes, hasNextPage) => JSON.stringify({ data: { repository: { issues: { pageInfo: { hasNextPage, endCursor: 'c' }, nodes } } } });
  const withBranch = (number, name) => ({ number, linkedBranches: { nodes: name ? [{ ref: { name } }] : [] } });
  const pages = [page([withBranch(1, 'other'), withBranch(2, null)], true), page([withBranch(3, 'task/x'), withBranch(4, 'task/xy')], false)];
  let i = 0;
  const found = scanLinkedBranch({ repo: 'o/r', headRef: 'task/x' }, () => pages[i++]);
  assert.deepEqual(found, { linked: [{ repo: 'o/r', number: 3, via: 'linked branch' }], truncated: false });
  assert.equal(i, 2, 'two pages read');
  let calls = 0;
  const endless = scanLinkedBranch({ repo: 'o/r', headRef: 'task/x' }, () => { calls += 1; return page([withBranch(1, 'other')], true); });
  assert.equal(calls, SCAN_MAX_PAGES);
  assert.deepEqual(endless, { linked: [], truncated: true });
  const foundThenCut = scanLinkedBranch({ repo: 'o/r', headRef: 'task/x' }, () => page([withBranch(1, 'task/x')], true));
  assert.equal(foundThenCut.truncated, false, 'a finding is no truncation');
  assert.throws(() => scanLinkedBranch({ repo: 'o/r', headRef: 'x' }, () => JSON.stringify({ data: { repository: null } })), /could not be read/);
});

test('the distributed caller grants the permission the read needs and the reusable workflow it names asks for no more, runs on every activity that can change the answer, and cancels a waiting run on a new one', async () => {
  const { readFileSync, existsSync } = await import('node:fs');
  const caller = readFileSync(new URL('../distributed/pr-names-issue.yml', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
  const target = /uses: NXD-Solutions\/\.github\/(\.github\/workflows\/[\w.-]+\.yml)@main/.exec(caller);
  assert.ok(target, 'the caller names a reusable workflow in NXD-Solutions/.github');
  assert.ok(existsSync(new URL(`../${target[1]}`, import.meta.url)), `${target[1]} exists`);
  const reusable = readFileSync(new URL(`../${target[1]}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
  assert.match(reusable, /workflow_call:/);
  assert.match(reusable, /scripts\/pr-names-issue\.mjs/);
  assert.match(caller, /permissions:\n {6}contents: read\n {6}pull-requests: read\n {6}issues: read\n/, 'the scan of open issues needs issues: read, observed refused without it');
  assert.match(reusable, /^permissions:\n {2}contents: read\n {2}pull-requests: read\n {2}issues: read\n/m);
  assert.doesNotMatch(reusable, /(?:write|actions: )/, 'it writes nothing');
  assert.doesNotMatch(caller, /inputs|script_ref|with:/, 'the caller passes nothing, so it is byte-identical in every repo');
  assert.match(caller, /types: \[[^\]]*edited[^\]]*\]/);
  assert.match(caller, /types: \[[^\]]*ready_for_review[^\]]*\]/);
  assert.match(reusable, /cancel-in-progress: true/);
  assert.match(reusable, /timeout-minutes: 15/);
  assert.match(reusable, /if: github\.event\.pull_request\.draft == false/);
  for (const name of ['PR_NUMBER', 'REPO', 'GH_TOKEN', 'BASE_REF', 'DEFAULT_BRANCH', 'HEAD_REF']) assert.match(reusable, new RegExp(`${name}: \\$\\{\\{`), name);
  assert.match(reusable, /GH_TOKEN: \$\{\{ github\.token \}\}/);
});

test('a cross-repo closing keyword is read as GitHub reads it: mid-sentence and as the issue\'s URL, never a word that only ends in one or a keyword followed by other words', () => {
  const claim = (body) => crossRepoClaims(body, 'NXD-Solutions/packages').map((c) => `${c.repo}#${c.number}`);
  assert.deepEqual(claim('This pull request fixes other/repo#12 and more.'), ['other/repo#12']);
  assert.deepEqual(claim('Part of the work: closes: other/repo#3'), ['other/repo#3']);
  assert.deepEqual(claim('Closes https://github.com/other/repo/issues/45'), ['other/repo#45']);
  assert.deepEqual(claim('Resolves https://github.com/NXD-Solutions/packages/issues/7'), [], 'this repository is GitHub\'s to read');
  assert.deepEqual(claim('Closes a/b#1 and fixes c/d#2'), ['a/b#1', 'c/d#2']);
  assert.deepEqual(claim('prefixes other/repo#9, disclosed other/repo#8'), [], 'a word that only ends in a keyword is none');
  assert.deepEqual(claim('Closes the loop on other/repo#9'), [], 'a keyword followed by other words is none');
  assert.deepEqual(claim('Closes other/repo#9x'), [], 'the number ends at a non-word character');
  assert.equal(decide({ ...MAIN, headRef: 'feature/x', linked: [], repo: 'NXD-Solutions/packages', body: 'It fixes other/repo#12 along the way' }).status, 'pass');
});

test('the scan returns at the first match, so a pull request that has its link pays only the pages up to it, and reads the newest issues first', () => {
  const page = (nodes, hasNextPage) => JSON.stringify({ data: { repository: { issues: { pageInfo: { hasNextPage, endCursor: 'c' }, nodes } } } });
  const withBranch = (number, name) => ({ number, linkedBranches: { nodes: name ? [{ ref: { name } }] : [] } });
  const queries = [];
  const run = (args) => { queries.push(args.find((a) => a.startsWith('query='))); return page([withBranch(1, 'other'), withBranch(2, 'task/x'), withBranch(3, 'task/x')], true); };
  assert.deepEqual(scanLinkedBranch({ repo: 'o/r', headRef: 'task/x' }, run), { linked: [{ repo: 'o/r', number: 2, via: 'linked branch' }], truncated: false });
  assert.equal(queries.length, 1, 'one page, though more follow');
  assert.match(queries[0], /orderBy:\{field:CREATED_AT, direction:DESC\}/, 'newest first: the default is oldest first');
  let calls = 0;
  const none = scanLinkedBranch({ repo: 'o/r', headRef: 'task/x' }, () => { calls += 1; return page([withBranch(1, 'other')], calls < 3); });
  assert.deepEqual(none, { linked: [], truncated: false });
  assert.equal(calls, 3, 'with no match it reads to the last page');
});

test('a refused or failed read ends the check as an annotation naming what GitHub said, never a stack', () => {
  const note = failureAnnotation(new Error('gh api failed: Resource not accessible by integration\n    at somewhere'));
  assert.equal(note, '::error title=Could not read the Development field::gh api failed: Resource not accessible by integration. The check did not run to an answer; re-run it once the cause is fixed.');
  assert.ok(!note.includes('\n'));
  assert.match(failureAnnotation('plain text'), /Could not read the Development field::plain text\./);
});

test('the sync names the caller path only from the copy step: a pathspec that matches nothing fails every repo\'s sync', async () => {
  const { readFileSync } = await import('node:fs');
  const workflow = readFileSync(new URL('../.github/workflows/distribute-claude-config.yml', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
  const stepNames = [...workflow.matchAll(/^ {6}- name: (.+)$/gm)].map((m) => ({ name: m[1], at: m.index }));
  const stepAt = (index) => stepNames.filter((s) => s.at <= index).at(-1)?.name;
  const mentions = [...workflow.matchAll(/pr-names-issue\.yml/g)].map((m) => stepAt(m.index));
  // The copy step names the file; no other step may, and the commit and PR steps read the step's output instead.
  assert.deepEqual([...new Set(mentions)], ['Copy the caller of the PR-names-its-issue check']);
  assert.match(workflow, /CALLER_PATH: \$\{\{ steps\.caller\.outputs\.path \}\}/);
  assert.match(workflow, /^ +\$\{\{ steps\.caller\.outputs\.path \}\}$/m);
  // When the flag is off the step must still set an empty path, or the output is undefined.
  assert.match(workflow, /echo "path=" >> "\$GITHUB_OUTPUT"/);
});

test('the sync lists only repos that accept a push: archived repos never enter the subscriber list (.github#397)', async () => {
  const { readFileSync } = await import('node:fs');
  const workflow = readFileSync(new URL('../.github/workflows/distribute-claude-config.yml', import.meta.url), 'utf8');
  assert.match(workflow, /orgs\/NXD-Solutions\/repos[^\n]*select\(\.archived \| not\)/);
});
