import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  CONTEXT, MARKER, DESCRIPTION_MAX, CONDITIONS, sessionOf, latestReviewNote, evaluate, statusFor, commentFor, planComment, run,
} from '../scripts/landing-admission.mjs';

// The promise (NXD-Solutions/.github#419), one test per guarantee, written before the script. Fixture reads only: no GitHub call anywhere in this suite. That the workflow does
// what these say is the run of the workflow on the scratch repository, recorded on the issue.

const HEAD = 'a1b2c3d4e5f60718293a4b5c6d7e8f9012345678';
const OLD_HEAD = '0000000000000000000000000000000000000000';
const PR_BODY = '**From session:** framework\n\nCloses #1';
const approval = (id, { head = HEAD, from = 'reviewer', answer = 'approved' } = {}) => ({ id, body: `## Review: ${answer}\n\n**From session:** ${from}\n**Head reviewed:** ${head}\n` });
const green = { name: 'pre-push / build+test', status: 'completed', conclusion: 'success' };

// A pull request that meets every condition; each test spoils one.
const MEETS = {
  linkedIssues: [{ repo: 'NXD-Solutions/x', number: 1 }],
  requiredChecks: ['pre-push / build+test'],
  checkRuns: [green],
  notes: [approval(10)],
  prBody: PR_BODY,
  headSha: HEAD,
  draft: false,
  mergeState: 'clean',
  mergeable: true,
  statuses: [],
};
const failing = (overrides) => evaluate({ ...MEETS, ...overrides }).failures.map((f) => f.condition);

test('a pull request that meets every condition is admitted, and one that misses none has nothing listed', () => {
  const r = evaluate(MEETS);
  assert.equal(r.admitted, true);
  assert.deepEqual(r.failures, []);
});

test('it names its issue: none in the Development field is returned naming that condition', () => {
  assert.deepEqual(failing({ linkedIssues: [] }), [CONDITIONS.issue]);
});

test('the required checks pass: a name missing, still running, failed, cancelled or skipped is returned naming each, and none set is no pass', () => {
  assert.deepEqual(failing({ checkRuns: [] }), [CONDITIONS.checks]);
  for (const bad of [{ status: 'in_progress', conclusion: null }, { status: 'completed', conclusion: 'failure' }, { status: 'completed', conclusion: 'cancelled' }, { status: 'completed', conclusion: 'skipped' }]) {
    assert.deepEqual(failing({ checkRuns: [{ ...green, ...bad }] }), [CONDITIONS.checks], JSON.stringify(bad));
  }
  const two = evaluate({ ...MEETS, requiredChecks: ['a', 'b'], checkRuns: [{ name: 'a', status: 'completed', conclusion: 'success' }] });
  assert.match(two.failures.find((f) => f.condition === CONDITIONS.checks).detail, /\bb\b/);
  assert.doesNotMatch(two.failures.find((f) => f.condition === CONDITIONS.checks).detail, /\ba\b[^,]*missing/);
  assert.deepEqual(failing({ requiredChecks: [] }), [CONDITIONS.checks], 'no required check set is never a pass by default');
});

test('the latest review note decides, of any answer: an approval at the head from another session admits; the literal `## Review: approved` is the form read', () => {
  assert.equal(evaluate({ ...MEETS, notes: [approval(10)] }).admitted, true);
  assert.deepEqual(failing({ notes: [] }), [CONDITIONS.approval], 'no note at all');
  assert.equal(latestReviewNote([{ id: 1, body: 'chat' }, approval(5), { id: 7, body: 'thanks' }]).id, 5, 'a comment that is no review note is skipped');
});

test('an existing `## Review: approve` note is returned until reviewers adopt the literal, and the detail names the literal', () => {
  const r = evaluate({ ...MEETS, notes: [approval(10, { answer: 'approve' })] });
  assert.equal(r.admitted, false);
  assert.match(r.failures[0].detail, /## Review: approved/);
});

test('a later `changes requested` returns the pull request, whatever approved before it', () => {
  const r = evaluate({ ...MEETS, notes: [approval(10), approval(11, { answer: 'changes requested' })] });
  assert.deepEqual(r.failures.map((f) => f.condition), [CONDITIONS.approval]);
  assert.equal(evaluate({ ...MEETS, notes: [approval(11, { answer: 'changes requested' }), approval(12)] }).admitted, true, 'a later approval admits again');
});

test('an approval of another commit is returned: the note\'s `**Head reviewed:**` must equal the pull request\'s head, in full', () => {
  assert.deepEqual(failing({ notes: [approval(10, { head: OLD_HEAD })] }), [CONDITIONS.approval]);
  assert.deepEqual(failing({ notes: [approval(10, { head: HEAD.slice(0, 7) })] }), [CONDITIONS.approval], 'a short sha is no equal sha');
  assert.deepEqual(failing({ notes: [{ id: 10, body: '## Review: approved\n\n**From session:** reviewer\n' }] }), [CONDITIONS.approval], 'no head line');
});

test('independence: an approval from the pull request\'s own session, or a pull request that names none, is returned', () => {
  assert.equal(sessionOf(PR_BODY), 'framework');
  assert.equal(sessionOf('no session here'), null);
  assert.deepEqual(failing({ notes: [approval(10, { from: 'framework' })] }), [CONDITIONS.approval]);
  assert.deepEqual(failing({ prBody: 'no session line' }), [CONDITIONS.approval]);
});

test('it is clean and not draft: any merge state but clean, a conflict and a draft are returned naming that condition', () => {
  for (const mergeState of ['dirty', 'blocked', 'behind', 'unknown', undefined]) assert.deepEqual(failing({ mergeState }), [CONDITIONS.clean], String(mergeState));
  assert.deepEqual(failing({ draft: true }), [CONDITIONS.clean]);
  assert.deepEqual(failing({ mergeable: false }), [CONDITIONS.clean]);
});

test("a pull request this job returned is not unclean for it: `unstable` with only this job's own failed status and check is clean, and with any other check or status not passing it is not", () => {
  const own = { checkRuns: [green, { name: 'landing-admission / admit', status: 'completed', conclusion: 'failure' }], statuses: [{ context: 'landing-admission', state: 'failure' }], mergeState: 'unstable' };
  assert.equal(evaluate({ ...MEETS, ...own }).admitted, true, "the job's own failure must not keep a fixed pull request returned");
  assert.deepEqual(failing({ ...own, checkRuns: [...own.checkRuns, { name: 'lint', status: 'completed', conclusion: 'failure' }] }), [CONDITIONS.clean]);
  assert.deepEqual(failing({ ...own, statuses: [...own.statuses, { context: 'ci/other', state: 'pending' }] }), [CONDITIONS.clean]);
  assert.deepEqual(failing({ ...own, checkRuns: [...own.checkRuns, { name: 'lint', status: 'in_progress', conclusion: null }] }), [CONDITIONS.clean], 'a check still running is not passing');
});

test('a pull request missing several conditions is returned naming every one, each once', () => {
  const r = evaluate({ ...MEETS, linkedIssues: [], notes: [], draft: true });
  assert.deepEqual(r.failures.map((f) => f.condition).sort(), [CONDITIONS.approval, CONDITIONS.clean, CONDITIONS.issue].sort());
  assert.equal(new Set(r.failures.map((f) => f.condition)).size, r.failures.length);
});

test('Mutation: each of the four conditions alone decides admission: dropping any one lets a pull request through that missed it', () => {
  const misses = { [CONDITIONS.issue]: { linkedIssues: [] }, [CONDITIONS.checks]: { checkRuns: [] }, [CONDITIONS.approval]: { notes: [] }, [CONDITIONS.clean]: { mergeState: 'dirty' } };
  assert.equal(Object.keys(misses).length, 4);
  for (const [condition, spoil] of Object.entries(misses)) {
    const r = evaluate({ ...MEETS, ...spoil });
    assert.equal(r.admitted, false, condition);
    assert.deepEqual(r.failures.map((f) => f.condition), [condition]);
  }
});

test('one status on the head under one fixed context, `landing-admission`, the name NXD-Solutions/dna#1983\'s landing script reads: success when admitted, failure when returned, within 140 characters', () => {
  assert.equal(CONTEXT, 'landing-admission');
  const ok = statusFor(evaluate(MEETS), { sha: HEAD });
  assert.equal(ok.state, 'success');
  assert.match(ok.description, /a1b2c3d/);
  const bad = statusFor(evaluate({ ...MEETS, linkedIssues: [], notes: [], draft: true }), { sha: HEAD });
  assert.equal(bad.state, 'failure');
  assert.match(bad.description, /3 conditions/);
  assert.ok(bad.description.length <= DESCRIPTION_MAX);
});

test('one comment lists each failing condition and opens with a marker, so the job finds it again; an admitted pull request\'s comment says so', () => {
  const bad = commentFor(evaluate({ ...MEETS, linkedIssues: [], notes: [] }), { headSha: HEAD });
  assert.ok(bad.startsWith(MARKER));
  assert.match(bad, new RegExp(CONDITIONS.issue));
  assert.match(bad, new RegExp(CONDITIONS.approval));
  assert.doesNotMatch(bad, new RegExp(CONDITIONS.checks));
  assert.match(commentFor(evaluate(MEETS), { headSha: HEAD }), /Admitted/);
});

test('the one comment is updated in place, never a second: none yet is created, a marked one is updated by its id, a person\'s comment is never touched', () => {
  assert.deepEqual(planComment([{ id: 1, body: 'chat' }], 'new'), { action: 'create' });
  assert.deepEqual(planComment([{ id: 1, body: 'chat' }, { id: 2, body: `${MARKER}\nold` }], 'new'), { action: 'update', id: 2 });
  assert.deepEqual(planComment([{ id: 2, body: `${MARKER}\nsame` }], `${MARKER}\nsame`), { action: 'none' });
});

test('a pull request returned for lacking an approval is admitted when the approval is posted, with no new push: the same head, evaluated again, flips the status', () => {
  const posted = [];
  const readers = (notes) => ({
    pull: () => ({ headSha: HEAD, baseRef: 'landed/x', headRef: 'feature/y', draft: false, mergeState: 'clean', body: PR_BODY }),
    notes: () => notes, checkRuns: () => [green], statuses: () => [], linked: async () => MEETS.linkedIssues, comments: () => [],
  });
  const env = { gh: (args) => { posted.push(args); return ''; }, repo: 'NXD-Solutions/x', number: 5, requiredChecks: ['pre-push / build+test'] };
  return run({ ...env, readers: readers([]) }).then(async (first) => {
    assert.equal(first.state, 'failure');
    const second = await run({ ...env, readers: readers([approval(10)]) });
    assert.equal(second.state, 'success');
    const states = posted.filter((a) => a.some((x) => x.startsWith('state='))).map((a) => a.find((x) => x.startsWith('state=')));
    assert.deepEqual(states, ['state=failure', 'state=success']);
    assert.ok(posted.every((a) => !a.join(' ').includes(OLD_HEAD)));
    assert.ok(posted.some((a) => a.join(' ').includes(`statuses/${HEAD}`)), 'the status is on the pull request\'s head');
  });
});

test('Mutation: the status stays returned after the approval arrives: a run that does not re-read the notes would post failure twice, which the test above fails on', async () => {
  const stale = { pull: () => ({ headSha: HEAD, baseRef: 'landed/x', headRef: 'f', draft: false, mergeState: 'clean', mergeable: true, body: PR_BODY }), notes: () => [], checkRuns: () => [green], statuses: () => [], linked: async () => MEETS.linkedIssues, comments: () => [] };
  const states = [];
  const gh = (args) => { const s = args.find((x) => x.startsWith('state=')); if (s) states.push(s); return ''; };
  await run({ gh, repo: 'NXD-Solutions/x', number: 5, requiredChecks: ['pre-push / build+test'], readers: stale });
  await run({ gh, repo: 'NXD-Solutions/x', number: 5, requiredChecks: ['pre-push / build+test'], readers: { ...stale, notes: () => [approval(10)] } });
  assert.deepEqual(states, ['state=failure', 'state=success']);
});

// The shape of the workflow files. Reading text is not the proof (the run on the scratch repository is); these keep the pieces the run relies on from being edited away unnoticed.
const caller = readFileSync(new URL('../distributed/landing-admission.yml', import.meta.url), 'utf8');
const reusable = readFileSync(new URL('../.github/workflows/landing-admission-check.yml', import.meta.url), 'utf8');

test('the caller re-evaluates when a condition changes, not only on a push: pull-request events into landed/**, a comment that opens `## Review:`, and a finished check', () => {
  assert.match(caller, /pull_request:\s*\n\s*branches:\s*\n\s*- 'landed\/\*\*'\s*\n\s*types: \[[^\]]*opened[^\]]*synchronize[^\]]*ready_for_review[^\]]*\]/);
  assert.match(caller, /issue_comment:\s*\n\s*types: \[created, edited\]/);
  assert.match(caller, /startsWith\(github\.event\.comment\.body, '## Review:'\)/);
  assert.match(caller, /check_run:\s*\n\s*types: \[completed\]/);
});

test('the job\'s own check is excluded from "a check finished", so the job never starts itself', () => {
  assert.match(caller, /!startsWith\(github\.event\.check_run\.name, 'landing-admission'\)/);
  assert.match(caller, /landing-admission:\s*\n/, 'the job is named so that its check begins with the excluded prefix');
});

test('the caller grants what the job writes and nothing wider: the status and the one comment, and reads the rest; the pull-requests write is the one grant wider than the landing gate\'s caller', () => {
  assert.match(caller, /statuses: write/);
  assert.match(caller, /pull-requests: write/);
  assert.match(caller, /checks: read/);
  assert.ok(!/(?:contents|issues|actions|checks|packages):\s*write/.test(caller));
  assert.match(caller, /one grant wider|wider than/i, 'the grant is named in the caller\'s comment, where a security reader looks');
});

test('the job reads the API and runs no pull-request code: it checks out only this repository\'s own script', () => {
  assert.ok(!/ref: \$\{\{ github\.(?:event\.pull_request\.head|head_ref)/.test(reusable));
  assert.ok(!/pull_request_target/.test(caller + reusable));
  assert.match(reusable, /repository: NXD-Solutions\/\.github/);
});

test('one run per pull request, the latest event\'s, so a later evaluation is never overtaken by an earlier one', () => {
  assert.match(reusable, /concurrency:\s*\n\s*group: landing-admission-\$\{\{ github\.repository \}\}-\$\{\{ inputs\.number \}\}\s*\n\s*cancel-in-progress: true/);
});
