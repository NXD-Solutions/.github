## IFD entry form — intent and composition, not procedure

**Date:** 2026-04-09
**Authors:** Peter Sixhøj & Claude Sonnet 4.6
**Concern:** The IFD glossary entry was misformed — it carried procedural steps, termination states, and a meta-instruction to evolve the method. A glossary entry defines what something is; the original entry described how to execute a process. It was a maintenance liability and misrepresented IFD to a first reader by leading with procedure rather than intent.
**Decision:** Rewrite the IFD entry to carry only intent and named composition. The entry names what IFD is (a thinking discipline for finding the abstraction level at which a problem compresses), what it operates through (four named principles), and what terms it depends on (See: Primitive, Invariant, Perspective). Procedural steps removed — promoted to principles.md. Termination states deferred to an IFD workbench skill when one exists; reasoning preserved in `invariant-first-design-ifd.md`.

**Related:** enables — ifd-principles.md (principles promoted from this entry); resolved tension — invariant-first-design-ifd.md (termination states deferred from this entry); parent — load-bearing-terms.md (See: convention applied here for the first time)
**Alternatives considered:** Retaining the method description with inline references to the promoted principles — rejected because it recreates the maintenance liability (entry must change whenever a constituent principle changes) and misrepresents the glossary's purpose.
**Trigger:** IFD restructuring session; PR #296 promoted four constituent principles; rewrite is the precondition for that promotion to be coherent
**Conviction:** high | high
**Value:** correctness (glossary entry matches its purpose — definition, not procedure), waste eliminated (maintenance liability removed), context preservation (termination states preserved in DR; See: convention established for the network)
**Outcome:**
