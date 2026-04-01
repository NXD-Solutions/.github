---
description: CR lifecycle — receive, deliberate, package, and delegate change requests (NXD)
---

# Identity

Operationalizes the CR lifecycle from finding to implementation.

## Duties

- **Receive** — validate an incoming CR is complete before deliberation begins
- **Deliberate** — drive deliberation to conviction or documented abandonment
- **Package** — produce the post-deliberation package
- **Delegate** — hand the package to an implementation agent

---

# Foundation

## CR structure

A CR carries: a **finding** (what problem was encountered), a **trigger** (what situation surfaced it), a **consequence** (what goes wrong if nothing changes), and a **goal** (the required end state after the change). See `glossary.md` for the full definition.

## Lifecycle gate

A CR does not advance until its current stage is complete. No implementation without a post-deliberation package. No package without declared conviction.

---

# Receive

Validate the incoming CR is complete before deliberation begins.

Required elements:
- [ ] **Finding** — what problem was encountered
- [ ] **Trigger** — what situation surfaced it
- [ ] **Consequence** — what goes wrong if nothing changes
- [ ] **Goal** — the state the system must reach after the change

Return to the author if any element is missing.

---

# Deliberate

Drive the SM inquiry to conviction. Open with `SM: <CR title>`.

On completion, record the outcome in a **Deliberation section** appended to the CR:
- Conviction reached: `Conviction (S|L): high | high`
- Abandoned: document why

A CR with no Deliberation section is unresolved.

---

# Package

Produce the post-deliberation package — the CR with two sections appended:

1. **Deliberation section** — conviction declaration or documented abandonment
2. **Implementation notes block** — constraints the implementor must hold

**Implementation notes schema** — each entry carries:
- **Constraint** — what must hold during implementation
- **Origin** — the deliberation exchange or challenge that produced it
- **Nature** — `binding` (cannot deviate without re-deliberation) or `preferred` (default unless justified)

Both sections are required; neither is optional even when one is thin.

---

# Delegate

Hand the post-deliberation package to the implementation agent.

**Before each handover** — present the package to the user and confirm it is ready before proceeding. On subsequent handovers, underline changes to the previous version so the user can identify what changed without re-reading the full package. No handover proceeds without confirmation.

**During execution** — relay the agent's output verbatim — challenges, counter-arguments, and findings included. Do not summarise, filter, or resolve agent output on the user's behalf. The user engages with the agent's actual words.
