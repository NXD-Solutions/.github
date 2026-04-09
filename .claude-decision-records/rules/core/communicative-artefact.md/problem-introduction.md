# Problem introduction

**Facet of:** `rules/core/communicative-artefact.md`
**Parent principle:** Every communicative artefact serves the reader's context — not the system's structure
**Date:** 2026-04-09

---

## What was decided

Add *Problem introduction* as a fourth facet in `communicative-artefact.md`:

> **Problem introduction** — when the reader may not arrive with the problem already in mind, establish the problem the artefact solves before presenting the solution — so the reader can connect the solution to a problem they already hold in mind.

## Why the latent-need qualifier was removed

The CR draft scoped the facet to artefacts "the reader may not yet know they need." Challenge A surfaced that this qualifier restricts the facet to latent-need cases — readers who arrived by discovery. A reader who arrived with intent still benefits from seeing the problem stated before the solution: it confirms they are in the right place and frames the content before it arrives. The value of problem introduction does not depend on the reader's awareness. The qualifier was removed.

## Why "establish before" was chosen over "open with"

The CR draft said "open with the problem." Challenge B identified this as positionally prescriptive: some artefacts require brief framing (audience declaration, scope boundary) before the problem. An artefact that opens with a one-sentence scope statement and then states the problem would be non-compliant under the positional form. The intent is sequencing — the problem precedes the solution — not that the problem is the literal first sentence. "Establish the problem before presenting the solution" captures the sequencing intent without prescribing position.

## Why the scope condition changed from type enumeration to reader state

Initial post-conviction wording used a type enumeration: "when an artefact presents a process, rule, or reference." A counter-example (API reference documentation: `getCustomerInfo()`) showed that artefact type is the wrong discriminator — that artefact is a reference, yet the facet should not fire: the reader arrives with the problem already in mind. The correct discriminator is reader state on arrival. Lookup-intent readers hold the problem; discovery/learning-intent readers may not. The condition was changed to "when the reader may not arrive with the problem already in mind" — it gates on reader state, not artefact type, and generalises to any artefact form.

## Why the consequence clause changed from motivation to connection

Initial post-conviction wording named the motivation effect: "so the reader understands why they are reading." The deeper effect is cognitive priming: when the reader holds the problem before the solution arrives, they can connect the two — the solution lands in context rather than as isolated content. Motivation is upstream of connection; connection is the mechanism that saves the reader time and is what the writer directly achieves. The clause was changed to "so the reader can connect the solution to a problem they already hold in mind."

## Conviction

Conviction (S|L): high | high — both parties, 2026-04-09.
