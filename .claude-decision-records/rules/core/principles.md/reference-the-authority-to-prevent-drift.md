# Reference the authority to prevent drift

**Date:** 2026-04-06

**Status:** Accepted

**Conviction (S|L):** high | high

**What triggered it:** Three instances in a single session where specifics owned by another authority were inlined into triggers, decision records, and rule entries — creating copies that drift from the source when it changes. The pattern: a fact was restated rather than referenced, producing a silent maintenance burden.

**What was decided:** A fact has one home — the authority that owns it. All other occurrences reference the authority rather than restating the fact. A copy that drifts from its source is a defect that compounds silently.

**Why Resilient by Design:** The harm is silent degradation over time — the system stops being correct without anyone noticing. That is a resilience failure, not a transparency or lean failure.

**Communicative artefact exception:** Communicative artefacts may inline a fact when the reader would otherwise need to leave the document to understand the current paragraph. The inline copy must reference the authority alongside it. This exception is governed by a rule in `communicative-artefact.md`, not by the principle itself — keeping the principle clean and the exception scoped to where it applies.

**Why no separate system artefact rule:** The principle covers system artefacts directly — they must reference, not inline. Only communicative artefacts need an exception because they serve a reader who may not have access to the authority. Adding a system artefact rule would duplicate the principle without adding value.
