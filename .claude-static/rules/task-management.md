# Task Management

## Task list for all work

For any work — single step or many — create tasks before starting. The task list is the contract: both parties see what will happen before it happens, and the current state is always visible to a returning participant.

## Task references

Reference tasks by subject, not number — task IDs are internal to Claude's tooling and not visible to the user in the same way. Use the subject as the shared identifier.

If a user references a task by number, flag the ambiguity and confirm which task is meant before proceeding.

*Remove when Claude Code exposes a shared task view to both parties.*

## Task crash recovery

Whenever tasks are created or updated, write the open task list to `memory/tasks.md`. Each entry must include: subject, why the task exists, what was agreed, and the next step — enough context to resume after a crash. Clear the file when all tasks are completed.

`tasks.md` is session state — it does not follow the stable-knowledge rules of `MEMORY.md`.