# Decision Record — Deliberation

**Item:** `glossary.md / Deliberation`
**Date:** 2026-03-30
**Conviction:** S: high | L: high

---

## Trigger

"Deliberation" is referenced in the Change Request definition as the process a CR inputs to and a Decision Record outputs from — but deliberation itself was not defined. The chain (CR → deliberation → DR) was named but the middle step was invisible. Surfaced by reflecting on why `SM` gets invoked: it is being used to guarantee deliberation happens, not as a deliberate design choice.

## Decision

Add "Deliberation" as a glossary entry. Definition only — the trigger obligation (every CR must trigger deliberation) is a separate process governance gap deferred to a follow-on CR.

## Scope split — why definition only

The CR that surfaced this gap conflated two problems: a vocabulary gap (deliberation is undefined) and a process governance gap (deliberation is optional and invisible). These are distinct: the definition belongs in the glossary; the obligation belongs under a principle with a rule. Combining them would conflate vocabulary with process governance in a single change. The definition lands first; the obligation follows when its own CR is deliberated.

## SM as direct implementation — not "one of potentially many"

An earlier framing proposed that SM "may become a named deliberation method rather than the only path." This was cut. There is no second deliberation method — naming a possibility that doesn't exist creates a door with no room behind it. SM is deliberation's current implementation; the definition references it directly. If a second method is introduced later, the definition can be updated then.

## Parent principle (for the trigger obligation CR)

Challenge until conviction owns the trigger obligation. Deliberation is the mechanism by which conviction is reached on a proposed change. Record decisions to avoid repeating work governs what happens after deliberation concludes — not whether it happens.
