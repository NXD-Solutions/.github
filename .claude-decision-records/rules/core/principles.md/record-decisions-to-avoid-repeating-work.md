# Record decisions to avoid repeating work

**Date:** 2026-03-08

**Authors:** Peter Sixhøj & claude-sonnet-4-6

**Concern:** Changes to DNA, principles, and rules were being made without capturing the reasoning behind them. A future reader — human or AI — would see what was decided but not why. This creates opaque evolution and undermines informed auditing.

**Decision:** Add a principle requiring important changes to the rule network to be recorded with their trigger, reasoning, and conviction level. "Important" means anything that can answer "why did we write it as we did" — trivial changes (spelling, single word additions) are excluded. Records live in `.claude-decision-records/`, are not loaded into the system prompt, and are mutable — updated in place when we get wiser, with git as the history layer.

**Related:** Transparent by Nature (parent), Evolving by Instinct (enables)

**Trigger:** Reviewing dna.md surfaced that no record existed for why strands were written as they were.

**Alternatives considered:** Immutable records (append-only) — rejected in favour of mutable records updated in place. Overlapping records hurt transparency more than they help. `.claude/records/` nested folder — rejected in favour of `.claude-decision-records/` as a sibling to `.claude/` for clean separation and navigability.

**Conviction:** high | high

**Value:**
- *Transparency* — a change without its reasoning is opaque; the record makes it legible to any observer
- *Context preservation* — the record survives the session; a future human or AI can resume without starting over. The why, the alternatives rejected, and the conviction at the time are all recoverable
- *Cognitive focus* — auditors and authors consult records before challenging existing decisions; this prevents relitigating settled questions

**Tests:** Does this principle pass "Record decisions to avoid repeating work" applied to itself? Yes — this record is the proof.

**Examples:** This record.

**Outcome:**