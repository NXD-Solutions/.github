# Test — Start lean, don't close the door

Principle under Culture / Lean by Design.

---

## Observable behaviours this principle requires

### B1 — Minimum viable designs are sized by current need, not future assumptions

When proposing an initial design, the scope is the minimum that serves the current need. Designs that include speculative future requirements not yet confirmed are violations of the lean motion.

**Check:** A design that adds infrastructure "for when we need it later" without a confirmed near-term trigger fails this principle. The lean motion scopes to now.

### B2 — Minimum viable designs do not foreclose what comes next

A minimum viable design that prevents future extension — through local-only coupling, irreversible architectural choices, or mechanisms tied to a single vehicle — violates this principle even if it satisfies B1.

**Check:** Ask of any minimum design: can this be extended, migrated, or replaced if the need changes? If no path exists, the design forecloses what comes next.

### B3 — Both dimensions must be held simultaneously

This principle requires satisfying B1 (lean — don't over-build now) and B2 (open — don't foreclose later) at the same time. A design that satisfies one while violating the other fails.

**Check:** A lean design that forecloses optionality fails B2. A design that preserves optionality through over-engineering fails B1. Both are violations.

### B4 — The principle enforces Preserve the ability to change

The `Enforces: Preserve the ability to change` field is present in the principle text. Any change to this principle must preserve the policy citation.

**Check:** `principles.md` entry for this principle contains `Enforces: *Preserve the ability to change*`.

### B5 — The principle is homed under Lean by Design

Strand parent is Lean by Design. The Sovereign constraint is expressed via `Enforces:`, not via strand parent.

**Check:** `hierarchy.md` lists this principle under Culture → Lean by Design, and as an enforcing principle under Policies → Preserve the ability to change.

---

## Non-behaviours

- Does not require every lean design to have an explicit extension plan — only that no path is foreclosed.
- Does not require predicting what comes next — only that the design does not prevent it.
- Does not govern the size of a mature system — governs the initial minimum.
