import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  check, closingRefs, deliveredBy, decide, readMergedTaskPrs, readIssueStates, failureAnnotation,
  EXEMPT_HEAD_PREFIXES, PAGE_SIZE, MAX_PAGES,
} from '../scripts/feature-closes-delivered.mjs';

// The promise (NXD-Solutions/dna#2003), one test per guarantee, written before the script. Fixture reads only: no GitHub call anywhere in this suite. That the workflow does what
// these say is the run of the workflow on the scratch repository, recorded on the pull request.

const REPO = 'NXD-Solutions/Manager-Assistant-v2';
const FEATURE = { headRef: 'feature/let-a-manager-see-the-team', baseRef: 'main', defaultBranch: 'main', repo: REPO };
const key = (n, repo = REPO) => `${repo}#${n}`;
// A task pull request merged into the feature branch: its own text and what GitHub shows linked (the Development field).
const task = (number, body = '', linked = []) => ({ number, body, linked });
const OPEN = (...ns) => new Map(ns.map((n) => [key(n), 'OPEN']));

test('Case: three task pull requests merged into the branch and a body that closes one: the check fails naming the other two, and not the one closed', () => {
  const merged = [task(11, 'Closes #101'), task(12, 'Closes #102'), task(13, 'Fixes NXD-Solutions/Manager-Assistant-v2#103')];
  const r = decide({ ...FEATURE, body: 'Closes #101\n\nThe Feature.', delivered: deliveredBy(merged, REPO), states: OPEN(101, 102, 103) });
  assert.equal(r.status, 'fail');
  assert.deepEqual(r.missing, [key(102), key(103)]);
  assert.match(r.message, /Manager-Assistant-v2#102/);
  assert.match(r.message, /Manager-Assistant-v2#103/);
  assert.doesNotMatch(r.message, /#101/);
});

test('a body that says Closes for every issue its merged task pull requests delivered passes, whether it writes the issue bare or with its owner', () => {
  const merged = [task(11, 'Closes #101'), task(12, 'Closes NXD-Solutions/Manager-Assistant-v2#102')];
  for (const body of ['Closes #101\nCloses #102', 'Closes NXD-Solutions/Manager-Assistant-v2#101, closes #102', 'Fixes #101 and resolves #102']) {
    const r = decide({ ...FEATURE, body, delivered: deliveredBy(merged, REPO), states: OPEN(101, 102) });
    assert.equal(r.status, 'pass', body);
    assert.deepEqual(r.missing, []);
  }
});

test('it passes when none of the delivered issues is open, and when no task pull request was merged into the branch', () => {
  const merged = [task(11, 'Closes #101'), task(12, 'Closes #102')];
  const closed = new Map([[key(101), 'CLOSED'], [key(102), 'CLOSED']]);
  assert.equal(decide({ ...FEATURE, body: 'no closing line at all', delivered: deliveredBy(merged, REPO), states: closed }).status, 'pass');
  assert.equal(decide({ ...FEATURE, body: '', delivered: deliveredBy([], REPO), states: new Map() }).status, 'pass');
});

test('an issue is delivered when a merged task pull request names it with a closing keyword, or has it in its Development field; Relates to and a bare mention deliver nothing', () => {
  const merged = [
    task(11, 'Closes #101'),
    task(12, 'no keyword here', [{ repo: REPO, number: 102 }]),
    task(13, 'Relates to #103\nsee #104\nCloses the loop on #105'),
    task(14, 'Resolves NXD-Solutions/packages#7'),
  ];
  assert.deepEqual([...deliveredBy(merged, REPO).keys()].sort(), [key(101), key(102), key(7, 'NXD-Solutions/packages')].sort());
});

test('Mutation: Relates to, a bare mention and a keyword in a code fence or a comment stand for no Closes: the check still fails', () => {
  const merged = [task(11, 'Closes #101')];
  for (const body of ['Relates to #101', 'see #101', 'Closes the loop on #101', '```\nCloses #101\n```', '<!-- Closes #101 -->', 'Closes #1010', 'unCloses #101', '']) {
    const r = decide({ ...FEATURE, body, delivered: deliveredBy(merged, REPO), states: OPEN(101) });
    assert.equal(r.status, 'fail', JSON.stringify(body));
    assert.deepEqual(r.missing, [key(101)], JSON.stringify(body));
  }
  assert.deepEqual(closingRefs('Closes #1, fixes owner/repo#2\nCloses https://github.com/o/r/issues/3', REPO).sort(), ['NXD-Solutions/Manager-Assistant-v2#1', 'o/r#3', 'owner/repo#2'].sort());
});

test('a pull request from release/* or automated/*, and one into a branch other than the default, is not checked: nothing is read', async () => {
  const boom = async () => assert.fail('no read for a pull request that is not checked');
  for (const pr of [{ headRef: 'release/platform-40.4.0' }, { headRef: 'automated/dna-sync' }, { headRef: 'candidate/mvp-2026-11-17' }, { baseRef: 'feature/the-feature' }, { baseRef: 'landed/mvp' }]) {
    const r = await check({ ...FEATURE, body: '', ...pr, readMerged: boom, readStates: boom });
    assert.equal(r.status, 'skip', JSON.stringify(pr));
  }
  assert.deepEqual(EXEMPT_HEAD_PREFIXES, ['release/', 'automated/', 'candidate/']);
});

test('a candidate\'s pull request into main is skipped with a message that says why, and never passes having read nothing', () => {
  const r = decide({ ...FEATURE, headRef: 'candidate/mvp-2026-11-17', body: '', delivered: new Map(), states: new Map() });
  assert.equal(r.status, 'skip');
  assert.match(r.message, /candidate/);
  assert.match(r.message, /landing branch/);
  assert.match(r.message, /not read here/);
  assert.doesNotMatch(r.message, /Every open issue/);
});

test('the read of merged task pull requests is bounded: more pages than the bound fails the check and says so, never a pass on what was read', async () => {
  const truncated = await check({
    ...FEATURE, body: 'Closes #101',
    readMerged: async () => ({ prs: [task(11, 'Closes #101')], truncated: true }),
    readStates: async () => OPEN(101),
  });
  assert.equal(truncated.status, 'fail');
  assert.match(truncated.message, new RegExp(`${MAX_PAGES * PAGE_SIZE}`));
  assert.match(truncated.message, /not read to the end|hit its bound/);
});

test('the bound counts pages: the edge reads page after page of merged task pull requests, stops at the last page, and reports a stop at the bound', () => {
  const page = (n, more) => JSON.stringify({ data: { repository: { pullRequests: { pageInfo: { hasNextPage: more, endCursor: `c${n}` }, nodes: Array.from({ length: 2 }, (_, i) => ({ number: n * 10 + i, body: 'Closes #1', closingIssuesReferences: { nodes: [{ number: 5, repository: { nameWithOwner: REPO } }] } })) } } } });
  const calls = [];
  const three = readMergedTaskPrs({ repo: REPO, headRef: 'feature/x' }, (args) => { calls.push(args); return page(calls.length, calls.length < 3); });
  assert.equal(three.prs.length, 6);
  assert.equal(three.truncated, false);
  assert.deepEqual(three.prs[0].linked, [{ repo: REPO, number: 5 }]);
  const endless = readMergedTaskPrs({ repo: REPO, headRef: 'feature/x' }, () => page(1, true));
  assert.equal(endless.truncated, true);
  assert.equal(endless.prs.length, 2 * MAX_PAGES);
  assert.throws(() => readMergedTaskPrs({ repo: REPO, headRef: 'feature/x' }, () => JSON.stringify({ data: { repository: null } })), /could not be read/);
});

test('an issue in another repository that the check\'s token cannot read is not asked for, and the message says it could not be confirmed; a failed read of this repository fails the check', async () => {
  const other = 'NXD-Solutions/packages';
  const states = readIssueStates([key(101), key(7, other)], (args) => {
    const owner = args.find((a) => a.startsWith('name='));
    if (owner === 'name=packages') throw new Error('gh api failed: Could not resolve to a Repository with the name NXD-Solutions/packages');
    return JSON.stringify({ data: { repository: { issue: { state: 'OPEN' } } } });
  });
  assert.equal(states.get(key(101)), 'OPEN');
  assert.equal(states.get(key(7, other)), 'UNKNOWN');
  const r = decide({ ...FEATURE, body: 'Closes #101', delivered: deliveredBy([task(11, 'Closes #101'), task(12, `Closes ${other}#7`)], REPO), states });
  assert.equal(r.status, 'pass');
  assert.match(r.message, /packages#7/);
  assert.match(r.message, /could not be confirmed/);
  assert.throws(() => readIssueStates([key(101)], () => { throw new Error('gh api failed: HTTP 502'); }), /502/);
  assert.throws(() => readIssueStates([key(101)], () => JSON.stringify({ data: { repository: { issue: null } } })), /not found/);
  assert.match(failureAnnotation(new Error('gh api failed: HTTP 502\nmore')), /^::error title=Could not read the delivered issues::gh api failed: HTTP 502\. /);
});

test('a read that fails is never a pass: the check throws, and the failure reaches the annotation', async () => {
  await assert.rejects(check({ ...FEATURE, body: '', readMerged: async () => { throw new Error('gh api failed: HTTP 403'); }, readStates: async () => new Map() }), /403/);
});

// An increment (`**Increment:**` line, `tools/github/github-workflow.md`, Branches) delivers part of a Feature: the issues whose task pull requests merged into the branch and that it does not
// deliver are named in a literal `**Leaves:**` line, and the check asks for a Closes line for every other open one (NXD-Solutions/dna#2003, the DNA's reading C).
const INCREMENT = '**Increment:** the team list is usable on its own and low in risk';
const merged3 = [task(11, 'Closes #101'), task(12, 'Closes #102'), task(13, 'Closes #103')];

test('an increment asks for a Closes line for every open merged-task issue except those named in its Leaves line', () => {
  const body = `${INCREMENT}\n**Leaves:** NXD-Solutions/Manager-Assistant-v2#103\n\nCloses #101\nCloses #102`;
  const r = decide({ ...FEATURE, body, delivered: deliveredBy(merged3, REPO), states: OPEN(101, 102, 103) });
  assert.equal(r.status, 'pass');
  const short = decide({ ...FEATURE, body: `${INCREMENT}\n**Leaves:** ${key(103)}\n\nCloses #101`, delivered: deliveredBy(merged3, REPO), states: OPEN(101, 102, 103) });
  assert.equal(short.status, 'fail');
  assert.deepEqual(short.missing, [key(102)]);
});

test('Leaves takes several owner-qualified issues, and is read only as its own line', () => {
  const body = `${INCREMENT}\n**Leaves:** ${key(102)}, ${key(103)}\nCloses #101`;
  assert.equal(decide({ ...FEATURE, body, delivered: deliveredBy(merged3, REPO), states: OPEN(101, 102, 103) }).status, 'pass');
  for (const noLine of [`${INCREMENT}\nLeaves ${key(102)}, ${key(103)}\nCloses #101`, `${INCREMENT}\nclosing words **Leaves:** ${key(102)}, ${key(103)}\nCloses #101`, `${INCREMENT}\n\`\`\`\n**Leaves:** ${key(102)}, ${key(103)}\n\`\`\`\nCloses #101`]) {
    assert.equal(decide({ ...FEATURE, body: noLine, delivered: deliveredBy(merged3, REPO), states: OPEN(101, 102, 103) }).status, 'fail', noLine);
  }
});

test('Mutation: an increment with no Leaves line is asked for every open issue, so forgetting the line fails loudly', () => {
  const r = decide({ ...FEATURE, body: `${INCREMENT}\nCloses #101`, delivered: deliveredBy(merged3, REPO), states: OPEN(101, 102, 103) });
  assert.equal(r.status, 'fail');
  assert.deepEqual(r.missing, [key(102), key(103)]);
});

test('a Leaves line without an Increment line is no increment: every open issue is asked for', () => {
  const r = decide({ ...FEATURE, body: `**Leaves:** ${key(102)}, ${key(103)}\nCloses #101`, delivered: deliveredBy(merged3, REPO), states: OPEN(101, 102, 103) });
  assert.equal(r.status, 'fail');
  assert.deepEqual(r.missing, [key(102), key(103)]);
});

test('an issue the increment names as left and also closes is a mismatch, and the check names it', () => {
  const r = decide({ ...FEATURE, body: `${INCREMENT}\n**Leaves:** ${key(102)}\nCloses #101\nCloses #102\nCloses #103`, delivered: deliveredBy(merged3, REPO), states: OPEN(101, 102, 103) });
  assert.equal(r.status, 'fail');
  assert.deepEqual(r.missing, []);
  assert.deepEqual(r.mismatched, [key(102)]);
  assert.match(r.message, /Manager-Assistant-v2#102/);
  assert.match(r.message, /Leaves/);
});

test('a Leaves issue that no merged task pull request delivered or that is already closed is no mismatch and no ask', () => {
  const closed = new Map([[key(101), 'OPEN'], [key(102), 'OPEN'], [key(103), 'CLOSED']]);
  const r = decide({ ...FEATURE, body: `${INCREMENT}\n**Leaves:** ${key(103)}, ${key(999)}\nCloses #101\nCloses #102`, delivered: deliveredBy(merged3, REPO), states: closed });
  assert.equal(r.status, 'pass');
});

test('Mutation: a bare #n in the Leaves line is not read: the rule says the owner-qualified form only, so the issue is still asked for', () => {
  for (const line of [`**Leaves:** #103`, `**Leaves:** ${key(102)}, #103`]) {
    const r = decide({ ...FEATURE, body: `${INCREMENT}\n${line}\nCloses #101`, delivered: deliveredBy(merged3, REPO), states: OPEN(101, 102, 103) });
    assert.equal(r.status, 'fail', line);
    assert.ok(r.missing.includes(key(103)), line);
    assert.match(r.message, /Manager-Assistant-v2#103/);
  }
});
