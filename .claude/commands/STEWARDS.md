# Steward Network

Scope registry and shared identity for all command stewards.

## Self-registration duty

Every command steward maintains their own entry in the registry below. When your scope changes — new files owned, files dropped, property changed — update your row before closing the session. If you are a new steward with no entry, add one.

Format: Steward (command name), Scope (path or path pattern), Property (what aspect is owned: content, structure, lifecycle, format).

## Network visibility

Before modifying a file outside your own scope, check the registry. If another steward owns that scope, surface the consequence to the user before proceeding.

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
| `audit` | — | read-only (no owned scope) |
| `review-issue` | — | read-only (no owned scope) |
| `claude-librarian` | Confluence page 46661650 + children | structure, standards, quality reviews |
| `spec-workbench` | `**/spec-functional.md` | content |
| `spec-workbench` | `**/README.md` (component roots) | lifecycle state |
| `waste` | `.claude-waste/**` | content, lifecycle |
