## Load-bearing terms

**Date:** 2026-04-09
**Authors:** Peter Sixhøj & Claude Sonnet 4.6
**Concern:** The glossary has no stated invariant about the stability of core terms. Definitions that depend on other terms treat that dependency as implicit — there is no rule that protects load-bearing terms from being renamed or restructured without accounting for the network they anchor.
**Decision:** Terms that other definitions depend on are load-bearing. Their stability is a precondition for the glossary functioning as a network — not a goal to pursue, but a constraint to protect. The constraint is expressed as: (1) an editorial policy in the glossary header instructing editors to apply the annotation when a term acquires dependants, and (2) a one-line annotation on each load-bearing term at the point of action. The annotation names the search mechanism — search for all uses in the file before renaming or restructuring.

**Alternatives considered:** A named list of load-bearing terms (Primitive, Invariant, Perspective) — rejected because it is stale the moment a fourth term emerges and depends on someone remembering to update it. A preamble-only approach — rejected because a preamble is read once and not present at the moment of action. The annotation ensures the signal is visible to the editor modifying the entry.
**Trigger:** IFD restructuring session — cross-reference maintenance cost raised; Primitive, Invariant, Perspective identified as stable by design
**Conviction:** high | high
**Value:** correctness (network integrity protected), waste eliminated (silent degradation prevented), context preservation (reasoning survives session memory)
**Outcome:**
