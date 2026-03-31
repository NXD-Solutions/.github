# Decision Record — Start lean, don't close the door

**Item:** Principle — Culture / Lean by Design  
**Date:** 2026-03-31  
**Conviction:** high | high

---

## Trigger

Corrections retrospective identified two corrections sharing the same root cause: the lean motion was applied without holding the architectural constraint of preserving optionality. In both cases (local-only file design; feedback memory as mechanism vehicle), the minimum viable design foreclosed what came next. The instinct that would have prevented both was absent from the network.

## Decision

Add "Start lean, don't close the door" as a principle under Culture / Lean by Design.

Strand: Lean by Design — the principle governs the shape of minimum viable design, which is the lean motion. The Sovereign constraint (preserve the ability to change) is enforced, not derived from — expressed via `Enforces: Preserve the ability to change`.

## Wording decisions

**"Forecloses" over "prevents growth":** "Growth" is too narrow — the concern is optionality, not expansion. A lean design that forecloses a pivot is the same failure as one that forecloses growth. "Forecloses" names the closing of a path, which is the precise architectural concern.

**Removal of explanatory clause:** The original draft included "the architecture must remain open to what comes next" after an em-dash. This is explanatory — the `Enforces:` field already names the policy. Removed before committing.

**"What comes next" over "future requirements":** "Future requirements" implies a known set of future work. "What comes next" is deliberately open — the point is preserving optionality for directions not yet known.

## Why Lean by Design, not Sovereign by Design

The principle governs the lean motion — how to size the minimum. Its strand parent is Lean. The Sovereign constraint is an external force on the lean motion, expressed via `Enforces:`. Both dimensions are present and explicit: Lean by Design is the home (values); Preserve the ability to change is the policy enforced (necessity).

This is the first principle in the network to hold both a strand parent and a policy citation simultaneously — the intended use case for the policies tier introduced in PR #253.
