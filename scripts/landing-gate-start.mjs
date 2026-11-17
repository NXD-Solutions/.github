// Decides whether the full test of a landing branch may start on a chosen commit (NXD-Solutions/.github#423): the branch must be a `landed/**` branch and the commit its head or an
// ancestor of it, so `landing-gate` success can only mark landing content. A refusal names both, runs nothing and sets no status. The decision is a pure function of what the
// compare says; the gh edge sits at the bottom.
import { execFileSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const FULL_SHA = /^[0-9a-f]{40}$/;
const MAX_STEP_MINUTES = 355; // the job's own ceiling is the step limit plus a margin, and GitHub allows a job 360 minutes

// `comparison` is the compare of the commit against the branch (base = the commit, head = the branch): `ahead` or `identical` means the commit is the branch's head or behind it.
export function checkStart({ branch, sha, comparison, stepMinutes = '55' }) {
  const named = `commit ${String(sha).slice(0, 12)} on branch ${branch}`;
  const refuse = (why) => ({ ok: false, reason: `The full test is refused for ${named}: ${why}` });
  if (typeof branch !== 'string' || !branch.startsWith('landed/') || branch.length <= 'landed/'.length) return refuse('the branch is not a landed/** branch');
  if (!FULL_SHA.test(String(sha))) return refuse('the commit is not a full commit id');
  if (!/^[1-9]\d*$/.test(String(stepMinutes)) || Number(stepMinutes) > MAX_STEP_MINUTES) return refuse(`the step limit ${JSON.stringify(stepMinutes)} is not a whole number of minutes from 1 to ${MAX_STEP_MINUTES}`);
  if (comparison !== 'ahead' && comparison !== 'identical') return refuse(`the commit is neither the head of ${branch} nor an ancestor of it (the compare says ${comparison ?? 'nothing'})`);
  return { ok: true, reason: `${named} is on the branch` };
}

const ghExec = (args) => execFileSync('gh', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

export function run({ env, gh = ghExec }) {
  const { REPO: repo, BRANCH: branch, SHA: sha, STEP_MINUTES: stepMinutes } = env;
  // Nothing reaches the API until the inputs are well formed: a commit that is no full id, or a branch that is not `landed/**`, is refused before the compare is asked.
  const wellFormed = checkStart({ branch, sha, comparison: 'ahead', stepMinutes });
  if (!wellFormed.ok) return wellFormed;
  let comparison;
  try {
    comparison = gh(['api', `repos/${repo}/compare/${sha}...${encodeURIComponent(branch ?? '')}`, '--jq', '.status']);
  } catch (e) {
    // A branch or a commit the repository does not have cannot be compared: refused, naming both, never started.
    comparison = `not comparable: ${String(e?.stderr ?? e?.message ?? e).trim().split(/\r?\n/)[0]}`;
  }
  return checkStart({ branch, sha, comparison, stepMinutes });
}

// The job's ceiling for the full test: the step limit plus a margin, so the step's own limit always fires first and a hung run ends as a red status. Actions expressions have no
// arithmetic (found by the run on the scratch repository), so the start step works it out and the gate job reads it.
export const JOB_MARGIN_MINUTES = 5;
export const jobMinutes = (stepMinutes) => Number(stepMinutes) + JOB_MARGIN_MINUTES;

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const r = run({ env: process.env });
  console.log(r.reason);
  if (!r.ok) process.exitCode = 1;
  else if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `job_minutes=${jobMinutes(process.env.STEP_MINUTES)}\n`);
}
