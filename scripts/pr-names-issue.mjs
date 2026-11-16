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

export function hintsFor(body) {
  const text = (body ?? '').replace(/\r\n/g, '\n').replace(/<!--[\s\S]*?-->/g, '').replace(/^[ \t]*(```|~~~)[\s\S]*?^[ \t]*\1[ \t]*$/gm, '');
  return HINTS.filter(([re]) => re.test(text)).map(([, message]) => message);
}

const named = (linked) => linked.map((i) => `${i.repo}#${i.number}${i.via ? ` (${i.via})` : ''}`).join(', ');

// decide({ headRef, baseRef, defaultBranch, linked, scanTruncated, body }) → { status: 'pass' | 'fail' | 'skip', message }. `linked` is what the reads found: [{ repo, number, via? }].
export function decide({ headRef, baseRef, defaultBranch, linked, scanTruncated = false, body }) {
  const exempt = EXEMPT_HEAD_PREFIXES.find((prefix) => (headRef ?? '').startsWith(prefix));
  if (exempt) return { status: 'skip', message: `Skipped: a pull request from \`${exempt}*\` names no issue by nature.` };
  if (linked.length) return { status: 'pass', message: `Has an issue in its Development field: ${named(linked)}.` };
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
const SCAN_QUERY = 'query($owner:String!,$name:String!,$after:String){ repository(owner:$owner,name:$name){ issues(first:' + SCAN_PAGE_SIZE + ', states:OPEN, after:$after){ pageInfo{ hasNextPage endCursor } nodes{ number linkedBranches(first:5){ nodes{ ref{ name } } } } } } }';
const gh = (args) => execFileSync('gh', args, { encoding: 'utf8' });

export function readLinked({ repo, number }, run = gh) {
  const [owner, name] = repo.split('/');
  const out = JSON.parse(run(['api', 'graphql', '-f', `query=${READ_QUERY}`, '-f', `owner=${owner}`, '-f', `name=${name}`, '-F', `number=${number}`]));
  const pull = out?.data?.repository?.pullRequest;
  if (!pull) throw new Error(`the pull request ${repo}#${number} was not found`);
  return pull.closingIssuesReferences.nodes.map((n) => ({ repo: n.repository.nameWithOwner, number: n.number }));
}

// scanLinkedBranch({ repo, headRef }) → { linked, truncated }: the open issues of the repository whose linked branch is `headRef`, read page by page up to the bound.
export function scanLinkedBranch({ repo, headRef }, run = gh) {
  const [owner, name] = repo.split('/');
  const linked = [];
  let after = null;
  for (let page = 0; page < SCAN_MAX_PAGES; page += 1) {
    const out = JSON.parse(run(['api', 'graphql', '-f', `query=${SCAN_QUERY}`, '-f', `owner=${owner}`, '-f', `name=${name}`, ...(after ? ['-f', `after=${after}`] : [])]));
    const issues = out?.data?.repository?.issues;
    if (!issues) throw new Error(`the issues of ${repo} could not be read`);
    for (const issue of issues.nodes) if (issue.linkedBranches.nodes.some((b) => b.ref?.name === headRef)) linked.push({ repo, number: issue.number, via: 'linked branch' });
    if (!issues.pageInfo.hasNextPage) return { linked, truncated: false };
    after = issues.pageInfo.endCursor;
  }
  return { linked, truncated: linked.length === 0 };
}

async function main() {
  const { REPO, PR_NUMBER, PR_BODY, HEAD_REF, BASE_REF, DEFAULT_BRANCH } = process.env;
  const result = await check({
    headRef: HEAD_REF, baseRef: BASE_REF, defaultBranch: DEFAULT_BRANCH, body: PR_BODY,
    read: async () => readLinked({ repo: REPO, number: Number(PR_NUMBER) }),
    scan: async (headRef) => scanLinkedBranch({ repo: REPO, headRef }),
    sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  });
  if (result.status === 'fail') {
    console.log(`::error title=No issue in Development::${result.message}`);
    process.exit(1);
  }
  console.log(`${result.message}${result.waited ? ' (a link appeared while this check waited)' : ''}`);
}

// `file://${process.argv[1]}` never matches on Windows; compare as paths.
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) await main();
