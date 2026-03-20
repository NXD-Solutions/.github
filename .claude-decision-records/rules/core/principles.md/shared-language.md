pr# Shared language and glossary

**Date:** 2026-03-18

**Status:** Accepted

**Conviction (S|L):** high | high

**What triggered it:** Authoring "Preserve the source that enables recreation" and "Shared scope, shared lifecycle" surfaced the need for "unit of work" as a shared term. Multiple rules implicitly depend on this concept but none defined it. The Socratic process revealed that a unit of work needs both a definition (glossary term) and a declaration mechanism (work package).

**What was decided:**

1. **Shared language** principle added to `principles.md` under Culture → Transparent by Nature. Terms that carry specific meaning must be defined once and used consistently across all internal NXD work products.

2. **`glossary.md`** created as the home for defined terms. Scoped to the rule network — not a corporate-wide glossary. Definitions only; rationale lives in decision records.

3. Two initial terms defined:
   - **Unit of work** — a change and everything required for it to be understood, verified, and used by its consumer, delivered as one. Has inherent (self-evident) and declared (work package) components.
   - **Work package** — the declared list of artefacts that constitute a complete unit of work for a specific scope.

4. **Work package section** added to the DNA Workbench skill, declaring the artefacts that must travel together for any workbench-managed change.

**Why a glossary, not inline definitions:** The glossary compresses the rule network. If three rules explain the same concept differently, extracting the definition to the glossary removes the redundancy. One definition, many references.

**Why the obligation is bounded to internal work products:** The glossary obligation applies to all internal NXD work products — DNA, principles, rules, specifications, decision records, skills, and internal documentation. External-facing content (customer documentation, public-audience material) is excluded: the audience may not share NXD's vocabulary, and audience comprehension takes precedence over glossary consistency. Corporate-wide terms and external terms belong in a different artefact.

**Related:** `principles.md`, `glossary.md`, `.claude/commands/dna-workbench.local.md`

---

## Revision — Scope boundary (2026-03-20)

**Status:** Accepted

**Conviction (S|L):** high | high

**What triggered it:** Invariant analysis of the principle identified "across the DNA, principles, and rules" as an instance masquerading as the invariant. The phrase caused first-time readers to conclude the principle applies only to DNA maintenance. A follow-up challenge surfaced that the correct boundary is internal vs external — not rule network vs everything else.

**What was decided:**

- Scoping phrase "across the DNA, principles, and rules" removed from the principle text. The invariant is "terms that carry specific meaning" — where those terms appear is not the principle's job to enumerate.
- Scope boundary corrected: the obligation applies to all internal NXD work products (DNA, principles, rules, specifications, decision records, skills, internal documentation). External-facing content is excluded — the audience may not share NXD vocabulary, and audience comprehension takes precedence.

**Why the obligation does not extend to external-facing content:**

Specifications, decision records, and skills are internal — their readers are NXD practitioners who share the vocabulary. Customer documentation and public-audience material are written for readers who may not know NXD's defined terms. Imposing the glossary obligation there would harm clarity rather than improve it.

---

## Revision — Active use (2026-03-20)

**Status:** Accepted

**Conviction (S|L):** high | high

**What triggered it:** DNA test against the original principle. S4 (stable under substitution) surfaced that "define terms" is a practice — what doesn't change is the outcome: a shared vocabulary actively used. The wording described the act (define), not the invariant (shared, active use). A glossary that is defined but never referenced is decoration.

**What was decided:**

Principle reworded from passive definition to active use:

- Old: "Define terms that carry specific meaning across the DNA, principles, and rules. A term defined once and used consistently removes ambiguity..."
- New: "Build and actively use a shared glossary. Terms that carry specific meaning across the DNA, principles, and rules are defined once and used as working vocabulary — not reference material. A term left undefined is interpreted differently by every reader. A term defined but not actively used is decoration."

**Why the wording changed:**

"Define" describes the act. The invariant is that terms are shared and actively used — if you change the tool (drop the glossary file, embed terms inline), "define terms" breaks but "build and actively use a shared vocabulary" still holds. The revision names the invariant.

"Working vocabulary — not reference material" names the failure mode the original wording permitted: a glossary that exists but sits unread is technically compliant with "define terms" but defeats the purpose.

"A term defined but not actively used is decoration" provides a test — if a term can be removed from the glossary without anyone noticing, it has not been made shared vocabulary.

**What did not change:**

The glossary artefact itself and the definitions within it are unchanged. The scope of the obligation (then: rule network) was later revised — see revision below.