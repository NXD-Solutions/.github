# Impact precedes action

**Date:** 2026-03-18
**Authors:** Peter Sixhøj & claude-sonnet-4-6

**Concern:** During the rules subfolder reorganisation, two sets of affected artefacts were missed before execution started: (1) a pre-existing rename (`git-workflow.md` → `github-workflow.md`) not propagated to commands that referenced it; (2) structural mirrors (`.claude-decision-records/`, `.claude-test/`) not identified as part of the same unit of work. Both were discovered mid-execution — after changes were already partially applied. Without a principle naming the obligation to identify all dependents before starting, the same gap recurs.

**Decision:** Principle added under *Lean by Design* (Culture): before the first change is made, the full set of affected artefacts must be known. Three categories: structural mirrors (files that duplicate the same structure elsewhere), content references (files that name or link to the changed artefact), and semantic dependents (tests, documentation, examples that assert the artefact's behaviour). All are part of the same unit of work. Incomplete scope discovered mid-execution is waste.

**Related:** Lean by Design (parent), Shared scope, shared lifecycle (complementary — artefacts that belong together live together; this principle names the obligation to identify them before starting), Unit of work (glossary — the principle operationalises what constitutes a complete unit of work)

**Trigger:** Rules subfolder reorganisation session — two mid-execution discoveries named the gap and prompted the principle.

**Alternatives considered:** "When renaming a rule file, check commands" — rejected, too specific; misses semantic dependents and only fires on rename. Adding to Rework mode only — rejected, the obligation applies to all execution contexts. "Impact analysis" as a process step — the name "Impact precedes action" chosen to signal prerequisite, not optional step.

**Conviction (S|L):** high | high

**Value:**
- *Waste eliminated* — incomplete scope discovered mid-execution is the source of rework; naming it up front prevents it
- *Correctness* — the unit of work is complete at commit time, not at "I think that's all" time
- *Consumer benefit* — AI has an explicit trigger: before the first file is touched, name all three categories of dependents
- *Cognitive focus* — explicit scope commitment makes later additions visible as scope creep, not undiscovered work