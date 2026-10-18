import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { check, stripExamples, EXEMPT_HEAD_PREFIXES } from '../scripts/pr-names-issue.mjs';

// The promise (NXD-Solutions/.github#394), one test per guarantee. Fixture bodies only: no GitHub call anywhere in this suite.

const pass = (body, headRef = 'feature/x') => assert.equal(check({ body, headRef }).status, 'pass', body);
const fail = (body, headRef = 'feature/x') => assert.equal(check({ body, headRef }).status, 'fail', body);

test('a body with a closing or relating line, qualified or same-repo, passes', () => {
  for (const line of [
    'Closes NXD-Solutions/dna#1400.',
    'Closes #12',
    'closes #12',
    'Fixes NXD-Solutions/packages#5',
    'Resolves #7',
    'Relates to NXD-Solutions/Manager-Assistant-Plan#198',
    'Relates to #3',
    '- Closes #4',
    'Closes: #4',
  ]) {
    pass(`**From session:** x\n\n## Summary\nSomething.\n\n${line}\n\n🤖 Generated`);
  }
});

test('a bare mention of an issue number does not pass', () => {
  fail('Summary\nSee #12 and NXD-Solutions/dna#5 for context.');
  fail('Part of #12');
  fail('Closes the loop on #12');
});

test('an empty or missing body fails', () => {
  fail('');
  assert.equal(check({ body: null, headRef: 'feature/x' }).status, 'fail');
  assert.equal(check({ body: undefined, headRef: 'feature/x' }).status, 'fail');
});

test('a line inside a code fence or an HTML comment is an example, so it passes nothing', () => {
  fail('Summary\n<!-- Closes #12 -->\n');
  fail('Summary\n```\nCloses #12\n```\n');
  fail('Summary\n~~~\nCloses NXD-Solutions/dna#12\n~~~\n');
  pass('Summary\n<!-- Closes #1 -->\nCloses #12\n');
});

test('a stacked pull request passes on its own line, never on its base', () => {
  // The base PR's number in prose is a mention, so only the PR's own line counts.
  fail('Stacked on NXD-Solutions/packages#1100.\n\nPart of the same Feature.');
  pass('Stacked on NXD-Solutions/packages#1100.\n\nCloses NXD-Solutions/packages#1101');
});

test('CRLF line endings do not hide a line', () => {
  pass('Summary\r\n\r\nCloses #12\r\n');
});

test('a distribution PR and a release PR are exempt by head branch, and say so', () => {
  assert.deepEqual(EXEMPT_HEAD_PREFIXES, ['automated/', 'release/']);
  for (const headRef of ['automated/update-ai-coding-rules', 'automated/test-dna-ref/x', 'release/platform-33.2.0']) {
    const r = check({ body: 'no issue named', headRef });
    assert.equal(r.status, 'skip', headRef);
    assert.match(r.message, /names no issue by nature/);
  }
});

test('a branch that merely contains an exempt word is not exempt', () => {
  fail('no issue', 'feature/release/x');
  fail('no issue', 'releases/x');
  fail('no issue', 'automatedfix');
});

test('a failure names what is missing and the accepted forms', () => {
  const r = check({ body: 'nothing', headRef: 'feature/x' });
  assert.match(r.message, /names no issue it delivers/);
  assert.match(r.message, /Closes <owner>\/<repo>#n/);
  assert.match(r.message, /Relates to/);
  assert.match(r.message, /stacked/);
});

test('stripExamples leaves ordinary text alone', () => {
  assert.equal(stripExamples('a\nb'), 'a\nb');
});

test('subprocess: running the file directly exits 1 on a failing body and 0 on a passing one', () => {
  const script = fileURLToPath(new URL('../scripts/pr-names-issue.mjs', import.meta.url));
  const run = (body, head) => spawnSync(process.execPath, [script], {
    encoding: 'utf8', env: { ...process.env, PR_BODY: body, HEAD_REF: head },
  });
  const bad = run('nothing here', 'feature/x');
  assert.equal(bad.status, 1);
  assert.match(bad.stdout, /::error title=No issue named::/);
  assert.equal(run('Closes #1', 'feature/x').status, 0);
  assert.equal(run('nothing here', 'release/x').status, 0);
});

test('the distributed caller runs the reusable workflow that exists, on every activity that can change the answer', async () => {
  const { readFileSync, existsSync } = await import('node:fs');
  const caller = readFileSync(new URL('../distributed/pr-names-issue.yml', import.meta.url), 'utf8');
  const target = /uses: NXD-Solutions\/\.github\/(\.github\/workflows\/[\w.-]+\.yml)@main/.exec(caller);
  assert.ok(target, 'the caller names a reusable workflow in NXD-Solutions/.github');
  assert.ok(existsSync(new URL(`../${target[1]}`, import.meta.url)), `${target[1]} exists`);
  const reusable = readFileSync(new URL(`../${target[1]}`, import.meta.url), 'utf8');
  assert.match(reusable, /workflow_call:/);
  assert.match(reusable, /scripts\/pr-names-issue\.mjs/);
  // opened/synchronize/reopened are defaults; the other two are why a body edit or a draft made ready is checked.
  assert.match(caller, /types: \[[^\]]*edited[^\]]*\]/);
  assert.match(caller, /types: \[[^\]]*ready_for_review[^\]]*\]/);
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
