import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { CONDITIONS, kindOf, evaluateCandidate, candidatePulls, runCandidates, run } from '../scripts/landing-admission.mjs';

// The promise for a candidate's pull request (NXD-Solutions/.github#419, the DNA's addition of 2026-11-17): a pull request from a `candidate/**` branch into the default branch is
// admitted only when `landing-gate` is `success` on its own head (the tested commit), the default branch is an ancestor of that head, it is not a draft and it merges cleanly. It
// needs no approval at its head, and is asked for no issue and no required checks. Fixture reads only; the run of the workflow is on the scratch repository, recorded on the issue.

const HEAD = 'a1b2c3d4e5f60718293a4b5c6d7e8f9012345678';
const MEETS = {
  statuses: [{ context: 'landing-gate', state: 'success' }],
  comparison: 'ahead',
  checkRuns: [],
  draft: false,
  mergeState: 'clean',
  mergeable: true,
};
const failing = (overrides) => evaluateCandidate({ ...MEETS, ...overrides }).failures.map((f) => f.condition);

test('which pull requests are this job\'s: one into landed/**, a candidate/** branch into the default branch, and nothing else', () => {
  assert.equal(kindOf({ baseRef: 'landed/mvp', headRef: 'feature/x', defaultBranch: 'main' }), 'landing');
  assert.equal(kindOf({ baseRef: 'main', headRef: 'candidate/2026-11-18', defaultBranch: 'main' }), 'candidate');
  assert.equal(kindOf({ baseRef: 'main', headRef: 'feature/x', defaultBranch: 'main' }), null, 'an ordinary pull request into main is not a candidate');
  assert.equal(kindOf({ baseRef: 'feature/y', headRef: 'candidate/z', defaultBranch: 'main' }), null, 'a candidate branch into anything but the default branch is not');
});

test('a candidate whose head carries the full test\'s success, contains main, is not a draft and is clean is admitted, with no approval, no issue and no required checks asked', () => {
  const r = evaluateCandidate(MEETS);
  assert.equal(r.admitted, true);
  assert.deepEqual(r.failures, []);
  for (const comparison of ['ahead', 'identical']) assert.equal(evaluateCandidate({ ...MEETS, comparison }).admitted, true, comparison);
});

test('a candidate whose head lacks `landing-gate` success is returned naming it: no status at all, a failure, or a pending one', () => {
  assert.deepEqual(failing({ statuses: [] }), [CONDITIONS.gate]);
  assert.deepEqual(failing({ statuses: [{ context: 'landing-gate', state: 'failure' }] }), [CONDITIONS.gate]);
  assert.deepEqual(failing({ statuses: [{ context: 'landing-gate', state: 'pending' }] }), [CONDITIONS.gate]);
  assert.deepEqual(failing({ statuses: [{ context: 'landing-quick', state: 'success' }] }), [CONDITIONS.gate], 'the quick set\'s context is not the full test\'s');
});

test('a candidate behind main is returned naming it: the head must contain the default branch (the compare says ahead or identical, never behind or diverged)', () => {
  for (const comparison of ['behind', 'diverged', undefined, 'nonsense']) assert.deepEqual(failing({ comparison }), [CONDITIONS.ahead], String(comparison));
});

test('a draft, a conflict and any merge state but clean are returned naming the clean condition, as for a pull request into a landing branch', () => {
  assert.deepEqual(failing({ draft: true }), [CONDITIONS.clean]);
  assert.deepEqual(failing({ mergeable: false }), [CONDITIONS.clean]);
  for (const mergeState of ['dirty', 'blocked', 'behind', 'unknown']) assert.deepEqual(failing({ mergeState }), [CONDITIONS.clean], mergeState);
  assert.deepEqual(failing({ mergeState: 'unstable', checkRuns: [{ name: 'lint', status: 'completed', conclusion: 'failure' }] }), [CONDITIONS.clean], 'a failing check reaches a candidate through clean');
});

test('Mutation: each of the three conditions alone decides a candidate: dropping the tested-commit status, the ancestry or the clean test lets one through that missed it', () => {
  const misses = { [CONDITIONS.gate]: { statuses: [] }, [CONDITIONS.ahead]: { comparison: 'behind' }, [CONDITIONS.clean]: { mergeState: 'dirty' } };
  for (const [condition, spoil] of Object.entries(misses)) {
    const r = evaluateCandidate({ ...MEETS, ...spoil });
    assert.equal(r.admitted, false, condition);
    assert.deepEqual(r.failures.map((f) => f.condition), [condition]);
  }
});

const readersFor = ({ baseRef, headRef, comparison = 'ahead', statuses = MEETS.statuses }) => ({
  pull: () => ({ headSha: HEAD, baseRef, headRef, draft: false, mergeState: 'clean', mergeable: true, body: '**From session:** framework' }),
  notes: () => [], comments: () => [], checkRuns: () => [], statuses: () => statuses, compare: () => comparison, linked: async () => assert.fail('a candidate asks for no issue'),
});

test('a run on a candidate\'s pull request sets one status on its head: success when admitted, and it asks for no approval, no issue and no required checks', async () => {
  const posted = [];
  const r = await run({ gh: (args) => { posted.push(args); return ''; }, repo: 'NXD-Solutions/x', number: 9, requiredChecks: [], readers: readersFor({ baseRef: 'main', headRef: 'candidate/c1' }) });
  assert.equal(r.state, 'success');
  assert.ok(posted.some((a) => a.join(' ').includes(`statuses/${HEAD}`)));
  const behind = await run({ gh: () => '', repo: 'NXD-Solutions/x', number: 9, requiredChecks: [], readers: readersFor({ baseRef: 'main', headRef: 'candidate/c1', comparison: 'behind' }) });
  assert.equal(behind.state, 'failure');
  assert.match(behind.description, /main is an ancestor of its head/);
});

test('a pull request that is neither into a landing branch nor a candidate\'s sets nothing and says nothing', async () => {
  const posted = [];
  const r = await run({ gh: (args) => { posted.push(args); return ''; }, repo: 'NXD-Solutions/x', number: 3, requiredChecks: [], readers: readersFor({ baseRef: 'main', headRef: 'feature/ordinary' }) });
  assert.equal(r.skipped, true);
  assert.deepEqual(posted, []);
});

test('when the default branch moves, every open candidate\'s pull request is evaluated again, and no other', async () => {
  const pulls = [
    { number: 1, head: 'candidate/a', base: 'main' }, { number: 2, head: 'feature/b', base: 'main' }, { number: 3, head: 'candidate/c', base: 'main' }, { number: 4, head: 'candidate/d', base: 'landed/mvp' },
  ];
  assert.deepEqual(candidatePulls(pulls, 'main'), [1, 3]);
  const ran = [];
  const out = await runCandidates({ repo: 'NXD-Solutions/x', list: () => pulls, runOne: async (n) => { ran.push(n); return { state: 'failure' }; } });
  assert.deepEqual(ran, [1, 3]);
  assert.deepEqual(out.map((o) => o.number), [1, 3]);
  assert.deepEqual(await runCandidates({ repo: 'NXD-Solutions/x', list: () => [], runOne: async () => assert.fail('none open') }), []);
});

test('one candidate whose evaluation throws does not stop the others: each is evaluated, the failure is reported with its number', async () => {
  const pulls = [{ number: 1, head: 'candidate/a', base: 'main' }, { number: 2, head: 'candidate/b', base: 'main' }, { number: 3, head: 'candidate/c', base: 'main' }];
  const ran = [];
  const out = await runCandidates({
    repo: 'NXD-Solutions/x', list: () => pulls,
    runOne: async (n) => { ran.push(n); if (n === 2) throw new Error('gh: HTTP 502'); return { state: 'failure' }; },
  });
  assert.deepEqual(ran, [1, 2, 3], 'the candidate after the failing one is still evaluated');
  assert.deepEqual(out.map((o) => o.number), [1, 2, 3]);
  assert.equal(out[1].error, 'gh: HTTP 502');
  assert.equal(out[0].error, undefined);
  assert.equal(out[2].state, 'failure');
});

const caller = readFileSync(new URL('../distributed/landing-admission.yml', import.meta.url), 'utf8');

test('the caller hears a candidate: pull requests into the default branch, but its job starts only for a head that begins `candidate/`, and a push to the default branch re-evaluates the open ones', () => {
  assert.match(caller, /startsWith\(github\.head_ref, 'candidate\/'\)/);
  assert.match(caller, /push:\s*\n\s*branches:\s*\n\s*- main/);
  assert.match(caller, /github\.event_name == 'push'/);
  assert.match(caller, /number: \$\{\{[^}]*\|\| '' \}\}/, 'a push names no pull request: the number is empty');
});
