// Reports each org repo that holds code but does not receive the dev standards (NXD-Solutions/dna#1387).
// The decisions are pure functions; the gh edges sit at the bottom and are injected, so the tests touch nothing.
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const STANDARDS_DOMAIN = 'enterprise-architecture';
export const EXEMPTION_KEY = 'standards-exemption';

// Code is a file a machine executes, or builds into something it executes: a program, a script, a CI workflow,
// or what builds or provisions something that runs (a Dockerfile, a Makefile, Bicep, Terraform).
// Markup, prose, data and configuration values are not, and neither is anything the distribution copies in.
// This is the one list; the requirement's own words are in dna#1387.
const CODE_EXTENSIONS = new Set([
  'js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'mts', 'cts',
  'py', 'sh', 'bash', 'ps1', 'rb', 'go', 'java', 'kt', 'cs', 'php', 'rs', 'swift',
  // What builds or provisions something that runs.
  'bicep', 'tf',
]);
const CODE_FILE_NAMES = /^(Dockerfile(\.(?!(md|txt|json|ya?ml|html)$)[^.]+)?|Makefile|GNUmakefile)$/;
const NOT_CODE_DIRECTORIES = new Set(['node_modules', 'dist', 'build', 'vendor', '.claude', '.claude-test']);

export function isCode(path) {
  const parts = path.split('/');
  if (parts.some((part) => NOT_CODE_DIRECTORIES.has(part))) return false;
  const name = parts[parts.length - 1];
  if (/^\.github\/workflows\/[^/]+\.ya?ml$/.test(path)) return true;
  if (name.endsWith('.d.ts')) return false;
  if (CODE_FILE_NAMES.test(name)) return true;
  const dot = name.lastIndexOf('.');
  return dot > 0 && CODE_EXTENSIONS.has(name.slice(dot + 1).toLowerCase());
}

export function firstCode(paths) {
  return paths.find(isCode) ?? null;
}

export function isSubscribed(override) {
  return (override?.domains ?? []).includes(STANDARDS_DOMAIN);
}

// An exemption is a granted deviation and carries its reason; one without a reason exempts nothing.
export function exemptionReason(override) {
  const reason = override?.[EXEMPTION_KEY];
  return typeof reason === 'string' && reason.trim() !== '' ? reason.trim() : null;
}

/** One verdict per repo. `truncated` means GitHub cut the file list, so no-code can't be shown: the repo counts as holding code. */
export function decide({ repo, paths, truncated = false, override }) {
  const example = firstCode(paths);
  if (example === null && !truncated) return { repo, status: 'no-code' };
  if (isSubscribed(override)) return { repo, status: 'subscribed' };
  const reason = exemptionReason(override);
  if (reason !== null) return { repo, status: 'exempt', reason };
  return { repo, status: 'named', example, truncated };
}

export const reportTitle = (repo) => `${repo} holds code without the dev standards`;

export function reportBody({ repo, example, truncated }) {
  const evidence = truncated
    ? 'Its file list was too large for GitHub to return in full, so it is counted as holding code.'
    : `For example: \`${example}\`.`;
  return [
    '**From session:** the distribution workflow, `NXD-Solutions/.github`',
    `**The need:** \`${repo}\` holds code and does not receive Enterprise Architecture's dev standards, and the standing coordination hub should know.`,
    '',
    '## Context',
    evidence,
    '',
    `It leaves this list when the repo subscribes to \`${STANDARDS_DOMAIN}\` in \`.github/claude-rules-overrides.yml\`, holds no code, or the principal grants an exemption: a \`${EXEMPTION_KEY}\` entry beside its subscription, with the reason. The report informs. It withholds nothing from the repo.`,
    '',
    '## What must hold',
    '**No invariant yet:** this reports a state; it is not work to build.',
    `**Domains:** ${STANDARDS_DOMAIN}, framework`,
    '',
    '## Metadata',
    '- **Source:** NXD-Solutions/dna#1387',
  ].join('\n');
}

/**
 * What to do about the open reports. `openReports` maps a repo to its open issue number.
 * A named repo with no open report gets one; a repo that is no longer named has its report closed, with the reason.
 */
export function plan({ decisions, openReports }) {
  const actions = [];
  for (const d of decisions) {
    const open = openReports[d.repo];
    if (d.status === 'named') {
      if (open === undefined) actions.push({ type: 'open', repo: d.repo, title: reportTitle(d.repo), body: reportBody(d) });
    } else if (open !== undefined) {
      actions.push({ type: 'close', repo: d.repo, number: open, comment: closeComment(d) });
    }
  }
  return actions;
}

function closeComment(d) {
  if (d.status === 'subscribed') return 'Closed: the repo now subscribes to the dev standards.';
  if (d.status === 'no-code') return 'Closed: the repo holds no code.';
  return `Closed: the principal granted an exemption. Reason: ${d.reason}`;
}

export const REPORT_TYPE = 'Task';
export const BOARD_STATUS = 'Proposed';

/** Carries the actions out. `gh(args)` returns stdout and throws on failure, so a failure is loud, never skipped. */
export function apply(actions, { gh, issuesRepo, owner, boardNumber, board }) {
  const done = [];
  for (const a of actions) {
    if (a.type === 'open') {
      const url = gh(['issue', 'create', '--repo', issuesRepo, '--title', a.title, '--body', a.body]).trim();
      const number = url.split('/').pop();
      try {
        gh(['api', `repos/${issuesRepo}/issues/${number}`, '-X', 'PATCH', '-f', `type=${REPORT_TYPE}`]);
        const itemId = gh(['project', 'item-add', String(boardNumber), '--owner', owner, '--url', url, '--format', 'json', '--jq', '.id']).trim();
        gh(['project', 'item-edit', '--id', itemId, '--project-id', board.projectId, '--field-id', board.statusFieldId,
          '--single-select-option-id', board.proposedOptionId]);
      } catch (e) {
        // A report off the board, or not a Task, or not Proposed, would stay open, and the next run would leave it so.
        gh(['issue', 'close', number, '--repo', issuesRepo, '--reason', 'not planned',
          '--comment', `Closed: it could not be set up on the board (${e.message}). The next run opens it again.`]);
        throw e;
      }
      done.push(`opened ${url}`);
    } else {
      gh(['issue', 'close', String(a.number), '--repo', issuesRepo, '--comment', a.comment]);
      done.push(`closed #${a.number} (${a.repo})`);
    }
  }
  return done;
}

/** The board's own ids, read once: the project, its Status field, and the Proposed option. */
export function boardIds(gh, owner, boardNumber) {
  const projectId = gh(['project', 'view', String(boardNumber), '--owner', owner, '--format', 'json', '--jq', '.id']).trim();
  const fields = JSON.parse(gh(['project', 'field-list', String(boardNumber), '--owner', owner, '--format', 'json'])).fields;
  const status = fields.find((f) => f.name === 'Status');
  const proposed = status?.options?.find((o) => o.name === BOARD_STATUS);
  if (!projectId || !status || !proposed) throw new Error(`the board has no Status field with a "${BOARD_STATUS}" option`);
  return { projectId, statusFieldId: status.id, proposedOptionId: proposed.id };
}

// ---- the gh edges ----------------------------------------------------------------------------------------------

export function ghRunner(env = process.env) {
  return (args) => {
    const r = spawnSync('gh', args, { encoding: 'utf8', env });
    if (r.status !== 0) throw new Error(`gh ${args.slice(0, 3).join(' ')} failed: ${r.stderr.trim()}`);
    return r.stdout;
  };
}

export function listRepos(gh, owner) {
  const out = gh(['api', `orgs/${owner}/repos`, '--paginate', '--jq', '.[] | select(.archived | not) | .full_name']);
  return out.split('\n').map((s) => s.trim()).filter(Boolean);
}

export function readTree(gh, repo) {
  try {
    const t = JSON.parse(gh(['api', `repos/${repo}/git/trees/HEAD?recursive=1`]));
    return { paths: (t.tree ?? []).filter((e) => e.type === 'blob').map((e) => e.path), truncated: Boolean(t.truncated) };
  } catch (e) {
    if (/empty/i.test(String(e.message))) return { paths: [], truncated: false };
    throw e;
  }
}

const OPEN_ISSUE_LIMIT = 200;

export function listOpenReports(gh, issuesRepo) {
  const out = gh(['issue', 'list', '--repo', issuesRepo, '--state', 'open', '--limit', String(OPEN_ISSUE_LIMIT), '--json', 'number,title']);
  const issues = JSON.parse(out);
  // A list cut at the limit could hide an open report, and a hidden one would be opened a second time.
  if (issues.length >= OPEN_ISSUE_LIMIT) throw new Error(`${issuesRepo} has ${OPEN_ISSUE_LIMIT} or more open issues; the reports cannot all be read`);
  const map = {};
  for (const issue of issues) {
    const m = /^(.+) holds code without the dev standards$/.exec(issue.title);
    if (m) map[m[1]] = issue.number;
  }
  return map;
}

export function run({ gh, owner, issuesRepo, boardNumber, registry, dryRun }) {
  const overrides = registry.overrides ?? {};
  const decisions = listRepos(gh, owner).map((repo) => {
    const { paths, truncated } = readTree(gh, repo);
    return decide({ repo, paths, truncated, override: overrides[repo] });
  });
  const actions = plan({ decisions, openReports: listOpenReports(gh, issuesRepo) });
  const needsBoard = !dryRun && actions.some((a) => a.type === 'open');
  const done = dryRun
    ? actions.map((a) => `would ${a.type} ${a.repo}`)
    : apply(actions, { gh, issuesRepo, owner, boardNumber, board: needsBoard ? boardIds(gh, owner, boardNumber) : null });
  return { decisions, actions, done };
}

function main(argv) {
  const arg = (name) => argv[argv.indexOf(name) + 1];
  const registry = JSON.parse(readFileSync(arg('--registry'), 'utf8'));
  const result = run({
    gh: ghRunner(),
    owner: arg('--owner'),
    issuesRepo: arg('--issues-repo'),
    boardNumber: Number(arg('--board')),
    registry,
    dryRun: argv.includes('--dry-run'),
  });
  for (const d of result.decisions) console.log(`${d.repo}: ${d.status}`);
  for (const line of result.done) console.log(line);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main(process.argv.slice(2));
