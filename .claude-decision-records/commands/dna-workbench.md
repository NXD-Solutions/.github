# Records — commands/dna-workbench.md

Decision records for `.claude/commands/dna-workbench.md`. One entry per important change — anything that can answer "why did we write it as we did."

---

## Rename /dna to /dna-workbench

Date: 2026-03-08
Authors: Peter Sixhøj & claude-sonnet-4-6
Concern: /dna signalled subject but not function. With two modes
  (Author and Audit), the name was opaque — a new team member would
  have to invoke it just to discover what it does.
Decision: "dna-workbench" signals a multi-purpose workspace. Also
  establishes a naming pattern for multi-mode skills:
  <domain>-workbench — preventing future proliferation of
  single-purpose commands and ensuring uniformity.

--- optional ---
Related: Transparent by Nature (parent), Uniform by Design (enables)
Alternatives considered: Split into /dna and /dna-audit — rejected,
  too many commands leads to lack of clarity and non-uniformity.
Conviction: high | high
