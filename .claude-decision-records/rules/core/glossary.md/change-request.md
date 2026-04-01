# Decision Record — Change Request (template revision)

**Item:** `glossary.md / Change Request`
**Date:** 2026-03-30
**Conviction:** S: high | L: high

---

## Trigger

Shaping a CR for a missing glossary entry surfaced that the "proposed change" field was doing two jobs: naming the need and pre-selecting the solution. The submitter's intention — what they need from deliberation — was absent from the template. The result: CRs arrived with a solution to evaluate rather than a need to deliberate against. Deliberation space narrowed before it opened.

## Decision

Replace "proposed change" with "goal" as the fourth mandatory field. Solution alternatives may appear in working notes but are explicitly non-binding.

## Why "goal" over "need"

The governing principle is *Goal before solution*. "Goal" is forward-facing — it names the state the system must reach after the change. "Need" is backward-facing — it names the gap, which is already covered by finding and consequence. The fourth field must not repeat the problem; it must name the destination. "Goal" aligns with the principle's vocabulary.

## Why "proposed change" was a template failure

"Proposed change" oriented the submitter toward a solution before deliberation had opened the space. CRs that arrive with a proposed change create fixation: the deliberation narrows toward the submitter's framing before the workbench has examined the finding. Needs that could be met multiple ways are funnelled into one path by the template itself.

## Why solution alternatives survive in working notes

A goal that cannot generate any solution alternative is a signal the goal isn't specified clearly enough. Working notes serve as that test — they are the space for exploring whether the goal is well-formed, not for pre-selecting the answer. The "working notes — non-binding" label does the governance work: it signals to the workbench that what follows is not a proposal competing for adoption.

## Impact scope

"Proposed change" appears in `glossary.md` (the only location that required updating). Occurrences in `workbench.md` refer to file-level changes shown to the user during Fix mode — not the CR field — and were left unchanged. The occurrence in the Deliberation decision record is generic usage and was left unchanged.

## Follow-on CR

"Working notes" is established practice but undefined. Its formal definition is deferred to a follow-on CR, dependent on this template change landing first.

## Name survival

"Change Request" names the category of artefact — something that requests a change be considered — not the content of the proposal. The name holds even though the specific change is no longer a mandatory field. The tension is real but acceptable; the name is established vocabulary and renaming it would cost more than it resolves.

---

# Decision — Glossary entry reduction (2026-04-01)

**Change:** Reduced the entry to a compact field list; moved the `/cr` pointer to `ai-human-conventions.md`.
**Conviction:** `Conviction (S|L): high | high`

## What was decided

**Kept:** opening sentence, field names as compact list (finding, trigger, consequence, goal, Deliberation section), liveness clause ("A CR is live until the post-deliberation package is complete"), "Distinct from a Decision Record" distinction.

**Dropped:** parenthetical explanations for each field (procedural — the `/cr` skill owns these), "solution alternatives in working notes" note.

**Moved:** pointer to `/cr` placed in `ai-human-conventions.md` under the CR execution gate rule.

## Key deliberation decisions

**Field names are definitional; parentheticals are procedural** — The field names tell the reader what a CR *is*. Parenthetical explanations tell the reader how to fill them — that is the `/cr` skill's job.

**Tool pointer belongs in the rule, not the definition** — A tool pointer in a glossary definition binds the term to a current implementation. Moved to the CR execution gate rule, where a rule can reference its operationalization without the definition becoming fragile.
