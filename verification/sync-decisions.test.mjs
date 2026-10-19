import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

// The promise (NXD-Solutions/.github#402): the decision-log sync's Confluence token needs only the scopes its calls
// need. One test per guarantee; Confluence is a stand-in that every call is made against, and nothing outside a
// temporary directory is touched. G4, a run with a real scoped token, is not here: it happens once the secret is replaced.

const REPO = resolve(fileURLToPath(new URL('..', import.meta.url)));
const SCRIPT = join(REPO, 'scripts', 'sync-decisions.ts');
const TSX = join(REPO, 'node_modules', 'tsx', 'dist', 'cli.mjs');
const CLOUD_ID = '11111111-2222-3333-4444-555555555555';
const SITE = 'https://nordicexperiencedesign.atlassian.net';

// The one parser for a `Scopes:` block is the DNA's own, so the test reads it from a DNA checkout: DNA_REPO names one.
const DNA_REPO = process.env.DNA_REPO;
assert.ok(DNA_REPO && existsSync(join(DNA_REPO, 'dna', 'scripts', 'confluence-tools', 'declared-scopes.cjs')),
  'set DNA_REPO to a checkout of NXD-Solutions/dna: the Scopes: block is read by its declared-scopes.cjs, never a second parser');
const declaredScopes = join(DNA_REPO, 'dna', 'scripts', 'confluence-tools', 'declared-scopes.cjs');
const { scopesIn } = createRequire(declaredScopes)(declaredScopes);

// What each call needs, from Atlassian's OpenAPI (v1 content search: search:confluence; v2 page by id: read:page:confluence).
const NEEDS = [
  { path: /^\/wiki\/rest\/api\/content\/search\?/, scope: 'search:confluence' },
  { path: /^\/wiki\/api\/v2\/pages\/\d+\?/, scope: 'read:page:confluence' },
];

/** The scopes a set of observed calls needs, or a sentence naming a call this table does not know. */
export function neededScopes(paths) {
  const needed = new Set();
  for (const p of paths) {
    const row = NEEDS.find((n) => n.path.test(p));
    if (!row) throw new Error(`a call to ${p} has no scope in the spec table`);
    needed.add(row.scope);
  }
  return [...needed].sort();
}

const STUB = `
import { appendFileSync } from 'node:fs';
const log = (entry) => appendFileSync(process.env.STUB_LOG, JSON.stringify(entry) + '\\n');
const body = '<table><tr><td><p><strong>Status</strong></p></td><td>Accepted</td></tr><tr><td><p><strong>Classification</strong></p></td><td>Standard</td></tr></table><h2>AI Summary — Developer</h2><ul><li>Do the thing</li></ul>';
globalThis.fetch = async (url, init = {}) => {
  url = String(url);
  log({ url, authorization: Boolean(init.headers && init.headers.Authorization) });
  const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });
  if (url === '${SITE}/_edge/tenant_info') return json({ cloudId: '${CLOUD_ID}' });
  if (url.startsWith('https://api.atlassian.com/ex/confluence/${CLOUD_ID}/wiki/rest/api/content/search?')) return json({ results: [{ id: '101', title: 'A decision' }], size: 1, _links: {} });
  if (url.startsWith('https://api.atlassian.com/ex/confluence/${CLOUD_ID}/wiki/api/v2/pages/101?')) return json({ body: { storage: { value: body } } });
  return new Response('unexpected call', { status: 404 });
};
`;

function runSync(extraEnv = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'sync-decisions-'));
  const stub = join(dir, 'stub.mjs');
  const log = join(dir, 'calls.jsonl');
  writeFileSync(stub, STUB);
  writeFileSync(log, '');
  const result = spawnSync(process.execPath, [TSX, SCRIPT, '--role', 'Developer'], {
    cwd: dir, encoding: 'utf8',
    env: { PATH: process.env.PATH, CONFLUENCE_EMAIL: 'a@example.com', CONFLUENCE_API_TOKEN: 'ATATT-marker', NODE_OPTIONS: `--import=${pathToFileURL(stub).href}`, STUB_LOG: log, ...extraEnv },
  });
  const calls = readFileSync(log, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
  const output = join(dir, '.claude', 'rules', 'nxd-practices', 'decision-log-extract.gen.md');
  return { result, calls, output: existsSync(output) ? readFileSync(output, 'utf8') : undefined, cleanup: () => rmSync(dir, { recursive: true, force: true }) };
}

test('G1 every call goes through the gateway with the cloud id, none to the site but the tenant lookup', () => {
  const run = runSync();
  try {
    assert.equal(run.result.status, 0, run.result.stderr);
    assert.match(run.result.stdout, /\(1 decisions\)/);
    assert.match(run.output, /A decision/);
    const others = run.calls.filter((c) => c.url !== `${SITE}/_edge/tenant_info`);
    assert.ok(others.length >= 2, 'a search and a page read were made');
    for (const c of others) assert.ok(c.url.startsWith(`https://api.atlassian.com/ex/confluence/${CLOUD_ID}/`), `${c.url} is not through the gateway`);
    assert.ok(run.calls.every((c) => !c.url.startsWith(`${SITE}/wiki`)), 'a call went to the site URL');
    // The tenant lookup needs no credential, so it carries none.
    assert.equal(run.calls.find((c) => c.url.endsWith('/_edge/tenant_info')).authorization, false);
  } finally { run.cleanup(); }
});

test('G1 a pinned cloud id skips the tenant lookup', () => {
  const run = runSync({ CONFLUENCE_CLOUD_ID: CLOUD_ID });
  try {
    assert.equal(run.result.status, 0, run.result.stderr);
    assert.ok(run.calls.every((c) => !c.url.includes('_edge/tenant_info')));
  } finally { run.cleanup(); }
});

test('G2 the script declares its scopes in a Scopes: block the DNA parser reads', () => {
  assert.deepEqual(scopesIn(readFileSync(SCRIPT, 'utf8'), 'sync-decisions.ts').sort(), ['read:page:confluence', 'search:confluence']);
});

test('G3 the declared scopes are exactly what the calls made need', () => {
  const run = runSync();
  try {
    const paths = run.calls.filter((c) => c.url.startsWith('https://api.atlassian.com/')).map((c) => c.url.replace(/^https:\/\/api\.atlassian\.com\/ex\/confluence\/[^/]+/, ''));
    const declared = scopesIn(readFileSync(SCRIPT, 'utf8'), 'sync-decisions.ts').sort();
    assert.deepEqual(neededScopes(paths), declared);
  } finally { run.cleanup(); }
});

test('G3 the check fails on a call whose scope the block omits, and on a call the table does not know', () => {
  const declared = ['search:confluence'];
  assert.notDeepEqual(neededScopes(['/wiki/rest/api/content/search?cql=x', '/wiki/api/v2/pages/1?body-format=storage']), declared);
  assert.throws(() => neededScopes(['/wiki/rest/api/content/1/label']), /no scope in the spec table/);
});

test('the token is never printed', () => {
  const run = runSync();
  try {
    assert.ok(!run.result.stdout.includes('ATATT-marker') && !run.result.stderr.includes('ATATT-marker'));
  } finally { run.cleanup(); }
});
