---
description: Command workbench — maintains structural integrity of all command files (NXD)
---

# Identity

Read `.claude/commands/STEWARDS.md` before proceeding.

## Duties

Maintains the structural integrity of all command files under `.claude/commands/`.

- **READMEs** — `.claude/commands/README.md` and `.claude-static/commands/README.md`
- **Structure convention** — every command follows the H1 pattern (Identity / Foundation / per-duty sections)
- **Frontmatter** — every command has valid `---` delimiters and a description ending with `(NXD)`
- **Naming** — command names communicate purpose; namespace folders group related commands
- **Steward network** — `.claude/commands/STEWARDS.md` — scope registry for all command stewards
- **Newcomer pages** — root newcomer introduction page (Confluence 62947329); quality check on registered command pages

## Services

- **Audit** — scan all command files for structural violations and stale READMEs
- **Fix** — repair a specific finding (frontmatter, README entry, structure)
- **Document** — maintain the root newcomer introduction page (Confluence 62947329)

---

# Foundation

## Distribution

This command is local to the `.github` repo — it is not distributed to other repos. Do not add it to `.claude-static/commands/`.

## Command structure convention

Defined in `claude-rules-system.md` under Commands. Every command is a Steward. H1 headings are reserved for structural divisions:

| H1 | Purpose | Count |
|---|---|---|
| `# Identity` | Duties, services, session preamble | Exactly one |
| `# Foundation` | Shared knowledge and constraints across all duties | Exactly one |
| `# <Duty>` | One section per duty | One per duty |

## README contract

Both README files (`.claude/commands/README.md` and `.claude-static/commands/README.md`) must list every command with its current name and description. When a command is added, renamed, or removed, both READMEs are updated in the same commit.

## Steward network contract

`STEWARDS.md` is the scope registry — it maps every command steward to the scope it owns. The format is a table with three columns: Steward (command name), Scope (path or path pattern), Property (what aspect is owned: content, structure, lifecycle).

**Self-registration duty:** every steward is responsible for updating its own entry when its scope changes. The command workbench defines the format and audits accuracy — it does not write entries for other stewards.

**Network visibility:** any steward that modifies a file checks `STEWARDS.md` to determine whether another steward owns that scope. If so, it surfaces the consequence to the user before proceeding.

---

# Command Audit

## Checks

1. **Structure** — does every command file have the H1 pattern? Flag missing Identity, Foundation, or duty sections.
2. **Frontmatter** — does every command file have valid `---` delimiters and a description field ending with `(NXD)`?
3. **README accuracy** — does every discoverable command appear in both READMEs with the correct name and description?
4. **Naming** — do command names communicate purpose to a newcomer? Flag names that reflect internals.
5. **Orphans** — are there files in `.claude/commands/` that are not commands and not in a namespace subfolder? Flag for classification.
6. **Steward network** — does every command steward have an entry in `STEWARDS.md`? Is every entry's scope consistent with the steward's Identity section? Flag missing or stale entries.

7. **Newcomer pages** — for every command steward that has a Confluence page ID registered in `STEWARDS.md`: fetch the page and assess whether the content seems valid — not empty, not still a placeholder title. Flag pages that have no meaningful content.

Present findings to the user — do not revise without confirmation.

---

# Document

Maintain the root newcomer introduction page (Confluence 62947329). This page is the entry point for anyone new to the Claude Code command system.

## Root page (Confluence 62947329)

The root page is the entry point for anyone new to the Claude Code command system.

Content must:
- Explain what Claude Code commands are and how to invoke them — this is cross-cutting and always present
- Index registered command child pages — one row per command with a link, added when a child page is created and its ID registered in `STEWARDS.md`; removed when the page is deregistered

The index does not store command descriptions. Descriptions live on each command's child page.

Update the root page whenever a child page is created, removed, or its ID changes in `STEWARDS.md`.

## Own child page

Create and maintain a newcomer child page under 62947329 introducing `/dna:command-workbench` — what it does, when to use it, and what the audit and fix services involve. Record the page ID in `STEWARDS.md` once created.

## Review gate

Before authoring or making significant changes to either page, read the Newcomer perspective criteria in `review.md`. Pre-applying criteria reduces review cost.

Before publishing, run `/review` with the newcomer perspective (mandatory).