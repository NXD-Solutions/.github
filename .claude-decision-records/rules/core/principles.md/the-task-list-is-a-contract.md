# The task list is a contract

**Date:** 2026-03-10
**Authors:** Peter Sixhøj & claude-sonnet-4-6

**Concern:** Work was being done without externalising the plan. Both parties knew what was happening within the flow of conversation, but a returning participant — after lunch, after a crash, or after a context switch — had no fixed point to orient from. The task list existed as a tool but its role as a shared contract was not named.

**Decision:** Principle added under *Transparent by Nature*: externalise all work as tasks before starting, regardless of size. The task list is a contract — both parties see what will happen before it happens. Whether the work is a single step or many, the mechanism is the same. A contract that exists only in the AI's context is not a contract — it cannot be observed, challenged, or recovered.

The threshold was deliberately set to 1 (all work) rather than 3+ steps. A single-task list serves two purposes beyond sequencing: orientation for a returning participant, and a crash-recovery anchor.

**Related:** Transparent by Nature (parent), Task list for all work convention in `ai-human-conventions.md` (implements), Task crash recovery convention (extends)

**Trigger:** Session exploring how to improve user use of Claude Code Tasks. Observation that the task list provided a fixed orientation point — "previously I had to scroll through the command to understand what you were doing at the moment." Named the principle behind the practice.

**Alternatives considered:** Threshold of 3+ steps — rejected, single-step tasks still serve the orientation and crash-recovery purposes. "For multi-step work" framing — rejected, the word "contract" applies regardless of length; the value is the shared visibility, not the sequencing.

**Conviction (S|L):** high | high

**Value:**
- *Orientation* — a returning participant sees current state at a glance without asking
- *Crash recovery* — tasks are the anchor that `memory/tasks.md` preserves across session death
- *Shared visibility* — the contract is observable and challengeable before execution begins
- *Transparency* — the AI's work is not opaque; it is structured and verifiable