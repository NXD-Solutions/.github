# Principles — NXD

NXD-specific principles derived from DNA strands. Apply where the strand is clear but the implementation is constrained by NXD technology choices, platform decisions, or engineering standards.

---

# Architecture

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
