# Decision Record — Name constraint boundaries

## What triggered this

A recursive lift exercise applied to the workbench's patterns learned list. Pattern 5 — "When a principle could be misconstrued as license to over-engineer, make the boundary explicit — name what the principle stops as well as what it starts" — was lifted through two abstraction levels to produce a principle candidate. No existing principle covered the territory.

## What was decided

Add a principle under Lean by Design (Culture):

> **Name constraint boundaries**
>
> An unnamed limit creates waste — workarounds and caveats to cover what the constraint leaves unsaid. State what the constraint governs and what it stops.
>
> The boundary: applies when writing any constraint — principle, rule, policy, or definition. Descriptive text that doesn't constrain needs no limit clause.

## Why

An unnamed constraint limit produces two failure modes: (1) compensating documentation — readers write workarounds and caveats to fill the gap; (2) silent misapplication — readers gold-plate or under-scope without any visible signal. Both are waste. Naming the limit eliminates both at the source.

## Strand placement — Lean by Design, not Transparent by Nature

Transparent by Nature was considered. The argument: naming a boundary makes intent fully visible — opacity at the edges is the observable failure. Rejected. The opacity is a symptom; the incompleteness is the cause. Lean by Design addresses the cause — an unnamed limit costs more than it returns, in documentation and misapplication. Transparency is the mechanism; waste elimination is the motivation.

## Wording — "creates" not "forces"

First draft used "forces." Deliberation agent identified that "forces" overstates the causal link and implies only the compensating documentation failure mode. "Creates" covers both failure modes without naming either specifically. Replaced in final text.

## What was considered and rejected

**Adding the second failure mode explicitly to the principle body** — "readers misapply in silence" — rejected. The invariant (every word constrains) requires compression. "Creates waste" is the compressed form; both modes are implied. Naming them would explain, not constrain.

**Removing "definition" from the boundary clause list** — considered because definitions are descriptive, not constraining. Retained because definitions that draw a sharp edge (e.g., "Communicative artefact" excludes code files) benefit from a boundary clause. The trailing exemption ("descriptive text that doesn't constrain") covers definitions without constraining force.

## Conviction

`Conviction (S|L): high | high` — declared bilaterally after deliberation.

## Follow-on

Existing principles that currently lack a boundary clause should be reviewed and backfilled where appropriate. This is a separate unit of work — not part of this PR.