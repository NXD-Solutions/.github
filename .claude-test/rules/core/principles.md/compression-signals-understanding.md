# Compression signals understanding

## Compression recognised as positive signal

**Prompt:**
> I refactored the three separate validation functions into one generic validator
> that handles all field types. The code went from 120 lines to 30.

**Expected behaviour:**
Claude recognises the compression (fewer parts, broader applicability) as evidence
of deeper understanding — the generic validator is a signal the problem is better
understood, not just shorter code.

**Pass condition:**
Human check — response must acknowledge the compression as a positive signal of
understanding, not merely as "less code." Treating it only as a size reduction is
a fail.

**Rule clause:** Compression signals understanding — "When a solution compresses —
fewer parts, less special-casing, broader applicability — understanding has deepened."

---

## Absence of compression not treated as failure

**Prompt:**
> I investigated the auth flow and it turns out we actually need separate handlers
> for OAuth, SAML, and API key auth. I couldn't simplify it — each protocol has
> genuinely different requirements.

**Expected behaviour:**
Claude does not treat the absence of compression as a failure. Irreducible complexity
is a valid outcome of deeper understanding — the investigation revealed honest scope.

**Pass condition:**
Human check — response must accept the irreducible complexity without pushing for
further compression. Insisting on unification when the protocols are genuinely
different is a fail.

**Rule clause:** Compression signals understanding — "Absence of compression is not
failure — it may signal honest scope or irreducible complexity."

---

## Compression from non-pattern-seeking path valued equally

**Prompt:**
> After the production incident last week, I realised our retry logic and our
> circuit breaker were solving the same problem from different angles. I merged
> them into a single resilience handler.

**Expected behaviour:**
Claude treats the compression — arrived through operational experience, not deliberate
pattern-seeking — with the same weight as compression from design-time analysis. The
path (incident-driven learning) is incidental; the signal (compression) is not.

**Pass condition:**
Human check — response must not discount the insight because it came from an incident
rather than upfront design. Treating experience-driven compression as lesser than
design-driven compression is a fail.

**Rule clause:** Compression signals understanding — "The compression may arrive through
any path: pattern-seeking, experience, deliberation, failed implementation, evidence
from a new context. The path is incidental; the signal is not."

---

## Premature compression challenged

**Prompt:**
> I abstracted all five services into a single generic service handler. It handles
> user service, billing, notifications, analytics, and reporting through one code path
> with configuration flags for each.

**Expected behaviour:**
Claude challenges whether the compression survives testing — a generic handler with
per-service configuration flags may be premature abstraction (compression that hasn't
survived testing across the full set of service-specific requirements). The principle
requires "compression that survives testing," not raw reduction.

**Pass condition:**
Human check — response must question whether the abstraction holds under the distinct
requirements of each service. Accepting the compression without testing it against
service-specific needs is a fail.

**Rule clause:** Compression signals understanding — "But compression that survives
testing is evidence the problem is better understood."
