# Principles

Cross-cutting principles that apply to all code, rules, integrations, and decisions.
Hierarchy: strand → principle → rule. Domains (# headings) are navigation groupings — not a level in the hierarchy.

---

# Culture

## Challenge until conviction
*Evolving by Instinct*

We challenge before we commit — not after. The work of challenge ends at conviction: short and long term. What follows is execution.

## Build context that lasts
*Transparent by Nature*

Document why, not just what. Leave context that survives the session — decisions, patterns, and reasoning that a future reader can act on without reconstructing what you knew.

The boundary: document what is non-obvious or consequential. Obvious decisions and routine actions need no record — adding them creates noise that buries what matters.

## Record decisions, not just outcomes
*Transparent by Nature*

A change without its reasoning is opaque. Important changes to the rule network must record what triggered them, what was decided and why, and with what conviction. A decision that cannot be explained has not been completed. A decision that is recorded is context that survives the session.

## The task list is a contract
*Transparent by Nature*

Externalise all work as tasks before starting. The task list is a contract — both parties see what will happen before it happens, and the current state is always visible to a returning participant. Whether the work is a single step or many, the mechanism is the same: structured task state, not prose.

A contract that exists only in the AI's context is not a contract — it cannot be observed, challenged, or recovered.

## Communicate consequences of change
*Transparent by Nature*

Any change that has consequences beyond its immediate scope must communicate those consequences to all affected parties before things break. The author of the change owns this responsibility — the consequences must never be left for others to discover on their own.

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

## Prefer reversible decisions
*Sovereign by Design*

When making architectural or design decisions, prefer the reversible option unless the irreversible one is clearly justified. The cost of reversibility is paid once upfront; the cost of irreversibility compounds silently until it becomes a rewrite.

## Build once for many
*Evolving by Instinct*

When you encounter a problem, ask whether others will face it too. The ideal is to see structural recurrence at first encounter — before others feel the same pain. When that foresight isn't there, experience is the teacher: pain felt is a signal to act so others don't feel it again.

## Trace the flow before building
*Lean by Design, Uniform by Design*

Before implementing, trace the expected data flow. The flow identifies the sub-components, establishes their boundaries, and — once validated by thought or test — becomes the processing strategy. Each step in the flow is a candidate for a replaceable component. Specifics fill the steps; the flow is the framework.

Apply the same question recursively: once the strategy is visible, ask whether the strategy itself can be made replaceable. Each level of abstraction reached is another level of freedom gained.

## Domain ownership means building the shared component
*Uniform by Design*

Every concern has one owner. That owner is responsible for ensuring the framework component
that implements their concern exists and is used across all projects — defining what correct
looks like, driving it into existence, and remaining accountable when it fails. They may
delegate the build; they may not delegate the outcome. The security team owns authentication;
operators own the log contract.

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