# Decision Record — Change Request (lifecycle evolution)

**Item:** `glossary.md / Change Request`
**Date:** 2026-03-30
**Conviction:** S: high | L: high

---

## Trigger

Adding the mandatory Deliberation section to the CR template (PR #248) made the CR a lifecycle artefact — it carries the proposal from finding through deliberation to a confirmed outcome. The existing definition described the CR as "the input to a deliberation," which captured only the input role. The definition no longer matched the artefact.

## Decision

Update the CR definition to reflect its lifecycle role: an artefact that carries a finding through deliberation to a recorded outcome. The field list is updated to include the Deliberation section.

## Why the definition must change

A definition that misrepresents the artefact creates ambiguity about what a complete CR looks like. Submitters working with "input-only" in mind would omit the Deliberation section; the workbench working with "lifecycle" in mind would require it. The definition is the contract — it must match the artefact.

## Relationship to the Decision Record

The prior definition said the CR is "distinct from a Decision Record, which is the output." With the Deliberation section now recording the outcome, the DR is no longer the only output. The distinction is reframed: the CR is distinct from the DR in that the DR captures the full reasoning for future editors. The CR's Deliberation section is the gate; the DR is the record. They serve different readers and neither replaces the other.
