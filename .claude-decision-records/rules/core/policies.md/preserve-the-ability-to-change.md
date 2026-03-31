# Decision Record — Policies tier and Preserve the ability to change

**Items:** New file `policies.md`; new tier in hierarchy; first policy entry  
**Date:** 2026-03-31  
**Conviction:** high | high

---

## Trigger

Authoring "Start lean, don't close the door" could not find a clean home. The instinct derives from Lean by Design (values) but enforces a Sovereign invariant (necessity). The hierarchy forced a single strand parent, making the other dimension invisible. The friction recurred across authoring sessions — a pattern signalling a missing structural element.

## What was considered and rejected

**policies.md as a hierarchy tier (second root)** — rejected. Two roots breaks the tree; turns the hierarchy into a graph; adds authoring overhead (strand parent? policy parent? both?) without proportional value.

**DR footnotes for cross-strand influences** — rejected. Depends on author memory. The forcing function of Sovereign (strand status) works precisely because it is mandatory invocation. A DR footnote is optional invocation — same failure mode.

**Glossary entries for architectural invariants** — rejected. Glossary entries define meaning; they carry no obligation weight. A principle enforcing an architectural invariant without naming it would not be a detectable coverage gap.

## Decision

Introduce `policies.md` as a **reference layer**, not a hierarchy tier:

- Policies are architectural invariants that drive decisions from necessity — parallel authority to DNA strands, from a different source (necessity vs values)
- Strands and policies are not in a derivation relationship; they are peers governing the same decision from orthogonal directions
- A policy may be strand-expressed, externally mandated, or strategically decided; source is documented per entry, not required as a parent
- Principles that enforce a policy name it with `Enforces: <policy name>` in their text — semi-formal (authoring checklist + test file); upgradeable to CI
- The hierarchy tree is preserved: policies are listed in a `# Policies` section for discoverability, with enforcing principles noted

## First policy: Preserve the ability to change

*Vendor, partner, and technology substitution must always be possible without a system rewrite.*

Source: Sovereign by Design (strand-expressed). The Sovereign strand names the value; this policy names the architectural obligation that follows from it.

Enforcing principles at time of authoring: No vendor lock-in; Prefer reversible decisions.

## Why "Policy" is distinct from a glossary term

Obligation weight. A principle that enforces a policy without naming it is a coverage gap — detectable and correctable. A glossary term left unnamed in a principle is not a gap; it is just imprecise language. The distinction is enforceability, not content type.

## Why a policy may have no strand parent

Strands are identity; policies are necessity. An externally mandated invariant (legal, market survival) does not derive from who NXD is — it derives from the environment NXD operates in. Requiring a strand parent would exclude the most important class of policies: those imposed from outside.
