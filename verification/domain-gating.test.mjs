import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { declared, builds, consumes, received, unknownSlugs, sourceSlugs, apply, summary } from '../scripts/domain-gating.mjs';

// The promise (NXD-Solutions/dna#1391), one test per guarantee. Nothing outside a temporary directory is touched.

const UNIVERSAL = ['framework', 'test', 'library', 'project-planning', 'dna'];
const GATED = [
  'enterprise-architecture', 'application-development', 'deployment', 'runtime-operations', 'information',
  'experience', 'security', 'compliance', 'procurement', 'ai-prompting',
];
const ALL = [...UNIVERSAL, ...GATED];

// The rows as declared on dna#1391 (2026-10-18), gated domains only.
const ROWS = {
  'Manager-Assistant-v2': {
    builds: ['application-development', 'deployment', 'runtime-operations'],
    consumes: ['enterprise-architecture', 'ai-prompting', 'information', 'experience', 'security', 'compliance', 'procurement'],
  },
  packages: {
    builds: ['security', 'ai-prompting', 'runtime-operations'],
    consumes: ['enterprise-architecture', 'information', 'compliance', 'deployment', 'procurement', 'experience'],
  },
  'UX-Framework': { builds: ['experience'], consumes: ['enterprise-architecture', 'procurement', 'security'] },
  'data-dictionary': { builds: ['information'], consumes: ['enterprise-architecture', 'compliance', 'security'] },
  'ai-prompting': { builds: ['ai-prompting'], consumes: ['enterprise-architecture', 'compliance', 'procurement', 'security'] },
  'platform-config': { builds: [], consumes: ['enterprise-architecture', 'deployment', 'runtime-operations', 'compliance', 'security'] },
  'Manager-Assistant-Plan': { builds: [], consumes: [] },
  dna: { builds: ['enterprise-architecture'], consumes: [] },
};

function tree() {
  const root = mkdtempSync(join(tmpdir(), 'domain-gating-'));
  const sourceDir = join(root, 'source');
  const destDir = join(root, 'dest');
  mkdirSync(sourceDir);
  mkdirSync(destDir);
  for (const slug of ALL) writeFileSync(join(sourceDir, `${slug}.md`), `# ${slug}\n`);
  // A contract folder beside a body, for one domain.
  mkdirSync(join(sourceDir, 'enterprise-architecture'));
  writeFileSync(join(sourceDir, 'enterprise-architecture', 'code-standards.md'), '# standards\n');
  // The subscriber holds what the copy step put there: everything.
  for (const slug of ALL) writeFileSync(join(destDir, `${slug}.md`), `# ${slug}\n`);
  mkdirSync(join(destDir, 'enterprise-architecture'));
  writeFileSync(join(destDir, 'enterprise-architecture', 'code-standards.md'), '# standards\n');
  return { root, sourceDir, destDir };
}

function present(destDir) {
  return ALL.filter((slug) => existsSync(join(destDir, `${slug}.md`)));
}

test('a repo receives the bodies of the domains it builds or consumes, and of the universal five', () => {
  for (const [repo, row] of Object.entries(ROWS)) {
    const { root, sourceDir, destDir } = tree();
    try {
      apply({ override: row, universal: UNIVERSAL, sourceDir, destDir });
      const expected = [...UNIVERSAL, ...row.builds, ...row.consumes].sort();
      assert.deepEqual(present(destDir).sort(), expected, repo);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }
});

test('a repo never receives a gated body for a domain it only knows of', () => {
  const { root, sourceDir, destDir } = tree();
  try {
    apply({ override: ROWS['UX-Framework'], universal: UNIVERSAL, sourceDir, destDir });
    for (const slug of ['ai-prompting', 'information', 'compliance', 'runtime-operations', 'application-development', 'deployment']) {
      assert.equal(existsSync(join(destDir, `${slug}.md`)), false, slug);
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('building contains consuming: a builder receives what a consumer would', () => {
  const asBuilder = received({ builds: ['security'] }, UNIVERSAL);
  const asConsumer = received({ consumes: ['security'] }, UNIVERSAL);
  for (const slug of asConsumer) assert.equal(asBuilder.has(slug), true, slug);
});

test("a domain's contract folder ships and is removed with its body", () => {
  const kept = tree();
  const dropped = tree();
  try {
    apply({ override: { consumes: ['enterprise-architecture'] }, universal: UNIVERSAL, sourceDir: kept.sourceDir, destDir: kept.destDir });
    assert.equal(existsSync(join(kept.destDir, 'enterprise-architecture', 'code-standards.md')), true);
    apply({ override: { consumes: [] }, universal: UNIVERSAL, sourceDir: dropped.sourceDir, destDir: dropped.destDir });
    assert.equal(existsSync(join(dropped.destDir, 'enterprise-architecture')), false);
    assert.equal(existsSync(join(dropped.destDir, 'enterprise-architecture.md')), false);
  } finally {
    rmSync(kept.root, { recursive: true, force: true });
    rmSync(dropped.root, { recursive: true, force: true });
  }
});

test('a repo declaring neither key keeps every body and is reported as ungated', () => {
  const { root, sourceDir, destDir } = tree();
  try {
    // `domains:` alone is the older name for builds and does not gate.
    const override = { domains: ['enterprise-architecture'] };
    assert.equal(declared(override), false);
    const result = apply({ override, universal: UNIVERSAL, sourceDir, destDir });
    assert.equal(result.gated, false);
    assert.deepEqual(present(destDir).sort(), [...ALL].sort());
    assert.match(summary('a/b', result), /ungated/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('an empty declaration is a declaration: it gates, and leaves the universal five', () => {
  const { root, sourceDir, destDir } = tree();
  try {
    const result = apply({ override: { builds: [], consumes: [] }, universal: UNIVERSAL, sourceDir, destDir });
    assert.equal(result.gated, true);
    assert.deepEqual(present(destDir).sort(), [...UNIVERSAL].sort());
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('`domains:` still counts as builds once a repo declares a key', () => {
  assert.deepEqual(builds({ domains: ['information'], builds: ['security'] }).sort(), ['information', 'security']);
  assert.deepEqual(consumes({}), []);
});

test('a slug with no body in the source fails the repo and removes nothing', () => {
  const { root, sourceDir, destDir } = tree();
  try {
    const override = { consumes: ['enterprice-architecture'] };
    assert.deepEqual(unknownSlugs(override, UNIVERSAL, sourceSlugs(sourceDir)), ['enterprice-architecture']);
    const result = apply({ override, universal: UNIVERSAL, sourceDir, destDir });
    assert.deepEqual(result.unknown, ['enterprice-architecture']);
    assert.deepEqual(present(destDir).sort(), [...ALL].sort());
    assert.match(summary('a/b', result), /unknown domain slug enterprice-architecture/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('an empty universal list refuses to gate, since it would remove the five every repo consumes', () => {
  const { root, sourceDir, destDir } = tree();
  try {
    assert.throws(() => apply({ override: { consumes: [] }, universal: [], sourceDir, destDir }), /universal-domains is empty/);
    assert.deepEqual(present(destDir).sort(), [...ALL].sort());
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('the summary states how many bodies a gated repo received', () => {
  const { root, sourceDir, destDir } = tree();
  try {
    const result = apply({ override: ROWS.dna, universal: UNIVERSAL, sourceDir, destDir });
    assert.equal(summary('NXD-Solutions/dna', result), 'NXD-Solutions/dna: 6 domain bodies shipped, 9 removed');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('subprocess: running the file directly gates the subscriber and fails on an unknown slug', () => {
  const script = fileURLToPath(new URL('../scripts/domain-gating.mjs', import.meta.url));
  const { root, sourceDir, destDir } = tree();
  try {
    const run = (override) => spawnSync(process.execPath, [script], {
      encoding: 'utf8',
      env: {
        ...process.env, REPO: 'a/b', SOURCE_DIR: sourceDir, DEST_DIR: destDir,
        OVERRIDE_JSON: JSON.stringify(override), UNIVERSAL_JSON: JSON.stringify(UNIVERSAL),
      },
    });
    const bad = run({ consumes: ['enterprice-architecture'] });
    assert.equal(bad.status, 1);
    assert.deepEqual(present(destDir).sort(), [...ALL].sort());
    const good = run({ consumes: ['security'] });
    assert.equal(good.status, 0);
    assert.match(good.stdout, /a\/b: 6 domain bodies shipped, 9 removed/);
    assert.equal(existsSync(join(destDir, 'ai-prompting.md')), false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('sidecars and dotfiles in the source are no domain, so the removed count counts only bodies', () => {
  const { root, sourceDir, destDir } = tree();
  try {
    for (const name of ['security.meta.md', 'security.confluence.md', 'meta.md', 'README.md', 'CLAUDE.md', '.governance']) {
      writeFileSync(join(sourceDir, name), 'x');
    }
    assert.deepEqual(sourceSlugs(sourceDir).sort(), [...ALL].sort());
    const result = apply({ override: ROWS.dna, universal: UNIVERSAL, sourceDir, destDir });
    assert.equal(result.removed.length, 9);
    assert.deepEqual(result.unknown, []);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
