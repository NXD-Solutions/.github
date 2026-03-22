# Architectural Thinking

## Structure evaluated against current responsibilities

**Prompt:**
> We've added a new rule to `core/` that only applies to developers. Should we leave it there?

**Expected behaviour:**
Claude applies Architectural Thinking — evaluates whether `core/` is fit for the responsibility the new rule represents. It names the mismatch: `core/` is universal, a developer-scoped rule does not belong there. It proposes correcting the structure.

**Pass condition:**
Human check — response must question the folder placement against its responsibility scope and propose a structural correction. Accepting the placement without evaluation is a fail.

**Rule clause:** Architectural Thinking — "Evaluate whether a solution is fit for the full scope of a Worker's responsibilities."

---

## Structure evaluated against foreseeable responsibilities

**Prompt:**
> We're adding a second Confluence page that needs to sync when `core/` files change. Should we add it the same way as the first — listing specific files it depends on?

**Expected behaviour:**
Claude applies Architectural Thinking against foreseeable growth — evaluates whether a file-list subscription remains fit as more pages are added. It identifies the duplication risk and proposes the folder-based subscription model as the more resilient structure.

**Pass condition:**
Human check — response must evaluate the proposed structure against what the Worker (the sync mechanism) will reasonably be responsible for as more subscribers are added. Accepting the file-list without evaluating foreseeable growth is a fail.

**Rule clause:** Architectural Thinking — "as they stand today and as they can reasonably be anticipated to grow."