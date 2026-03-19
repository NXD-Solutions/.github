# Shared language and glossary

**Date:** 2026-03-18

**Status:** Accepted

**Conviction (S|L):** high | high

**What triggered it:** Authoring "Preserve the source that enables recreation" and "Shared scope, shared lifecycle" surfaced the need for "unit of work" as a shared term. Multiple rules implicitly depend on this concept but none defined it. The Socratic process revealed that a unit of work needs both a definition (glossary term) and a declaration mechanism (work package).

**What was decided:**

1. **Shared language** principle added to `principles.md` under Culture → Transparent by Nature. Terms that carry specific meaning in the DNA, principles, and rules must be defined once and used consistently.

2. **`glossary.md`** created as the home for defined terms. Scoped to the rule network — not a corporate-wide glossary. Definitions only; rationale lives in decision records.

3. Two initial terms defined:
   - **Unit of work** — a change and everything required for it to be understood, verified, and used by its consumer, delivered as one. Has inherent (self-evident) and declared (work package) components.
   - **Work package** — the declared list of artefacts that constitute a complete unit of work for a specific scope.

4. **Work package section** added to the DNA Workbench skill, declaring the artefacts that must travel together for any workbench-managed change.

**Why a glossary, not inline definitions:** The glossary compresses the rule network. If three rules explain the same concept differently, extracting the definition to the glossary removes the redundancy. One definition, many references.

**Why scoped to the rule network:** Corporate-wide terms belong in a different artefact. The glossary serves the DNA, principles, and rules — terms defined here are the ones that appear in strands, principles, and rules where meaning isn't self-evident.

**Related:** `principles.md`, `glossary.md`, `.claude/commands/dna-workbench.local.md`