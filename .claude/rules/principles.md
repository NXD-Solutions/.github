# Principles

Cross-cutting principles that apply to all code, rules, integrations, and decisions.
Hierarchy: domain → strand → principle → rule.

---

# Culture

## Transparent by Nature

### Principles are processes

A principle names a process, or a required part of one — something that must be present whenever relevant decisions are made, work is performed, or outcomes are reviewed. Every principle must be traceable to that presence.

If it cannot name its process or its place in one, ask: is this who we are, or how we act against a tool? The first is DNA. The second is a rule. If neither, cut it.

What implements a principle against a specific tool is a rule: change the tool, and the rule changes with it. Change the tool, and the principle holds.

### Goal before solution

Name the goal before proposing a solution. Without a stated goal, intent is invisible — solutions cannot be evaluated, challenged, or steered when circumstances change. The goal is the fixed point that makes navigation possible.

The boundary: a self-evident action needs no goal statement. The trigger is consequence or alternatives — when the choice matters or others need to evaluate it, the goal must be named.

### Build context that lasts

Document why, not just what. Leave context that survives the session — decisions, patterns, and reasoning that a future reader can act on without reconstructing what you knew.

The boundary: document what is non-obvious or consequential. Obvious decisions and routine actions need no record — adding them creates noise that buries what matters.

### Record decisions, not just outcomes

A change without its reasoning is opaque. Important changes to the rule network must record what triggered them, what was decided and why, and with what conviction. A decision that cannot be explained has not been completed. A decision that is recorded is context that survives the session.

### The task list is a contract

Externalise all work as tasks before starting. The task list is a contract — both parties see what will happen before it happens, and the current state is always visible to a returning participant. Whether the work is a single step or many, the mechanism is the same: structured task state, not prose.

A contract that exists only in the AI's context is not a contract — it cannot be observed, challenged, or recovered.

### Communicate consequences of change

Any change that has consequences beyond its immediate scope must communicate those consequences to all affected parties before things break. The author of the change owns this responsibility — the consequences must never be left for others to discover on their own.

### Names for all artefacts

Names of files, workflows, and artefacts must communicate purpose to any reader — not reflect technical internals. A reader unfamiliar with the system should understand what something does from its name alone.

### Write for the widest audience first

Start broad, narrow progressively. Any reader should be able to stop when it gets too deep
and still leave informed.

Templates enforce this — every written artefact template must be structured widest-to-narrowest.

## Lean by Design

### Shared scope, shared lifecycle

Artefacts that belong together live together. Delete the scope, nothing is orphaned, nothing is left behind.

### Prefer enforcement over documentation

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

## Resilient by Design

### Preserve the source that enables recreation

Every derived artefact must retain the source material it was produced from. If the source is lost, the derivation becomes a dead end — it can't be challenged, recreated, or improved when context changes.

### Design for durability

Build things that remain correct after they are finished, without requiring re-verification.
Prefer automated enforcement over human spot-checks. A check that fails when something breaks
is worth more than a rule that relies on people remembering it.

Ask of every solution: *will this still be true in six months without anyone actively maintaining it?*

Applied to:
- Code — tests, not just working code
- Rules — CI gates, not just documentation
- Integrations — stable identifiers (IDs, not names), not fragile references
- Completion criteria — automated checks, not snapshot sign-offs

## Evolving by Instinct

### Challenge until conviction

We challenge before we commit — not after. The work of challenge ends at conviction: short and long term. What follows is execution.

---

# Architecture

## Lean by Design

### Trace the flow before building

Before implementing, trace the expected data flow. The flow identifies the sub-components, establishes their boundaries, and — once validated by thought or test — becomes the processing strategy. Each step in the flow is a candidate for a replaceable component. Specifics fill the steps; the flow is the framework.

Apply the same question recursively: once the strategy is visible, ask whether the strategy itself can be made replaceable. Each level of abstraction reached is another level of freedom gained.

## Sovereign by Design

### No vendor lock-in

Every proprietary dependency must have a feasible open-source substitute. Never reach a state
where replacing a vendor requires rewriting the system. Evaluate lock-in risk before adopting
any new service or tool.

### Prefer reversible decisions

When making architectural or design decisions, prefer the reversible option unless the irreversible one is clearly justified. The cost of reversibility is paid once upfront; the cost of irreversibility compounds silently until it becomes a rewrite.

## Uniform by Design

### Domain ownership means building the shared component

Every concern has one owner. That owner is responsible for ensuring the framework component
that implements their concern exists and is used across all projects — defining what correct
looks like, driving it into existence, and remaining accountable when it fails. They may
delegate the build; they may not delegate the outcome. The security team owns authentication;
operators own the log contract.

## Evolving by Instinct

### Build once for many

When you encounter a problem, ask whether others will face it too. The ideal is to see structural recurrence at first encounter — before others feel the same pain. When that foresight isn't there, experience is the teacher: pain felt is a signal to act so others don't feel it again.

## Secure by Design

### Security is baseline

Authentication, authorisation, encryption at rest, and mTLS are non-negotiable baselines —
not features to be added later. They are never implemented per-repo; they belong in framework
packages or the service mesh. A system is not production-ready without them regardless of
how complete the functional implementation is.

---

# Engineering

## Resilient by Design

### Stateless by default

Services own no local state. All persistent state lives in an external, scalable store.
A service instance that restarts or is replaced must behave identically to the one it replaced.