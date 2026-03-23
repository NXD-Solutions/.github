---
name: Protect assigned scope
type: principle
strand: Resilient by Design
domain: Culture
status: accepted
---

## Finding

The DNA Workbench had no invariant governing scope behaviour. A CR proposed adding one as a workbench-specific invariant. During evaluation, the proposed text ("A Steward must protect its scope...") was identified as universal — it describes how any Steward should behave, not something specific to one workbench.

Further analysis revealed that boundary-adjacent concerns were scattered across four locations in the rule network: routing (Transparent), ownership (Uniform), evaluation (Pattern-seeking), and scope protection (nowhere). Three of four duties already had principles or rules. The gap was scope protection — the operational discipline of defending an assigned boundary.

## Decision

Add **Protect assigned scope** as a principle under Culture > Resilient by Design.

> Scope is assigned, not self-declared. Protect it — execute within it, refuse what falls outside it, and route misrouted work to whoever owns it. Where no owner exists, flag the gap to someone empowered to extend the network.

Enrich the **Steward** glossary definition with four obligations: protect assigned scope, implement within scope, route gaps to their owner, evaluate fitness. The glossary names the duties; the principles define the disciplines.

Remap **Route gaps to their owner** from Communicate consequences of change to Protect assigned scope in the hierarchy — it implements the routing clause of this principle.

## Why Resilient by Design

Scope erosion requires intervention — someone must manually route, remember who owns what, compensate for blurred boundaries. That is "someone holding it up" and "memory required" — the failure modes Resilient by Design rejects. A system where each unit protects its assigned scope keeps working without intervention.

## Why not a new strand

The CR initially raised the question of whether a "contract" strand was missing. The evidence was one principle and one rule remap — insufficient to justify a new strand. Boundary concerns are scattered but each existing item fits its current strand. The scatter is noted as a finding for future audit; it does not block the principle.

## Why not replace Architectural Thinking

A subsequent CR proposed replacing AT with scope protection. Evaluation found: (1) AT's method was formalized one day prior because the unnamed version failed — not ready for dissolution; (2) AT covers proactive structural evaluation, not just incoming work; (3) AT's strand mapping (Pattern-seeking) is deliberate and documented. The principles are complementary, not competing. AT evaluates; scope protection enforces.

## Steward not named in principle text

The principle text does not name "Steward" — it states the discipline universally. The glossary binds it to Stewards through the four obligations. This avoids the principle being narrower than its intent and prevents circular reference (glossary defines Steward duties → principle restates them).

## Glossary duty names

The four obligations use descriptive names, not single words: "protect assigned scope", "implement within scope", "route gaps to their owner", "evaluate fitness". Single words risk collision with future principles. Where a principle or rule exists, the duty name matches it. Where none exists ("implement within scope", "evaluate fitness"), the name is descriptive enough to disambiguate without creating false coupling.

## Conviction

`Conviction (S|L): high | high`

## Related

- `rules/core/glossary.md#steward` — carries the four Steward obligations
- `rules/core/ai-human-conventions.md#route-gaps-to-their-owner` — rule remapped under this principle
- `rules/core/principles.md#architectural-thinking` — complementary principle (evaluate fitness)