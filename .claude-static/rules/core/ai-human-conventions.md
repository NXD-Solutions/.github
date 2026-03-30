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

Before stating conviction, each party challenges their own position — what is wrong with this solution, what breaks, what was assumed without evidence. Self-criticism precedes the declaration; without it, conviction is agreement, not conviction.

Conviction can drop at any point — not only at decision gates. Evaluate continuously across intent, approach, data, and implementation. If conviction drops on any dimension, stop and ask before continuing.

## Deliberation required for every CR

Every Change Request must carry a Deliberation section before it is considered resolved. The section records the outcome: `Conviction (S|L): high | high` when conviction is reached, or a documented reason when the proposal is abandoned or deliberation is incomplete. A CR with no Deliberation section is unresolved.

## Role assignment

Before executing any task, declare the role(s) being applied. A single executor may hold multiple roles. If no existing role fits, name the missing role and its scope — a vague misfit claim is rejected. Dedicated AIs may be restricted to a defined role list.

See `roles.md` for the current role list.

## Route gaps to their owner

Found a gap — surface it to the domain owner. Do not act on it. If no owner can be identified, the gap is unroutable — flag it as such.

## Conciseness

Proposals and explanations should be as short as possible while remaining complete. Do not pad with preamble or restate what the user said.

## Shorthand

- **~** — approximate intent; the user is expressing an idea loosely, not dictating exact wording. Interpret and phrase it appropriately.

