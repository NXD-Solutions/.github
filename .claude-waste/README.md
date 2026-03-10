# .claude-waste

An evidence archive for recurring waste across all NXD work. Each file tracks one waste pattern — its history, consequences, and accumulated evidence. Not loaded into the AI system prompt.

**Open records live at the root — if it's here, it needs attention. Resolved records move to `resolved/`.** See `INDEX.md` for a token-efficient list of open records.

## Triggering the waste process

Prefix a message with `Waste:` to signal that something should be recorded. Either party may use the trigger. The AI will search existing records before writing a new one — an existing record may only need a new evidence entry.

## When to add a record

Either party (human or AI) may create a new record or add an evidence entry to an existing one, by agreement. Before creating a new record, search for an existing one that covers the same pattern.

## File naming

`kebab-case-description.md` — name the pattern, not the instance.

## Format

```md
# <Title>

- **Occurrences:** N
- **First seen:** YYYY-MM-DD
- **Last seen:** YYYY-MM-DD
- **Consequences:** what happens when this recurs — cost, risk, friction
- **Status:** open | resolved

## Description

What the waste is and why it recurs.

## Solution Ideas

Ideas captured during diagnosis. Not a task list — input for whoever fixes this.
When an idea is acted on, annotate it inline with its outcome:

- `*Fixed*` — addressed in the same PR
- `*Deferred: <ticket>*` — Jira issue created
- `*Recorded: <filename>*` — spawned a new waste record
- `*Ignored: <reason>*` — explicitly out of scope

- ...

## Evidence

### YYYY-MM-DD
What happened, context, impact.
```

`## Solution Ideas` is optional — omit when no ideas have been captured yet.

## Governance

When adding a new record, search existing records first.

- **Direct relation** — solving one enables solving the other. Add a `**Related:**` link in both files; bundle when fixing.
- **Close relation** — solving one informs the other. Add a `**Related:**` link in both files.

Links are always bidirectional — both files must reference each other. A one-sided link is incomplete. The PR checklist enforces this.

When resolving a record, check its related links — the resolution window may cover them too. Mark the record `**Status:** resolved` and move it to `resolved/`. Update any `**Related:**` links in other records to point to the new path.