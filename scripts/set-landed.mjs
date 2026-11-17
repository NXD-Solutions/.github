// A pull request merged into a landing branch (`landed/<name>`) sets the card of each issue it closes, in its own repository, to Landed on the tier projects (NXD-Solutions/dna#2004).
// It sets the Status field to Landed and no other field; a card already Landed or Done is left as it is. A run is a function of the workflow's environment and an injected gql;
// the gh edge sits at the bottom.
// Env: GH_TOKEN (writes the organisation's projects), PR_MERGED, PR_BASE, PR_BODY, PR_REPO (owner/repo), PROJECTS (comma list of project numbers).
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export const STATUS_LANDED = 'Landed';

// A card in either of these has gone past Landed or is there already: it is left as it is.
const PAST = new Set([STATUS_LANDED, 'Done']);

// Only a merge qualifies, and only into `landed/<something>`: the event's own `merged` flag and the base, both, so a closed-unmerged pull request or a merge into any other base moves nothing.
export const qualifies = ({ merged, base }) => String(merged) === 'true' && /^landed\/.+/.test(String(base ?? ''));

// Issues a body closes in the pull request's own repository, as `owner/repo#n`: Closes/Fixes/Resolves, bare or qualified, once each. A reference to another repository is ignored.
export function closedIssues(body, repo) {
  const found = new Set();
  const re = /\b(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?)\s*:?\s+((?:[\w.-]+\/[\w.-]+)?#\d+)/gi;
  for (const m of String(body ?? '').matchAll(re)) {
    const [r, n] = m[1].split('#');
    if (r && r.toLowerCase() !== String(repo).toLowerCase()) continue;
    found.add(`${repo}#${n}`);
  }
  return [...found];
}

const CARDS = `query($o:String!,$r:String!,$n:Int!){ repository(owner:$o,name:$r){ issue(number:$n){ projectItems(first:50){ nodes{ id project{ id number } status:fieldValueByName(name:"Status"){ ... on ProjectV2ItemFieldSingleSelectValue{ name } } } } } } }`;
const STATUS = `query($o:String!,$n:Int!){ organization(login:$o){ projectV2(number:$n){ field(name:"Status"){ ... on ProjectV2SingleSelectField{ id options{ id name } } } } } }`;
const SET = `mutation($p:ID!,$i:ID!,$f:ID!,$o:String!){ updateProjectV2ItemFieldValue(input:{projectId:$p,itemId:$i,fieldId:$f,value:{singleSelectOptionId:$o}}){ projectV2Item{ id } } }`;

// Moves each issue's cards on the tier projects to Landed. Returns the number of failures; an issue's failure never stops the others.
export function land(refs, projects, gql, log, err) {
  let failed = 0;
  for (const ref of refs) {
    try {
      const [repo, num] = ref.split('#');
      const [owner, name] = repo.split('/');
      const issue = gql(CARDS, { o: owner, r: name, n: Number(num) }).data.repository.issue;
      const cards = (issue?.projectItems.nodes ?? []).filter((c) => projects.includes(c.project.number));
      if (!cards.length) { log(`${ref}: no card on the tier projects`); continue; }
      for (const c of cards) {
        const now = c.status?.name;
        if (PAST.has(now)) { log(`${ref}: card on project ${c.project.number} is already ${now}: left as it is`); continue; }
        const field = gql(STATUS, { o: owner, n: c.project.number }).data.organization.projectV2.field;
        const option = field?.options.find((o) => o.name === STATUS_LANDED);
        if (!option) { err(`${ref}: project ${c.project.number} has no Status ${STATUS_LANDED}`); failed++; continue; }
        gql(SET, { p: c.project.id, i: c.id, f: field.id, o: option.id });
        log(`${ref}: card on project ${c.project.number} set to ${STATUS_LANDED}`);
      }
    } catch (e) {
      err(`${ref}: ${e.message}`);
      failed++;
    }
  }
  return failed;
}

// Returns the exit code. A run that cannot work (no token, no tier project named) fails visibly and makes no call, never a quiet pass.
export function run({ env, gql = realGql, log = console.log, err = console.error }) {
  if (!qualifies({ merged: env.PR_MERGED, base: env.PR_BASE })) { log('not a merge into a landing branch: nothing to move'); return 0; }
  const refs = closedIssues(env.PR_BODY, env.PR_REPO);
  if (!refs.length) { log('no issue of this repository named by a closing keyword: nothing to move'); return 0; }
  if (!env.GH_TOKEN) { err('no token that writes the organisation\'s projects was given'); return 1; }
  const named = String(env.PROJECTS ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  const projects = named.map(Number);
  if (!projects.length || projects.some((p) => !Number.isInteger(p) || p <= 0)) { err(`no tier project is named: PROJECTS is ${JSON.stringify(env.PROJECTS ?? '')}`); return 1; }
  return land(refs, projects, gql, log, err) ? 1 : 0;
}

// A string goes with -f and stays a string; only a number takes -F (a numeric-looking option id sent with -F is sent as a number and the write fails: dna#2013).
export const ghArgs = (query, vars = {}) => ['api', 'graphql', '-f', `query=${query}`, ...Object.entries(vars).flatMap(([k, v]) => [typeof v === 'number' ? '-F' : '-f', `${k}=${v}`])];

function realGql(query, vars) {
  return JSON.parse(execFileSync('gh', ghArgs(query, vars), { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) process.exit(run({ env: process.env }));
