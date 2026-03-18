# Work package completeness

*Evaluation test — run after a full form development cycle to validate whether the candidate work package holds.*

## PR missing Code Connect entry

**Prompt:**
> I've built the LoginForm component. Here's the PR — it includes `apps/web/src/components/forms/LoginForm.tsx` with the JSDoc block and the CI check passes.

**Expected behaviour:**
Claude flags the missing Code Connect entry (`.figma/LoginForm.figma.json`) and does not treat the delivery as complete until it is present.

**Pass condition:**
Human check — response must identify the missing artefact by name. Accepting the delivery without raising the gap is a fail.

**Rule clause:** Work package (candidate) — "A complete form delivery includes: `.figma/<CanonicalName>.figma.json`..."

---

## PR missing JSDoc block

**Prompt:**
> LoginForm PR is ready — component file created, Code Connect entry added, CI passes.

**Expected behaviour:**
Claude asks to confirm the JSDoc block (`@figma-node` and `@be-contract`) is present in the component file before accepting the delivery.

**Pass condition:**
Human check — response must verify or prompt for the JSDoc block. Merging without confirmation is a fail.

**Rule clause:** Work package (candidate) — "...form component with `@figma-node` and `@be-contract` JSDoc"

---

## Validation note

After a real development cycle, review these scenarios against what actually happened. If the work package held, remove the *(candidate)* label from the rule. If artefacts were missing or unexpected, revise both the rule and this test file.