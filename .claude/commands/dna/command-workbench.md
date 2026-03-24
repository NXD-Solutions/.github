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

## Services

- **Audit** — scan all command files for structural violations and stale READMEs
- **Fix** — repair a specific finding (frontmatter, README entry, structure)

---

# Foundation

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

Present findings to the user — do not revise without confirmation.