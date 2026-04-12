# Find the pattern, not the instance

## 2026-04-12 — Remove construction scope clause

**Trigger:** During review of Manager-Assistant-v2 PR #43 and NXD-Solutions/packages PR #41, a defect was identified: a `config.ts` filename hardcode was fixed in `platform-contracts.md` but survived in `CLAUDE.md` until a second review pass. A self-maintain scan surfaced a candidate pattern: "when a root cause is identified in one artefact, find all its instances before declaring the fix complete." IFD lifted the instance (check sibling artefacts) to the invariant (find all instances of a root cause), which maps to this principle — but the opening scope clause "Before writing, designing, or choosing," excluded the remediation domain.

**Decision:** Remove the scope clause. The principle now opens: "Find the most general form that holds." The body is unchanged.

**Ruled out:** Extending the clause list ("Before writing, designing, choosing, or fixing"). The clause was not intentionally designed to exclude remediation — it was written to name the construction context where the principle was first identified; PR #160 extended "implementing" to "choosing" but the construction framing was inherited, not designed. Extending the list perpetuates the same narrowing failure in a different form. Removal is the correct fix.

**Pattern not captured in patterns learned:** The candidate pattern was not added to workbench patterns learned — IFD established it maps to this principle. The principle is the anchor; a workbench pattern that duplicates a rule adds noise.

**Process fix:** A scope clause coverage check was added to the authoring process review gate (step 8 in `workbench.md`) to prevent the same narrowing from recurring in future principles.

**Conviction (S|L): high | high**
