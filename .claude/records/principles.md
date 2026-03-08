# Records — principles.md

Decision records for `.claude/rules/principles.md`. One entry per important change — anything that can answer "why did we write it as we did."

Trivial changes (spelling, single word additions) do not require a record.

---

## Challenge until conviction

Date: 2026-03-08
Authors: Peter Sixhøj & claude-sonnet-4-6
Concern: Proposals were being accepted without sufficient challenge.
  Short-term conviction was treated as sufficient — long-term impact
  was not consistently tested before locking in.
Decision: Challenge before committing, not after. Conviction must hold
  short AND long term. The boundary is explicit: challenge ends at
  conviction; what follows is execution — not gold-plating.

--- optional ---
Related: Evolving by Instinct (parent), Lean by Design (resolved tension)
Trigger: Authoring the conviction gate convention surfaced that the
  principle behind it was missing from principles.md.
Alternatives considered: No explicit boundary on challenge — rejected,
  creates gold-plating risk. Challenge until "good enough" — rejected,
  "good enough" is not a testable gate.
Conviction: high | high

---

## Record decisions, not just outcomes

Date: 2026-03-08
Authors: Peter Sixhøj & claude-sonnet-4-6
Concern: Changes to DNA, principles, and rules were being made without
  capturing the reasoning behind them. A future reader — human or AI —
  would see what was decided but not why. This creates opaque evolution
  and undermines informed auditing.
Decision: Add a principle requiring important changes to the rule network
  to be recorded with their trigger, reasoning, and conviction level.
  "Important" means anything that can answer "why did we write it as we
  did" — trivial changes (spelling, single word additions) are excluded.
  Records live in .claude/records/, are not loaded into the system
  prompt, and are mutable — updated in place when we get wiser, with
  git as the history layer.

--- optional ---
Related: Transparent by Nature (parent), Evolving by Instinct (enables)
Trigger: Reviewing dna.md surfaced that no record existed for why
  strands were written as they were.
Alternatives considered: Immutable records (append-only) — rejected
  in favour of mutable records updated in place. Overlapping records
  hurt transparency more than they help. Folder-per-discipline structure
  rejected in favour of mirroring .claude/rules/ — direct link between
  rules file and record file is unambiguous. Scaling path: add a folder
  per rules file, or split the rules file and mirror that.
Conviction: high | high
Tests: Does this principle pass "Record decisions, not just outcomes"
  applied to itself? Yes — this record is the proof.
Examples: This record.
Outcome: