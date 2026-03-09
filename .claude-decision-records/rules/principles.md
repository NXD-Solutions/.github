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