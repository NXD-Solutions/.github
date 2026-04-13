# Contract surface primitive

**Date:** 2026-04-13
**Status:** Accepted
**Conviction (S|L):** high | high

## Trigger

Architect review of the service architecture's DataDictionary node surfaced
that `@nxd-solutions/data-dictionary` carries no contract artefact — yet
PR #318 (same-day distribution of `platform-contracts.md`) mandated
`CLAUDE.md` only for `packages/` folders. The mandate's primitive was never
stated; location was treated as the trigger. A day-one exception on a
referenced package undermined the rule's credibility.

## Decision

The rule governs *contract surfaces* — folders where consumers form
expectations the producer must uphold. Two instances always qualify:

- **Location** — any folder under `packages/` in any repo
- **Scope** — any folder whose `package.json` has a `name` field matching
  `@nxd-solutions/*`

Instances are stated explicitly so the steward recognises them directly.
The primitive is named so future contract surfaces are recognised without
amending the rule each time.

## Alternatives considered

- **Keep `packages/` and add `@nxd-solutions/*` as a parallel clause.**
  Rejected — enumerates instances without naming the primitive; the next
  contract surface reopens the same discussion.
- **Promotion-candidate trigger — mandate before scope assignment.**
  Out of scope — pre-scope contract thinking is workflow, not structure;
  belongs in `framework-standards.md`, not here.
- **Extend to services, apps, public-API folders.** Deferred — the
  primitive admits broader instances; this record holds scope to
  package-level surfaces. Future CRs add instances without re-deriving.

## Why non-obvious

The shift looks like a scope broadening but is a level change — from
instance (where contract surfaces live today) to primitive (what makes a
folder a contract surface at all). Without this record, a future reader
sees two bullets and treats them as the rule — repeating the original
failure mode.

## Enforces

*Preserve the ability to change* — explicit contract surfaces are a
precondition for consumer substitution.
