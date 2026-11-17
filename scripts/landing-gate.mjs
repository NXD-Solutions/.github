// Sets one commit status, `landing-gate`, on a landing branch's head after a merge into it (NXD-Solutions/.github#418): the result of the repository's own gate, the
// commit it ran on, what failed, and the time of its run, so a pull request into `main` shows whether the branch builds and passes.
// The decision is a pure function of the gate's exit and output; the gh edge sits at the bottom, and a run is a function of the workflow's environment and an injected gh.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const CONTEXT = 'landing-gate';

// GitHub keeps 140 characters of a status description.
export const DESCRIPTION_MAX = 140;

// What the workflow reports when the repository set no gate command: a failure that says so, never a pass.
export const NO_GATE = 'no-gate';

const PASS = '0';

// The gate passed only when it returned exactly 0. An exit that is anything else, missing, or no number is a failure: the status is never a pass by default.
export const resultOf = (exitCode) => (String(exitCode) === PASS ? 'pass' : 'fail');

const FAILED_LINE = /^(?:not ok\b|FAIL\b|✖|✗|error\b)/i;

// The line the gate's output says failed; else its last line; else that it printed nothing.
export function failedLineOf(output) {
  const lines = String(output ?? '').replace(/\r\n/g, '\n').split('\n').map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return 'the gate printed nothing';
  return lines.find((l) => FAILED_LINE.test(l)) ?? lines[lines.length - 1];
}

const stamp = (now) => `${now.toISOString().slice(0, 16).replace('T', ' ')}Z`;
const cut = (text) => (text.length <= DESCRIPTION_MAX ? text : `${text.slice(0, DESCRIPTION_MAX - 1)}…`);

// The status for a gate's result: `success` or `failure`, and a description that names the commit (its first characters, so a cut keeps it) and the time of the run.
export function statusFor({ exitCode, sha, output, now = new Date() }) {
  const head = `${sha.slice(0, 7)} at ${stamp(now)}`;
  if (exitCode === NO_GATE) return { state: 'failure', description: cut(`Failed on ${head}: no gate command is set for this repository`) };
  if (resultOf(exitCode) === 'pass') return { state: 'success', description: cut(`Passed on ${head}`) };
  const shown = /^-?\d+$/.test(String(exitCode)) ? String(exitCode) : 'unreported';
  return { state: 'failure', description: cut(`Failed on ${head} (exit ${shown}): ${failedLineOf(output)}`) };
}

// One call, on the commit the gate ran on: `landing-gate` is the one context, so a later run on the same commit replaces this one.
export function postStatus({ repo, sha, state, description, targetUrl }, gh = ghExec) {
  gh(['api', '-X', 'POST', `repos/${repo}/statuses/${sha}`, '-f', `state=${state}`, '-f', `context=${CONTEXT}`, '-f', `description=${description}`, '-f', `target_url=${targetUrl}`]);
  return { sha, state, description };
}

export function run({ env, now = new Date(), gh = ghExec }) {
  const sha = env.GITHUB_SHA ?? '';
  if (!/^[0-9a-f]{40}$/.test(sha)) throw new Error(`GITHUB_SHA is not a commit: ${JSON.stringify(sha)}`);
  const repo = env.GITHUB_REPOSITORY ?? '';
  if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) throw new Error(`GITHUB_REPOSITORY is not a repository: ${JSON.stringify(repo)}`);
  const server = env.GITHUB_SERVER_URL || 'https://github.com';
  const targetUrl = env.GITHUB_RUN_ID ? `${server}/${repo}/actions/runs/${env.GITHUB_RUN_ID}` : `${server}/${repo}/commit/${sha}`;
  const { state, description } = statusFor({ exitCode: env.GATE_EXIT_CODE, sha, output: env.GATE_OUTPUT, now });
  return postStatus({ repo, sha, state, description, targetUrl }, gh);
}

const ghExec = (args) => execFileSync('gh', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] });

// The gate's output is a file in the workflow; only its tail is read, since the failing line is near the end.
const OUTPUT_TAIL_BYTES = 20_000;
const tailOf = (file) => {
  if (!file) return '';
  try { return readFileSync(file, 'utf8').slice(-OUTPUT_TAIL_BYTES); } catch { return ''; }
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const env = { ...process.env, GATE_OUTPUT: process.env.GATE_OUTPUT ?? tailOf(process.env.GATE_OUTPUT_FILE) };
  const r = run({ env });
  console.log(`${r.state}: ${r.description}`);
  if (r.state !== 'success') process.exitCode = 1;
}
