---
name: Architectural Thinking
type: principle
strand: Pattern-seeking by Instinct
domain: Architecture
status: accepted
---

## Finding

During a reorg of `core/` — moving developer-scoped rules to `dev/` — a practice was applied that had no name in the rule network. A folder boundary was evaluated for fitness against its responsibilities, a subscription mechanism was identified as unfit for foreseeable growth, and the consequences of adding more Workers to a solution could not be surfaced without explicit prompting. The practice was Architectural Thinking, and it had no term or principle.

## Decision

Add **Architectural Thinking** as a principle under Architecture > Pattern-seeking by Instinct.

> Evaluate whether a solution is fit for the full scope of a Worker's responsibilities — as they stand today and as they can reasonably be anticipated to grow.

## Why Pattern-seeking by Instinct

AT finds whether the current structure is the right primitive for the responsibilities it holds. "Trace the flow to find the invariants" governs design-time discovery; AT governs ongoing evaluation of fitness — is this shape still right as responsibilities grow? The territories are distinct.

## "Foreseeable" — scope of evaluation, not construction directive

Early drafts used "foreseeable" without qualification. This risked boundary contamination with "Prefer reversible decisions" (how to build against change) and "Design for durability" (build to remain correct). Both govern how to respond to anticipated change; AT governs what to evaluate, not how to respond.

Resolution: "as they can reasonably be anticipated to grow" scopes what AT evaluates against. It says nothing about the response. The response belongs to the principles that already govern it.

## Trigger

Deliberately undefined at this stage. The principle establishes the practice; the trigger for when to invoke it is deferred until a pattern of application accumulates.

## Conviction

`Conviction (S|L): high | high`

## Related

- `rules/core/glossary.md#worker` — Worker is the agent whose responsibilities AT evaluates
- `rules/core/principles.md#trace-the-flow-to-find-the-invariants` — parent principle in the same strand; AT is the ongoing complement to design-time invariant discovery