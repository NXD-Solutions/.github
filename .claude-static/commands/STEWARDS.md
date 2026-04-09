# Steward Network

Scope registry and shared identity for all command stewards.

**Registry scope:** This registry reflects the org-wide Steward network. Entries for commands not installed locally are expected — the registry is not a local inventory. Local stewards not listed here may exist in individual repos.

## Self-registration duty

Every command steward maintains their own entry in the registry below. When your scope changes — new files owned, files dropped, property changed — update your row before closing the session. If you are a new steward with no entry, add one.

- **In `.github` repo:** update the row directly in `.claude-static/commands/STEWARDS.md` and derive to `.claude/commands/STEWARDS.md` in the same commit.
- **In any other repo:** open a PR against `.github` with the updated row in `.claude-static/commands/STEWARDS.md` (derived copy in the same commit).

Format: Steward (command name), Scope (path or path pattern), Property (what aspect is owned: content, structure, lifecycle, format).

## Network visibility

Before modifying a file outside your own scope, check the registry. If another steward owns that scope, surface the consequence to the user before proceeding.

## Fix what you see

Fix simple errors that can be resolved without context — do not route them back to the author. A typo, a broken link, a stale title in an index: fix it directly. Routing trivial fixes is waste.

## Review findings on Confluence

Post review findings as a comment on the affected Confluence page — not in a separate channel. Findings stay where the content lives.

## Decision records

When a DR is warranted, invoke `/dr` — do not author decision records inline.

## Governance

Format governed by the command workbench. Audited for accuracy alongside command structure (check #6).

## Registry

| Steward | Scope | Property | Authority | Escalation |
|---|---|---|---|---|
| `dna:workbench` | `.claude/rules/core/dna.md`, `.claude/rules/core/principles.md`, `.claude/rules/core/glossary.md` | content | — | — |
| `dna:workbench` | `.claude/hierarchy.md` | content | — | — |
| `dna:workbench` | `.claude-decision-records/**` | content | — | — |
| `dna:workbench` | `.claude/commands/dna/memory.md` | content | — | — |
| `dna:workbench` | `.claude/rules/configuration/` | structure, README content | — | — |
| `dna:workbench` | Confluence pages 46661643, 45121554 | content | — | — |
| `cr` | — | read-only (no owned scope) | — | — |
| `dna:auditor` | — | read-only (no owned scope) | — | — |
| `dna:command-workbench` | `.claude/commands/**` | structure, frontmatter | — | — |
| `dna:command-workbench` | `.claude/commands/README.md`, `.claude-static/commands/README.md` | content | — | — |
| `dna:command-workbench` | `.claude/commands/STEWARDS.md` | format, network behavior content | — | — |
| `dev:bootstrap` | `**/package.json` (scripts) | correctness — all declared scripts must pass on first clone | — | — |
| `dev:bootstrap` | `.claude-static/rules/dev/bootstrap.md`, `.claude/rules/dev/bootstrap.md` | content | — | — |
| `dev:audit` | — | read-only (no owned scope) | — | — |
| `dev:figma` | `.figma/**` | content, lifecycle | — | — |
| `dev:figma` | `.claude/scripts/figma-index.cjs` | content | — | — |
| `review-issue` | — | read-only (no owned scope) | — | — |
| `claude-librarian` | Confluence page 46661650 + children | structure, standards, quality reviews | — | — |
| `claude-librarian` | `.claude-static/commands/dr.md`, `.claude/commands/dr.md` | content | — | — |
| `spec-workbench` | `**/spec-functional.md` | content | — | — |
| `spec-workbench` | `**/README.md` (component roots) | lifecycle state | — | — |
| `waste` | `.claude-waste/**` | content, lifecycle | — | — |
| `data-dictionary-workbench` | `packages/data/dictionary/**` | content, lifecycle | Unilateral: technical correctness. Structural: requires Architect sign-off | Structural CRs → Architect |
