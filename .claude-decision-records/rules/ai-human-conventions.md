# Records — ai-human-conventions.md

Decision records for `.claude/rules/ai-human-conventions.md`. One entry per important change — anything that can answer "why did we write it as we did."

---

## Task list for all work — drop threshold, add crash recovery

**Date:** 2026-03-10
**Authors:** Peter Sixhøj & claude-sonnet-4-6

**Concern:** The "3 or more distinct steps" threshold excluded single-step work from the task list. A single-task list still serves orientation (returning participant sees state) and crash recovery (task is preserved in `memory/tasks.md`). The threshold was arbitrary and eliminated value without reducing noise.

Additionally, no convention existed for crash recovery — tasks created mid-session were lost when a session died, and the next session had to reconstruct from git history and memory.

**Decision:** Three changes in one:
1. Drop the threshold — all work gets a task, regardless of length
2. Add crash recovery convention — write open tasks to `memory/tasks.md` on every create/update; clear when all tasks complete; recreate at session start if not empty
3. Add Why field to `tasks.md` entry format — captures what led to the task, not just what was agreed and what's next. A cold-start participant needs the history to handle forks and challenges, not just the execution plan.

**Related:** The task list is a contract (parent principle), CLAUDE.md session-start instruction (implements crash recovery)

**Trigger:** Session exploring task use. Testing confirmed: TaskCreate tasks persist across resume but are not visible in the UI until a `TaskCreate` call fires. `memory/tasks.md` is the reliable crash-safe layer. Session-start instruction in CLAUDE.md reads the file and recreates tasks — the `TaskCreate` call also triggers UI reload of persisted tasks.

**Alternatives considered:** Keep the 3-step threshold — rejected, the benefits of a single-task list (orientation, crash recovery) outweigh any noise concern. Automatic checkpoint writes (time-based) — rejected, write on task change is sufficient and avoids unnecessary writes. Separate `tasks.md` format from MEMORY.md — accepted, different lifecycle is the signal: session state vs. stable knowledge.

**Conviction (S|L):** high | high

**Value:**
- *Crash recovery* — tasks survive session death and are recoverable at next start
- *Orientation* — fixed point for a returning participant regardless of task count
- *History* — Why field captures the trigger, not just the plan; cold-start recovery is complete

---

## Conviction gate — bilateral conviction check

**Date:** 2026-03-08, updated 2026-03-10

**Authors:** Peter Sixhøj & claude-sonnet-4-6

**Concern:** The bilateral conviction check was a consistent practice in sessions but not written down. Neither party could point to a rule that required it — it relied on habit.

**Decision:** Before locking in a significant decision, both parties state conviction. Any conviction below high must be challenged — the gap is the work still to be done. High conviction can still be challenged; expect minor refinements, not reversals.

**Update (2026-03-10):** The short/long term dimension was used in practice but never defined. Two dimensions added:
- **Short-term:** meets the immediate need without over-engineering
- **Long-term:** remains sound when expected circumstances arise — won't require reversal for foreseeable change

Format standardised: `Conviction (S|L): high | high`. Rejected wordings for long-term: "when circumstances change" (too broad — implies survival of anything) and "to meet long-term requirements" (assumes requirements are known).

**Related:** Challenge until conviction (parent), Evolving by Instinct (enables)

**Conviction (S|L):** high | high

---

## Honesty and challenge — broadening the trigger

**Date:** 2026-03-08

**Authors:** Peter Sixhøj & claude-sonnet-4-6

**Concern:** The original rule triggered challenge only on "low confidence". This was too narrow — good proposals can become great through challenge even when confidence is moderate. Silent acceptance of mostly-right proposals leaves value on the table.

**Decision:** Challenge whenever there is a tension, missing distinction, or better framing — not only when confidence is low.

**Related:** Transparent by Nature (parent), Challenge until conviction (related)

**Conviction:** high | high