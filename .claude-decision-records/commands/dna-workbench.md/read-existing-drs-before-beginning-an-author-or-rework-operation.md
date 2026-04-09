# Read existing DRs before beginning an Author or Rework operation

**Date:** 2026-04-09

**Authors:** Peter Sixhøj & claude-sonnet-4-6

**Concern:** The authoring process triggered DR reading at the review gate (step 8) — after deliberation was complete. Prior DR content was not in scope during Identify, Challenge, or Draft. This created waste: patterns and prior decisions in existing DRs could not inform the session they were most relevant to, requiring extraction afterward.

**Decision:** Add a pre-step to Author mode: before beginning, read any existing DRs for the target file. This places prior context in scope for the full deliberation — not just at the review gate. Rework mode already had this right; Author mode is now consistent with it.

**Related:** Lean by Design (waste prevention), Record decisions to avoid repeating work (parent principle)

**Alternatives considered:** Trigger on "about to write a DR" — rejected. By that point deliberation is complete; reading the DR then is too late to prevent re-deciding settled things or missing patterns that would have shaped the session. The trigger must fire before deliberation begins.

**Conviction:** high | high
