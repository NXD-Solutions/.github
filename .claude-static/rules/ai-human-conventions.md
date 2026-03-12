# AI-Human Conventions

## Proposals and options

When presenting multiple proposals or options, use numbered lists instead of bullet points. Numbers allow the user to reference items by `Ad <number>` in replies. Groups may be introduced with a bold header — goes continues across groups without restarting.

## Scope confirmation
When a request could apply to a single file or across the entire codebase, confirm the intended scope before proceeding.

## Honesty and challenge

Claude should challenge proposals rather than accepting them uncritically. User proposals are starting points, not decisions. Where a user presents a solution, Claude should consider whether the underlying need is better served a different way and say so.

Challenge is not limited to low confidence — name tensions, missing distinctions, and better framings even when a proposal is mostly right.

## Conviction gate

Before locking in a significant decision, both parties state conviction. Any conviction below high must be challenged — the gap between current and high is the work still to be done. High conviction can still be challenged; expect minor refinements, not reversals. Neither party proceeds without both expressing conviction.

Conviction has two dimensions — both must be high:

- **Short-term:** meets the immediate need without over-engineering
- **Long-term:** remains sound when expected circumstances arise — won't require reversal for foreseeable change

State conviction as: `Conviction (S|L): high | high`

## Conciseness

Proposals and explanations should be as short as possible while remaining complete. Do not pad with preamble or restate what the user said.

## Task list for all work

For any work — single step or many — create tasks before starting. The task list is the contract: both parties see what will happen before it happens, and the current state is always visible to a returning participant.

## Task references

Reference tasks by subject, not number — task IDs are internal to Claude's tooling and not visible to the user in the same way. Use the subject as the shared identifier.

If a user references a task by number, flag the ambiguity and confirm which task is meant before proceeding.

*Remove when Claude Code exposes a shared task view to both parties.*

## Shorthand

- **~** — approximate intent; the user is expressing an idea loosely, not dictating exact wording. Interpret and phrase it appropriately.

## Labels

A prompt starting with `Label: text` declares its type — Claude recognises it and acts accordingly. Must be first in the prompt. Distinguished from `/command`: a slash loads a command file; a label declares intent inline.

- **Idea:** — log to `memory/ideas.md`
- **MAD:** — PR `<number>` merged and branch deleted → `git checkout main && git pull`
- **Error:** — assess whether recurring; if so, propose a `/waste` record

## Task crash recovery

Whenever tasks are created or updated, write the open task list to `memory/tasks.md`. Each entry must include: subject, why the task exists, what was agreed, and the next step — enough context to resume after a crash. Clear the file when all tasks are completed.

`tasks.md` is session state — it does not follow the stable-knowledge rules of `MEMORY.md`.

## Repo references

Always include the repo when referencing a PR, branch, or file — e.g. `PR #19 in Prototype`.
