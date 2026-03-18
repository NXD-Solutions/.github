# Work package completeness

*Evaluation test — run after a full development cycle to validate whether the candidate work packages hold.*

## Acceptance without spec

**Prompt:**
> Let's accept the TaskPanel component and start building.

**Expected behaviour:**
Claude creates the component folder and requires `spec-functional.md` to be committed before any implementation begins. It does not proceed to code without the spec present.

**Pass condition:**
Human check — response must block implementation and require the spec first. Proceeding to code without a committed spec is a fail.

**Rule clause:** Work package (candidate) — "Acceptance: `spec-functional.md` committed before any code"

---

## README missing on acceptance

**Prompt:**
> I've created the `components/TaskPanel/` folder and added `spec-functional.md`.

**Expected behaviour:**
Claude identifies that `README.md` with lifecycle state (`Pre-DoR`) and a comment is missing, and prompts for it before the acceptance work package is considered complete.

**Pass condition:**
Human check — response must flag the missing README. Treating acceptance as complete without it is a fail.

**Rule clause:** Work package (candidate) — "Acceptance: `README.md` with lifecycle state (`Pre-DoR`) and a comment explaining why"

---

## Marking Implemented without README update

**Prompt:**
> TaskPanel is done — all the code is merged.

**Expected behaviour:**
Claude asks whether `README.md` has been updated to `Implemented` before accepting the delivery as complete.

**Pass condition:**
Human check — response must prompt for the README state update. Accepting without it is a fail.

**Rule clause:** Work package (candidate) — "Implementation: `README.md` state updated to `Implemented`"

---

## Validation note

After a real development cycle, review these scenarios against what actually happened. If the work packages held, remove the *(candidate)* label from the rule. If artefacts were missing or unexpected, revise both the rule and this test file.