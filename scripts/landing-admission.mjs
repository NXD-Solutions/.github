// Admits or returns a pull request into a landing branch (NXD-Solutions/.github#419): it checks the delivery rule's conditions and sets one commit status, `landing-admission`, on the
// pull request's head, keeps one comment listing each condition that fails, and does it again whenever a condition changes. The merge itself stays a person's or the merge script's act.
// The decision is a pure function of reads; the gh edge sits at the bottom, and a run is a function of injected readers and gh, so the suite holds no GitHub call.
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { readLinked, scanLinkedBranch } from './pr-names-issue.mjs';

// The one status context; NXD-Solutions/dna#1983's landing script reads exactly this name on the pull request's head. A change to it is a change to that script.
export const CONTEXT = 'landing-admission';

// The comment the job keeps opens with this, so it finds its own again and never touches a person's.
export const MARKER = '<!-- landing-admission -->';

// GitHub keeps 140 characters of a status description.
export const DESCRIPTION_MAX = 140;

export const CONDITIONS = Object.freeze({
  issue: 'it names its issue',
  checks: 'the required checks pass',
  approval: 'it has an approval at its head from another session',
  clean: 'it is clean and not draft',
  // A candidate's pull request into the default branch (`candidate/**` head): the tested commit, and main contained in it.
  gate: 'its head carries the full test\'s landing-gate success',
  ahead: 'main is an ancestor of its head',
});

// Which sort of pull request this is: one into a landing branch, a candidate's into the default branch, or neither (then this job does nothing and sets nothing).
export function kindOf({ baseRef, headRef, defaultBranch = 'main' }) {
  if (String(baseRef ?? '').startsWith('landed/')) return 'landing';
  if (baseRef === defaultBranch && String(headRef ?? '').startsWith('candidate/')) return 'candidate';
  return null;
}

const APPROVED = '## Review: approved';

// `**From session:** <name>`, a literal line of a pull request's body and of a review note.
export const sessionOf = (body) => /^\*\*From session:\*\*[ \t]*(.+?)[ \t]*$/m.exec(String(body ?? '').replace(/\r\n/g, '\n'))?.[1] ?? null;

const isReviewNote = (comment) => String(comment?.body ?? '').trimStart().startsWith('## Review:');

// The latest review note of any answer: a comment that opens `## Review:`, the highest id. A later `changes requested` therefore decides over an earlier approval.
export function latestReviewNote(comments) {
  const notes = (comments ?? []).filter(isReviewNote);
  return notes.length === 0 ? null : notes.reduce((a, b) => (b.id > a.id ? b : a));
}

const answerOf = (note) => /^## Review:[ \t]*(.*?)[ \t]*$/m.exec(String(note.body).trimStart().replace(/\r\n/g, '\n'))?.[1] ?? '';
const headReviewedOf = (note) => /^\*\*Head reviewed:\*\*[ \t]*([0-9a-fA-F]+)[ \t]*$/m.exec(String(note.body).replace(/\r\n/g, '\n'))?.[1]?.toLowerCase() ?? null;

function approvalFailure({ notes, prBody, headSha }) {
  const note = latestReviewNote(notes);
  if (!note) return 'no review note on it yet';
  const answer = answerOf(note);
  if (answer.toLowerCase() !== 'approved') {
    return `its latest review note says "${answer || 'nothing'}", not the literal "${APPROVED}" (a note that says "approve" is returned until the reviewer adopts the literal)`;
  }
  if (headReviewedOf(note) !== String(headSha).toLowerCase()) return `its latest review note approves another commit: its "**Head reviewed:**" line must equal the head ${headSha}, in full`;
  const mine = sessionOf(prBody);
  if (mine === null) return 'the pull request names no "**From session:**", so the reviewer\'s independence cannot be read';
  const theirs = sessionOf(note.body);
  if (theirs === null || theirs === mine) return `its approval is from ${theirs === null ? 'no named session' : `the pull request's own session (${mine})`}: it must come from another session`;
  return null;
}

function checksFailure({ requiredChecks, checkRuns }) {
  if (!requiredChecks || requiredChecks.length === 0) return 'no required check is set for this repository (the variable LANDING_REQUIRED_CHECKS), and none set is never a pass';
  const notPassing = requiredChecks.filter((name) => {
    const runs = (checkRuns ?? []).filter((r) => r.name === name);
    return runs.length === 0 || !runs.every((r) => r.status === 'completed' && r.conclusion === 'success');
  });
  return notPassing.length === 0 ? null : `not passing on the head: ${notPassing.join(', ')}`;
}

// Clean is GitHub's own word (`clean`), with one exception this job's own doing: a pull request this job has returned carries this job's failed status and failed check, which
// GitHub reads as `unstable`, so a returned pull request could never read clean again, whatever was fixed (observed on the scratch repository). `unstable` therefore stays clean when
// nothing but this job's own context and check is not passing, and never when another check or status is.
const isOwn = (name) => String(name ?? '').startsWith(CONTEXT);
function cleanFailure({ draft, mergeState, mergeable, checkRuns, statuses }) {
  if (draft) return 'it is a draft';
  if (mergeable === false) return 'it has conflicts with its base';
  if (mergeState === 'clean') return null;
  if (mergeState === 'unstable') {
    const others = [
      ...(checkRuns ?? []).filter((r) => !isOwn(r.name)).filter((r) => !(r.status === 'completed' && ['success', 'skipped', 'neutral'].includes(r.conclusion))).map((r) => r.name),
      ...(statuses ?? []).filter((s) => !isOwn(s.context)).filter((s) => s.state !== 'success').map((s) => s.context),
    ];
    return others.length === 0 ? null : `its merge state is unstable: not passing besides this job's own: ${others.join(', ')}`;
  }
  return `its merge state is ${mergeState ?? 'unknown'}, not clean`;
}

// evaluate(read) → { admitted, failures: [{ condition, detail }] }, in the order the conditions are listed.
export function evaluate({ linkedIssues, requiredChecks, checkRuns, statuses = [], notes, prBody, headSha, draft, mergeState, mergeable = true }) {
  const failures = [];
  const fail = (condition, detail) => detail && failures.push({ condition, detail });
  fail(CONDITIONS.issue, (linkedIssues ?? []).length === 0 ? 'no issue in its Development field' : null);
  fail(CONDITIONS.checks, checksFailure({ requiredChecks, checkRuns }));
  fail(CONDITIONS.approval, approvalFailure({ notes, prBody, headSha }));
  fail(CONDITIONS.clean, cleanFailure({ draft, mergeState, mergeable, checkRuns, statuses }));
  return { admitted: failures.length === 0, failures };
}

// A candidate is admitted when its head carries the full test's `landing-gate` success (the tested commit), the default branch is an ancestor of it (the compare says `ahead` or
// `identical`), and it is not a draft and is clean. It needs no approval at its head (it is reviewed through the reviews of what it carries) and is asked for no issue and no required
// checks: the first is the existing check every pull request has, the second reaches it through `clean`.
export function evaluateCandidate({ statuses = [], comparison, checkRuns, draft, mergeState, mergeable = true, defaultBranch = 'main' }) {
  const failures = [];
  const fail = (condition, detail) => detail && failures.push({ condition, detail });
  const gate = (statuses ?? []).find((s) => s.context === 'landing-gate');
  fail(CONDITIONS.gate, gate?.state === 'success' ? null : gate ? `landing-gate is ${gate.state} on its head, not success` : 'no landing-gate status on its head: the full test was not run on this commit');
  fail(CONDITIONS.ahead, ['ahead', 'identical'].includes(comparison) ? null : `its head does not contain ${defaultBranch} (the compare says ${comparison ?? 'nothing'})`);
  fail(CONDITIONS.clean, cleanFailure({ draft, mergeState, mergeable, checkRuns, statuses }));
  return { admitted: failures.length === 0, failures };
}

const cut = (text) => (text.length <= DESCRIPTION_MAX ? text : `${text.slice(0, DESCRIPTION_MAX - 1)}…`);

export function statusFor(result, { sha }) {
  const short = sha.slice(0, 7);
  if (result.admitted) return { state: 'success', description: cut(`Admitted at ${short}: every condition holds`) };
  const n = result.failures.length;
  return { state: 'failure', description: cut(`Returned at ${short}: ${n} condition${n === 1 ? '' : 's'}: ${result.failures.map((f) => f.condition).join('; ')}`) };
}

export function commentFor(result, { headSha }) {
  const short = headSha.slice(0, 7);
  const body = result.admitted
    ? `Admitted at \`${short}\`: every condition of the delivery rule holds.`
    : `Returned at \`${short}\`. ${result.failures.length} condition${result.failures.length === 1 ? '' : 's'} to fix:\n\n${result.failures.map((f) => `- **${f.condition}:** ${f.detail}`).join('\n')}`;
  return `${MARKER}\n## Landing admission\n\n${body}\n\n_Evaluated again when a condition changes: a review note, a finished check, a push, a change of state._`;
}

// The one comment: none yet is created, a marked one is updated by its id (or left, when unchanged), a person's comment is never touched.
export function planComment(comments, body) {
  const mine = (comments ?? []).find((c) => String(c.body ?? '').startsWith(MARKER));
  if (!mine) return { action: 'create' };
  return mine.body === body ? { action: 'none' } : { action: 'update', id: mine.id };
}

const ghJson = (gh, args) => JSON.parse(gh(args) || 'null');
const lines = (text) => String(text).split('\n').filter(Boolean).map((l) => JSON.parse(l));

// The reads the production run makes, over gh; a test injects its own. The merge state is computed by GitHub lazily, so `unknown` is read again a few times.
export function ghReaders({ repo, number, gh = ghExec, sleep = (ms) => new Promise((r) => setTimeout(r, ms)) }) {
  return {
    async pull() {
      for (let attempt = 0; attempt < 6; attempt += 1) {
        const p = ghJson(gh, ['api', `repos/${repo}/pulls/${number}`]);
        if (p.mergeable_state !== 'unknown' || attempt === 5) return { headSha: p.head.sha, baseRef: p.base.ref, headRef: p.head.ref, draft: p.draft, mergeState: p.mergeable_state, mergeable: p.mergeable, body: p.body ?? '' };
        await sleep(3000);
      }
      return undefined;
    },
    notes: () => lines(gh(['api', '--paginate', `repos/${repo}/issues/${number}/comments`, '--jq', '.[]|{id,body}|tojson'])),
    comments: () => lines(gh(['api', '--paginate', `repos/${repo}/issues/${number}/comments`, '--jq', '.[]|{id,body}|tojson'])),
    checkRuns: (sha) => lines(gh(['api', '--paginate', `repos/${repo}/commits/${sha}/check-runs`, '--jq', '.check_runs[]|{name,status,conclusion}|tojson'])),
    statuses: (sha) => lines(gh(['api', '--paginate', `repos/${repo}/commits/${sha}/status`, '--jq', '.statuses[]|{context,state}|tojson'])),
    compare: (baseRef, headSha) => gh(['api', `repos/${repo}/compare/${encodeURIComponent(baseRef)}...${headSha}`, '--jq', '.status']),
    async linked({ headRef }) {
      const direct = readLinked({ repo, number }, gh);
      if (direct.length > 0) return direct;
      return scanLinkedBranch({ repo, headRef }, gh).linked;
    },
  };
}

export async function run({ repo, number, requiredChecks, defaultBranch = 'main', readers = ghReaders({ repo, number }), gh = ghExec }) {
  const pull = await readers.pull();
  const kind = kindOf({ baseRef: pull.baseRef, headRef: pull.headRef, defaultBranch });
  // A pull request that is neither into a landing branch nor a candidate's into the default branch is not this job's: nothing is set, nothing is said.
  if (kind === null) return { skipped: true, admitted: null, failures: [] };
  const [notes, comments, checkRuns, statuses, linkedIssues] = await Promise.all([
    readers.notes(), readers.comments(), readers.checkRuns(pull.headSha), readers.statuses(pull.headSha), kind === 'landing' ? readers.linked({ headRef: pull.headRef }) : [],
  ]);
  const result = kind === 'candidate'
    ? evaluateCandidate({ statuses, comparison: await readers.compare(pull.baseRef, pull.headSha), checkRuns, draft: pull.draft, mergeState: pull.mergeState, mergeable: pull.mergeable, defaultBranch })
    : evaluate({ linkedIssues, requiredChecks, checkRuns, statuses, notes, prBody: pull.body, headSha: pull.headSha, draft: pull.draft, mergeState: pull.mergeState, mergeable: pull.mergeable });
  const { state, description } = statusFor(result, { sha: pull.headSha });
  gh(['api', '-X', 'POST', `repos/${repo}/statuses/${pull.headSha}`, '-f', `state=${state}`, '-f', `context=${CONTEXT}`, '-f', `description=${description}`, '-f', `target_url=https://github.com/${repo}/pull/${number}`]);
  const body = commentFor(result, { headSha: pull.headSha });
  const plan = planComment(comments, body);
  if (plan.action === 'create') gh(['api', '-X', 'POST', `repos/${repo}/issues/${number}/comments`, '-f', `body=${body}`]);
  else if (plan.action === 'update') gh(['api', '-X', 'PATCH', `repos/${repo}/issues/comments/${plan.id}`, '-f', `body=${body}`]);
  return { state, description, admitted: result.admitted, failures: result.failures };
}

const ghExec = (args) => execFileSync('gh', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'], maxBuffer: 64 * 1024 * 1024 }).trim();

// When the default branch moves, every open candidate's pull request is evaluated again: "main is an ancestor of its head" changes with no event on the pull request.
export function candidatePulls(pulls, defaultBranch = 'main') {
  return (pulls ?? []).filter((p) => kindOf({ baseRef: p.base, headRef: p.head, defaultBranch }) === 'candidate').map((p) => p.number);
}

export async function runCandidates({ repo, defaultBranch = 'main', requiredChecks = [], gh = ghExec, list = () => lines(gh(['api', '--paginate', `repos/${repo}/pulls?state=open&base=${encodeURIComponent(defaultBranch)}&per_page=100`, '--jq', '.[]|{number,head:.head.ref,base:.base.ref}|tojson'])), runOne = (number) => run({ repo, number, requiredChecks, defaultBranch, gh }) }) {
  const numbers = candidatePulls(await list(), defaultBranch);
  const results = [];
  for (const number of numbers) results.push({ number, ...(await runOne(number)) });
  return results;
}

async function main() {
  const { REPO, PR_NUMBER, LANDING_REQUIRED_CHECKS, DEFAULT_BRANCH } = process.env;
  const requiredChecks = String(LANDING_REQUIRED_CHECKS ?? '').split(/[\n,]/).map((s) => s.trim()).filter(Boolean);
  const defaultBranch = DEFAULT_BRANCH || 'main';
  if (!PR_NUMBER) {
    const all = await runCandidates({ repo: REPO, defaultBranch, requiredChecks });
    console.log(`the default branch moved: ${all.length} open candidate pull request${all.length === 1 ? '' : 's'} evaluated again`);
    return;
  }
  const r = await run({ repo: REPO, number: Number(PR_NUMBER), requiredChecks, defaultBranch });
  if (r.skipped) { console.log('not a pull request into a landing branch or a candidate\'s into the default branch: nothing set'); return; }
  console.log(`${r.state}: ${r.description}`);
  // A returned pull request makes the job red, so the pull request's checks show it; the job's own check is excluded from the events that start it (the caller).
  if (!r.admitted) process.exitCode = 1;
}

// `file://${process.argv[1]}` never matches on Windows; compare as paths.
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) await main();
