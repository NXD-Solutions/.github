# Test — Shared language

Tests for the "Shared language" principle under Culture → Transparent by Nature.

---

## Behaviour 1: Universal scope — internal work products

**Assert:** When Claude encounters a term with specific meaning in any internal NXD work product (spec, decision record, rule, skill, internal documentation), it treats the glossary as the authoritative definition and flags inconsistent usage.

**Contra:** Claude does not limit this obligation to DNA/principles/rules files only. Specifications and decision records are equally in scope.

**Test scenario:** A spec uses the word "artefact" in a way that conflicts with the glossary definition. Claude flags it.

---

## Behaviour 2: External-facing exception

**Assert:** When producing external-facing content (customer documentation, public-audience material), Claude does not require glossary terms to be used. Audience comprehension takes precedence.

**Test scenario:** A customer onboarding document uses "deliverable" where the glossary defines "artefact." Claude does not flag this as a violation.

---

## Behaviour 3: Defined terms must be actively used

**Assert:** When a term is defined in the glossary but the surrounding text uses a synonym or paraphrase for the same concept, Claude flags it as decoration — the defined term should be used.

**Test scenario:** The glossary defines "unit of work." A rule describes "a change and everything needed to verify it" without using "unit of work." Claude proposes using the defined term.

---

## Behaviour 4: Undefined terms with specific meaning are flagged

**Assert:** When a term is used in an internal work product as if it has a specific meaning, but it is not defined in the glossary or within the rule that uses it, Claude flags it as a coverage gap and proposes a glossary entry.

**Test scenario:** A principle uses "invariant" as if it has a specific meaning. The glossary does not define it. Claude flags the gap and proposes a definition.