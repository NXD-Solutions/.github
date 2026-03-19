# Prefer reversible decisions

**Date:** 2026-03-09
**Authors:** Peter Sixhøj & claude-sonnet-4-6

**Concern:** *Sovereign by Design* had one principle (No vendor lock-in) covering one specific form of irreversibility. The strand's intent — own your choices, preserve your ability to change — applies to every architectural and design decision, not just vendor selection. Without a broader principle, sovereignty only fires at vendor evaluation and misses architectural coupling, data structures, and design choices that quietly remove optionality.

**Decision:** Add *Prefer reversible decisions* as the parent principle that No vendor lock-in derives from. Vendor lock-in is one instance of irreversible dependency; this principle covers all instances. The "unless clearly justified" boundary prevents over-engineering — abstraction layers added "just in case" are not justified. The cost framing ("paid once upfront vs. compounds silently") gives AI and humans a practical test: is the cost of reversibility justified by the risk of irreversibility?

**Related:** Sovereign by Design (parent), No vendor lock-in (child — specific instance of this principle)

**Trigger:** DNA audit — Sovereign by Design flagged as underrepresented with one principle covering only vendor lock-in. The strand's broader intent was not operationalised.

**Alternatives considered:** Multiple specific principles (data portability, loose coupling, etc.) — rejected in favour of one parent principle that covers all cases; specific instances can be added as Engineering principles if needed. Dropping the "unless clearly justified" qualifier — rejected, without it the principle becomes a license to over-engineer every decision.

**Conviction:** high | high

**Value:**
- *Correctness* — sovereignty is now applied at every design decision, not just vendor selection
- *Waste eliminated* — irreversible decisions caught before they compound into rewrites
- *Consumer benefit* — AI flags tight coupling, hardwired structures, and shared databases with the same authority as vendor lock-in
- *Speed* — reversibility costs less to build in upfront than to retrofit after the fact