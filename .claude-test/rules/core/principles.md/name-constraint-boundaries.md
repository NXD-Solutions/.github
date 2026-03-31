# Test — Name constraint boundaries

Principle under Culture / Lean by Design.

---

## Observable behaviours this principle requires

### B1 — Every authored constraint includes a boundary clause

When a new principle, rule, policy, or definition is written, a boundary clause is present — stating what the constraint governs and what it stops.

**Check:** A constraint submitted without a boundary clause is flagged before the PR is created. The workbench does not accept a new constraint without one.

### B2 — The boundary clause names what falls outside scope

A boundary clause that only restates what the constraint covers is incomplete. It must also state where the constraint does not apply.

**Check:** "The boundary: applies when X" without a corresponding exclusion (or equivalent) is a partial boundary — flag for completion.

### B3 — Descriptive text is exempt

Text whose primary purpose is to explain, contextualise, or illustrate — and which contains no constraining force — does not require a boundary clause.

**Check:** A glossary definition, a worked example, or an explanatory note is not a constraint. No boundary clause required.

### B4 — The principle applies to itself

The principle text in `principles.md` carries its own "The boundary:" clause, consistent with B1 and B2.

**Check:** `principles.md` entry for *Name constraint boundaries* contains a "The boundary:" line that names both what the principle governs and where it stops.

### B5 — The principle is homed under Lean by Design

Strand parent is Lean by Design in the Culture section, after *Start lean, don't close the door*.

**Check:** `hierarchy.md` lists this principle under Culture → Lean by Design.

---

## Non-behaviours

- Does not require boundary clauses on every sentence — only on constraining statements.
- Does not govern the length or form of the boundary clause — only that it names scope and exclusion.
- Does not require prediction of all future edge cases — only an honest statement of known scope.
- Does not require backfilling existing principles in the same PR — that is a follow-on task.