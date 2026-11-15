// Posts the hourly report of answered Decision Requests to each hub's standing issue (NXD-Solutions/.github#409).
//
// The report is NXD-Solutions/dna's answered-decisions.mjs output, run without --since: one block per hub, a
// `Hub: <person> — …` line and then one `- <owner/repo#n> — <title>` line per answered request. This posts, to the
// issue the hub's `**Hub issue:**` line names, only the requests not already listed there, so an answer is said
// once and a late or skipped run loses nothing.
//
// This repo is public, so its run logs are too. The log gets person names and counts only: never an issue title,
// body or number, since the report lists requests in private repos.
//
// Usage: node post-answered-decisions.mjs --report <file> --config <org.config.md> [--dry-run]
// Exit: 0 done; 2 bad arguments; 6 GitHub couldn't be asked.
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { readHubIssues } from './org-config.mjs';

// The literal first line of every comment this posts: what marks a request as already listed.
export const MARKER = '**Answered Decision Requests** — hourly report (NXD-Solutions/.github#409)';

const ITEM = /^-\s+([\w.-]+\/[\w.-]+#\d+)\s+—/;

// The report's blocks: person -> { header, items: [{ ref, line }] }. Lines outside a `Hub:` block are ignored:
// with a principal in the role configuration, the script puts every no-hub request inside the principal's block.
export function parseReport(text) {
  const blocks = new Map();
  let current = null;
  for (const line of text.split(/\r?\n/)) {
    const hub = line.match(/^Hub:\s*(.+?)\s*—/);
    if (hub) {
      current = { header: line, items: [] };
      blocks.set(hub[1], current);
      continue;
    }
    const item = line.match(ITEM);
    if (item && current) current.items.push({ ref: item[1], line });
    else if (!line.trim()) current = null;
  }
  return blocks;
}

// The requests a hub issue already lists: every `owner/repo#n` item line in a comment this script posted.
export function alreadyListed(commentBodies) {
  const refs = new Set();
  for (const body of commentBodies) {
    const lines = body.split(/\r?\n/);
    if (lines[0].trim() !== MARKER) continue;
    for (const line of lines) {
      const m = line.match(ITEM);
      if (m) refs.add(m[1]);
    }
  }
  return refs;
}

// What to post: one comment per hub issue with something new, and the hubs that have no issue to post to.
export function plan(blocks, hubIssues, listedFor) {
  const posts = [];
  const noIssue = [];
  const counts = [];
  for (const [person, block] of blocks) {
    if (!block.items.length) continue;
    const issue = hubIssues.get(person);
    if (!issue) {
      noIssue.push(person);
      continue;
    }
    const listed = listedFor(issue);
    const fresh = block.items.filter((i) => !listed.has(i.ref));
    counts.push({ person, fresh: fresh.length, listed: block.items.length - fresh.length });
    if (fresh.length) posts.push({ person, issue, body: [MARKER, '', block.header, ...fresh.map((i) => i.line)].join('\n') });
  }
  return { posts, noIssue, counts };
}

function gh(args) {
  const r = spawnSync('gh', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (r.error || r.status !== 0) throw Object.assign(new Error('gh failed'), { gh: true, status: r.status });
  return r.stdout;
}

const live = {
  comments: (issue) => gh(['api', '--paginate', `repos/${issue.repo}/issues/${issue.number}/comments`, '--jq', '.[].body | @json'])
    .split('\n').filter(Boolean).map((l) => JSON.parse(l)),
  post: (issue, body) => {
    const file = join(mkdtempSync(join(tmpdir(), 'answered-')), 'body.md');
    writeFileSync(file, body);
    gh(['issue', 'comment', String(issue.number), '--repo', issue.repo, '--body-file', file]);
  },
};

export function main(argv, deps = live, log = console.log) {
  const args = [...argv];
  const take = (f) => { const i = args.indexOf(f); if (i === -1) return null; const v = args[i + 1]; args.splice(i, 2); return v ?? ''; };
  const dryRun = args.includes('--dry-run');
  const reportFile = take('--report');
  const configFile = take('--config');
  if (!reportFile || !configFile) {
    log('usage: post-answered-decisions.mjs --report <file> --config <org.config.md> [--dry-run]');
    return 2;
  }
  const blocks = parseReport(readFileSync(reportFile, 'utf8'));
  const hubIssues = readHubIssues(readFileSync(configFile, 'utf8'));
  try {
    const result = plan(blocks, hubIssues, (issue) => alreadyListed(deps.comments(issue)));
    for (const person of result.noIssue) log(`::warning::${person} has answered Decision Requests but no **Hub issue:** line: not reported`);
    for (const c of result.counts) log(`${c.person}: ${c.fresh} new, ${c.listed} already listed`);
    for (const p of result.posts) {
      if (dryRun) log(`${p.person}: would post ${p.body.split('\n').length - 3} new (dry run)`);
      else deps.post(p.issue, p.body);
    }
    if (!result.counts.length && !result.noIssue.length) log('Nothing answered awaits a hub.');
    return 0;
  } catch (e) {
    if (!e.gh) throw e;
    log("::error::GitHub couldn't be asked or written to");
    return 6;
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) process.exit(main(process.argv.slice(2)));
