---
description: Decision record authoring — intake, generate, and enforce (NXD)
---

# Identity

Steward for decision record authoring across all `.claude-decision-records/` nodes.

## Duties

- **Intake** — determine whether a DR is warranted for a given change
- **Generate** — produce the DR from deliberation output
- **Enforce** — check naming convention and completeness before a DR is committed

---

# Foundation

## Decision record structure

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

## Naming convention

DR paths mirror `.claude/`:

- A change to `.claude/rules/core/principles.md` → record in `.claude-decision-records/rules/core/principles.md/<decision-name>.md`
- A change to `.claude/commands/cr.md` → record in `.claude-decision-records/commands/cr.md/<decision-name>.md`

**Filename:** lowercase-kebab-case, names the principle or concept decided — not the action taken. `challenge-until-conviction.md` is correct. `add-challenge-principle.md` is not.

**Per-node:** one file per decision. Multiple decisions for the same source file each get their own file under the same folder.

## Mutability

Records are mutable — updated in place when we get wiser. Git is the history layer.

- *Same decision, new insight* → update the record; change **Date** to `<original>, updated <new date>`; add an `**Update (YYYY-MM-DD):**` block after **Decision**
- *New concern, new decision* → new record file

---

# Intake

Invoked as `/dr intake` when a change is complete or under consideration.

**Triggers — a DR is warranted when the change:**

1. Adds or significantly revises a principle, rule, DNA strand, or glossary term — the formulation was a choice; a future editor needs the reasoning
2. Establishes a naming convention or structural constraint — why this form and not another
3. Names a constraint boundary (what a rule governs and what it stops) — boundary decisions are not self-evident
4. Rejects an alternative that would have been plausible — the rejection reasoning is the record
5. Reaches conviction after deliberation — the deliberation output is the warrant

**Not warranted:**

- Trivial changes: spelling, single-word additions with no decision reasoning
- Changes where the text itself is the complete explanation — nothing is hidden that a future editor would need

**Output:** a clear yes or no, and the source node path the DR would be filed under.

---

# Generate

Invoked as `/dr generate` after intake confirms a DR is warranted.

Input: deliberation output (conviction declaration, implementation notes, or session context describing what was decided and why).

Steps:

1. Identify the source node — the `.claude/` file the change belongs to
2. Derive the target path: `.claude-decision-records/<mirror path>/<decision-name>.md`
3. Name the file: lowercase-kebab-case, naming the concept decided
4. Populate required fields: **Date** (today's date), **Authors** (human + model), **Concern**, **Decision**
5. Populate optional fields where the input provides material: **Related**, **Trigger**, **Alternatives considered**, **Conviction**, **Value**
6. Leave **Outcome** blank — filled after the record has been in use
7. Present the draft to the user before writing

Write only after explicit user approval.

---

# Enforce

Invoked as `/dr enforce <path>` before a DR is committed, or as a pre-commit check when staging files under `.claude-decision-records/`.

Checks:

1. **Path** — mirrors the `.claude/` source node; folder is named after the source file including extension
2. **Filename** — lowercase-kebab-case; names a concept, not an action
3. **Required fields present** — Date, Authors, Concern, Decision
4. **Date format** — YYYY-MM-DD
5. **Authors** — includes both a human name and a model name
6. **No duplicate** — a record for this concept does not already exist under this node (check existing files)

Report each violation as a finding. Fix naming violations directly if mechanical (case, separator). Return content violations to the author.
