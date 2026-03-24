---
name: Steward fitness dimensions
type: glossary enrichment
parent: Steward
status: accepted
---

## Finding

During a scope fitness evaluation of the DNA Workbench, the self-improvement gate (a session-end reflection) was examined for fitness. The gate asked two questions: "Was self-improvement needed?" and "Was it conducted?" — but did not define what "self-improvement" evaluates against.

Unpacking the gate revealed six dimensions of fitness. The question then became: where do these dimensions belong?

## Decision

Add six **fitness dimensions** to the Steward glossary definition as a bullet list. These define what "evaluate fitness" (the fourth Steward obligation) means:

- **Scope** — correctly assigned and cleanly held?
- **Received tasks** — appropriate for this Steward?
- **Implementation** — output meets conviction?
- **Processes** — methods serving or hindering?
- **Captured knowledge** — insights survive beyond the session?
- **Scope integration** — boundaries meet adjacent Stewards?

The dimensions live on the glossary definition because they specify an existing obligation — they do not create new obligations or principles.

## How the dimensions were identified

The self-improvement gate was decomposed into what a Steward *does* in a session and what can degrade. Each candidate was tested against existing principles to check whether it introduced genuinely uncovered ground or re-evaluated territory already governed.

Leakage check:

- **Scope** — governed by "Protect assigned scope" (Resilient by Design). The dimension re-evaluates at session boundary; the principle governs continuously.
- **Received tasks** — governed by "Protect assigned scope" (refuse what falls outside). Same re-evaluation pattern.
- **Implementation** — challenged as potentially collapsing into "Challenge until conviction" (if conviction was sound and execution matched, implementation is fit). Retained because execution can diverge from conviction in ways not covered by the conviction gate alone — the divergence itself is the finding.
- **Processes** — governed by Evolving by Instinct strand ("every solution is a starting point"). The dimension re-evaluates specific process fitness.
- **Captured knowledge** — governed by "Build context that lasts" (Transparent by Nature). Same re-evaluation pattern.
- **Scope integration** — genuinely uncovered. No existing principle governs whether adjacent Stewards' boundaries meet.

## Alternatives considered

### New principles for implementation fitness and scope integration

The two uncovered dimensions (implementation, scope integration) were candidates for new principles. Rejected because:

- Implementation fitness collapses substantially into existing principles (conviction gate, challenge until conviction). The residual gap — execution diverging from conviction — is real but narrow. A principle for a narrow residual would over-engineer.
- Scope integration was a strong candidate for a principle under Resilient by Design (sibling to "Protect assigned scope"). But the insight was that it's a *dimension of fitness evaluation*, not a standalone concern. A Steward that evaluates its fitness should check its boundaries — that's what "evaluate fitness" means, not a separate obligation.

Creating principles would have duplicated existing governance with a different trigger (session boundary vs continuous).

### New obligations on the Steward

The four existing obligations (protect, implement, route, evaluate) were tested for completeness. Scope integration was a candidate fifth obligation ("maintain scope integration"). Rejected because:

- Scope integration is *what* you evaluate, not a separate thing you *do*. Adding it as an obligation would create a peer of "evaluate fitness" that is actually a child of it.
- The obligation count (four) is already a compact, memorable set. Adding a fifth for what is a dimension of the fourth weakens the structure.

### Self-improvement gate as a workbench-specific duty

The original placement had the gate as a DNA Workbench duty. Rejected because:

- The gate's dimensions are not DNA-specific — any Steward benefits from the same reflection.
- The gate is one *implementation* of the "evaluate fitness" obligation. Other implementations exist: scope fitness principle (structural changes), audit mode (on demand), conviction gate (decision points). All evaluate fitness; each picks different dimensions at different triggers.
- Keeping it workbench-specific would have hidden a reusable pattern inside one Steward.

### Dimensions as a separate artefact

Considered placing the dimensions in a standalone file or in the scope fitness principle. Rejected because:

- The dimensions define an obligation that lives on the Steward glossary entry. Separating them from the definition they complete would violate "Shared scope, shared lifecycle."
- The scope fitness principle evaluates scope and scope integration — a subset. It should not carry the full set.

## Key insight: obligation–implementation separation

"Evaluate fitness" is the obligation. The dimensions are what fitness means. Any process (self-improvement gate, audit, scope fitness, conviction gate) is an *implementation* that selects relevant dimensions for its trigger. This separation means:

- New implementations can be added without changing the obligation
- Dimensions can grow without changing existing implementations
- Each implementation is independently justified by its trigger, not by the dimensions it evaluates

## Conviction

`Conviction (S|L): high | high`

## Related

- `rules/core/glossary.md#steward` — the definition being enriched
- `rules/core/principles.md#scope-fitness-architectural-thinking` — one implementation of "evaluate fitness", evaluates scope + scope integration dimensions
- `.claude-decision-records/rules/core/principles.md/scope-fitness.md` — DR for the scope fitness principle
- `.claude-decision-records/rules/core/principles.md/protect-assigned-scope.md` — DR for the complementary obligation