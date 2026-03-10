# Session death loses in-session context

- **Occurrences:** 2
- **First seen:** 2026-03-10
- **Last seen:** 2026-03-10
- **Consequences:** Tasks and decisions agreed in the session are unrecoverable. The next session starts blind — work must be reconstructed from git history and memory, if it was captured at all. Mid-session work that was not committed is lost entirely.
- **Status:** open

## Description

When a Claude Code session dies unexpectedly, any context that existed only in the session — tasks created with TaskCreate, decisions under discussion, partially agreed plans — is gone. Memory and git history partially recover the state, but anything live at the time of death is unrecoverable.

## Solution Ideas

- Establish a convention: at natural milestones (end of a topic, before a long operation), write a brief checkpoint to memory covering open tasks and decisions in flight.
- Use TaskCreate more aggressively so tasks survive session death — tasks may persist across sessions (to be verified). *Partially verified — tasks persist across resume but are not visible in the UI until a TaskCreate call fires. Read tool call alone is insufficient to surface them.*
- Keep a copy of the task list in memory with enough context to pursue each task after a crash — not just the subject, but what was agreed, what the next step is, and any decisions in flight.

## Evidence

### 2026-03-10
Session died mid-work on improving user use of Claude Code Tasks. Tasks and context lost. Next session could only recover what was in MEMORY.md and git log.

### 2026-03-10 (crash recovery test)
Intentional session close to test the new crash recovery convention (PR #104). Two failures observed:
1. TaskCreate tasks do not persist across sessions — confirmed session-scoped only.
2. CLAUDE.md session-start instruction was loaded but not followed — Claude proceeded directly to git status without reading memory/tasks.md. The instruction exists at documentation level only (level 5); no enforcement mechanism fired.

Root cause: CLAUDE.md instruction relies on Claude remembering to act on it. No stronger enforcement mechanism is available at this level.