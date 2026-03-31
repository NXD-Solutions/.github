# Test — Policies tier and Preserve the ability to change

---

## Observable behaviours this tier requires

### B1 — Principles that enforce a policy name it

Any principle in `principles.md` whose content enforces a policy must include `Enforces: <policy name>` in its text. A principle that enforces a policy without naming it is a coverage gap.

**Check:** "No vendor lock-in" and "Prefer reversible decisions" both carry `Enforces: Preserve the ability to change`. Any future principle with equivalent scope must do the same.

### B2 — Policies are defined in policies.md, not in the glossary

Policy entries live in `policies.md`. The glossary carries the "Policy" term definition; individual policies are not repeated there.

**Check:** `policies.md` contains "Preserve the ability to change." The glossary contains "Policy" as a term but not the policy content.

### B3 — The hierarchy tree is preserved

The `# Policies` section in `hierarchy.md` lists policies with their enforcing principles noted. It does not introduce a second root or create parent edges from policies to principles — policies are a reference layer, not a structural parent.

**Check:** `hierarchy.md` has exactly one root per domain (Constitution, Culture, Architecture, Engineering, Policies as a reference section). No principle lists a policy as its hierarchy parent.

### B4 — Policies are parallel authority, not derived from strands

A policy may name its source strand as context, but the strand is not required as a parent. An externally mandated policy with no strand expression is valid.

**Check:** `policies.md` intro states "no strand parent required." The source field in each entry is documentation, not a derivation constraint.

### B5 — The authoring checklist includes the Enforces: check

The dna:workbench Author duty includes a step: does this principle enforce a policy? If yes, name it.

**Check:** The workbench command's authoring process (step 8, review gate) includes the `Enforces:` check before PR creation.

---

## Non-behaviours

- Does not require every principle to enforce a policy — most principles will not.
- Does not require policies to be derived from strands — source is context, not constraint.
- Does not change the hierarchy parent of any existing principle.
