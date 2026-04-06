# Corrections Triggers

Volatile collection of triggers extracted from `memory/corrections.md`. Each trigger is a pattern that, when recognised early, prevents a class of corrections from recurring.

Lifecycle: entries are promoted to rules when they prove durable, or deleted when they lose value. This file is a staging area — not a permanent home.

## Entry format

```
### <Trigger name>

**Pattern:** what to watch for
**Prevention:** what to do when the pattern is recognised
**Origin:** correction entry or entries that produced this trigger
```

---

## Triggers

### Side-effect outside working tree

**Pattern:** A proposed action writes, deletes, or modifies a file outside the current repo's working tree — including user home directories, global configs, and other repos.
**Prevention:** Before executing any file-system write, verify the target path is inside the repo root. If it is not, surface the side-effect to the user and get explicit approval before proceeding.
**Origin:** Corrections where Claude Code wrote to paths outside the repo without flagging the side-effect.
