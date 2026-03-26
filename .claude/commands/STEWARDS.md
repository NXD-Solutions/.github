# Steward Network

Scope registry and shared identity for all command stewards.

**Registry scope:** This registry reflects the org-wide Steward network. Entries for commands not installed locally are expected — the registry is not a local inventory. Local stewards not listed here may exist in individual repos.

## Self-registration duty

Every command steward maintains their own entry in the registry below. When your scope changes — new files owned, files dropped, property changed — update your row before closing the session. If you are a new steward with no entry, add one.

Format: Steward (command name), Scope (path or path pattern), Property (what aspect is owned: content, structure, lifecycle, format).

## Network visibility

Before modifying a file outside your own scope, check the registry. If another steward owns that scope, surface the consequence to the user before proceeding.

## Fix what you see

Fix simple errors that can be resolved without context — do not route them back to the author. A typo, a broken link, a stale title in an index: fix it directly. Routing trivial fixes is waste.

## Review findings on Confluence

Post review findings as a comment on the affected Confluence page — not in a separate channel. Findings stay where the content lives.

## Governance

Format governed by the command workbench. Audited for accuracy alongside command structure (check #6).

## Registry

| Steward | Scope | Property |
|---|---|---|
| `dna:workbench` | `.claude/rules/core/dna.md`, `.claude/rules/core/principles.md`, `.claude/rules/core/glossary.md` | content |
| `dna:workbench` | `.claude/hierarchy.md` | content |
| `dna:workbench` | `.claude-decision-records/**` | content |
| `dna:workbench` | `.claude/commands/dna/memory.md` | content |
| `dna:workbench` | Confluence pages 46661643, 45121554 | content |
| `dna:auditor` | — | read-only (no owned scope) |
| `dna:command-workbench` | `.claude/commands/**` | structure, frontmatter |
| `dna:command-workbench` | `.claude/commands/README.md`, `.claude-static/commands/README.md` | content |
| `dna:command-workbench` | `.claude/commands/STEWARDS.md` | format |
| `dev:bootstrap` | `**/package.json` (scripts) | correctness — all declared scripts must pass on first clone |
| `dev:bootstrap` | `.claude-static/rules/dev/bootstrap.md`, `.claude/rules/dev/bootstrap.md` | content |
| `dev:audit` | — | read-only (no owned scope) |
| `dev:figma` | `.figma/project.json` | content, lifecycle |
| `review` | — | read-only (no owned scope) |
| `review-issue` | — | read-only (no owned scope) |
| `claude-librarian` | Confluence page 46661650 + children | structure, standards, quality reviews |
| `spec-workbench` | `**/spec-functional.md` | content |
| `spec-workbench` | `**/README.md` (component roots) | lifecycle state |
| `waste` | `.claude-waste/**` | content, lifecycle |
