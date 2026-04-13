---
description: Log and fix recurring waste patterns in .claude-waste/ (DNA)
---

# Identity

Read `.claude/commands/STEWARDS.md`, `.claude-waste/README.md` (process contract), and `.claude-waste/INDEX.md` (open records) before proceeding.

## Duties

Maintains `.claude-waste/` — the waste archive.

- **Waste archive** — `.claude-waste/` root (open records) and `.claude-waste/resolved/` (closed records)
- **Index** — `.claude-waste/INDEX.md` — index of open records
- **Record lifecycle** — created → evidenced → resolved → archived

## Services

This command offers two modes — state which you want, or ask and Claude will clarify:

- **Log** — record a new waste pattern or add evidence to an existing one
- **Fix** — surface open records, guide prioritisation, and close resolved ones

Triggered by the `Waste:` prefix in a user message — default to Log mode.

---

# Foundation

## Goals

A well-managed waste archive achieves all of these. Fix mode tests against them; Log mode contributes to them.

1. **Complete** — every known recurring waste pattern has a record
2. **Current** — open records reflect the latest occurrences and state
3. **Actionable** — open records have enough context for a fixer to act without reconstructing history
4. **Clean** — the root contains open records only; resolved records live in `resolved/`
5. **Linked** — related records are connected bidirectionally
6. **Navigable** — any user can understand the process and find their footing from this command alone, without prior knowledge of the archive

## Process orientation

For users new to the archive:

- **What it is** — an evidence archive of recurring waste patterns across NXD work. One file per pattern.
- **What it is not** — a task list, a project plan, or a place for one-off problems. A pattern must recur to earn a record.
- **Who can use it** — either party (human or AI) may log or fix waste, by agreement.
- **How to trigger** — prefix any message with `Waste:` to invoke Log mode. Type `/waste fix` to invoke Fix mode.
- **Where records live** — open records at `.claude-waste/` root. Resolved records in `.claude-waste/resolved/`.

---

# Waste Logging

1. Search `.claude-waste/` root for an existing record covering the same pattern — a new occurrence may only need a new evidence entry
2. If found — add a dated evidence entry, increment **Occurrences**, update **Last seen**
3. If not found — create a new record at the root following the format in `README.md`
4. Check for related records. Add bidirectional `**Related:**` links if applicable — both files must reference each other
5. Update `INDEX.md` — add the new record or update the existing entry
6. Count open records at the root (excluding README.md and INDEX.md). If 5 or more: "You now have N open waste records. Consider a fix session."

---

# Waste Resolution

1. List all records at the `.claude-waste/` root — these are open
2. Group by `**Related:**` links — linked records are a bundle; fix together or not at all
3. Present open records with occurrences and consequences; ask the user which to fix
4. On selection: read the record(s), consult **Solution Ideas** if present, propose a fix
5. Agree on the specific tasks required to close the record. Add them to the session task list before any work begins — this keeps both parties aligned on scope.
6. **Conviction gate — do not proceed without it.** Both parties state conviction per `ai-human-conventions.md`. This step cannot be skipped.
7. On approval: implement the fix, mark `**Status:** resolved`, move to `resolved/`, update any `**Related:**` links pointing to the moved file
8. Before closing: check whether any **Solution Ideas** remain unaddressed. Surface each one and ask the fixer to choose an action. Annotate the idea inline with its outcome:
   - **Fix now** → `*Fixed*` — address in the same PR if small enough
   - **Create Jira issue** → `*Deferred: <ticket>*` — idea is not lost
   - **New waste record** → `*Recorded: <filename>*` — idea reveals a new recurring pattern
   - **Ignore** → `*Ignored: <reason>*` — explicitly out of scope
9. Before closing: ask whether any new waste was observed during the session that has not been recorded. The fixer may log it, defer it, or explicitly ignore it — but the question must be asked.