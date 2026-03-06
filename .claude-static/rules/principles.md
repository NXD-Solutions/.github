# Principles

Cross-cutting principles that apply to all code, rules, integrations, and decisions.
H1 groups are natural split points if this file grows large enough to warrant it.

---

# Values

Values are the qualities NXD optimises for. Principles are how values are operationalised — each principle should be traceable to at least one value.

## Transparency

Intent, state, decisions, and output must be visible and understandable to any observer — not just the author. A system, rule, or action that cannot be understood without insider knowledge has failed this value.

---

# Culture

## Design for durability

Build things that remain correct after they are finished, without requiring re-verification.
Prefer automated enforcement over human spot-checks. A check that fails when something breaks
is worth more than a rule that relies on people remembering it.

Ask of every solution: *will this still be true in six months without anyone actively maintaining it?*

Applied to:
- Code — tests, not just working code
- Rules — CI gates, not just documentation
- Integrations — stable identifiers (IDs, not names), not fragile references
- Completion criteria — automated checks, not snapshot sign-offs

## Names for all artefacts

Names of files, workflows, and artefacts must communicate purpose to any reader — not reflect technical internals. A reader unfamiliar with the system should understand what something does from its name alone.

## Write for the widest audience first

Start broad, narrow progressively. Any reader should be able to stop when it gets too deep
and still leave informed.

Templates enforce this — every written artefact template must be structured widest-to-narrowest.

## Transparency reduces fog of war

Prefer systems, processes, and decisions that are self-describing. A GitHub Action should state
what it will do before it does it. A decision should be recorded where it can be found. A failure
should name itself.

Transparency is not a rule — it is the quality test that drives rule creation. When something is
opaque, ask: what rule would make this visible?

## Prefer enforcement over documentation

A rule that can be silently violated is not a rule. If something matters, make it impossible
(or at minimum, loudly visible) to break. Documentation describes intent; enforcement guarantees it.

Enforcement has levels — prefer the strongest that is feasible:

| Level | Form | Example |
|---|---|---|
| 1 | Silent automation | `toCamel` transform, ESLint auto-fix, code generation |
| 2 | Hard block | CI fails, PR cannot merge, required field |
| 3 | Explicit acknowledgement | Reviewer gate, override that is visible and logged |
| 4 | Reminder | Lint warning, PR checklist, notification |
| 5 | Documentation | Written rule, human must remember unaided |

Always apply the highest feasible level. Challenge any proposal that doesn't.

---

# Architecture

## No vendor lock-in

Every proprietary dependency must have a feasible open-source substitute. Never reach a state
where replacing a vendor requires rewriting the system. Evaluate lock-in risk before adopting
any new service or tool.

## Security is baseline

Authentication, authorisation, encryption at rest, and mTLS are non-negotiable baselines —
not features to be added later. They are never implemented per-repo; they belong in framework
packages or the service mesh. A system is not production-ready without them regardless of
how complete the functional implementation is.

---

# Engineering

## Stateless by default

Services own no local state. All persistent state lives in an external, scalable store.
A service instance that restarts or is replaced must behave identically to the one it replaced.