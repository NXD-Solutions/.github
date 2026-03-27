# A misfit is a signal — redesign the container or create one

**Principle:** A misfit is a signal — redesign the container or create one
**Strand:** Pattern-seeking by Instinct
**Domain:** Culture
**Date:** 2026-03-28

---

## Trigger

During a workbench session, the principle "if nothing feels like home — create one" was used to justify creating `constitution.md` as a new structural category. The user observed this was incomplete: sometimes the home exists but is wrong, and should be redesigned rather than bypassed. The fuller form: "if it does not feel like home — redesign it or create one."

The user then challenged whether this was workbench-specific. Counterexample: a C++ method placed in the wrong class. The insight holds universally — code, rules, architecture, documentation. This surfaced it as a candidate principle.

## What was decided

Add the principle *A misfit is a signal — redesign the container or create one* under Pattern-seeking by Instinct (Culture).

One sentence. The dash separates the diagnosis (mismatch is not noise — it is information) from the two valid responses (fix the container or create a new one). Forcing the element into a wrong container is the failure mode the principle stops.

## Why

Mismatch is a signal that the right primitive hasn't been found yet. The correct response is always to address the container — not to force the element. This is the response protocol that "Find the pattern, not the instance" and "What holds for one holds for many" imply but do not state.

Without it: mismatch gets worked around by forcing elements into wrong homes. The wrong home accumulates noise, the right home never gets built, and the pattern stays hidden.

With it: every misfit becomes diagnostic. The question shifts from "where can I put this?" to "what does this mismatch reveal about the structure?"

## Test results

S1–S4: pass. Pair tests against What holds for one holds for many, Find the pattern, Scope fitness: pass. No findings.

## Conviction

Conviction (S|L): high | high — both parties, 2026-03-28.