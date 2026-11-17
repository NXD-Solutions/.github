import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { CONTEXT, QUICK_CONTEXT, contextFor, run as runStatus } from '../scripts/landing-gate.mjs';
import { checkStart, run as runStart } from '../scripts/landing-gate-start.mjs';

// The promise (NXD-Solutions/.github#423), one test per guarantee, written before the build. Fixture reads only: no GitHub call anywhere in this suite. That the workflows do what these
// say is the run of the workflows on the scratch repository, recorded on the issue.
//
// Invariant: the result of a full test belongs to the commit that was tested, and a later merge neither cancels the run nor changes the result.
//
// Guarantee 1: the full test is started by hand with a landing branch and a commit; it refuses, before running anything and naming both, a commit that is neither that branch's head nor an
//   ancestor of it, setting no status; it sets `landing-gate` on the tested commit; a merge arriving while it runs does not cancel or restart it, and the status stays on the tested commit.
// Guarantee 2: `landing-gate` is set only by the full test, on the tested commit; the quick set sets `landing-quick`, in a group that never cancels the full test; `LANDING_GATE_COMMAND`
//   is the full test's, `LANDING_QUICK_COMMAND` the optional per-merge one; the step limit is an input and the job's ceiling rises with it, so a hung full test ends as a red status.

const SHA = 'a1b2c3d4e5f60718293a4b5c6d7e8f9012345678';
const NEW_HEAD = 'fedcba9876543210fedcba9876543210fedcba98';
const BRANCH = 'landed/mvp';

// ─── the start check (guarantee 1) ───────────────────────────────────────────

test('a commit that is the landing branch\'s head or an ancestor of it may be tested', () => {
  for (const comparison of ['identical', 'ahead']) {
    const r = checkStart({ branch: BRANCH, sha: SHA, comparison });
    assert.equal(r.ok, true, comparison);
  }
});

test('a commit that is neither the branch\'s head nor an ancestor of it is refused naming both the commit and the branch', () => {
  for (const comparison of ['behind', 'diverged', undefined, 'not comparable: HTTP 404', 'nonsense']) {
    const r = checkStart({ branch: BRANCH, sha: SHA, comparison });
    assert.equal(r.ok, false, String(comparison));
    assert.ok(r.reason.includes(SHA.slice(0, 12)), 'names the commit');
    assert.ok(r.reason.includes(BRANCH), 'names the branch');
  }
});

test('a branch that is not a landed/** branch is refused, so `landing-gate` success can only mark landing content', () => {
  for (const branch of ['main', 'feature/x', 'candidate/x', 'landed/', 'landed', '', undefined]) {
    const r = checkStart({ branch, sha: SHA, comparison: 'ahead' });
    assert.equal(r.ok, false, String(branch));
    assert.ok(r.reason.includes(SHA.slice(0, 12)));
  }
});

test('a commit that is no full commit id is refused', () => {
  for (const sha of ['a1b2c3d', 'HEAD', 'main', '', 'zz' + SHA.slice(2)]) {
    assert.equal(checkStart({ branch: BRANCH, sha, comparison: 'ahead' }).ok, false, sha);
  }
});

test('Mutation: each condition alone refuses; none of the three is the same check as another (the check dropped lets one through that missed it)', () => {
  const ok = { branch: BRANCH, sha: SHA, comparison: 'ahead' };
  assert.equal(checkStart(ok).ok, true);
  assert.equal(checkStart({ ...ok, comparison: 'behind' }).ok, false);
  assert.equal(checkStart({ ...ok, branch: 'main' }).ok, false);
  assert.equal(checkStart({ ...ok, sha: 'abc' }).ok, false);
});

test('the start step asks GitHub to compare the commit against the branch, and a branch or commit GitHub cannot compare is refused, never started', () => {
  const asked = [];
  const accepted = runStart({ env: { REPO: 'NXD-Solutions/x', BRANCH, SHA, STEP_MINUTES: '55' }, gh: (args) => { asked.push(args.join(' ')); return 'ahead'; } });
  assert.equal(accepted.ok, true);
  assert.ok(asked[0].includes(`compare/${SHA}...landed%2Fmvp`), asked[0]);
  const failing = runStart({ env: { REPO: 'NXD-Solutions/x', BRANCH, SHA, STEP_MINUTES: '55' }, gh: () => { const e = new Error('gh failed'); e.stderr = 'HTTP 404: Not Found\nmore'; throw e; } });
  assert.equal(failing.ok, false);
  assert.ok(failing.reason.includes(BRANCH) && failing.reason.includes(SHA.slice(0, 12)));
  assert.match(failing.reason, /HTTP 404/);
});

test('the step limit is a whole number of minutes from 1 to 355, else the start is refused (a hung run must end as a red status, within the job\'s ceiling)', () => {
  for (const stepMinutes of ['55', '1', '355', '120']) assert.equal(checkStart({ branch: BRANCH, sha: SHA, comparison: 'ahead', stepMinutes }).ok, true, stepMinutes);
  for (const stepMinutes of ['0', '-5', '356', '5.5', 'abc', '', '1e3']) assert.equal(checkStart({ branch: BRANCH, sha: SHA, comparison: 'ahead', stepMinutes }).ok, false, stepMinutes);
});

// ─── the status goes on the tested commit, under the right context (guarantees 1 and 2) ──────

const posted = () => { const calls = []; return { calls, gh: (args) => { calls.push(args); return ''; } }; };
const ENV = { GITHUB_REPOSITORY: 'NXD-Solutions/x', GATE_EXIT_CODE: '0', GATE_OUTPUT: '' };

test('the full test\'s status lands on the tested commit, not on the head the branch has moved on to (and not on the commit a manual start itself runs at)', () => {
  const p = posted();
  runStatus({ env: { ...ENV, TESTED_SHA: SHA, GITHUB_SHA: NEW_HEAD, STATUS_CONTEXT: 'landing-gate' }, gh: p.gh });
  assert.equal(p.calls.length, 1);
  const call = p.calls[0].join(' ');
  assert.ok(call.includes(`statuses/${SHA}`), call);
  assert.ok(!call.includes(NEW_HEAD), 'never the new head');
  assert.ok(call.includes('context=landing-gate'));
});

test('Mutation: a run given no tested commit falls back to the run\'s own commit only for the quick set, and a status for no commit is never posted', () => {
  const p = posted();
  assert.throws(() => runStatus({ env: { ...ENV, TESTED_SHA: 'not-a-sha', GITHUB_SHA: '' }, gh: p.gh }), /tested commit/);
  assert.deepEqual(p.calls, []);
});

test('the quick set\'s result is `landing-quick`, never `landing-gate`: a quick pass can never be read as the full test\'s', () => {
  const p = posted();
  runStatus({ env: { ...ENV, GITHUB_SHA: SHA, TESTED_SHA: SHA, STATUS_CONTEXT: 'landing-quick' }, gh: p.gh });
  const call = p.calls[0].join(' ');
  assert.ok(call.includes('context=landing-quick'));
  assert.ok(!call.includes('context=landing-gate'));
  assert.equal(QUICK_CONTEXT, 'landing-quick');
  assert.equal(CONTEXT, 'landing-gate');
});

test('a run names one of the two contexts or none (then `landing-gate`, as before); any other name is refused, never posted', () => {
  assert.equal(contextFor(undefined), 'landing-gate');
  assert.equal(contextFor(''), 'landing-gate');
  assert.equal(contextFor('landing-quick'), 'landing-quick');
  assert.equal(contextFor('landing-gate'), 'landing-gate');
  assert.throws(() => contextFor('landing-admission'), /STATUS_CONTEXT/);
  const p = posted();
  assert.throws(() => runStatus({ env: { ...ENV, TESTED_SHA: SHA, STATUS_CONTEXT: 'ci/other' }, gh: p.gh }), /STATUS_CONTEXT/);
  assert.deepEqual(p.calls, []);
});

// ─── the shape of the workflows (reading text is not the proof: the run on the scratch repository is) ───

const full = readFileSync(new URL('../.github/workflows/landing-gate-check.yml', import.meta.url), 'utf8');
const quick = readFileSync(new URL('../.github/workflows/landing-quick-check.yml', import.meta.url), 'utf8');
const caller = readFileSync(new URL('../distributed/landing-gate.yml', import.meta.url), 'utf8');

test('the full test never cancels: its concurrency group is the tested commit\'s and cancel-in-progress is false', () => {
  assert.match(full, /concurrency:\s*\n(?:\s*#[^\n]*\n)*\s*group: landing-full-\$\{\{ github\.repository \}\}-\$\{\{ inputs\.sha \}\}\s*\n\s*cancel-in-progress: false/);
  assert.ok(!/cancel-in-progress: true/.test(full));
});

test('the quick set\'s group is not the full test\'s: a merge cancels only an earlier quick run', () => {
  const group = (text) => /group: (landing-[a-z]+-)/.exec(text)?.[1];
  assert.equal(group(quick), 'landing-quick-');
  assert.equal(group(full), 'landing-full-');
  assert.match(quick, /cancel-in-progress: true/);
});

test('the full test checks the start before anything else runs: the gate job waits on the start job, which reads the API and checks out no repository code', () => {
  assert.match(full, /gate:\s*\n\s*name: Landing gate\s*\n\s*needs: start/);
  const start = full.slice(full.indexOf('  start:'), full.indexOf('  gate:'));
  assert.match(start, /landing-gate-start\.mjs/);
  assert.ok(!/ref: \$\{\{ inputs\.sha \}\}/.test(start), 'the start job does not check out the tested commit');
});

test('the full test checks out the tested commit, not the branch head, with the whole history', () => {
  assert.match(full, /uses: actions\/checkout@v5\s*\n\s*with:\s*\n(?:\s*#[^\n]*\n)*\s*ref: \$\{\{ inputs\.sha \}\}\s*\n(?:\s*#[^\n]*\n)*\s*fetch-depth: 0/);
});

test('the full test sets `landing-gate` on the tested commit and the quick set sets `landing-quick` on its own, neither setting the other\'s context', () => {
  assert.match(full, /STATUS_CONTEXT: landing-gate/);
  assert.match(full, /TESTED_SHA: \$\{\{ inputs\.sha \}\}/);
  assert.match(quick, /STATUS_CONTEXT: landing-quick/);
  assert.ok(!/STATUS_CONTEXT: landing-gate/.test(quick), 'the quick set never sets landing-gate');
  assert.ok(!/STATUS_CONTEXT: landing-quick/.test(full));
});

test('the commands are separate: LANDING_GATE_COMMAND is the full test\'s, LANDING_QUICK_COMMAND the quick set\'s, and a quick set with no command runs nothing and sets nothing', () => {
  assert.match(full, /GATE_COMMAND: \$\{\{ vars\.LANDING_GATE_COMMAND \}\}/);
  assert.ok(!/LANDING_QUICK_COMMAND/.test(full.replace(/#[^\n]*\n/g, '')), 'the full test never reads the quick command');
  assert.match(quick, /GATE_COMMAND: \$\{\{ vars\.LANDING_QUICK_COMMAND \}\}/);
  assert.ok(!/GATE_COMMAND: \$\{\{ vars\.LANDING_GATE_COMMAND \}\}/.test(quick), 'the quick set never runs the full test\'s command');
  assert.match(quick, /if: \$\{\{ vars\.LANDING_QUICK_COMMAND != '' \}\}/);
});

test('a hung full test ends as a red status: the step limit is an input, the gate step\'s limit is that input and the job\'s ceiling is the input plus a margin', () => {
  assert.match(full, /step_minutes:\s*\n(?:\s*#[^\n]*\n)*\s*type: string\s*\n\s*default: '55'/);
  assert.match(full, /id: gate\s*\n(?:\s*#[^\n]*\n)*\s*timeout-minutes: \$\{\{ fromJSON\(inputs\.step_minutes\) \}\}/);
  assert.match(full, /name: Landing gate\s*\n\s*needs: start\s*\n\s*runs-on: ubuntu-latest\s*\n(?:\s*#[^\n]*\n)*\s*timeout-minutes: \$\{\{ fromJSON\(inputs\.step_minutes\) \+ (\d+) \}\}/);
  const margin = Number(/fromJSON\(inputs\.step_minutes\) \+ (\d+)/.exec(full)?.[1]);
  assert.ok(margin >= 1, 'the job outlives the step by a margin');
  assert.match(full, /if: \$\{\{ !cancelled\(\) \}\}/, 'the status step reports a step that timed out');
});

test('the caller starts the quick set on a push and the full test only by hand with a branch and a commit, passing the repository\'s step limit, and grants the status write and nothing wider', () => {
  assert.match(caller, /on:\s*\n\s*push:\s*\n\s*branches:\s*\n\s*- 'landed\/\*\*'\s*\n\s*workflow_dispatch:\s*\n\s*inputs:\s*\n\s*branch:[\s\S]*?required: true[\s\S]*?sha:[\s\S]*?required: true/);
  assert.match(caller, /quick:\s*\n\s*if: \$\{\{ github\.event_name == 'push' \}\}/);
  assert.match(caller, /full:\s*\n\s*if: \$\{\{ github\.event_name == 'workflow_dispatch' \}\}/);
  assert.match(caller, /landing-quick-check\.yml@main/);
  assert.match(caller, /landing-gate-check\.yml@main/);
  assert.match(caller, /step_minutes: \$\{\{ vars\.LANDING_GATE_TIMEOUT_MINUTES \|\| '55' \}\}/);
  assert.ok(!/(?:contents|pull-requests|issues|actions|checks|packages):\s*write/.test(caller));
  // a push of a candidate branch starts no full test: the only push heard is `landed/**` (matched above, one pattern), and it starts the quick set
  assert.equal((/push:\s*\n\s*branches:\s*\n((?:\s*- [^\n]+\n)+)/.exec(caller)?.[1].match(/- /g) ?? []).length, 1);
});
