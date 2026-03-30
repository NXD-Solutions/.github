# Decision Record — Deliberation required for every CR

**Item:** `ai-human-conventions.md / Deliberation required for every CR`
**Date:** 2026-03-30
**Conviction:** S: high | L: high

---

## Trigger

Defining "Deliberation" in the glossary surfaced that the CR → deliberation → Decision Record chain has a missing obligation in the middle. The definition exists; nothing required deliberation to be triggered. CRs could accumulate and be silently ignored — the chain completing only when someone remembered to invoke deliberation.

## Decision

Add a rule making deliberation mandatory for every CR. The mechanism: a Deliberation section added to each CR, recording the outcome (conviction or documented reason for abandonment). A CR with no Deliberation section is unresolved.

## Why the Deliberation section is the enforcement mechanism

A registry of open CRs would enable a hard gate (enforcement level 2) but doesn't exist. The Deliberation section achieves enforcement level 3 — explicit acknowledgement — without a registry: the CR carries its own evidence. An empty section is a visible gap; a filled section confirms the gate was passed.

## Why conviction is the content model

"Sufficient" was the initial framing; it resolves to conviction. Conviction is the existing standard for deliberation exit — defining a separate standard would fragment the vocabulary without adding precision. The section records `Conviction (S|L): high | high` on success, or a documented reason on abandonment or incomplete deliberation.

## Abandonment visibility

Under the prior Deliberation definition, abandonment produced no output — a deliberated-and-abandoned CR was indistinguishable from a silently-ignored one. The Deliberation section closes this: abandonment must be documented in the section. A CR cannot be considered resolved without it.

## Relationship to the Decision Record

The Deliberation section and the DR serve different readers:
- **Section** — confirms the gate was passed. Read by the workbench at close.
- **DR** — preserves the reasoning for future editors. Read at any point.

The section does not replace the DR. A CR reaching conviction still requires a DR when the reasoning is non-obvious or carries future reversal risk. Skipping the DR is a pre-existing enforcement failure, not created by this rule.

## Parent principle

Challenge until conviction. Deliberation is the mechanism by which conviction is reached on a proposed change — requiring deliberation for every CR is a direct expression of that principle.

## Dependent CR

The CR definition currently describes the artefact as "the input to a deliberation." Adding a Deliberation section makes the CR a lifecycle artefact spanning input through confirmed deliberation. The definition update is a dependent CR, deferred until this rule lands.
