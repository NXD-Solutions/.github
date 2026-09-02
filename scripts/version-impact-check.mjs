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

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const LEVEL_RANK = { None: 0, Patch: 1, Minor: 2, Major: 3 };
const LINE_RE = /^Version Impact: (.+?): (Major|Minor|Patch|None) — .+$/;

function readPackageJson(pkgJsonPath) {
  if (!fs.existsSync(pkgJsonPath)) return null;
  return JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
}

// findPackageRoot -- walk up from a touched file to the nearest ancestor
// carrying a package.json for an @nxd-solutions/* package. packages/ shapes
// are not uniform (framework-standards.md: one-level is default, two-level
// is grandfathered where grounded) so this doesn't assume a fixed segment
// depth.
export function findPackageRoot(filePath, readPkg = readPackageJson) {
  let dir = path.posix.dirname(filePath);
  while (dir.startsWith('packages') && dir !== '.') {
    const pkg = readPkg(path.posix.join(dir, 'package.json'));
    if (pkg) return pkg.name?.startsWith('@nxd-solutions/') ? { dir, pkg } : null;
    const parent = path.posix.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
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
export function isShipped(pkgDir, filePath, pkg) {
  const rel = path.posix.relative(pkgDir, filePath);
  if (rel === 'package.json') return true;
  if (!Array.isArray(pkg.files) || pkg.files.length === 0) return true;
  return pkg.files.some((entry) => rel === entry || rel.startsWith(`${entry}/`));
}

// classify -- given the PR's touched files and body, return which packages
// still need a "Version Impact:" line and the label to apply (null if
// nothing shipped, or every shipped package honestly declared None).
export function classify(files, body, readPkg = readPackageJson) {
  const touched = new Set();
  for (const f of files) {
    if (!f.startsWith('packages/')) continue;
    const found = findPackageRoot(f, readPkg);
    if (found && isShipped(found.dir, f, found.pkg)) touched.add(found.dir);
  }

  const declared = {};
  let maxLevel = null;
  for (const line of body.split('\n')) {
    const m = line.match(LINE_RE);
    if (!m) continue;
    declared[m[1]] = m[2];
    if (m[2] !== 'None' && (!maxLevel || LEVEL_RANK[m[2]] > LEVEL_RANK[maxLevel])) {
      maxLevel = m[2];
    }
  }

  const missing = [...touched].filter((pkg) => !declared[pkg]);
  const label = missing.length === 0 && maxLevel ? `semver:${maxLevel.toLowerCase()}` : null;
  return { touched: [...touched], missing, label };
}

function main() {
  const prNumber = process.env.PR_NUMBER;
  const repo = process.env.REPO;

  const files = JSON.parse(
    execSync(`gh pr view ${prNumber} --repo ${repo} --json files --jq '[.files[].path]'`, { encoding: 'utf8' })
  );
  const body = execSync(`gh pr view ${prNumber} --repo ${repo} --json body --jq '.body // ""'`, { encoding: 'utf8' });

  const { touched, missing, label } = classify(files, body);

  if (touched.length === 0) {
    console.log('No @nxd-solutions/* packages touched -- check does not apply.');
    return;
  }

  if (missing.length > 0) {
    console.error('Missing "Version Impact:" line for: ' + missing.join(', '));
    console.error('Add one line per touched package to the PR body:');
    console.error('Version Impact: <package-path>: Major|Minor|Patch|None — <one-sentence reason>');
    process.exit(1);
  }

  if (!label) {
    console.log('All touched packages declared None -- no version-impacting change, no label applied.');
    return;
  }

  try {
    execSync(`gh label create "${label}" --repo ${repo} --color ededed`, { stdio: 'ignore' });
  } catch {
    // already exists -- fine
  }
  execSync(`gh pr edit ${prNumber} --repo ${repo} --add-label "${label}"`);
  console.log(`All touched packages declared. Applied label: ${label}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
