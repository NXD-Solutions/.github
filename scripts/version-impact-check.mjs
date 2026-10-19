#!/usr/bin/env node
// version-impact-check.mjs -- decides which touched @nxd-solutions/* packages
// need a declared "Version Impact:" line on the PR, and applies the
// semver:<level> label once every touched package has one.
//
// Extracted from version-impact-check.yml (.github#351) so the touched-
// package and shipped-file logic is unit-testable (node:test, see
// verification/) instead of living untested inside a YAML heredoc -- it
// gates every repo's package PRs, so a mistake here is org-wide.
//
// Called via a second checkout of this repo from the reusable workflow
// (the caller repo's own checkout is what package.json reads resolve
// against; this file itself has to come from here).

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const LEVEL_RANK = { None: 0, Patch: 1, Minor: 2, Major: 3 };
const LINE_RE = /^Version Impact: (.+?): (Major|Minor|Patch|None) — .+$/;

function readPackageJson(pkgJsonPath) {
  if (!fs.existsSync(pkgJsonPath)) return null;
  return JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
}

// The trees the failure guard in classify() watches: where this org keeps its published packages today. The walk
// below does not use them, so a package kept anywhere else is still judged (.github#400).
const PACKAGE_TREES = ['packages/', 'dev-support/packages/'];

// findPackageRoot -- walk up from a touched file to the repo root and stop at the nearest package.json: that
// file decides. It counts when it names an @nxd-solutions/* package that is not `private`, since a private package
// has no consumer to meet its version; anything else is no package for this check. The walk follows no folder
// name, so a package kept anywhere is found (packages/ shapes are not uniform either -- framework-standards.md:
// one-level is default, two-level is grandfathered where grounded), and a tree added later needs no code change.
//
// Stated limit: because the nearest package.json decides, a private or non-@nxd-solutions package nested inside a
// publishable one hides the files under it from the outer package, though the outer package's `files` may ship
// them. The DNA's text would count those files as touched; this check does not (.github#400, DNA Steward).
export function findPackageRoot(filePath, readPkg = readPackageJson) {
  let dir = path.posix.dirname(filePath);
  for (;;) {
    const pkg = readPkg(path.posix.join(dir, 'package.json'));
    if (pkg) return pkg.name?.startsWith('@nxd-solutions/') && pkg.private !== true ? { dir, pkg } : null;
    const parent = path.posix.dirname(dir);
    if (dir === '.' || parent === dir) return null;
    dir = parent;
  }
}

// isShipped -- true if a touched file falls under a path the package's own
// package.json#files declares (the actual npm-publish authority --
// code-standards.md's Shipping section describes what a package publishes
// in terms of this same field, so reading it directly avoids a second,
// hand-maintained list of non-shipped folder names drifting from it). Also
// true for package.json itself, which npm always includes and which can
// carry real consumer-relevant change (a dependency bump). No declared
// `files` field means npm's own default (ship everything not gitignored) --
// conservatively treat every touched file as shipped rather than risk a
// false exclusion.
//
// Two stated limits (.github#400): an entry that is a glob is not evaluated -- only a directory or a file name,
// with `!` exclusions -- so a file npm ships under `dist/**` would count as not shipped (no package in the org
// uses one); and the files npm always ships beyond package.json, a README or a LICENSE, are not counted.
//
// npm's `files` entries are applied in array order, and a leading `!`
// negates a preceding match (e.g. packages/security/oauth-client's real
// `files` ships `verification` wholesale, then excludes one subfolder of
// it: `['verification', '!verification/<subfolder>']`) -- a plain
// first-match prefix check gets this case wrong (the earlier positive entry
// still wins). This folds the array in order instead, so a later negation
// overrides an earlier positive match, matching real usage. Boundary: only
// prefix/directory-style entries (what every `files` array in the org
// actually uses) -- not a full minimatch glob engine.
export function isShipped(pkgDir, filePath, pkg) {
  const rel = path.posix.relative(pkgDir, filePath);
  if (rel === 'package.json') return true;
  if (!Array.isArray(pkg.files) || pkg.files.length === 0) return true;

  const matches = (pattern) => rel === pattern || rel.startsWith(`${pattern}/`);
  let shipped = false;
  for (const entry of pkg.files) {
    if (entry.startsWith('!')) {
      if (matches(entry.slice(1))) shipped = false;
    } else if (matches(entry)) {
      shipped = true;
    }
  }
  return shipped;
}

// classify -- given the PR's touched files and body, return which packages
// still need a "Version Impact:" line and the label to apply (null if
// nothing shipped, or every shipped package honestly declared None).
//
// resolutionFailure distinguishes "walked the chain and genuinely found nothing to declare" from
// "could not read a single package.json anywhere" (.github#371's follow-up finding, DNA Steward on
// #372): findPackageRoot() returns null both when a real package.json exists but is out of scope,
// and when the walk read nothing at all -- the second case is what a wrong working directory
// produces (every readPkg call fails, indistinguishable from a package-free file). Wrapping the
// injected reader here, once, tracks whether ANY read across the whole PR ever succeeded --
// touching packages/ with zero successful reads anywhere is the environment failing to look, not
// a real answer, and main() must not report it as "no packages touched".
export function classify(files, body, readPkg = readPackageJson) {
  const touched = new Set();
  let anyFileUnderPackages = false;
  let anyPackageJsonRead = false;
  // A PR can touch thousands of files that share a few package roots; read each package.json once.
  const reads = new Map();
  const countingReadPkg = (p) => {
    if (!reads.has(p)) reads.set(p, readPkg(p));
    const pkg = reads.get(p);
    if (pkg) anyPackageJsonRead = true;
    return pkg;
  };

  for (const f of files) {
    if (PACKAGE_TREES.some((tree) => f.startsWith(tree))) anyFileUnderPackages = true;
    const found = findPackageRoot(f, countingReadPkg);
    if (found && isShipped(found.dir, f, found.pkg)) touched.add(found.dir);
  }

  if (anyFileUnderPackages && !anyPackageJsonRead) {
    return { touched: [], missing: [], label: null, resolutionFailure: true };
  }

  const declared = {};
  let maxLevel = null;
  // A body edited from Windows arrives with CRLF; `.` in LINE_RE does not match
  // `\r`, so splitting on `\n` alone hides every declaration (packages#927).
  for (const line of body.split(/\r?\n/)) {
    const m = line.match(LINE_RE);
    if (!m) continue;
    declared[m[1]] = m[2];
    if (m[2] !== 'None' && (!maxLevel || LEVEL_RANK[m[2]] > LEVEL_RANK[maxLevel])) {
      maxLevel = m[2];
    }
  }

  const missing = [...touched].filter((pkg) => !declared[pkg]);
  const label = missing.length === 0 && maxLevel ? `semver:${maxLevel.toLowerCase()}` : null;
  return { touched: [...touched], missing, label, resolutionFailure: false };
}

// gh calls go through execFileSync with an argument array -- never a shell-interpreted command
// string. execSync's default shell on Windows is cmd.exe, which does not strip single quotes the
// way a POSIX shell does, so a `--jq '[.files[].path]'`-style string reaches `gh` with the quote
// characters still attached and jq fails to parse its own filter (.github#371).
function main() {
  const prNumber = process.env.PR_NUMBER;
  const repo = process.env.REPO;

  const filesOutput = execFileSync(
    'gh', ['pr', 'view', prNumber, '--repo', repo, '--json', 'files', '--jq', '[.files[].path]'],
    { encoding: 'utf8' },
  );
  const files = JSON.parse(filesOutput);
  const body = execFileSync(
    'gh', ['pr', 'view', prNumber, '--repo', repo, '--json', 'body', '--jq', '.body // ""'],
    { encoding: 'utf8' },
  );

  const { touched, missing, label, resolutionFailure } = classify(files, body);

  if (resolutionFailure) {
    console.error(
      'Touched files under a package tree (packages/, dev-support/packages/), but no package.json could be read anywhere in the walk. ' +
      'This is not "no packages touched" -- it means package resolution itself failed, most likely ' +
      'because this script is running from the wrong working directory (it must run from the ' +
      "caller repo's own root, per the reusable workflow's checkout layout -- not from wherever " +
      'this script file lives).',
    );
    process.exit(1);
  }

  if (touched.length === 0) {
    console.log('Checked -- no @nxd-solutions/* packages touched, check does not apply.');
    return;
  }

  if (missing.length > 0) {
    console.error('Missing "Version Impact:" line for: ' + missing.join(', '));
    console.error('Add one line per touched package to the PR body:');
    console.error('Version Impact: <package-path>: Major|Minor|Patch|None — <one-sentence reason>');
    process.exit(1);
  }

  if (!label) {
    console.log('Checked -- all touched packages declared None, no version-impacting change, no label applied.');
    return;
  }

  try {
    execFileSync('gh', ['label', 'create', label, '--repo', repo, '--color', 'ededed'], { stdio: 'ignore' });
  } catch {
    // already exists -- fine
  }
  execFileSync('gh', ['pr', 'edit', prNumber, '--repo', repo, '--add-label', label]);
  console.log(`Checked -- all touched packages declared. Applied label: ${label}`);
}

// Platform-independent entry-point guard -- string-comparing `import.meta.url` against
// `file://${process.argv[1]}` never matches on Windows: process.argv[1] is a backslashed,
// no-leading-slash path (`C:\Users\...`), never equal to the `file:///C:/Users/...` URL form
// import.meta.url actually takes. Resolving both to the same representation (a plain filesystem
// path) before comparing works identically on every platform (.github#371).
const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isDirectRun) {
  main();
}
