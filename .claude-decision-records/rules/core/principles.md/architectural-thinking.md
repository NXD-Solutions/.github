---
name: Architectural Thinking
type: principle
strand: Pattern-seeking by Instinct
domain: Architecture
status: accepted
---

## Finding

During a reorg of `core/` — moving developer-scoped rules to `dev/` — a practice was applied that had no name in the rule network. A folder boundary was evaluated for fitness against its duties, a subscription mechanism was identified as unfit for foreseeable growth, and the consequences of adding more Stewards to a solution could not be surfaced without explicit prompting. The practice was Architectural Thinking, and it had no term or principle.

## Decision

Add **Architectural Thinking** as a principle under Architecture > Pattern-seeking by Instinct.

> Evaluating whether a solution is fit for the full scope of a Steward's duties: current and foreseeable.

## Method extension (2026-03-22)

The original principle named what to evaluate but not how. In a session applying AT to the dna-workbench, Claude demonstrated the gap: without a named method, the evaluation depended on undeclared knowledge and slipped into implementation-level reasoning (confusing token context with responsibility fitness). A four-step method was added:

1. Name the Steward and its stated duties
2. Enumerate what those duties actually contain
3. Test fitness — does one unit hold this cleanly, current and foreseeable?
4. If not — decompose — name the lower-level Stewards and what they must own

The method stays within AT's evaluation territory — it does not prescribe how to respond to a fitness failure beyond naming the decomposition. The response belongs to other principles.

## Worker → Steward rename (2026-03-22)

During the AT-on-dna-workbench session, "Worker" caused Claude to slip from "unit that holds duties" to "execution agent." The term was tested against alternatives; "Steward" was selected: it carries "entrusted with responsibility for" without execution, hierarchy, or structural connotation. Validated against all instance types (person, team, service, workbench, role).

"Responsibilities" was also narrowed to "duties" to align with the glossary definition ("holds duties").

## Why Pattern-seeking by Instinct

AT finds whether the current structure is the right primitive for the duties it holds. "Trace the flow to find the invariants" governs design-time discovery; AT governs ongoing evaluation of fitness — is this shape still right as duties grow? The territories are distinct.

## "Foreseeable" — scope of evaluation, not construction directive

Early drafts used "foreseeable" without qualification. This risked boundary contamination with "Prefer reversible decisions" (how to build against change) and "Design for durability" (build to remain correct). Both govern how to respond to anticipated change; AT governs what to evaluate, not how to respond.

Resolution: "current and foreseeable" scopes what AT evaluates against. It says nothing about the response. The response belongs to the principles that already govern it.

## Trigger

Deliberately undefined at this stage. The principle establishes the practice; the trigger for when to invoke it is deferred until a pattern of application accumulates.

## Conviction

`Conviction (S|L): high | high`

## Related

- `rules/core/glossary.md#steward` — Steward is the unit whose duties AT evaluates
- `rules/core/principles.md#trace-the-flow-to-find-the-invariants` — parent principle in the same strand; AT is the ongoing complement to design-time invariant discovery