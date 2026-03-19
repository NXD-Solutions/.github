# Build once for many

**Date:** 2026-03-09
**Authors:** Peter Sixhøj & claude-sonnet-4-6

**Concern:** Framework promotion was purely reactive — code becomes shared after a second repo picks it up. No trigger existed at creation time to flag candidates. By the time a second repo needs something, someone may have already built their own version in parallel. The gap is structural: the rules told AI when to promote, not when to ask whether to promote.

**Decision:** Principle added under *Evolving by Instinct* that fires at creation — not at reuse. Two modes honoured: proactive (seeing structural recurrence at first encounter, before others feel the pain) and reactive (experience as teacher — pain felt is a signal to act so others don't feel it again). Proactive is the ideal; reactive is the fallback. Both are valid triggers for the same outcome. Paired with a practical trigger in `framework-standards.md` asking the question explicitly at build time.

**Related:** Evolving by Instinct (parent), Domain ownership means building the shared component (enables), When code is framework by reuse in `framework-standards.md` (implements)

**Trigger:** Session exploring how to encourage AI to identify framework candidates earlier in the development cycle. The innovation angle surfaced: the "genius" is recognising a problem will be universal without needing to see it repeated — some learn from anticipated pain, some from experienced pain. The principle must honour both.

**Alternatives considered:** Proactive-only framing ("see structural recurrence at first encounter") — rejected, forgets that experienced pain is also a valid and important teacher; the principle would implicitly shame reactive learners. Reactive-only ("flag after reuse") — already covered; adds nothing. "Look before you build" as a Lean principle — rejected, the core concern is contribution (flagging candidates for others), not just avoiding duplication for oneself.

**Conviction:** high | high

**Value:**
- *Correctness* — framework candidates are surfaced before duplication occurs, not after
- *Waste eliminated* — parallel implementations of the same gap prevented at source
- *Consumer benefit* — AI has an explicit trigger to fire during development, not just during audit
- *Cognitive focus* — the question is structural ("will others face this?"), not anecdotal ("have I seen this before?")
- *Speed* — flagging while context is fresh costs less than consolidating after the fact