# Governance

This layer maintains thinking-core. It defines the processes by which the core is changed,
deprecated, annotated, and kept recoverable. It is usable as a standalone add-on alongside
thinking-core/ — no NXD dependency. NXD extends it; governance does not depend on NXD.

## Invariants

1. Every deliberate change is recoverable — who decided, what was ruled out, why it held.
   The record exists independent of memory or tooling.

2. A change must pass an invariant check before it lands — no modification without verifying
   what load-bearing dependencies it touches.

3. Deprecation is explicit, never silent — a term or principle is not retired by omission;
   the retirement is named and dated.

4. The editorial convention lives once — annotations reference a single definition,
   not a copy per file.

5. Process is separable from illustration — no instance of an org, tool, or platform
   is load-bearing in any governance artefact.

## Scope

Members of this folder define processes, not terms. If removal of illustrations reveals
a process, it belongs here. If what remains is only a named thing, it does not.
