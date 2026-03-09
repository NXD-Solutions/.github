# Records — framework-standards.md

Decision records for `.claude/rules/framework-standards.md`. One entry per important change — anything that can answer "why did we write it as we did."

---

## Framework by nature — expanded beyond security; monorepo-first

**Date:** 2026-03-09
**Authors:** Peter Sixhøj & claude-sonnet-4-6

**Concern:** The previous rules file referenced a `NXD-Solutions/framework` monorepo that does not yet exist and was explicitly deferred. It treated security as the only framework-by-nature concern, leaving compliance, audit trail, observability, and multi-tenancy unaddressed — each one a candidate for per-repo drift that produces inconsistency or risk.

**Decision:** Framework concerns live in the monorepo under `packages/` until cross-repo sharing is needed. The `NXD-Solutions/framework` repo reference is removed. "Framework by nature" is expanded to a table of concerns — all defined by one test: would independent implementations produce waste, inconsistency, or risk that a single implementation eliminates? Reuse count is secondary for these concerns; the risk is the gate. "Framework by reuse" remains the path for everything else.

**Related:** Secure by Design (parent for security row), Uniform by Design (parent — consistency at the foundation), Domain ownership means building the shared component (enables — the domain owner must ensure one implementation exists)

**Trigger:** Previous file referenced a deferred repo as if it were live. User surfaced this in session: "the current framework standards break our decision."

**Alternatives considered:** Keep security-only framework-by-nature — rejected, compliance (GDPR/NIS2) and audit trail have identical risk profiles; siloing the rule to security implies the others are per-repo decisions, which they are not. Keep the `NXD-Solutions/framework` repo reference — rejected, it does not exist and the monorepo decision is current; referencing a deferred state as present is a correctness violation.

**Conviction:** high | high

**Value:**
- *Correctness* — rules file no longer references infrastructure that does not exist; AI guidance matches the actual repository structure
- *Waste eliminated* — prevents per-repo compliance and audit trail implementations that would later require consolidation; one rule eliminates the decision surface for each concern named in the table
- *Consumer benefit* — AI can now flag compliance and observability drift in the same way it flags security drift, with the same authority
- *Cognitive focus* — the test ("would independent implementations produce waste, inconsistency, or risk?") is a single question that covers all cases; developers and AI do not need to memorise a list of exceptions
- *Speed* — concerns identified early (before code is written) cost less to address than concerns identified at review or post-production

**Examples:**
```
packages/
  logging/
    logger/       # Structured logging mechanism
    log-schema/   # Log content contract — one schema, all services
  security/
    auth/         # Auth mechanism — one implementation, all repos
```