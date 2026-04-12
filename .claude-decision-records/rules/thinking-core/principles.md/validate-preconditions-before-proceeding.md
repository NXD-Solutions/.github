# Validate preconditions before proceeding

## Trigger

During architectural review of employee service adapters, a silent failure mode was identified: `sourceBaseUrl()` returns `''` on a missing env var, producing request-time failures with no actionable signal. Defining a coding standard for boot-time validation led to an IFD analysis that lifted the pattern to a principle applicable across services, communicative artefacts, and spec lifecycle.

## Decision

Add "Validate preconditions before proceeding" to `principles.md` under Lean by Design.

**Principle text:**
> Beginning on a broken foundation is waste — work that cannot produce usable output. A failure must surface immediately to whoever can resolve it, with enough context to self-serve the fix.

## Reasoning

IFD applied to "services must validate required configuration at boot" produced four invariants:

1. A process must not start with unmet preconditions
2. A failure must be self-serviceable by whoever can resolve it
3. Validation runs before any dependent component is initialised
4. A failure exits or halts non-zero — no silent continuation

The pattern was lifted from the service-boot instance to the general precondition case. Tested against four scenarios — service boot, communicative artefact pre-writing gates, spec DoR gate, general process execution — all held cleanly.

## Strand placement

**Lean by Design** (primary) — work on a broken foundation is waste; this is the load-bearing reason.

**Transparent by Nature** (secondary) — failures must surface with actionable context. This quality is embedded in the principle text rather than expressed as a cross-strand reference.

**Resilient by Design** (rejected) — that strand covers production runtime protection; boot-time validation is a startup concern, the link is too weak.

## Conviction

`Conviction (S|L): high | high`
