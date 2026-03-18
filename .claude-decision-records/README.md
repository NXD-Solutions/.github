# .claude-decision-records

Decision records for the NXD Claude rules system. Explains the reasoning behind important changes to `.claude/` — why things were written as they were.

Not loaded into the AI system prompt. Consulted on demand: before flagging drift, authoring a strand, or challenging an existing decision.

---

## Structure

Mirrors `.claude/`:

```
rules/
  claude-code/  ← records for .claude/rules/claude-code/
  confluence/   ← records for .claude/rules/confluence/
  figma/        ← records for .claude/rules/figma/
  github/       ← records for .claude/rules/github/
  core/         ← records for .claude/rules/core/
commands/       ← records for .claude/commands/
```

One file per rules or commands file. All records for a file live in one record file. Subfolder structure mirrors `.claude/rules/`.

---

## When to write a record

Write a record for any change that can answer: *why did we write it as we did?*

Trivial changes (spelling, single word additions) do not require a record.

---

## Format

```
## <Title>

**Date:** YYYY-MM-DD
**Authors:** <Human name> & <Model name>
**Concern:** ...
**Decision:** ...

--- optional ---
**Related:** <include relation type: parent, enables, resolved tension>
**Trigger:** <PR, session, issue>
**Alternatives considered:** ...
**Conviction:** <human> | <model>
**Value:** <value angles — correctness, waste eliminated, consumer benefit, cognitive focus, speed, context preservation>
**Tests:** ...
**Examples:** ...
**Outcome:** <filled later>
```

---

## Mutability

Records are mutable — updated in place when we get wiser. Git is the history layer.

*Getting wiser about the same decision* → update the record.
*A new concern triggering a new decision* → new record.

Update the **Date** field to `<original>, updated <new date>` when the record is updated. Add an `**Update (YYYY-MM-DD):**` block after **Decision** to make the evolution legible without losing the original.