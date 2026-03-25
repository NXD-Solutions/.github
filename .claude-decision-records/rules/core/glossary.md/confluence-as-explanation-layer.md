# Confluence as the explanation layer for DNA concepts

**Date:** 2026-03-25

**Status:** Accepted

**Conviction (S|L):** high | high

**What triggered it:** IFD step 7 (evolve the method) was added to the glossary as a compressed constraint and to the Confluence IFD page as a full explanation with examples. The same concept appeared in two places at different fidelity. Without a record, a future reader would see duplication and either treat it as drift or collapse it.

**What was decided:**

The rules network (glossary, dna.md, principles.md) and Confluence pages serve different audiences and carry different content standards:

- **Rules network** — loaded every session; every word states or sharpens a constraint. No explanation, no rationale, no context. Lossless by declaration.
- **Confluence** — human-readable; carries explanation, rationale, examples, and context. Not subject to the lossless constraint.

The same concept may appear in both at different fidelity. This is by design, not drift. The rules network holds the constraint; Confluence holds what a human needs to understand and apply it.

**Why this separation holds:**

The rules network is token budget. Every word in it costs every session. Explanation does not constrain — it inflates. Explanation belongs where it can be read once and internalised, not where it is loaded repeatedly.

Confluence is not loaded automatically. A reader who needs explanation goes there deliberately. A reader who needs the constraint gets it from the rules network without the overhead.

**Implication for future DNA content:**

When authoring or updating a DNA concept:
- Rules network entry: constraint only — no justification, no examples, no context
- Confluence page: explanation, rationale, examples, evolution history — the full picture for a human reader

When the same concept appears in both and the Confluence version is richer, that is correct. When the rules network version contains explanation, that is a violation of the lossless declaration.

**Related:** `glossary.md` (IFD entry), Confluence page 61341697 (IFD), workbench invariant #4