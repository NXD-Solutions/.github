// Decides which caller workflows the sync copies into a subscriber (NXD-Solutions/.github#394, #422).
// A pure decision over the registry; the sync's copy step runs the command line and copies what it prints, so no workflow text names a caller file.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// The caller every subscriber receives while the registry's global flag is true.
export const EVERY_SUBSCRIBER = 'pr-names-issue.yml';
// The caller only a repository the registry marks `landing-gate: true` receives, because only a repository with a landing branch has use for it.
export const MARKED_ONLY = [{ key: 'landing-gate', file: 'landing-gate.yml' }];

// Returns the file names (under `distributed/`) the repository receives, in a fixed order.
// Nothing is copied while `distribute-caller-workflows` is not true, marked or not: a push of a workflow file needs the `workflow` scope on REPOS_PAT,
// and a refused push would fail every repo's sync.
export function callersFor({ registry, repo }) {
  if (registry?.['distribute-caller-workflows'] !== true) return [];
  const override = registry.overrides?.[repo] ?? {};
  return [EVERY_SUBSCRIBER, ...MARKED_ONLY.filter(({ key }) => override[key] === true).map(({ file }) => file)];
}

function main(argv) {
  const arg = (name) => argv[argv.indexOf(name) + 1];
  const registry = JSON.parse(readFileSync(arg('--registry'), 'utf8'));
  for (const file of callersFor({ registry, repo: arg('--repo') })) console.log(file);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main(process.argv.slice(2));
