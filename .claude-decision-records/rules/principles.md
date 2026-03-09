# Records — principles.md

Decision records for `.claude/rules/principles.md`. One entry per important change — anything that can answer "why did we write it as we did."

Trivial changes (spelling, single word additions) do not require a record.

---

## Challenge until conviction

**Date:** 2026-03-08

**Authors:** Peter Sixhøj & claude-sonnet-4-6

**Concern:** Proposals were being accepted without sufficient challenge. Short-term conviction was treated as sufficient — long-term impact was not consistently tested before locking in.

**Decision:** Challenge before committing, not after. Conviction must hold short AND long term. The boundary is explicit: challenge ends at conviction; what follows is execution — not gold-plating.

**Related:** Evolving by Instinct (parent), Lean by Design (resolved tension)

**Trigger:** Authoring the conviction gate convention surfaced that the principle behind it was missing from principles.md.

**Alternatives considered:** No explicit boundary on challenge — rejected, creates gold-plating risk. Challenge until "good enough" — rejected, "good enough" is not a testable gate.

**Conviction:** high | high

---

## Record decisions, not just outcomes

**Date:** 2026-03-08

**Authors:** Peter Sixhøj & claude-sonnet-4-6

**Concern:** Changes to DNA, principles, and rules were being made without capturing the reasoning behind them. A future reader — human or AI — would see what was decided but not why. This creates opaque evolution and undermines informed auditing.

**Decision:** Add a principle requiring important changes to the rule network to be recorded with their trigger, reasoning, and conviction level. "Important" means anything that can answer "why did we write it as we did" — trivial changes (spelling, single word additions) are excluded. Records live in `.claude-decision-records/`, are not loaded into the system prompt, and are mutable — updated in place when we get wiser, with git as the history layer.

**Related:** Transparent by Nature (parent), Evolving by Instinct (enables)

**Trigger:** Reviewing dna.md surfaced that no record existed for why strands were written as they were.

**Alternatives considered:** Immutable records (append-only) — rejected in favour of mutable records updated in place. Overlapping records hurt transparency more than they help. `.claude/records/` nested folder — rejected in favour of `.claude-decision-records/` as a sibling to `.claude/` for clean separation and navigability.

**Conviction:** high | high

**Tests:** Does this principle pass "Record decisions, not just outcomes" applied to itself? Yes — this record is the proof.

**Examples:** This record.

**Outcome:**

---

## Trace the flow before building

**Date:** 2026-03-09
**Authors:** Peter Sixhøj & claude-sonnet-4-6

**Concern:** No principle existed that named the design discipline of seeking the overarching structure before implementing. Teams and individuals defaulted to building at the specifics level, producing solutions that couldn't survive change because their structure was never separated from their implementation.

**Decision:** Principle added under *Lean by Design* and *Uniform by Design* — the first principle tagged with two strands. The discipline: trace the expected data flow before building. The flow reveals sub-components and their boundaries, and once validated becomes the processing strategy. Each step is a replaceable component. The recursive dimension is explicit: once the strategy is visible, apply the same question to the strategy itself. Each level of abstraction reached is another level of freedom gained.

**Related:** Lean by Design (parent — building at the wrong abstraction level is waste), Uniform by Design (parent — the flow is the consistent foundation), Build once for many (enables — the structure reveals what is reusable), No vendor lock-in (complementary — replaceability at the structure level extends beyond vendors)

**Trigger:** A real-world story: Peter was asked to build a news distribution system for mobile units. The boss could not answer any question about content, source, device type, or operator. Rather than waiting for specifics, the data flow was derived from the problem statement alone — receive → normalise → format for device → format for operator — and implemented as a strategy pattern with stubbed components. Later, making the strategy itself replaceable revealed a second meta level. The principle captures both the discipline and the recursive instinct the story demonstrated.

**Alternatives considered:** Single parent strand — rejected, the principle genuinely serves Lean (avoids waste from wrong abstraction) and Uniform (creates consistent foundation) equally; forcing one parent misrepresents it. Splitting into two principles (mindset vs. outcome) — rejected, the discipline and the recursive outcome belong together; splitting produces two thin principles that only make sense in combination. Deriving from *Sovereign by Design* — considered but rejected; sovereignty links too tightly to external dependencies, and the principle applies equally in fully internal systems with no vendor involvement.

**Conviction:** high | high

**Value:**
- *Correctness* — solutions designed from the flow are correct at the structural level before any implementation decision is made; specifics cannot break the structure
- *Waste eliminated* — building at the wrong abstraction level is the most expensive form of rework; the flow prevents it before a line of code is written
- *Consumer benefit* — each step is a replaceable component; consumers can substitute any step without rewriting the whole
- *Cognitive focus* — the flow is a shared artefact that makes the design legible to any reader before implementation begins
- *Speed* — validated flow means implementation decisions are made in the right order; no backtracking from hardwired specifics

**Examples:**
> Receive news → normalise → format for device → format for operator
>
> Four steps, four replaceable components, derived with zero specifics known. Making the strategy itself replaceable revealed a second meta level — the same pipeline pattern applicable to any transformation sequence.

---

## Build once for many

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

---

## Domain ownership means building the shared component

**Date:** 2026-03-09

**Authors:** Peter Sixhøj & claude-sonnet-4-6

**Concern:** When uniformity is discouraged, every team inherits full ownership of every concern — including deep ones like GDPR, NIS2, and security. Most teams lack the time to go deep enough. The result: teams act in good faith, believe they have done it correctly, and have not. The failure is not negligence — it is structural. Depth requires focus. A team that partially owns ten concerns cannot go deep enough on any of them.

**Decision:** A principle naming the obligation that comes with domain ownership: the owner is not just the expert — they are accountable for ensuring a framework component exists and is used across all projects. They may delegate the build; they may not delegate the outcome. This closes the gap between "we have a security team" and "every project is actually secure."

**Related:** Uniform by Design (parent), Security is baseline (complementary — Security is baseline says never per-repo; this principle names the accountability structure that makes that true)

**Trigger:** Authoring Uniform by Design derived principles. Real experience from an organisation where uniformity was discouraged: teams cross-examined on GDPR and NIS2 compliance held genuine but incorrect beliefs. The failure was not negligence — it was the predictable result of distributing deep concerns across generalists without the time to go deep.

**Alternatives considered:** "Centralise expertise" — rejected, too passive; expertise without the obligation to deliver a component leaves the problem structurally unsolved. Scoping to security only — rejected, the same failure mode applies to logging, observability, and any concern requiring depth that generalists cannot sustain.

**Conviction:** high | high

**Examples:** Security team owns authentication — they ensure `@nxd-solutions/auth` exists and is used. Operators own log contents — they ensure the logging component implementing the contract is in place.