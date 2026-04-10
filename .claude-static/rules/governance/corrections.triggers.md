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

### DR intake before PR

**Pattern:** About to propose creating a PR for a change that introduced a new command, rule, principle, or structural decision.
**Prevention:** Before proposing the PR, run DR intake: does this change warrant a decision record? If yes, draft and commit the DR before raising the PR — not after.
**Origin:** 2026-04-07 correction — DR for data-dictionary-workbench distribution strategy added only after user asked, despite the PR already being raised.

### Side-effect outside working tree

**Pattern:** A proposed action writes, deletes, or modifies a file outside the current repo's working tree — including user home directories, global configs, and other repos.
**Prevention:** Before executing any file-system write, verify the target path is inside the repo root. If it is not, surface the side-effect to the user and get explicit approval before proceeding.
**Origin:** Corrections where Claude Code wrote to paths outside the repo without flagging the side-effect.

### DR file per change instead of per node

**Pattern:** About to create a new DR file under `.claude-decision-records/` when a file already exists for that node (the H2 heading the decision belongs to).
**Prevention:** Before creating a DR file, check whether one already exists at the target path. If it does, append to the existing file — do not create a second file.
**Origin:** Recurring violation across multiple sessions — created one DR file per change instead of one per node (H2).

### Communicative artefact pre-writing gates

**Pattern:** A communicative artefact has been drafted or created.
**Prevention:** After the artefact is produced, check: were the pre-writing gates in `communicative-artefact.md` satisfied before the first draft? If not, log a correction.
**Origin:** Corrections page created without satisfying pre-writing gates — rewritten after the gap was caught mid-session (2026-04-06).
