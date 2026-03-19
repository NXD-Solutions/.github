# Pattern-seeking by Instinct

**Date:** 2026-03-18, updated 2026-03-19

**Status:** Accepted

**Conviction (S|L):** high | high

**What triggered it:** A Socratic inquiry (SM: Generalising) starting from a fragility
observation in the DNA Workbench skill — the word "four" in "Trigger: any of the four
source files above changes." The inquiry traced from that specific symptom to the
underlying habit of mind: finding the pattern before committing to the instance.

**What was decided:**

New DNA strand added to `dna.md`: *Pattern-seeking by Instinct* — we look for the
pattern before the instance; the primitive that makes a solution compressed, robust,
and generic. A specific that doesn't survive change is a signal the pattern wasn't found.

Derived principle added to `principles.md` under `# Culture`: *Find the pattern, not
the instance* — before writing, designing, or implementing, find the most general form
that holds. Boundary clause: intentional specifics (page IDs, file paths, named owners)
are not failures — they are the primitives of their scope.

New glossary entry: *Primitive* — the smallest meaningful unit at a given level of
abstraction; the form that holds across instances. Compression is the signal it was found.

**Why a new strand, not a principle under Lean or Evolving:**

Lean by Design drives elimination of waste — it tells you *to* remove what costs without
return, but not *what level* to work at. Evolving by Instinct drives improvement over
time — it tells you every solution is a starting point, but doesn't name the habit
of abstraction before building. Pattern-seeking is distinct: it fires *before* the
instance exists — find the general form first. Different time horizon, different habit.

**Why the test case confirmed distinctness:**

Three services with different retry implementations. Lean says: consolidate (remove
duplication). Evolving says: improve from what we've learned. Pattern-seeking says:
find the primitive of retry before building anything. A Lean response can consolidate
to the wrong thing; Pattern-seeking finds the level where the consolidation is correct.

**Why "four" was the right entry point:**

"Four" is fragile because it's a derived fact (a count) stated as an independent truth.
The pattern it violated: iterate the list, don't count it. Applying the pattern makes
"four" impossible to write — you'd naturally reference the list. This closed the inquiry:
fragility is the signal that the pattern wasn't found, not a separate concern.

**Why robust and generic aren't conflated:**

Robust = won't break when details change. Generic = applies across multiple instances.
They're different, but fragility destroys genericity: a statement that breaks when one
instance changes was never generic. They share a root — the right level of abstraction
produces both — but the failure modes are distinct: drift (robustness) vs scope (genericity).

**Why the boundary clause matters:**

Without it, the principle reads as rejecting all specifics. A page ID is a primitive of
its scope — stable, intentional, not fragile. The clause names the distinction: a
specific that breaks when one detail changes is the failure signal; a specific that is
the authoritative reference is correct.

**Alternatives considered:**

- Sub-principle under Lean by Design — rejected: different core value (abstraction vs waste)
- Sub-principle under Evolving by Instinct — rejected: different time horizon (before vs after)
- Rename of "Build once for many" — rejected: that principle asks "will others face this?";
  Pattern-seeking asks "what is the general form?" — different questions

**Update (2026-03-19):**

The inquiry continued to test whether the strand was operationally usable for
architecture. It was not — the Culture principle "Find the pattern, not the instance"
doesn't give a practitioner enough to act architecturally. The Socratic Specification
Collaborator instructions were used as a challenge, surfacing the dataflow discipline
as the architectural operationalisation of the strand.

This produced: a second principle (*Trace the flow to find the invariants*) under
Architecture / Pattern-seeking by Instinct, replacing the misattributed "Trace the
flow before building" from Lean. Two additional glossary entries: *Invariant* (a node
whose behaviour holds under substitution) and *Perspective* (the lens that fixes the
abstraction level). See `trace-the-flow-to-find-the-invariants.md` for the full record.

**Related:** `dna.md`, `principles.md`, `glossary.md`, `hierarchy.md`,
`trace-the-flow-to-find-the-invariants.md`