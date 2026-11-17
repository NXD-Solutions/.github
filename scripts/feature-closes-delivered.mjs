// Fails a pull request from a feature branch into the default branch whose body does not close every issue that its merged task pull requests delivered (NXD-Solutions/dna#2003;
// the rule: `tools/github/github-workflow.md`, *Issue linkage and closure*). `.github#408` asks the pull request for a link; nothing asked the other direction, and cards stayed open.
// GitHub keeps no closing link for a pull request merged into a branch that is not the default, so what a task pull request "delivered" is read from its own text (a closing keyword) and
// from its Development field, and the state of each issue from GitHub. The decision is a pure function of those reads; the gh edge sits at the bottom.
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { withoutExamples } from './pr-names-issue.mjs';

// Head branches that are not Features: the distribution's own pull request, and a release (`tools/github/github-workflow.md`, Branches).
export const EXEMPT_HEAD_PREFIXES = ['release/', 'automated/'];

// The read of the merged task pull requests costs one GraphQL call per PAGE_SIZE of them, so it is bounded: a read that hits the bound is not taken for "no more", the check fails and says so.
export const PAGE_SIZE = 100;
export const MAX_PAGES = 10;

const norm = (key) => String(key).toLowerCase();
const SLUG = '[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+';
// GitHub reads a closing keyword wherever it stands in the body, followed by `owner/repo#n`, `#n` or the issue's URL; a word that merely ends in a keyword or a keyword followed by other words is no claim.
const CLOSING = new RegExp(`(?<![A-Za-z0-9_])(?:close[sd]?|fix(?:es|ed)?|resolve[sd]?):?[ \\t]+(?:(${SLUG})#(\\d+)|#(\\d+)|https://github\\.com/(${SLUG})/issues/(\\d+))(?![A-Za-z0-9_])`, 'gi');

// The issues a text closes, as `owner/repo#n`; a bare `#n` is of `repo`. A keyword in a code fence or an HTML comment is an example and counts for nothing.
export function closingRefs(body, repo) {
  const found = new Set();
  for (const m of withoutExamples(body).matchAll(CLOSING)) found.add(`${m[1] ?? m[4] ?? repo}#${m[2] ?? m[3] ?? m[5]}`);
  return [...found];
}

// Map `owner/repo#n` → { repo, number, prs }: the issues the merged task pull requests delivered, by a closing keyword in their text or a link in their Development field.
// `Relates to`, a bare mention and a keyword followed by other words deliver nothing.
export function deliveredBy(prs, repo) {
  const delivered = new Map();
  for (const pr of prs) {
    const refs = [...closingRefs(pr.body, repo), ...(pr.linked ?? []).map((l) => `${l.repo}#${l.number}`)];
    for (const ref of refs) {
      const [r, n] = ref.split('#');
      const hit = [...delivered.keys()].find((k) => norm(k) === norm(ref)) ?? ref;
      const entry = delivered.get(hit) ?? { repo: r, number: Number(n), prs: [] };
      entry.prs.push(pr.number);
      delivered.set(hit, entry);
    }
  }
  return delivered;
}

// An increment declares itself with an `**Increment:**` line and names the issues it leaves out in a `**Leaves:**` line (the DNA's form, dna#2003): each `owner/repo#n`, or a bare `#n` of this repository.
// A Leaves line without an Increment line is no increment. Only a line of its own counts.
export function leavesOf(body, repo) {
  const text = withoutExamples(body);
  if (!/^[ \t]*\*\*Increment:\*\*/m.test(text)) return [];
  const line = text.match(/^[ \t]*\*\*Leaves:\*\*[ \t]*(.+)$/m);
  if (!line) return [];
  return line[1].split(',').map((s) => s.trim()).filter(Boolean).flatMap((s) => {
    const m = s.match(new RegExp(`^(?:(${SLUG}))?#(\\d+)$`));
    return m ? [`${m[1] ?? repo}#${m[2]}`] : [];
  });
}

const list = (keys) => keys.join(', ');

// decide({ headRef, baseRef, defaultBranch, body, repo, delivered, states, truncated }) → { status: 'pass' | 'fail' | 'skip', message, missing, mismatched }.
// `states` maps each delivered issue to OPEN, CLOSED or UNKNOWN (an issue the check's token cannot read).
export function decide({ headRef, baseRef, defaultBranch, body, repo, delivered = new Map(), states = new Map(), truncated = false }) {
  const exempt = EXEMPT_HEAD_PREFIXES.find((p) => (headRef ?? '').startsWith(p));
  if (exempt) return { status: 'skip', message: `Skipped: a pull request from \`${exempt}*\` is not a Feature.`, missing: [], mismatched: [] };
  if (baseRef !== defaultBranch) return { status: 'skip', message: `Skipped: a pull request into \`${baseRef}\`, not the default branch, is not checked.`, missing: [], mismatched: [] };
  if (truncated) {
    return { status: 'fail', message: `The read of the merged pull requests hit its bound of ${MAX_PAGES * PAGE_SIZE} and was not read to the end, so the delivered issues could not be listed.`, missing: [], mismatched: [] };
  }
  const closes = new Set(closingRefs(body, repo).map(norm));
  const leaves = new Set(leavesOf(body, repo).map(norm));
  const missing = [];
  const mismatched = [];
  const unconfirmed = [];
  for (const key of delivered.keys()) {
    const state = states.get(key) ?? 'UNKNOWN';
    if (state === 'UNKNOWN') { unconfirmed.push(key); continue; }
    if (state !== 'OPEN') continue;
    if (leaves.has(norm(key))) { if (closes.has(norm(key))) mismatched.push(key); continue; }
    if (!closes.has(norm(key))) missing.push(key);
  }
  const notes = unconfirmed.length ? [`${list(unconfirmed)} could not be confirmed: the check's token reads only this repository, so whether it is open was not checked.`] : [];
  if (!missing.length && !mismatched.length) {
    return { status: 'pass', message: ['Every open issue its merged task pull requests delivered is closed by this pull request.', ...notes].join(' '), missing, mismatched };
  }
  const parts = [];
  if (missing.length) parts.push(`This pull request does not close ${list(missing)}, delivered by a pull request merged into its branch and still open: add \`Closes <owner>/<repo>#n\` for each (\`tools/github/github-workflow.md\`, *Issue linkage and closure*), or, for an increment, name it in a \`**Leaves:**\` line.`);
  if (mismatched.length) parts.push(`${list(mismatched)} is named in the \`**Leaves:**\` line and also closed by this pull request: it cannot be both left out and delivered.`);
  return { status: 'fail', message: [...parts, ...notes].join(' '), missing, mismatched };
}

// check({ ...pr, readMerged, readStates }) → decide's answer. `readMerged()` answers { prs, truncated }; `readStates(keys)` the state of each issue. A pull request that is not checked reads nothing.
// A failed read throws, so a missing read is never taken for "nothing delivered".
export async function check({ readMerged, readStates, ...pr }) {
  const skipped = decide({ ...pr, delivered: new Map(), states: new Map() });
  if (skipped.status === 'skip') return skipped;
  const { prs, truncated } = await readMerged();
  const delivered = deliveredBy(prs, pr.repo);
  const states = truncated ? new Map() : await readStates([...delivered.keys()]);
  return decide({ ...pr, delivered, states, truncated });
}

const MERGED_QUERY = 'query($owner:String!,$name:String!,$head:String!,$after:String){ repository(owner:$owner,name:$name){ pullRequests(baseRefName:$head, states:MERGED, first:' + PAGE_SIZE + ', orderBy:{field:CREATED_AT, direction:DESC}, after:$after){ pageInfo{ hasNextPage endCursor } nodes{ number body closingIssuesReferences(first:20){ nodes{ number repository{ nameWithOwner } } } } } } }';
const STATE_QUERY = 'query($owner:String!,$name:String!,$number:Int!){ repository(owner:$owner,name:$name){ issue(number:$number){ state } } }';

// A refused call names what GitHub said, never only that the command failed.
const gh = (args) => {
  try {
    return execFileSync('gh', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) {
    throw new Error(`gh api failed: ${String(e.stderr || e.message).trim().split('\n')[0]}`);
  }
};

// The pull requests merged into `headRef`, page by page up to the bound: { prs: [{ number, body, linked }], truncated }.
export function readMergedTaskPrs({ repo, headRef }, run = gh) {
  const [owner, name] = repo.split('/');
  const prs = [];
  let after = null;
  for (let page = 0; page < MAX_PAGES; page += 1) {
    const out = JSON.parse(run(['api', 'graphql', '-f', `query=${MERGED_QUERY}`, '-f', `owner=${owner}`, '-f', `name=${name}`, '-f', `head=${headRef}`, ...(after ? ['-f', `after=${after}`] : [])]));
    const pulls = out?.data?.repository?.pullRequests;
    if (!pulls) throw new Error(`the pull requests of ${repo} could not be read`);
    for (const n of pulls.nodes) prs.push({ number: n.number, body: n.body ?? '', linked: n.closingIssuesReferences.nodes.map((i) => ({ repo: i.repository.nameWithOwner, number: i.number })) });
    if (!pulls.pageInfo.hasNextPage) return { prs, truncated: false };
    after = pulls.pageInfo.endCursor;
  }
  return { prs, truncated: true };
}

// The state of each issue: OPEN or CLOSED. An issue of a repository the token cannot resolve is UNKNOWN; any other failed read throws.
export function readIssueStates(keys, run = gh) {
  const states = new Map();
  for (const key of keys) {
    const [slug, number] = key.split('#');
    const [owner, name] = slug.split('/');
    let out;
    try {
      out = JSON.parse(run(['api', 'graphql', '-f', `query=${STATE_QUERY}`, '-f', `owner=${owner}`, '-f', `name=${name}`, '-F', `number=${number}`]));
    } catch (e) {
      if (/Could not resolve/i.test(e.message)) { states.set(key, 'UNKNOWN'); continue; }
      throw e;
    }
    const issue = out?.data?.repository?.issue;
    if (!issue) throw new Error(`the issue ${key} was not found`);
    states.set(key, issue.state);
  }
  return states;
}

export const failureAnnotation = (error) =>
  `::error title=Could not read the delivered issues::${String(error?.message ?? error).split('\n')[0]}. The check did not run to an answer; re-run it once the cause is fixed.`;

async function main() {
  const { REPO, PR_BODY, HEAD_REF, BASE_REF, DEFAULT_BRANCH } = process.env;
  let result;
  try {
    result = await check({
      headRef: HEAD_REF, baseRef: BASE_REF, defaultBranch: DEFAULT_BRANCH, body: PR_BODY, repo: REPO,
      readMerged: async () => readMergedTaskPrs({ repo: REPO, headRef: HEAD_REF }),
      readStates: async (keys) => readIssueStates(keys),
    });
  } catch (e) {
    console.log(failureAnnotation(e));
    process.exit(1);
  }
  if (result.status === 'fail') {
    console.log(`::error title=Delivered issues not closed::${result.message}`);
    process.exit(1);
  }
  console.log(result.message);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) await main();
