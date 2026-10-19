import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { classify, isShipped, findPackageRoot } from '../scripts/version-impact-check.mjs';

const SCRIPT_PATH = fileURLToPath(new URL('../scripts/version-impact-check.mjs', import.meta.url));

// Fake package.json reader -- maps a path to a parsed package.json object,
// no real filesystem or gh calls anywhere in this suite.
function fakeReader(map) {
  return (p) => map[p] ?? null;
}

const DICT_PKG = { name: '@nxd-solutions/data-dictionary', files: ['dist'] };
const NO_FILES_PKG = { name: '@nxd-solutions/legacy', files: undefined };
// Real files field, packages/security/oauth-client/package.json (dna#352 review).
const OAUTH_PKG = {
  name: '@nxd-solutions/oauth-client',
  files: [
    'dist',
    'CLAUDE.md',
    'promises',
    'verification',
    '!verification/the-keycloak-broker-provider-conforms-to-the-credential-seam',
  ],
};

test('.governance/ touch on a files:["dist"] package -- no declaration required (the concrete #351 case)', () => {
  const reader = fakeReader({ 'packages/data/dictionary/package.json': DICT_PKG });
  const { touched, missing, label } = classify(
    ['packages/data/dictionary/.governance/decision-records/x.md'],
    '',
    reader
  );
  assert.deepEqual(touched, []);
  assert.deepEqual(missing, []);
  assert.equal(label, null);
});

test('dist/ touch on the same package -- declaration required, missing when absent', () => {
  const reader = fakeReader({ 'packages/data/dictionary/package.json': DICT_PKG });
  const { touched, missing } = classify(['packages/data/dictionary/dist/index.js'], '', reader);
  assert.deepEqual(touched, ['packages/data/dictionary']);
  assert.deepEqual(missing, ['packages/data/dictionary']);
});

test('None is an accepted declaration -- satisfies missing, applies no label', () => {
  const reader = fakeReader({ 'packages/data/dictionary/package.json': DICT_PKG });
  const body = 'Version Impact: packages/data/dictionary: None — comment-only change in dist output';
  const { missing, label } = classify(['packages/data/dictionary/dist/index.js'], body, reader);
  assert.deepEqual(missing, []);
  assert.equal(label, null);
});

test('mixed None + Patch across two packages -- label reflects only the real level', () => {
  const reader = fakeReader({
    'packages/data/dictionary/package.json': DICT_PKG,
    'packages/legacy/package.json': NO_FILES_PKG,
  });
  const body = [
    'Version Impact: packages/data/dictionary: None — no-op',
    'Version Impact: packages/legacy: Patch — bugfix',
  ].join('\n');
  const { missing, label } = classify(
    ['packages/data/dictionary/dist/index.js', 'packages/legacy/src/index.ts'],
    body,
    reader
  );
  assert.deepEqual(missing, []);
  assert.equal(label, 'semver:patch');
});

test('no files field declared -- conservative fallback, all touched files are shipped', () => {
  const reader = fakeReader({ 'packages/legacy/package.json': NO_FILES_PKG });
  const { touched, missing } = classify(['packages/legacy/src/index.ts'], '', reader);
  assert.deepEqual(touched, ['packages/legacy']);
  assert.deepEqual(missing, ['packages/legacy']);
});

test('package.json itself always counts as shipped, even outside the declared files list', () => {
  const reader = fakeReader({ 'packages/data/dictionary/package.json': DICT_PKG });
  const { touched } = classify(['packages/data/dictionary/package.json'], '', reader);
  assert.deepEqual(touched, ['packages/data/dictionary']);
});

test('legacy baseline: a plain shipped Patch declaration still applies its label (no regression)', () => {
  const reader = fakeReader({ 'packages/data/dictionary/package.json': DICT_PKG });
  const body = 'Version Impact: packages/data/dictionary: Patch — bugfix';
  const { missing, label } = classify(['packages/data/dictionary/dist/index.js'], body, reader);
  assert.deepEqual(missing, []);
  assert.equal(label, 'semver:patch');
});

test('a CRLF body still satisfies its declaration (packages#927)', () => {
  const reader = fakeReader({ 'packages/data/dictionary/package.json': DICT_PKG });
  const body = 'Intro\r\nVersion Impact: packages/data/dictionary: Patch — fix\r\nOutro\r\n';
  const { missing, label } = classify(['packages/data/dictionary/dist/index.js'], body, reader);
  assert.deepEqual(missing, []);
  assert.equal(label, 'semver:patch');
});

test('evasion: a path merely prefixed "packages" (no slash) is never treated as package-scoped', () => {
  const reader = fakeReader({});
  const { touched } = classify(['packagesfoo/x.js'], '', reader);
  assert.deepEqual(touched, []);
});

test('empty file list -- no packages touched, check does not apply, and resolution did not fail', () => {
  const { touched, missing, label, resolutionFailure } = classify([], '', fakeReader({}));
  assert.deepEqual(touched, []);
  assert.deepEqual(missing, []);
  assert.equal(label, null);
  assert.equal(resolutionFailure, false, 'no packages/ files were ever touched, so there was nothing to fail resolving');
});

// Regression for .github#371's own follow-up finding (DNA Steward, PR #372 review): findPackageRoot
// returns null both for "found a real package.json, wrong scope" and for "never read a single
// package.json" -- the second is what a wrong working directory produces (every read fails), and it
// is indistinguishable from a genuine no-op without this signal. classify() must say so rather than
// silently reporting "no packages touched".
test('resolution failure: touching a packages/ path with a reader that never succeeds is not the same as a genuine no-op', () => {
  const neverReads = () => null; // simulates every package.json read failing, e.g. wrong cwd
  const { touched, missing, label, resolutionFailure } = classify(
    ['packages/platform/service-architecture/src/ai/session-context.ts'],
    '',
    neverReads,
  );
  assert.equal(resolutionFailure, true, 'zero successful package.json reads across a packages/-touching PR must be flagged, not reported as a clean no-op');
  assert.deepEqual(touched, []);
  assert.deepEqual(missing, []);
  assert.equal(label, null);
});

test('resolution failure does not fire for a real package correctly resolved as not-shipped (the actual #839 case)', () => {
  const reader = fakeReader({ 'packages/platform/package.json': { name: '@nxd-solutions/platform', files: ['dist'] } });
  const { touched, resolutionFailure } = classify(
    ['packages/platform/service-architecture/src/ai/session-context.ts'],
    '',
    reader,
  );
  assert.equal(resolutionFailure, false, 'a real package.json was read successfully -- this file genuinely does not ship, which is a real answer, not a resolution failure');
  assert.deepEqual(touched, []);
});

test('non-@nxd-solutions package under packages/ is never touched, even with a files match', () => {
  const reader = fakeReader({ 'packages/vendor/package.json': { name: 'some-other-package', files: ['dist'] } });
  const { touched } = classify(['packages/vendor/dist/index.js'], '', reader);
  assert.deepEqual(touched, []);
});

test('isShipped: unit-level check for a non-listed file', () => {
  assert.equal(isShipped('packages/x', 'packages/x/README.md', { files: ['dist'] }), false);
});

test('negation entry: a file under the negated subfolder is not shipped, even though an earlier positive entry matches it too (real oauth-client case)', () => {
  const file =
    'packages/security/oauth-client/verification/the-keycloak-broker-provider-conforms-to-the-credential-seam/evidence.json';
  assert.equal(isShipped('packages/security/oauth-client', file, OAUTH_PKG), false);
});

test('negation entry: a sibling file still under the same positive entry, but not the negated path, stays shipped', () => {
  const file = 'packages/security/oauth-client/verification/some-other-promise/evidence.json';
  assert.equal(isShipped('packages/security/oauth-client', file, OAUTH_PKG), true);
});

test('negation entry, end to end via classify: PR touching only the excluded verification subfolder needs no declaration', () => {
  const reader = fakeReader({ 'packages/security/oauth-client/package.json': OAUTH_PKG });
  const file =
    'packages/security/oauth-client/verification/the-keycloak-broker-provider-conforms-to-the-credential-seam/evidence.json';
  const { touched, missing, label } = classify([file], '', reader);
  assert.deepEqual(touched, []);
  assert.deepEqual(missing, []);
  assert.equal(label, null);
});

test('order sensitivity: a negation before its positive entry does not spuriously exclude a later match', () => {
  const pkg = { files: ['!dist/secret', 'dist'] };
  assert.equal(isShipped('packages/x', 'packages/x/dist/secret', pkg), true);
});

test('findPackageRoot: walks up from a nested file to the package root', () => {
  const reader = fakeReader({ 'packages/data/dictionary/package.json': DICT_PKG });
  const found = findPackageRoot('packages/data/dictionary/.governance/decision-records/x.md', reader);
  assert.equal(found.dir, 'packages/data/dictionary');
});

// Regression for .github#371: every test above imports classify()/isShipped()/findPackageRoot()
// directly, so none of them ever execute the file's own entry-point guard -- a silent no-op and a
// clean pass look identical from in here. This test runs the file the way a caller actually does
// (`node version-impact-check.mjs`), so the guard itself is what's under test, on whatever
// platform this suite runs on.
test('subprocess: running the file directly enters main() on this platform (the file:// guard must match, not silently no-op)', () => {
  // A repo/PR combination that can never resolve, on purpose -- main() reaches its first gh call
  // and gh's own API rejects it (a GraphQL "could not resolve" error). That failure is the signal:
  // it only happens if main() was actually entered. The .github#371 defect's signature is the
  // opposite -- exit 0, empty stdout and stderr, because main() was never called at all.
  //
  // Empty strings were tried first and are NOT safe here: `gh pr view '' --repo ''` falls back to
  // the current branch's own associated PR when one exists (confirmed -- it silently succeeded
  // once this very fix's own branch got a real PR opened against it), so the test's pass/fail
  // depended on local git/PR state instead of on main() actually running. A repo name that cannot
  // exist has no such fallback.
  const result = spawnSync(process.execPath, [SCRIPT_PATH], {
    encoding: 'utf8',
    env: { ...process.env, PR_NUMBER: '999999', REPO: 'NXD-Solutions-does-not-exist/nonexistent-repo-xyz' },
  });
  assert.notEqual(result.status, 0, 'expected a non-zero exit from main() failing on bad input -- status 0 means the entry-point guard silently skipped main() entirely (the .github#371 defect)');
  assert.ok(
    (result.stderr ?? '').length > 0,
    'expected main() to fail loudly to stderr -- empty output on a "successful" run is indistinguishable from never having looked',
  );
});

// The promise of .github#400, one test per guarantee. Confirmed by the DNA Steward, with G3 amended and G4 as parity.
// No real gh call and no filesystem read anywhere here.
const TOOL_PKG = { name: '@nxd-solutions/dev-platform', files: ['dist', 'CLAUDE.md'] };

test('G1: a file a package under dev-support/packages/ ships needs a line, and the label follows once it is declared', () => {
  const reader = fakeReader({ 'dev-support/packages/dev-platform/package.json': TOOL_PKG });
  const file = 'dev-support/packages/dev-platform/dist/index.js';
  const before = classify([file], '', reader);
  assert.deepEqual(before.touched, ['dev-support/packages/dev-platform']);
  assert.deepEqual(before.missing, ['dev-support/packages/dev-platform']);
  const after = classify([file], 'Version Impact: dev-support/packages/dev-platform: Minor — a new export', reader);
  assert.deepEqual(after.missing, []);
  assert.equal(after.label, 'semver:minor');
});

test('G2: a PR touching only files outside every versioned package needs no line, and a private package is no package for this check', () => {
  const reader = fakeReader({
    'dev-support/apps/cockpit/package.json': { name: '@nxd-solutions/cockpit', private: true, version: '0.0.1' },
    'services/employee-service/package.json': { name: '@nxd-solutions/employee-service', private: true, version: '0.1.0' },
  });
  const r = classify(['scripts/check.js', '.github/workflows/x.yml', 'CLAUDE.md', 'dev-support/apps/cockpit/server/app.ts', 'services/employee-service/src/index.ts'], '', reader);
  assert.deepEqual(r.touched, []);
  assert.deepEqual(r.missing, []);
  assert.equal(r.label, null);
  assert.equal(r.resolutionFailure, false);
});

test('G3: the walk follows no folder name, so a published package kept anywhere is judged (ai-activity-store, and a tree added later)', () => {
  const reader = fakeReader({
    'services/ai-activity-store/package.json': { name: '@nxd-solutions/ai-activity-store', private: false, files: ['dist', 'env.md'] },
    'tools/new-tree/widget/package.json': { name: '@nxd-solutions/widget' },
  });
  const r = classify(['services/ai-activity-store/dist/index.js', 'tools/new-tree/widget/src/a.ts'], '', reader);
  assert.deepEqual([...r.touched].sort(), ['services/ai-activity-store', 'tools/new-tree/widget']);
});

test('G3: the nearest package.json decides, and the walk ends at the repo root', () => {
  const reader = fakeReader({
    'packages/outer/package.json': { name: '@nxd-solutions/outer' },
    'packages/outer/tools/inner/package.json': { name: '@nxd-solutions/inner', private: true },
    'package.json': { name: '@nxd-solutions/root-package' },
  });
  assert.equal(findPackageRoot('packages/outer/tools/inner/src/a.ts', reader), null, 'a private package nested in a published one is not judged as the outer one');
  assert.equal(findPackageRoot('packages/outer/src/a.ts', reader).dir, 'packages/outer');
  assert.equal(findPackageRoot('docs/a.md', reader).dir, '.', 'a published package at the repo root owns the files that no nearer package does');
  assert.equal(findPackageRoot('docs/a.md', fakeReader({})), null, 'no package.json anywhere on the way up is no package');
});

test('G4: a package under dev-support/packages/ behaves exactly as one under packages/, including the #351 exemption', () => {
  for (const tree of ['packages/data/dictionary', 'dev-support/packages/dev-platform']) {
    const reader = fakeReader({ [`${tree}/package.json`]: DICT_PKG });
    for (const [rel, ships] of [['dist/index.js', true], ['package.json', true], ['.governance/decision-records/x.md', false], ['src/a.ts', false]]) {
      assert.deepEqual(classify([`${tree}/${rel}`], '', reader).touched, ships ? [tree] : [], `${tree}/${rel}`);
    }
    const noFiles = fakeReader({ [`${tree}/package.json`]: NO_FILES_PKG });
    assert.deepEqual(classify([`${tree}/anything/at/all.md`], '', noFiles).touched, [tree], `${tree}: a package with no files field ships every file`);
  }
});

test('the failure guard watches both package trees: unreadable package.json files under either are a resolution failure, not a clean no-op', () => {
  for (const file of ['packages/ai/src/a.ts', 'dev-support/packages/dev-platform/src/a.ts']) {
    assert.equal(classify([file], '', () => null).resolutionFailure, true, file);
  }
});

test('stated limit: the failure guard does not watch a package kept elsewhere, though the package is still judged', () => {
  assert.equal(classify(['services/ai-activity-store/dist/a.js'], '', () => null).resolutionFailure, false);
  const reader = fakeReader({ 'services/ai-activity-store/package.json': { name: '@nxd-solutions/ai-activity-store', files: ['dist'] } });
  assert.deepEqual(classify(['services/ai-activity-store/dist/a.js'], '', reader).touched, ['services/ai-activity-store']);
});

test('stated limits of isShipped: a glob entry is not evaluated, and the files npm always ships (a README) are not counted', () => {
  assert.equal(isShipped('p', 'p/dist/a.js', { name: 'x', files: ['dist/**'] }), false);
  assert.equal(isShipped('p', 'p/README.md', { name: 'x', files: ['dist'] }), false);
  assert.equal(isShipped('p', 'p/dist/a.js', { name: 'x', files: ['dist'] }), true);
});

test('no package.json path is read twice, however many files a PR touches', () => {
  const reads = new Map();
  const reader = (p) => { reads.set(p, (reads.get(p) ?? 0) + 1); return p === 'packages/ai/package.json' ? { name: '@nxd-solutions/ai', files: ['dist'] } : null; };
  const r = classify(Array.from({ length: 50 }, (_, i) => `packages/ai/dist/file-${i}.js`), '', reader);
  assert.deepEqual(r.touched, ['packages/ai']);
  assert.deepEqual([...reads.values()].filter((n) => n > 1), [], `read more than once: ${[...reads].filter(([, n]) => n > 1).map(([path]) => path)}`);
});
