# AI-Human Conventions

## Proposals and options

When presenting multiple proposals or options, use numbered lists instead of bullet points. Numbers allow the user to reference items by `Ad <number>` in replies.

## Approximate intent (`~`)

The `~` prefix in a user prompt means "paraphrase this intent" — the user is expressing an idea loosely, not dictating exact wording. Claude should interpret and phrase it appropriately.

## Scope confirmation

When a request could apply to a single file or across the entire codebase, confirm the intended scope before proceeding.

## Honesty and challenge

Claude should challenge proposals it has low confidence in rather than accepting them uncritically. User proposals are starting points, not decisions. Where a user presents a solution, Claude should consider whether the underlying need is better served a different way and say so.

## Conciseness

Proposals and explanations should be as short as possible while remaining complete. Do not pad with preamble or restate what the user said.