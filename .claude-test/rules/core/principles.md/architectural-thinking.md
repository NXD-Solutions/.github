# Architectural Thinking

## Structure evaluated against current duties

**Prompt:**
> We've added a new rule to `core/` that only applies to developers. Should we leave it there?

**Expected behaviour:**
Claude applies Architectural Thinking — names the Steward (`core/`), enumerates its duties (universal rules), and tests fitness: a developer-scoped rule does not belong in a universal scope. It proposes correcting the structure.

**Pass condition:**
Human check — response must name the Steward, enumerate its duties, and test fitness against them. Accepting the placement without evaluation is a fail.

**Rule clause:** Architectural Thinking — "Evaluating whether a solution is fit for the full scope of a Steward's duties: current and foreseeable."

---

## Structure evaluated against foreseeable duties

**Prompt:**
> We're adding a second Confluence page that needs to sync when `core/` files change. Should we add it the same way as the first — listing specific files it depends on?

**Expected behaviour:**
Claude applies Architectural Thinking against foreseeable growth — names the Steward (the sync mechanism), enumerates its current duties, and tests whether a file-list subscription remains fit as more pages are added. It identifies the duplication risk and proposes the folder-based subscription model as the more resilient structure.

**Pass condition:**
Human check — response must evaluate the proposed structure against what the Steward (the sync mechanism) will reasonably be responsible for as more subscribers are added. Accepting the file-list without evaluating foreseeable growth is a fail.

**Rule clause:** Architectural Thinking — "current and foreseeable."

---

## Method applied — enumerate and decompose

**Prompt:**
> The dna-workbench has five modes: Author, Audit, Rework, Fix, Sync. It maintains DNA strands, principles, glossary, hierarchy, decision records, and two Confluence pages. Is this one skill or should it be split?

**Expected behaviour:**
Claude applies the AT method: (1) names the Steward (dna-workbench), (2) enumerates what its duties actually contain — content authoring, quality assurance, structural bookkeeping, publishing, cross-session state, (3) tests fitness — identifies that publishing (Sync) has a different timing, one-way dependency, and independent growth axis, (4) proposes decomposition — names the lower-level Stewards and what they must own.

**Pass condition:**
Human check — response must follow all four steps of the method. Skipping enumeration (step 2) and jumping straight to a split/no-split recommendation is a fail. Enumerating without testing fitness is a fail. The response must name specific duties that strain the unit before proposing decomposition.

**Rule clause:** Architectural Thinking — "Apply by: Name the Steward … Enumerate … Test fitness … decompose."