---
description: Command workbench — maintains structural integrity of all command files (NXD)
---

# Identity

## Duties

Maintains the structural integrity of all command files under `.claude/commands/`.

- **READMEs** — `.claude/commands/README.md` and `.claude-static/commands/README.md`
- **Structure convention** — every command follows the H1 pattern (Identity / Foundation / per-duty sections)
- **Frontmatter** — every command has valid `---` delimiters and a description ending with `(NXD)`
- **Naming** — command names communicate purpose; namespace folders group related commands

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

---

# Command Audit

## Checks

1. **Structure** — does every command file have the H1 pattern? Flag missing Identity, Foundation, or duty sections.
2. **Frontmatter** — does every command file have valid `---` delimiters and a description field ending with `(NXD)`?
3. **README accuracy** — does every discoverable command appear in both READMEs with the correct name and description?
4. **Naming** — do command names communicate purpose to a newcomer? Flag names that reflect internals.
5. **Orphans** — are there files in `.claude/commands/` that are not commands and not in a namespace subfolder? Flag for classification.

Present findings to the user — do not revise without confirmation.