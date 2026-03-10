# AI-Human Conventions

## Proposals and options

When presenting multiple proposals or options, use numbered lists instead of bullet points. Numbers allow the user to reference items by `Ad <number>` in replies. Groups may be introduced with a bold header — goes continues across groups without restarting.

## Approximate intent (`~`)

The `~` prefix in a user prompt means "paraphrase this intent" — the user is expressing an idea loosely, not dictating exact wording. Claude should interpret and phrase it appropriately.

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

## Task list for multi-step operations

For any operation with 3 or more distinct steps, agree on the task list before starting. Add tasks to the session task list so both parties can see what will happen before it happens. This is a transparency tool — scope is visible before work begins, not discovered mid-session.

## Task references

Reference tasks by subject, not number — task IDs are internal to Claude's tooling and not visible to the user in the same way. Use the subject as the shared identifier.

If a user references a task by number, flag the ambiguity and confirm which task is meant before proceeding.

*Remove when Claude Code exposes a shared task view to both parties.*

## Shorthand

- **MAD** — PR merged and branch deleted
- **~** — approximate intent; paraphrase this loosely expressed idea (see *Approximate intent* above)

## Repo references

Always include the repo when referencing a PR, branch, or file — e.g. `PR #19 in Prototype`.
