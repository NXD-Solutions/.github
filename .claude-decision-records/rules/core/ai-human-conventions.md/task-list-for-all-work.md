# Task list for all work — drop threshold, add crash recovery

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
