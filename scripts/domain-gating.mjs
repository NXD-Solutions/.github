// Ships a domain's body only to the repos that build or consume it (NXD-Solutions/dna#1391).
// The decisions are pure functions; apply() touches only the two directories it is handed, so the tests touch nothing else.
import { existsSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// A domain's contract is its body, `domains/<slug>.md`, and optionally a folder of contract rules, `domains/<slug>/`.
// Both ship together or not at all.

// What a repo receives of a domain is one member of an ordering: nothing ⊂ names ⊂ contract ⊂ contract + practitioner.
// The names level is `domains.md`, which is not under `domains/` and reaches every repo. This script chooses between
// the bottom of what lives under `domains/` and the contract; the practitioner content is gated by its own steps.
export function declared(override) {
  return override?.builds !== undefined || override?.consumes !== undefined;
}

// `domains:` is the older name for `builds:`, kept until the registry's values are rewritten.
export function builds(override) {
  return [...new Set([...(override?.builds ?? []), ...(override?.domains ?? [])])];
}

export function consumes(override) {
  return [...new Set(override?.consumes ?? [])];
}

// Returns the slugs whose body the repo receives, or null for a repo that declared neither key (not gated yet).
export function received(override, universal) {
  if (!declared(override)) return null;
  return new Set([...universal, ...builds(override), ...consumes(override)]);
}

// A slug the source has no body for would ship nothing and say nothing: a typo, or a domain renamed under the registry.
export function unknownSlugs(override, universal, sourceSlugs) {
  const known = new Set(sourceSlugs);
  return [...new Set([...universal, ...builds(override), ...consumes(override)])].filter((slug) => !known.has(slug));
}

// Names the distribution never copies (dna claude-rules-system.md: dot + name levers), so they are no domain's body.
const NOT_DISTRIBUTED = /^(\..*|CLAUDE\.md|README\.md|meta\.md|.*\.meta\.md|.*\.confluence\.md)$/;

export function sourceSlugs(sourceDir) {
  return readdirSync(sourceDir, { withFileTypes: true })
    .filter((entry) => !NOT_DISTRIBUTED.test(entry.name))
    .map((entry) => (entry.isDirectory() ? entry.name : entry.name.replace(/\.md$/, '')))
    .filter((name) => !name.startsWith('.'));
}

// Removes from the subscriber every body it does not receive. rsync --delete protects names the exclude list holds
// and keeps nothing it was told to leave, so the removal is its own step after the copy.
export function apply({ override, universal, sourceDir, destDir }) {
  const slugs = [...new Set(sourceSlugs(sourceDir))].sort();
  if (!declared(override)) return { gated: false, kept: slugs, removed: [], unknown: [] };
  if (universal.length === 0) {
    throw new Error('universal-domains is empty: gating would remove the five domains every repo consumes by nature');
  }
  const unknown = unknownSlugs(override, universal, slugs);
  if (unknown.length > 0) return { gated: true, kept: [], removed: [], unknown };
  const keep = received(override, universal);
  const removed = [];
  for (const slug of slugs) {
    if (keep.has(slug)) continue;
    for (const path of [join(destDir, `${slug}.md`), join(destDir, slug)]) {
      if (existsSync(path)) {
        rmSync(path, { recursive: true, force: true });
        removed.push(slug);
      }
    }
  }
  return { gated: true, kept: slugs.filter((slug) => keep.has(slug)), removed: [...new Set(removed)], unknown: [] };
}

export function summary(repo, result) {
  if (!result.gated) return `${repo}: ungated, every domain body shipped (declares neither builds nor consumes)`;
  if (result.unknown.length > 0) return `${repo}: unknown domain slug ${result.unknown.join(', ')}`;
  return `${repo}: ${result.kept.length} domain bodies shipped, ${result.removed.length} removed`;
}

function main() {
  const env = process.env;
  const override = JSON.parse(env.OVERRIDE_JSON || '{}');
  const universal = JSON.parse(env.UNIVERSAL_JSON || '[]');
  const result = apply({ override, universal, sourceDir: env.SOURCE_DIR, destDir: env.DEST_DIR });
  console.log(summary(env.REPO, result));
  if (result.unknown.length > 0) {
    console.log(`::error title=Unknown domain::${env.REPO} names ${result.unknown.join(', ')}, which has no body under nxd-practices/rules/domains/. Fix the slug in .github/claude-rules-overrides.yml.`);
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
