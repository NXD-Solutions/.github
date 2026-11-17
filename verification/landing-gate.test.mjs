import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  CONTEXT, DESCRIPTION_MAX, NO_GATE, resultOf, failedLineOf, statusFor, postStatus, run,
} from '../scripts/landing-gate.mjs';

// The promise (NXD-Solutions/.github#418), one test per guarantee, written before the script. Fixture reads only: no GitHub call anywhere in this suite. That the workflow
// does what these say is the run of the workflow on the scratch repository, recorded on the issue.

const SHA = 'a1b2c3d4e5f60718293a4b5c6d7e8f9012345678';
const OTHER = '0000000000000000000000000000000000000000';
const NOW = new Date('2026-11-17T12:30:00Z');

test('a gate that returned exit 0 sets a success status naming the commit it ran on and the time of its run', () => {
  const s = statusFor({ exitCode: '0', sha: SHA, now: NOW });
  assert.equal(s.state, 'success');
  assert.match(s.description, /a1b2c3d/);
  assert.match(s.description, /2026-11-17 12:30Z/);
  assert.equal(resultOf('0'), 'pass');
});

test('Mutation: the status is never success unless the gate returned exactly 0: any other exit, none, or a value that is no number is a failure', () => {
  for (const exitCode of ['1', '2', '127', '-1', '', undefined, null, 'abc', '0 ', '00', 'NaN', '0.0']) {
    const s = statusFor({ exitCode, sha: SHA, now: NOW });
    assert.equal(s.state, 'failure', JSON.stringify(exitCode));
    assert.equal(resultOf(exitCode), 'fail', JSON.stringify(exitCode));
  }
});

test('a failing gate\'s status names what failed: the line its output says failed, else its last line, and the exit it returned', () => {
  const output = ['> build', 'ok 1 - parses', 'not ok 2 - the landing branch builds', '  error: expected 3, got 4', '# fail 1', ''].join('\n');
  assert.equal(failedLineOf(output), 'not ok 2 - the landing branch builds');
  assert.equal(failedLineOf('compiling\nlinking\nsegmentation fault'), 'segmentation fault');
  assert.equal(failedLineOf(''), 'the gate printed nothing');
  const s = statusFor({ exitCode: '1', sha: SHA, output, now: NOW });
  assert.equal(s.state, 'failure');
  assert.match(s.description, /not ok 2 - the landing branch builds/);
  assert.match(s.description, /exit 1/);
});

test('a description never exceeds the 140 characters GitHub keeps, whatever the gate printed', () => {
  const s = statusFor({ exitCode: '1', sha: SHA, output: `FAIL ${'x'.repeat(500)}`, now: NOW });
  assert.ok(s.description.length <= DESCRIPTION_MAX, s.description.length);
  assert.ok(s.description.endsWith('…'));
  assert.match(s.description, /a1b2c3d/, 'the commit survives the cut');
});

test('the status is set on the commit the gate ran on, never on another commit the branch has since', () => {
  const calls = [];
  const out = postStatus({ repo: 'NXD-Solutions/x', sha: SHA, state: 'success', description: 'd', targetUrl: 'https://example.test/run/1' }, (args) => { calls.push(args); return ''; });
  assert.equal(calls.length, 1);
  assert.ok(calls[0].includes(`repos/NXD-Solutions/x/statuses/${SHA}`), calls[0].join(' '));
  assert.ok(!calls[0].join(' ').includes(OTHER));
  assert.equal(out.sha, SHA);
});

test('there is one status context, `landing-gate`, so a later run replaces an earlier one on the same commit and one name is what the branch shows', () => {
  assert.equal(CONTEXT, 'landing-gate');
  const calls = [];
  postStatus({ repo: 'NXD-Solutions/x', sha: SHA, state: 'failure', description: 'd', targetUrl: 'u' }, (args) => { calls.push(args); return ''; });
  assert.ok(calls[0].includes('context=landing-gate'), calls[0].join(' '));
});

test('run() reads the commit, the exit and the output from the workflow\'s environment and posts one status on that commit', () => {
  const posted = [];
  const env = {
    GITHUB_REPOSITORY: 'NXD-Solutions/x', GITHUB_SHA: SHA, GITHUB_SERVER_URL: 'https://github.com', GITHUB_RUN_ID: '42',
    GATE_EXIT_CODE: '1', GATE_OUTPUT: 'FAIL the branch does not build',
  };
  const r = run({ env, now: NOW, gh: (args) => { posted.push(args); return ''; } });
  assert.equal(posted.length, 1);
  assert.equal(r.state, 'failure');
  assert.ok(posted[0].some((a) => a === `target_url=https://github.com/NXD-Solutions/x/actions/runs/42`), posted[0].join(' '));
  assert.ok(posted[0].includes(`repos/NXD-Solutions/x/statuses/${SHA}`));
});

test('a repository that set no gate gets a failure status that says so, never a pass', () => {
  const posted = [];
  const r = run({ env: { GITHUB_REPOSITORY: 'NXD-Solutions/x', GITHUB_SHA: SHA, GITHUB_RUN_ID: '1', GATE_EXIT_CODE: NO_GATE }, now: NOW, gh: (args) => { posted.push(args); return ''; } });
  assert.equal(r.state, 'failure');
  assert.match(r.description, /no gate command/i);
  assert.ok(posted[0].includes('state=failure'));
});

test('a run that cannot tell which commit or repository it is on posts nothing and fails loudly', () => {
  assert.throws(() => run({ env: { GATE_EXIT_CODE: '0' }, now: NOW, gh: () => assert.fail('no post') }), /GITHUB_SHA/);
  assert.throws(() => run({ env: { GATE_EXIT_CODE: '0', GITHUB_SHA: 'not-a-sha', GITHUB_REPOSITORY: 'NXD-Solutions/x' }, now: NOW, gh: () => assert.fail('no post') }), /GITHUB_SHA/);
});

// The shape of the two workflow files. Reading text is not the proof (the run of the workflow on the scratch repository is); these keep the pieces the run relies on from
// being edited away unnoticed.
const caller = readFileSync(new URL('../distributed/landing-gate.yml', import.meta.url), 'utf8');
const reusable = readFileSync(new URL('../.github/workflows/landing-gate-check.yml', import.meta.url), 'utf8');

test('the caller runs on a push to a landed/** branch, which is what a merge into it is, and on a manual start for a head whose run died; it grants the status write and nothing wider', () => {
  assert.match(caller, /on:\s*\n\s*push:\s*\n\s*branches:\s*\n\s*- 'landed\/\*\*'/);
  assert.match(caller, /workflow_dispatch:/);
  assert.match(caller, /statuses: write/);
  assert.match(caller, /contents: read/);
  assert.ok(!/(?:contents|pull-requests|issues|actions|checks|packages):\s*write/.test(caller));
});

test('the reusable workflow keeps one run per branch, the latest merge\'s, so the head\'s status is the head\'s own', () => {
  assert.match(reusable, /concurrency:\s*\n\s*group: landing-gate-\$\{\{ github\.repository \}\}-\$\{\{ github\.ref \}\}\s*\n\s*cancel-in-progress: true/);
});

test('the workflow sets the status in a step that runs whatever the gate did, so a failing gate is a red status and never a missing one, but not when a later merge cancelled the run: a cancel is no failure and the superseded commit gets no status', () => {
  assert.match(reusable, /if: \$\{\{ !cancelled\(\) \}\}/);
  assert.ok(!/if: always\(\)/.test(reusable), 'always() would post a failure for a run a later merge cancelled');
  assert.match(reusable, /GATE_EXIT_CODE/);
});
