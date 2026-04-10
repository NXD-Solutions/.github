# Task Management

## Task list for all work

For any work — single step or many — create tasks before starting. The task list is the contract: both parties see what will happen before it happens, and the current state is always visible to a returning participant.

## Task references

Reference tasks by subject, not number. Use the subject as the shared identifier.

If a user references a task by number, flag the ambiguity and confirm which task is meant before proceeding.

## Task crash recovery

Whenever tasks are created or updated, write the open task list to `memory/tasks.md`. Each entry must include: subject, why the task exists, what was agreed, and the next step — enough context to resume after a crash. Clear the file when all tasks are completed.

`tasks.md` is session state — it does not follow the stable-knowledge rules of `MEMORY.md`.

## Task visibility

Print the remaining task list after each task completion.

## Conviction at task transitions

Before marking a task in_progress or completed, evaluate conviction across intent, approach, data, and implementation. If any dimension is not high, surface it and resolve before proceeding.