import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classify, isShipped, findPackageRoot } from '../scripts/version-impact-check.mjs';

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

test('evasion: a path merely prefixed "packages" (no slash) is never treated as package-scoped', () => {
  const reader = fakeReader({});
  const { touched } = classify(['packagesfoo/x.js'], '', reader);
  assert.deepEqual(touched, []);
});

test('empty file list -- no packages touched, check does not apply', () => {
  const { touched, missing, label } = classify([], '', fakeReader({}));
  assert.deepEqual(touched, []);
  assert.deepEqual(missing, []);
  assert.equal(label, null);
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
