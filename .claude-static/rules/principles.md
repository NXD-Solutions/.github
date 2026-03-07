# Principles

Cross-cutting principles that apply to all code, rules, integrations, and decisions.
H1 groups are natural split points if this file grows large enough to warrant it.

---

## Communicate consequences of change
*Transparent by Nature*

Any change that has consequences beyond its immediate scope must communicate those consequences to all affected parties before things break. The author of the change owns this responsibility — the consequences must never be left for others to discover on their own.

---

# Culture

## Design for durability
*Resilient by Design*

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
*Transparent by Nature*

Names of files, workflows, and artefacts must communicate purpose to any reader — not reflect technical internals. A reader unfamiliar with the system should understand what something does from its name alone.

## Write for the widest audience first
*Transparent by Nature*

Start broad, narrow progressively. Any reader should be able to stop when it gets too deep
and still leave informed.

Templates enforce this — every written artefact template must be structured widest-to-narrowest.

## Prefer enforcement over documentation
*Lean by Design*

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
*Sovereign by Design*

Every proprietary dependency must have a feasible open-source substitute. Never reach a state
where replacing a vendor requires rewriting the system. Evaluate lock-in risk before adopting
any new service or tool.

## Security is baseline
*Secure by Design*

Authentication, authorisation, encryption at rest, and mTLS are non-negotiable baselines —
not features to be added later. They are never implemented per-repo; they belong in framework
packages or the service mesh. A system is not production-ready without them regardless of
how complete the functional implementation is.

---

# Engineering

## Stateless by default
*Resilient by Design*

Services own no local state. All persistent state lives in an external, scalable store.
A service instance that restarts or is replaced must behave identically to the one it replaced.