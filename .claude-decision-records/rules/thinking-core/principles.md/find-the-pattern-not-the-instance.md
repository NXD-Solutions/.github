# Find the pattern, not the instance

## 2026-04-12 — Remove construction scope clause

**Trigger:** Self-maintain scan surfaced a candidate pattern for the remediation domain: "when a root cause is identified in one artefact, find all its instances before declaring the fix complete." IFD analysis confirmed it maps to this principle — but the opening scope clause "Before writing, designing, or choosing," excluded remediation from the principle's application domain.

**Decision:** Remove the scope clause. The principle now opens: "Find the most general form that holds." The body is unchanged.

**Ruled out:** Extending the clause list ("Before writing, designing, choosing, or fixing"). The clause was not intentionally designed to exclude remediation — it was written to name the construction context where the principle was first identified. Extending the list would perpetuate the same narrowing failure in a different form. Removal is the correct fix.

**Process fix:** A scope clause coverage check was added to the authoring process review gate (step 8 in `workbench.md`) to prevent the same narrowing from recurring in future principles.

**Conviction (S|L): high | high**
