# IFD termination states

**Item:** Invariant-first design (IFD) — glossary entry  
**Change:** Added a standalone sentence between the method description and the discipline characterization paragraphs, naming three termination states for abstraction-lifting.

---

## What was decided

The IFD entry now names three termination states for the "change abstraction level when stuck" step:

- **mapped** — parent found and confirmed
- **candidate** — parent proposed, conviction pending
- **floor** — the strand is the parent; highest valid level reached

A fourth state ("rejected") was considered and dropped.

---

## Placement — between paragraphs, not appended

The closing paragraph of the IFD entry characterizes the *discipline itself* — what makes IFD a discipline rather than a collection of independent principles. The termination states describe the outcome of one internal step. Appending them to the discipline characterization would conflate what IFD *is* with how one step inside it ends.

The sentence was placed as a standalone between the method description (first paragraph) and the discipline characterization (second paragraph) — adjacent to the step it terminates, without corrupting either paragraph's scope.

---

## "rejected" dropped

The original CR wording included "floor (no parent exists — the item is at strand level or out of scope)." This conflated two outcomes that require different actions:

- Strand level → item remains in the network; the strand is its parent
- Out of scope → item is removed from the network entirely

A split into "floor" and "rejected" was considered. Rejected on the grounds that out-of-scope items are caught before lifting begins — they fail solo tests S1 (strand derivation) or S2 (lone governance) during intake. Lifting presupposes the item passed intake. "Rejected" is a pre-condition failure, not a lifting outcome. Adding it here would imply that lifting is where out-of-scope items are caught — which is wrong.

Floor was kept clean: strand is the parent, highest valid level reached.

---

## "a specific" replaced with "an item"

The original CR wording used "a specific" as a standalone noun — shorthand from *Find the pattern, not the instance*. The IFD entry does not otherwise use that vocabulary. Replaced with "an item" — neutral, no prior vocabulary required.

---

## Conviction

`Conviction (S|L): high | high`

---

**Update (2026-04-09):** The termination states recorded here were removed from the IFD glossary entry as part of the IFD entry rewrite (see `ifd-entry-form.md`). They are deferred — not dropped — to an IFD workbench skill when one exists. This record preserves the reasoning for the states themselves; `ifd-entry-form.md` records why they were removed from the glossary.
