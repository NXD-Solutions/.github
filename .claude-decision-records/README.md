# .claude-decision-records

Decision records for the NXD Claude rules system. Explains the reasoning behind important changes to `.claude/` — why things were written as they were.

Not loaded into the AI system prompt. Consulted on demand: before flagging drift, authoring a strand, or challenging an existing decision.

---

## Structure

Mirrors `.claude/`:

```
rules/          ← records for .claude/rules/
commands/       ← records for .claude/commands/
```

One file per rules or commands file. All records for a file live in one record file.

**Scaling path:** if a file grows too large to navigate, add a subfolder per rules file, or split the rules file and mirror that.

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
**Tests:** ...
**Examples:** ...
**Outcome:** <filled later>
```

---

## Mutability

Records are mutable — updated in place when we get wiser. Git is the history layer.

*Getting wiser about the same decision* → update the record.
*A new concern triggering a new decision* → new record.

Update the **Date** field when the record is updated.