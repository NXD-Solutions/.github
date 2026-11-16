// Fails a pull request that has no issue in GitHub's Development field (NXD-Solutions/.github#408; its first form, .github#394, read the body's text).
// What counts is what GitHub itself links, read from GitHub, never the text: for a pull request into the default branch `closingIssuesReferences`, which sees a
// closing keyword, a linked branch and a sidebar link; for one into any other branch the same read sees a sidebar link only (observed on a scratch repository),
// so a linked branch is found from the issue side, by a bounded scan of the open issues' linked branches (the DNA's ruling on .github#408).
// The decision is a pure function of those reads; the gh edge sits at the bottom, and the wait for a late link is a loop over an injected reader and sleeper.
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Head branches whose pull requests name no issue by nature: the distribution's own PR, and a release PR, which is not a Feature (github-workflow.md, Branches).
export const EXEMPT_HEAD_PREFIXES = ['automated/', 'release/'];

// A link added in the sidebar after the check failed starts no workflow (observed: no pull_request activity type exists for it), so a failing check waits for
// one in this job, re-reading GitHub every POLL_SECONDS for up to WAIT_MINUTES, and passes the moment one appears. A body edit or a push starts a new run, which
// cancels this one (the reusable workflow's concurrency group). After the window the failure stands, and a re-run of the check reads again.
export const WAIT_MINUTES = 10;
export const POLL_SECONDS = 30;

// The scan of open issues costs one GraphQL call per SCAN_PAGE_SIZE issues, so it is bounded: at most SCAN_MAX_PAGES pages, repeated at most every
// SCAN_EVERY polls, and a scan that hits the bound is not taken for "no linked branch": the check fails and says so.
export const SCAN_PAGE_SIZE = 100;
export const SCAN_MAX_PAGES = 30;
export const SCAN_EVERY = 4;

const LEAF_RULE = '`tools/github/github-workflow.md`, *Issue linkage and closure* (NXD-Solutions/dna#1932)';

// Hints for the failure message only: the decision never reads the body's text.
const HINTS = [
  [/^[ \t]*(?:[-*][ \t]+)?(?:close[sd]?|fix(?:es|ed)?|resolve[sd]?):?[ \t]+(?![A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+#)[A-Za-z0-9_.-]+#\d+/im,
    'A `Closes <repo>#n` without its owner links to nothing: write `Closes <owner>/<repo>#n`.'],
  [/^[ \t]*(?:[-*][ \t]+)?relates to:?[ \t]+/im,
    `\`Relates to\` links nothing and does not count: a pull request delivers a leaf issue and closes it (${LEAF_RULE}).`],
];

// A line inside a code fence or an HTML comment is an example, not a statement about this pull request.
const withoutExamples = (body) => (body ?? '').replace(/\r\n/g, '\n').replace(/<!--[\s\S]*?-->/g, '').replace(/^[ \t]*(```|~~~)[\s\S]*?^[ \t]*\1[ \t]*$/gm, '');

export function hintsFor(body) {
  const text = withoutExamples(body);
  return HINTS.filter(([re]) => re.test(text)).map(([, message]) => message);
}

// A closing keyword that names another repository with its owner. GitHub links it, but the workflow's own token reads only this repository, so the read comes back
// empty for it (observed on a scratch repository, case 13 of the runs on .github#408). Option 2 of that issue, the DNA's: such a keyword passes when GitHub shows no
// link, and the message says the issue could not be confirmed; a wrong issue number passes. `Relates to`, a keyword without its owner, and one naming this repository
// do not qualify (a keyword naming this repository is read by GitHub). Option 1, a token that reads the org's repositories, is Security's to grant: a follow-up.
// GitHub reads a closing keyword wherever it stands in the body, mid-sentence included, followed by `owner/repo#n` or the issue's URL, so the claim is read the same way:
// anywhere, not only at the start of a line. A word that merely ends in a keyword (`prefixes`) or a keyword followed by other words (`closes the loop on`) is no claim.
const KEYWORD = '(?<![A-Za-z0-9_])(?:close[sd]?|fix(?:es|ed)?|resolve[sd]?):?[ \\t]+';
const CLOSING_WITH_OWNER = new RegExp(`${KEYWORD}(?:([A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+)#(\\d+)|https://github\\.com/([A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+)/issues/(\\d+))(?![A-Za-z0-9_])`, 'gi');

export function crossRepoClaims(body, repo) {
  const own = String(repo ?? '').toLowerCase();
  return [...withoutExamples(body).matchAll(CLOSING_WITH_OWNER)]
    .map((m) => ({ repo: m[1] ?? m[3], number: Number(m[2] ?? m[4]) }))
    .filter((c) => c.repo.toLowerCase() !== own)
    .map((c) => ({ ...c, via: 'a closing keyword GitHub shows no link for: not confirmed' }));
}

const named = (linked) => linked.map((i) => `${i.repo}#${i.number}${i.via ? ` (${i.via})` : ''}`).join(', ');

// decide({ headRef, baseRef, defaultBranch, linked, scanTruncated, body }) → { status: 'pass' | 'fail' | 'skip', message }. `linked` is what the reads found: [{ repo, number, via? }].
export function decide({ headRef, baseRef, defaultBranch, linked, scanTruncated = false, body, repo }) {
  const exempt = EXEMPT_HEAD_PREFIXES.find((prefix) => (headRef ?? '').startsWith(prefix));
  if (exempt) return { status: 'skip', message: `Skipped: a pull request from \`${exempt}*\` names no issue by nature.` };
  if (linked.length) return { status: 'pass', message: `Has an issue in its Development field: ${named(linked)}.` };
  // Only into the default branch: GitHub honours a closing keyword nowhere else, so a keyword into a feature branch counts for nothing.
  const claims = baseRef === defaultBranch ? crossRepoClaims(body, repo) : [];
  if (claims.length) {
    return { status: 'pass', message: `Names an issue in another repository, ${named(claims)}. GitHub shows no link for it because this check's token reads only this repository, so the check could not confirm that the issue exists.` };
  }
  const into = baseRef === defaultBranch ? '' : ` Into \`${baseRef}\`, a sidebar link or a branch created from an open issue counts; a closing keyword does not (GitHub honours it only into the default branch).`;
  return {
    status: 'fail',
    message: [
      'This pull request has no issue in its Development field.',
      'Link the issue it delivers: a closing keyword in the body (`Closes <owner>/<repo>#n`), a branch created from the issue, or the Development sidebar of the pull request.',
      ...(into ? [into.trim()] : []),
      ...(scanTruncated ? [`The scan of open issues for a linked branch hit its bound of ${SCAN_MAX_PAGES * SCAN_PAGE_SIZE} issues, so none was found: link it in the sidebar.`] : []),
      ...hintsFor(body),
    ].join(' '),
  };
}

// check({ ...inputs, read, scan, sleep, now }) → { status, message, waited }. `read()` is the pull request's own Development field; `scan(headRef)` finds the open issues
// whose linked branch is the head branch, and answers { linked, truncated }; it runs only for a pull request into a branch other than the default, only when `read` found
// nothing, and again at most every SCAN_EVERY polls. A failed read or scan throws, so a missing read is never taken for "no link". On a fail the check waits for a late
// link, as above.
export async function check({ read, scan, sleep, now = Date.now, waitMinutes = WAIT_MINUTES, pollSeconds = POLL_SECONDS, scanEvery = SCAN_EVERY, ...pr }) {
  let polls = 0;
  let lastScan = { linked: [], truncated: false };
  const look = async () => {
    // An exempt pull request is decided from its head branch alone: no read, no scan.
    if (EXEMPT_HEAD_PREFIXES.some((prefix) => (pr.headRef ?? '').startsWith(prefix))) return decide({ ...pr, linked: [] });
    let linked = await read();
    if (!linked.length && pr.baseRef !== pr.defaultBranch) {
      if (polls % scanEvery === 0) lastScan = await scan(pr.headRef);
      linked = lastScan.linked;
    }
    return decide({ ...pr, linked, scanTruncated: lastScan.truncated && !linked.length });
  };
  let result = await look();
  const deadline = now() + waitMinutes * 60_000;
  let waited = false;
  while (result.status === 'fail' && now() < deadline) {
    waited = true;
    polls += 1;
    console.log(`::notice title=Waiting for a link::No issue in the Development field yet; reading again in ${pollSeconds} s, for up to ${waitMinutes} min.`);
    await sleep(pollSeconds * 1000);
    result = await look();
  }
  return { ...result, waited };
}

const READ_QUERY = 'query($owner:String!,$name:String!,$number:Int!){ repository(owner:$owner,name:$name){ pullRequest(number:$number){ closingIssuesReferences(first:10){ nodes{ number repository{ nameWithOwner } } } } } }';
// Newest first: a branch is linked to a recent issue far more often than an old one, and GitHub's own default order is oldest first (observed on Manager-Assistant-v2),
// so a repository above SCAN_MAX_PAGES * SCAN_PAGE_SIZE open issues would otherwise be cut short exactly where the match is.
const SCAN_QUERY = 'query($owner:String!,$name:String!,$after:String){ repository(owner:$owner,name:$name){ issues(first:' + SCAN_PAGE_SIZE + ', states:OPEN, orderBy:{field:CREATED_AT, direction:DESC}, after:$after){ pageInfo{ hasNextPage endCursor } nodes{ number linkedBranches(first:5){ nodes{ ref{ name } } } } } } }';
// A refused call names what GitHub said, never only that the command failed: the permission a read lacks is the first thing a person looks for.
const gh = (args) => {
  try {
    return execFileSync('gh', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) {
    const said = String(e.stderr || e.message).trim().split('\n')[0];
    throw new Error(`gh api failed: ${said}`);
  }
};

export function readLinked({ repo, number }, run = gh) {
  const [owner, name] = repo.split('/');
  const out = JSON.parse(run(['api', 'graphql', '-f', `query=${READ_QUERY}`, '-f', `owner=${owner}`, '-f', `name=${name}`, '-F', `number=${number}`]));
  const pull = out?.data?.repository?.pullRequest;
  if (!pull) throw new Error(`the pull request ${repo}#${number} was not found`);
  return pull.closingIssuesReferences.nodes.map((n) => ({ repo: n.repository.nameWithOwner, number: n.number }));
}

// scanLinkedBranch({ repo, headRef }) → { linked, truncated }: the open issues of the repository whose linked branch is `headRef`, newest first, read page by page up to the
// bound. It returns at the first match: a pull request that has its link pays only the pages up to it, never all of them.
export function scanLinkedBranch({ repo, headRef }, run = gh) {
  const [owner, name] = repo.split('/');
  let after = null;
  for (let page = 0; page < SCAN_MAX_PAGES; page += 1) {
    const out = JSON.parse(run(['api', 'graphql', '-f', `query=${SCAN_QUERY}`, '-f', `owner=${owner}`, '-f', `name=${name}`, ...(after ? ['-f', `after=${after}`] : [])]));
    const issues = out?.data?.repository?.issues;
    if (!issues) throw new Error(`the issues of ${repo} could not be read`);
    const match = issues.nodes.find((issue) => issue.linkedBranches.nodes.some((b) => b.ref?.name === headRef));
    if (match) return { linked: [{ repo, number: match.number, via: 'linked branch' }], truncated: false };
    if (!issues.pageInfo.hasNextPage) return { linked: [], truncated: false };
    after = issues.pageInfo.endCursor;
  }
  return { linked: [], truncated: true };
}

// The annotation a refused or failed read ends as: what GitHub said, on one line, and what to do.
export const failureAnnotation = (error) =>
  `::error title=Could not read the Development field::${String(error?.message ?? error).split('\n')[0]}. The check did not run to an answer; re-run it once the cause is fixed.`;

async function main() {
  const { REPO, PR_NUMBER, PR_BODY, HEAD_REF, BASE_REF, DEFAULT_BRANCH } = process.env;
  let result;
  try {
    result = await check({
      headRef: HEAD_REF, baseRef: BASE_REF, defaultBranch: DEFAULT_BRANCH, body: PR_BODY, repo: REPO,
      read: async () => readLinked({ repo: REPO, number: Number(PR_NUMBER) }),
      scan: async (headRef) => scanLinkedBranch({ repo: REPO, headRef }),
      sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
    });
  } catch (e) {
    // A refused or failed read is never taken for a pass or for "no link": the check fails, as an annotation naming what GitHub said, not as a stack.
    console.log(failureAnnotation(e));
    process.exit(1);
  }
  if (result.status === 'fail') {
    console.log(`::error title=No issue in Development::${result.message}`);
    process.exit(1);
  }
  console.log(`${result.message}${result.waited ? ' (a link appeared while this check waited)' : ''}`);
}

// `file://${process.argv[1]}` never matches on Windows; compare as paths.
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) await main();
