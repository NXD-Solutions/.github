# Trace the flow to find the invariants

**Date:** 2026-03-19

**Status:** Accepted

**Conviction (S|L):** high | high

**What triggered it:** Continuation of the Socratic inquiry (SM: Generalising) that
produced the Pattern-seeking by Instinct strand. After locking the strand and its
Culture principle, the inquiry tested whether the strand was operationally usable for
architecture. It was not — "find the most general form" doesn't tell a practitioner
how to act when designing a system. The dataflow discipline was identified as the
architectural operationalisation of pattern-seeking.

**What was decided:**

New principle added to `principles.md` under `# Architecture / Pattern-seeking by
Instinct`: *Trace the flow to find the invariants* — before designing, trace the data
flow; identify nodes that hold regardless of substitution (invariants); decompose until
each node can be independently specified; stop when the level is adaptable.

Replaces: *Trace the flow before building* (previously under Architecture / Lean by
Design).

Two new glossary entries: *Invariant* and *Perspective*.

**Why this replaces "Trace the flow before building":**

The original principle named the act (trace the flow) but not what you're looking for
or when to stop. The new principle is operational: it names invariants as the target,
independently-specifiable as the stopping criterion, and the fractal nature as the
scope. The original was an entry point; this is the discipline.

**Why Pattern-seeking, not Lean:**

Tracing the flow to find invariants is pattern-seeking behaviour — finding the
general form before committing to specifics. It is not waste-elimination. The original
placement under Lean was a misattribution.

**Why invariant, not just primitive:**

A primitive is the smallest form that holds. An invariant has an additional property:
its behaviour holds even when the underlying is substituted. In the dataflow context,
this distinction matters — you're not just finding the smallest node, you're finding
the node that survives substitution of whatever implements it.

**Why perspective:**

Invariants are level-relative — what's invariant at the system level is variable at
the service level. "Perspective" names the lens that fixes the level and defines what
counts as a unit. Without it, "find the invariants" is ambiguous across levels.

**Why the boundary clause:**

The discipline is not always warranted. Where the solution is self-evident or the
problem is simple, tracing invariants is overkill. The trigger is judgment — applied
when complexity or unknowns make building without invariants a rework risk. The
boundary clause prevents the principle from mandating the discipline for every decision.

**What remains unresolved:**

The formal trigger condition — when to apply this discipline vs a simpler approach —
is intentionally left as judgment. A precise trigger was not achievable at conviction.

**Related:** `pattern-seeking-by-instinct.md`, `principles.md`, `glossary.md`