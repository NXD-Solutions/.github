// Fails a pull request that names no issue it delivers (NXD-Solutions/.github#394, dna#1400, rule dna#1401).
// The decision is a pure function of the PR's body and head branch; the one gh-free edge sits at the bottom.
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Head branches whose pull requests name no issue by nature: the distribution's own PR, and a release PR, which is not a
// Feature (github-workflow.md, Branches). Proposed on .github#394 and awaiting the requirement's owner.
export const EXEMPT_HEAD_PREFIXES = ['automated/', 'release/'];

// The keywords GitHub itself closes an issue on, and `Relates to`; each followed by `#n` or `<owner>/<repo>#n`.
const KEYWORD = '(?:close[sd]?|fix(?:es|ed)?|resolve[sd]?|relates to)';
const REFERENCE = '(?:[A-Za-z0-9_.-]+\\/[A-Za-z0-9_.-]+)?#\\d+';
const LINE = new RegExp(`^[ \\t]*(?:[-*][ \\t]+)?${KEYWORD}:?[ \\t]+${REFERENCE}`, 'im');

export const ACCEPTED_FORMS = '`Closes <owner>/<repo>#n`, `Closes #n`, `Fixes` or `Resolves` likewise, and `Relates to <owner>/<repo>#n` or `Relates to #n`, on a line of the PR body';

// A line inside a code fence or an HTML comment is an example, not a statement about this PR.
export function stripExamples(body) {
  return (body ?? '')
    .replace(/\r\n/g, '\n')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/^[ \t]*(```|~~~)[\s\S]*?^[ \t]*\1[ \t]*$/gm, '');
}

export function check({ body, headRef }) {
  const exempt = EXEMPT_HEAD_PREFIXES.find((prefix) => (headRef ?? '').startsWith(prefix));
  if (exempt) return { status: 'skip', message: `Skipped: a pull request from \`${exempt}*\` names no issue by nature.` };
  const match = LINE.exec(stripExamples(body));
  if (match) return { status: 'pass', message: `Names its issue: ${match[0].trim()}` };
  return {
    status: 'fail',
    message: `This pull request names no issue it delivers. Add one line to its body: ${ACCEPTED_FORMS}. A bare \`#n\` mention does not count, and a stacked pull request needs its own line, not its base's.`,
  };
}

function main() {
  const result = check({ body: process.env.PR_BODY, headRef: process.env.HEAD_REF });
  if (result.status === 'fail') {
    console.log(`::error title=No issue named::${result.message}`);
    process.exit(1);
  }
  console.log(result.message);
}

// `file://${process.argv[1]}` never matches on Windows; compare as paths.
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
