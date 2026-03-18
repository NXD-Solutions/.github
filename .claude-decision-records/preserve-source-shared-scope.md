# Preserve the source that enables recreation / Shared scope, shared lifecycle

**Date:** 2026-03-18

**Status:** Accepted

**Conviction (S|L):** high | high

**What triggered it:** A real-world need — an interview was conducted, an article was produced from it, and a new template arrived. Recreating the article required the raw conversation, not the finished output. The finished output was a dead end without its source.

**What was decided:**

Two independent principles added to `principles.md` under Culture:

1. **Preserve the source that enables recreation** — *Resilient by Design*. Every derived artefact must retain the source material it was produced from. If the source is lost, the derivation becomes a dead end — it can't be challenged, recreated, or improved when context changes.

2. **Shared scope, shared lifecycle** — *Lean by Design*. Artefacts that belong together live together. Delete the scope, nothing is orphaned, nothing is left behind.

**Why two principles, not one:** Each stands alone. Preservation without co-location is valid (source kept in a different system, linked). Co-location without preservation intent is valid (tidy filing without an obligation to keep sources). They reinforce each other when applied together but neither requires the other.

**Why these strands:**

- *Preserve the source* → Resilient by Design: recreation without human memory or intervention. The trigger was recreation, not understanding — if understanding had been prime, it would have been Transparent by Nature.
- *Shared scope* → Lean by Design: when the scope is deleted, nothing lingers. Eliminates orphaned artefacts — waste that costs without return.

**Why Culture, not Architecture:** Both principles apply across all domains — documentation, specs, code, decisions. Principles that govern behaviour across all domains belong in Culture.

**Derivation chain insight:** The Socratic process surfaced a chain: raw conversation → spec document → code. Each link is a derivation with a testable relationship to its source. The spec can be tested against the conversation; the code against the spec. The chain must be traversable end-to-end.

**Related:** `principles.md`, `.claude/hierarchy.md`