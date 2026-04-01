# Decision Record — Change Request (liveness property)

**Item:** `glossary.md / Change Request`
**Date:** 2026-04-01
**Conviction:** S: high | L: high

---

## Trigger

While evaluating a workbench pattern, "CR is a working document" and a process rule were written as a single sentence. The conflation was caught on review. The root cause: the CR definition does not name the artefact's liveness — that it remains open and shapeable until a specific termination condition is met. Without that anchor, liveness drifts into whatever sentence is being written, conflating artefact nature with process rules.

## Decision

Add *"A CR is live until the post-deliberation package is complete."* to the CR glossary entry as a standalone sentence.

## Why "live until the post-deliberation package is complete" over "working document"

"Working document" was considered and rejected — it is imprecise. Readers interpret it as "draft," "actively being edited," or "not yet approved," depending on context. None of these names the termination condition.

The termination condition is what matters: a CR is live until the post-deliberation package is complete. At that point it is stable and ready for implementation. Naming the termination condition makes "live" unambiguous — it is bounded by a concrete gate, not by an editorial state.

## Why the definition is the right home

The property belongs to the artefact, not to the conventions that govern how to handle it. A reader encountering a CR for the first time should understand its liveness from the definition — not by reading `ai-human-conventions.md` separately.

The execution gate in `ai-human-conventions.md` enforces the same boundary. Naming the liveness property in the definition makes the gate derivable: a reader who knows the CR is live until the package is complete can infer the gate without being told explicitly. The definition does not replace the gate; it gives the gate a foundation.

## Why appended to the existing paragraph, not as a separate paragraph

The liveness property is a property of the artefact described in the entry — not a separate concept. Appending it to the existing paragraph keeps the CR entry as one coherent definition.