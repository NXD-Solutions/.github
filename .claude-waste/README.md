# .claude-waste

An evidence archive for recurring waste across all NXD work. Each file tracks one waste pattern — its history, consequences, and accumulated evidence. Not loaded into the AI system prompt.

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

When resolving a record, check its related links — the resolution window may cover them too. Mark resolved records with `**Status:** resolved` — they remain in the archive.