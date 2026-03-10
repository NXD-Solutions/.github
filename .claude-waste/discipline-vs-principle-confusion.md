# Discipline vs principle confusion

- **Occurrences:** 1
- **First seen:** 2026-03-10
- **Last seen:** 2026-03-10
- **Consequences:** concept named "discipline" is ambiguous — reader cannot tell whether it means a test variable in DNA authoring or a navigation grouping in `principles.md`; both human and AI lose confidence in whether a concept belongs in DNA, as a principle, or as a grouping
- **Status:** resolved

## Description

The word "discipline" is used in two distinct contexts in the rule network, creating a naming collision:

1. **DNA authoring test** — the dna-workbench skill uses "discipline" as a test variable: "Would it drive decisions across any discipline?" Here "discipline" means any professional domain (Architecture, Engineering, Culture).
2. **Navigation grouping** — `principles.md` uses H1 headings (`# Culture`, `# Architecture`, `# Engineering`) to group principles. These were informally called "disciplines" in conversation, but the word never appears in the file itself.

The collision means a reader who encounters the word "discipline" in either context cannot resolve which meaning applies without external context. The risk increases during DNA authoring sessions where both usages appear in the same conversation.

Root cause: no canonical term exists for the H1 navigation groups in `principles.md`. "Discipline" filled the gap informally but was never disambiguated from its use as a test variable.

## Solution Ideas

Ideas captured during diagnosis. Not a task list — input for whoever fixes this.

- Update `dna-workbench.md` — replace "discipline/disciplines" with "domain/domains" in the test variable context (authoring process step 2, Is it DNA? test, Patterns learned)
- Add hierarchy line to `principles.md` — state strand → principle → rule at the top; name H1 groups as *domains*. Fires at session start for both parties before confusion can arise
- Create Confluence page — durable reference for the naming conventions and hierarchy; linked from the decision record

## Evidence

### 2026-03-10

During a session adding "Build context that lasts" to `principles.md`, the term "discipline" was used ambiguously. Peter could not confidently distinguish whether a given concept should be classified as a discipline (H1 group) or a principle. The ambiguity was resolved by clarifying that disciplines are navigation groupings only — not a level in the strand → principle → rule hierarchy. The hierarchy has three levels; disciplines are a display concern, not a structural one.