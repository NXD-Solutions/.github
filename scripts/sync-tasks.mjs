// Each Monday, every repo that receives the DNA has its one sync task open and Ready, and nothing starts a sync on
// a team's behalf (NXD-Solutions/.github#409, required by NXD-Solutions/dna#1891 and NXD-Solutions/dna#1892).
//
// The catalogue is the sub-issues of NXD-Solutions/dna#1892, one sync task per repo. The repos that receive the
// DNA are the distribution's own subscriber list, handed in by the workflow, so the two never disagree.
//   - a closed task whose repo receives the DNA is reopened and set Ready on the Priority project
//   - an open one has been missed: it gets a comment naming how many weeks it is behind, and its hub is told
//   - a receiving repo with no task, or with more than one, is reported to the principal's hub
//   - an open task whose repo no longer receives the DNA is marked deprecated: commented and closed as not
//     planned, never deleted
// It starts no distribution, and writes no project but the one `**Tier project:** Priority` names.
//
// Usage: node sync-tasks.mjs --subscribers <json file: [owner/repo, …]> --config <org.config.md> [--dry-run]
// Exit: 0 done; 1 a reopened task did not end Ready; 2 bad arguments or configuration; 6 GitHub couldn't be asked.
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { readHubs, readHubIssues, readPrincipal, readTierProject, hubFor } from './org-config.mjs';

export const CATALOGUE = { repo: 'NXD-Solutions/dna', number: 1892 };
export const PROJECT_NAME = 'Priority';
export const HUB_MARKER = '**Sync tasks** — Monday report (NXD-Solutions/.github#409)';
const WEEK = 7 * 24 * 60 * 60 * 1000;

// Whole weeks since the task was last reopened, or created when it never was; at least one.
export function weeksBehind(sinceIso, now) {
  return Math.max(1, Math.round((now.getTime() - new Date(sinceIso).getTime()) / WEEK));
}

// What this Monday does, from the catalogue and the subscriber list alone. `lastOpened(task)` gives the date an
// open task was last reopened or created.
export function plan({ tasks, subscribers, hubs, principal, lastOpened, now }) {
  const receiving = new Set(subscribers);
  const byRepo = new Map();
  for (const t of tasks) byRepo.set(t.repo, [...(byRepo.get(t.repo) ?? []), t]);

  const reopen = [];
  const missed = [];
  const deprecate = [];
  for (const t of tasks) {
    if (!receiving.has(t.repo)) {
      if (t.state === 'OPEN') deprecate.push(t);
      continue;
    }
    if (t.state === 'CLOSED') reopen.push(t);
    else missed.push({ task: t, weeks: weeksBehind(lastOpened(t), now) });
  }
  const withoutTask = subscribers.filter((r) => !byRepo.has(r)).sort();
  const duplicated = [...byRepo].filter(([r, list]) => receiving.has(r) && list.length > 1).map(([r]) => r).sort();

  // What each hub is told: its assignees' missed tasks; the principal's hub also gets what belongs to no one.
  const tell = new Map();
  const add = (hub, line) => tell.set(hub, [...(tell.get(hub) ?? []), line]);
  for (const { task, weeks } of missed) {
    const logins = task.assignees.length ? task.assignees : [null];
    for (const login of logins) add(hubFor(login, hubs, principal), `- ${task.repo}#${task.number} — still open, ${weeks} week${weeks === 1 ? '' : 's'} behind`);
  }
  for (const repo of withoutTask) add(principal, `- ${repo} receives the DNA but has no sync task under ${CATALOGUE.repo}#${CATALOGUE.number}`);
  for (const repo of duplicated) add(principal, `- ${repo} has more than one sync task under ${CATALOGUE.repo}#${CATALOGUE.number}`);
  for (const t of deprecate) add(principal, `- ${t.repo}#${t.number} — marked deprecated: its repo no longer receives the DNA`);

  return { reopen, missed, deprecate, withoutTask, duplicated, tell };
}

export function missedComment(weeks) {
  return `**Missed:** this sync task was still open at this Monday's run, ${weeks} week${weeks === 1 ? '' : 's'} behind the DNA. Run \`/dna:sync\`, then close it (NXD-Solutions/.github#409).`;
}

export const DEPRECATED_COMMENT = '**Deprecated:** this repo no longer receives the DNA (`.github/claude-rules-overrides.yml`), so this sync task is closed as not planned. It is kept, never deleted (NXD-Solutions/.github#409).';

function gh(args, input) {
  const r = spawnSync('gh', args, { encoding: 'utf8', input, maxBuffer: 64 * 1024 * 1024 });
  if (r.error || r.status !== 0) throw Object.assign(new Error(`gh ${args[0]} ${args[1] ?? ''} failed: ${(r.stderr ?? '').trim()}`), { gh: true });
  return r.stdout;
}
const graphql = (query, vars = {}) => JSON.parse(gh(['api', 'graphql', '-f', `query=${query}`, ...Object.entries(vars).flatMap(([k, v]) => ['-F', `${k}=${v}`])])).data;
const bodyFile = (body) => { const f = join(mkdtempSync(join(tmpdir(), 'sync-tasks-')), 'body.md'); writeFileSync(f, body); return f; };

const live = {
  tasks() {
    const d = graphql(`{ repository(owner: "NXD-Solutions", name: "dna") { issue(number: ${CATALOGUE.number}) { subIssues(first: 100) { nodes { id number state createdAt repository { nameWithOwner } assignees(first: 10) { nodes { login } } } } } } }`);
    return d.repository.issue.subIssues.nodes.map((n) => ({ id: n.id, number: n.number, state: n.state, createdAt: n.createdAt, repo: n.repository.nameWithOwner, assignees: n.assignees.nodes.map((a) => a.login) }));
  },
  lastReopened(t) {
    const dates = gh(['api', '--paginate', `repos/${t.repo}/issues/${t.number}/events`, '--jq', '.[] | select(.event == "reopened") | .created_at']).split('\n').filter(Boolean);
    return dates.at(-1) ?? null;
  },
  project(number) {
    const d = graphql(`{ organization(login: "NXD-Solutions") { projectV2(number: ${number}) { id title field(name: "Status") { ... on ProjectV2SingleSelectField { id options { id name } } } } } }`);
    const p = d.organization.projectV2;
    const ready = p.field.options.find((o) => o.name === 'Ready');
    if (p.title !== PROJECT_NAME || !ready) throw new Error(`project #${number} is not ${PROJECT_NAME} with a Ready status`);
    return { id: p.id, fieldId: p.field.id, readyId: ready.id };
  },
  reopen: (t) => gh(['api', '-X', 'PATCH', `repos/${t.repo}/issues/${t.number}`, '-f', 'state=open']),
  close: (t) => gh(['api', '-X', 'PATCH', `repos/${t.repo}/issues/${t.number}`, '-f', 'state=closed', '-f', 'state_reason=not_planned']),
  comment: (repo, number, body) => gh(['issue', 'comment', String(number), '--repo', repo, '--body-file', bodyFile(body)]),
  setReady(project, t) {
    const item = graphql('mutation($p: ID!, $c: ID!) { addProjectV2ItemById(input: { projectId: $p, contentId: $c }) { item { id } } }', { p: project.id, c: t.id }).addProjectV2ItemById.item.id;
    graphql('mutation($p: ID!, $i: ID!, $f: ID!, $o: String!) { updateProjectV2ItemFieldValue(input: { projectId: $p, itemId: $i, fieldId: $f, value: { singleSelectOptionId: $o } }) { projectV2Item { id } } }', { p: project.id, i: item, f: project.fieldId, o: project.readyId });
    return item;
  },
  status(itemId) {
    const d = graphql('query($i: ID!) { node(id: $i) { ... on ProjectV2Item { fieldValueByName(name: "Status") { ... on ProjectV2ItemFieldSingleSelectValue { name } } } } }', { i: itemId });
    return d.node.fieldValueByName?.name ?? null;
  },
  sleep: (ms) => new Promise((r) => setTimeout(r, ms)),
  now: () => new Date(),
};

export async function main(argv, deps = live, log = console.log) {
  const args = [...argv];
  const take = (f) => { const i = args.indexOf(f); if (i === -1) return null; const v = args[i + 1]; args.splice(i, 2); return v ?? ''; };
  const dryRun = args.includes('--dry-run');
  const subscribersFile = take('--subscribers');
  const configFile = take('--config');
  if (!subscribersFile || !configFile) {
    log('usage: sync-tasks.mjs --subscribers <json file> --config <org.config.md> [--dry-run]');
    return 2;
  }
  const subscribers = JSON.parse(readFileSync(subscribersFile, 'utf8'));
  const config = readFileSync(configFile, 'utf8');
  const hubs = readHubs(config);
  const hubIssues = readHubIssues(config);
  const principal = readPrincipal(config);
  const projectNumber = readTierProject(config, PROJECT_NAME);
  if (!Array.isArray(subscribers) || !subscribers.length) { log('::error::the subscriber list is empty: refusing to treat every task as deprecated'); return 2; }
  if (!principal || ![...hubs.values()].includes(principal)) { log(`::error::the principal (${principal ?? 'none found'}) matches no **Hub:** line`); return 2; }
  if (!projectNumber) { log(`::error::no **Tier project:** ${PROJECT_NAME} line`); return 2; }

  try {
    const tasks = deps.tasks();
    if (!tasks.length) { log(`::error::${CATALOGUE.repo}#${CATALOGUE.number} has no sub-issues: no catalogue to work from`); return 2; }
    const opened = new Map();
    for (const t of tasks) if (t.state === 'OPEN' && subscribers.includes(t.repo)) opened.set(t, deps.lastReopened(t) ?? t.createdAt);
    const p = plan({ tasks, subscribers, hubs, principal, lastOpened: (t) => opened.get(t), now: deps.now() });
    log(`${tasks.length} sync tasks, ${subscribers.length} repos receive the DNA: ${p.reopen.length} to reopen, ${p.missed.length} missed, ${p.deprecate.length} to deprecate, ${p.withoutTask.length} repos without a task, ${p.duplicated.length} with more than one`);
    if (dryRun) {
      for (const [hub, lines] of p.tell) log(`would tell ${hub}: ${lines.length} line(s)${hubIssues.has(hub) ? '' : ' (no **Hub issue:** line)'}`);
      return 0;
    }

    const project = deps.project(projectNumber);
    const items = [];
    for (const t of p.reopen) {
      deps.reopen(t);
      items.push({ task: t, item: deps.setReady(project, t) });
    }
    for (const { task, weeks } of p.missed) deps.comment(task.repo, task.number, missedComment(weeks));
    for (const t of p.deprecate) {
      deps.comment(t.repo, t.number, DEPRECATED_COMMENT);
      deps.close(t);
    }
    for (const [hub, lines] of p.tell) {
      const issue = hubIssues.get(hub);
      if (!issue) { log(`::warning::${hub} has no **Hub issue:** line: not told of ${lines.length} line(s)`); continue; }
      deps.comment(issue.repo, issue.number, [HUB_MARKER, '', ...lines].join('\n'));
    }

    // The project's own automation sets a reopened item to Backlog, and it may land after the Ready above. Check
    // once it has had time to, set Ready again where it lost, and fail loud on any still not Ready.
    let notReady = items;
    for (let round = 0; round < 3 && notReady.length; round++) {
      await deps.sleep(20_000);
      notReady = notReady.filter(({ item }) => deps.status(item) !== 'Ready');
      for (const n of notReady) deps.setReady(project, n.task);
    }
    if (notReady.length) { log(`::error::${notReady.length} reopened task(s) did not stay Ready on ${PROJECT_NAME}`); return 1; }
    log(`Reopened ${items.length}, all Ready on ${PROJECT_NAME}.`);
    return 0;
  } catch (e) {
    if (!e.gh) throw e;
    log(`::error::${e.message}`);
    return 6;
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) process.exit(await main(process.argv.slice(2)));
