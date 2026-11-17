import { test } from 'node:test';
import assert from 'node:assert/strict';
import { closedIssues, qualifies, land, run, ghArgs, STATUS_LANDED } from '../scripts/set-landed.mjs';

// The promise (NXD-Solutions/dna#2004), one test per guarantee, written before the script. The tests run against a fake of the projects API that keeps each card's Status, so a
// second run reads what the first wrote. That the workflow does what these say is the run of the workflow on the scratch repository, recorded on the issue; no GitHub call is made here.
//
// Owed: the run of the workflow on a scratch repository with a real token and a project copy; the principal's token decision (PROJECTS_PAT or the existing ADD_TO_PROJECT_PAT, and where it is placed).

const REPO = 'NXD-Solutions/Manager-Assistant-v2';
const OPT = { landed: 'opt-landed', done: 'opt-done', review: 'opt-review' };

// A fake of the organisation's projects: cards by issue (`owner/repo#n`), each on one or more projects with a Status; `statusField` options per project.
function fakeProjects({ cards, projects = { 12: ['Backlog', 'In review', 'Landed', 'Done'] }, failWriteOn = null }) {
  const state = structuredClone(cards);
  const writes = [];
  const calls = [];
  const gql = (query, vars) => {
    calls.push(query.trim().split(/[({\s]/)[0] + ':' + (query.includes('mutation') ? 'write' : 'read'));
    if (query.includes('mutation')) {
      const card = Object.values(state).flat().find((c) => c.id === vars.i);
      if (failWriteOn && card.id === failWriteOn) throw new Error('GitHub refused the write');
      const name = Object.entries(OPT).find(([, id]) => id === vars.o)?.[0];
      writes.push({ itemId: vars.i, projectId: vars.p, fieldId: vars.f, optionId: vars.o });
      card.status = { landed: 'Landed', done: 'Done', review: 'In review' }[name];
      return { data: { updateProjectV2ItemFieldValue: { projectV2Item: { id: vars.i } } } };
    }
    if (query.includes('issue(number')) {
      const nodes = (state[`${vars.o}/${vars.r}#${vars.n}`] ?? []).map((c) => ({ id: c.id, project: { id: `P${c.project}`, number: c.project }, status: c.status ? { name: c.status } : null }));
      return { data: { repository: { issue: { projectItems: { nodes } } } } };
    }
    const names = projects[vars.n];
    const options = names ? names.map((n) => ({ id: { Landed: OPT.landed, Done: OPT.done, 'In review': OPT.review }[n] ?? `opt-${n}`, name: n })) : [];
    return { data: { organization: { projectV2: { field: { id: `F${vars.n}`, options } } } } };
  };
  return { gql, state, writes, calls };
}

const quiet = () => ({ lines: [], errs: [], log(l) { this.lines.push(l); }, err(l) { this.errs.push(l); } });
const one = (status, project = 12, id = 'c1') => ({ [`${REPO}#3003`]: [{ id, project, status }] });

test('a pull request merged into a branch named landed/<name> moves each issue it closes, bare or qualified, once each, whoever merged it', () => {
  assert.equal(qualifies({ merged: 'true', base: 'landed/mvp' }), true);
  assert.deepEqual(closedIssues('Closes #3003\nFixes NXD-Solutions/Manager-Assistant-v2#3004 and closes #3003', REPO), [`${REPO}#3003`, `${REPO}#3004`]);
  const f = fakeProjects({ cards: { ...one('In review'), [`${REPO}#3004`]: [{ id: 'c2', project: 12, status: 'In review' }] } });
  const o = quiet();
  assert.equal(land(closedIssues('Closes #3003\nFixes #3004', REPO), [12], f.gql, (l) => o.log(l), (l) => o.err(l)), 0);
  assert.deepEqual(f.state[`${REPO}#3003`].map((c) => c.status), ['Landed']);
  assert.deepEqual(f.state[`${REPO}#3004`].map((c) => c.status), ['Landed']);
});

test('Closes, Fixes and Resolves each count, in any case and with a colon; the word alone, a mention and Relates to do not', () => {
  assert.deepEqual(closedIssues('closes: #1, RESOLVED #2, Fix #3', REPO), [`${REPO}#1`, `${REPO}#2`, `${REPO}#3`]);
  for (const b of ['Relates to #3003', 'see #3003', 'unclosed #3003', 'Closes', '', undefined, null]) assert.deepEqual(closedIssues(b, REPO), [], String(b));
});

test('it sets the Status field to Landed and writes no other field, and never sets Done', () => {
  const f = fakeProjects({ cards: one('In review') });
  land(closedIssues('Closes #3003', REPO), [12], f.gql, () => {}, () => {});
  assert.equal(f.writes.length, 1);
  assert.deepEqual(f.writes[0], { itemId: 'c1', projectId: 'P12', fieldId: 'F12', optionId: OPT.landed });
  assert.equal(STATUS_LANDED, 'Landed');
  assert.notEqual(f.writes[0].optionId, OPT.done);
});

test('a card on a project that is not a tier project is not touched; a card on several tier projects is set on each', () => {
  const f = fakeProjects({ cards: { [`${REPO}#3003`]: [{ id: 'a', project: 99, status: 'In review' }, { id: 'b', project: 12, status: 'In review' }, { id: 'c', project: 7, status: 'Backlog' }] }, projects: { 12: ['In review', 'Landed'], 7: ['Backlog', 'Landed'] } });
  land([`${REPO}#3003`], [12, 7], f.gql, () => {}, () => {});
  assert.deepEqual(f.state[`${REPO}#3003`].map((c) => c.status), ['In review', 'Landed', 'Landed']);
  assert.equal(f.writes.length, 2);
});

test('Mutation: a card already Landed or Done is left as it is: nothing is written, and Done is never moved back', () => {
  for (const status of ['Landed', 'Done']) {
    const f = fakeProjects({ cards: one(status) });
    const o = quiet();
    assert.equal(land([`${REPO}#3003`], [12], f.gql, (l) => o.log(l), (l) => o.err(l)), 0, status);
    assert.equal(f.writes.length, 0, status);
    assert.equal(f.state[`${REPO}#3003`][0].status, status);
  }
});

test('a pull request closed unmerged, a merge into any other base, and a base that only resembles a landing branch move nothing', () => {
  for (const [merged, base] of [['false', 'landed/mvp'], ['', 'landed/mvp'], [undefined, 'landed/mvp'], ['true', 'main'], ['true', 'landed'], ['true', 'landed/'], ['true', 'feature/landed/mvp'], ['true', 'Landed/mvp'], ['true', undefined]]) {
    assert.equal(qualifies({ merged, base }), false, `${merged} ${base}`);
    const f = fakeProjects({ cards: one('In review') });
    const out = run({ env: { PR_MERGED: merged, PR_BASE: base, PR_BODY: 'Closes #3003', PR_REPO: REPO, PROJECTS: '12', GH_TOKEN: 't' }, gql: f.gql, log() {}, err() {} });
    assert.equal(out, 0);
    assert.equal(f.calls.length, 0, `${merged} ${base}`);
  }
});

test('a body that says Relates to, only mentions #n, or names an issue of another repository moves nothing, and no call is made for it', () => {
  for (const body of ['Relates to #3003', 'see #3003', 'Closes NXD-Solutions/dna#1997', '']) {
    const f = fakeProjects({ cards: one('In review') });
    const out = run({ env: { PR_MERGED: 'true', PR_BASE: 'landed/mvp', PR_BODY: body, PR_REPO: REPO, PROJECTS: '12', GH_TOKEN: 't' }, gql: f.gql, log() {}, err() {} });
    assert.equal(out, 0, body);
    assert.equal(f.calls.length, 0, body);
    assert.equal(f.state[`${REPO}#3003`][0].status, 'In review');
  }
});

test('a project with no Status Landed option fails the run and writes nothing', () => {
  const f = fakeProjects({ cards: one('In review'), projects: { 12: ['Backlog', 'In review', 'Done'] } });
  const o = quiet();
  assert.equal(land([`${REPO}#3003`], [12], f.gql, (l) => o.log(l), (l) => o.err(l)), 1);
  assert.equal(f.writes.length, 0);
  assert.match(o.errs.join('\n'), /project 12 has no Status Landed/);
});

test('a failed write fails the run, the other issues are still tried, and the failure names the issue', () => {
  const f = fakeProjects({ cards: { ...one('In review', 12, 'bad'), [`${REPO}#3004`]: [{ id: 'good', project: 12, status: 'In review' }] }, failWriteOn: 'bad' });
  const o = quiet();
  assert.equal(land([`${REPO}#3003`, `${REPO}#3004`], [12], f.gql, (l) => o.log(l), (l) => o.err(l)), 1);
  assert.equal(f.state[`${REPO}#3003`][0].status, 'In review');
  assert.equal(f.state[`${REPO}#3004`][0].status, 'Landed');
  assert.match(o.errs.join('\n'), /Manager-Assistant-v2#3003.*GitHub refused the write/);
});

test('a run with no token, or no tier project named, fails visibly and makes no call, never a quiet pass', () => {
  for (const env of [{ GH_TOKEN: '', PROJECTS: '12' }, { GH_TOKEN: 't', PROJECTS: '' }, { GH_TOKEN: 't', PROJECTS: 'twelve' }, { GH_TOKEN: 't' }]) {
    const f = fakeProjects({ cards: one('In review') });
    const o = quiet();
    assert.equal(run({ env: { PR_MERGED: 'true', PR_BASE: 'landed/mvp', PR_BODY: 'Closes #3003', PR_REPO: REPO, ...env }, gql: f.gql, log: (l) => o.log(l), err: (l) => o.err(l) }), 1, JSON.stringify(env));
    assert.equal(f.calls.length, 0, JSON.stringify(env));
    assert.ok(o.errs.length > 0);
  }
});

test('a second run changes nothing: the card the first run set reads Landed and is left as it is', () => {
  const f = fakeProjects({ cards: one('In review') });
  const env = { PR_MERGED: 'true', PR_BASE: 'landed/mvp', PR_BODY: 'Closes #3003', PR_REPO: REPO, PROJECTS: '12', GH_TOKEN: 't' };
  assert.equal(run({ env, gql: f.gql, log() {}, err() {} }), 0);
  assert.equal(f.writes.length, 1);
  assert.equal(run({ env, gql: f.gql, log() {}, err() {} }), 0);
  assert.equal(f.writes.length, 1);
  assert.equal(f.state[`${REPO}#3003`][0].status, 'Landed');
});

test('an issue with no card on the tier projects is reported and left, not a failure', () => {
  const f = fakeProjects({ cards: {} });
  const o = quiet();
  assert.equal(land([`${REPO}#3003`], [12], f.gql, (l) => o.log(l), (l) => o.err(l)), 0);
  assert.match(o.lines.join('\n'), /no card on the tier projects/);
});

test('an option id or issue number the API returns that looks like a number is sent as the string or number the API expects', () => {
  // dna#2013: a numeric-looking option id sent as a number failed the write on a Done card; the issue number was then sent as a string.
  const seen = [];
  const gql = (q, v) => {
    seen.push(v);
    if (q.includes('mutation')) return { data: {} };
    if (q.includes('issue(number')) return { data: { repository: { issue: { projectItems: { nodes: [{ id: '1234', project: { id: '99', number: 12 }, status: { name: 'In review' } }] } } } } };
    return { data: { organization: { projectV2: { field: { id: '5678', options: [{ id: '98765432', name: 'Landed' }] } } } } };
  };
  land([`${REPO}#3003`], [12], gql, () => {}, () => {});
  const write = seen.at(-1);
  assert.equal(typeof write.o, 'string');
  assert.equal(write.o, '98765432');
  assert.equal(typeof seen[0].n, 'number');
  // the edge: a string goes with -f (kept a string), a number with -F; a numeric-looking string must never take -F, which would send it as a number
  const args = ghArgs('query{x}', { o: '98765432', n: 3003 });
  assert.deepEqual(args.slice(args.indexOf('-f', 4)), ['-f', 'o=98765432', '-F', 'n=3003']);
});
