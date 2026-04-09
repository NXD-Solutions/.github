# Serve the reader's context — not the system's structure

**Principle:** Every communicative artefact serves the reader's context — not the system's structure
**Strand:** Transparent by Nature
**Domain:** Culture (cross-cutting)
**Date:** 2026-03-26

---

## Trigger

The behavioral rule "The page serves the reader's context — not the system's structure" existed only in the Documentation Foundation (Confluence). It met the criteria for promotion to the rule network as a principle: it governs decisions across all communicative artefacts regardless of system, team, or context; it is not derivable from any existing principle; and it adds a dimension to Transparent by Nature that the strand alone cannot reach.

## What was decided

Add the principle *Every communicative artefact serves the reader's context — not the system's structure* under the Transparent by Nature strand in the Culture domain. Add four derived rules to `rules/core/communication.md`. Add "communicative artefact" to the glossary.

The principle body was distilled from the CR: a redundant restatement of the title was removed. The scope note was moved here rather than staying in the principle body.

## Scope of "communicative artefact"

A communicative artefact is any written output whose primary purpose is to convey meaning to a human reader, where the organisation is not overridden by formal structural constraints (e.g. compiler, runtime, or schema requirements). Includes pages, blog posts, ADRs, specifications, PR descriptions, comments, and emails. Excludes code files.

Code files are excluded because compiler and runtime constraints — not reader context — govern their organisation. This is not a judgment about their readability; it is a recognition that the organising force is different.

## Why this placement is correct

Transparent by Nature states: "Intent, state, decisions, and output are visible and understandable to any observer — not just the author." The phrase "not just the author" is the load-bearing clause. The proposed principle operationalises "understandable": to be understandable to the reader, organise around how the reader thinks — not how the author's system is structured. The principle fills the space between the strand's claim and what it actually requires in practice.

No existing principle covers this territory. *Write for the widest audience first* governs ordering (broad to narrow) within a document. The new principle governs the organising input (reader's context vs. system structure) — distinct territory.

## Challenge resolved: "any observer" vs. "specific reader"

The strand says "understandable to any observer." The rule *Define Audience before writing* says "who is the specific reader?" These are compatible, not contradictory:

- "Any observer" sets the minimum bar — do not assume system knowledge that an observer from outside the system would not have.
- "Specific reader" sets the organising input — know who will actually read this artefact so you can organise around their context.

The strand prevents exclusion (don't write only for insiders). The principle drives inclusion (write explicitly for the reader you have). They operate at different levels and in different directions.

## Conviction

Conviction (S|L): high | high — both parties, 2026-03-26.

---

## Add Problem introduction facet

**Date:** 2026-04-09

### What was decided

Add *Problem introduction* as a fourth facet in `communicative-artefact.md`:

> **Problem introduction** — when an artefact presents a process, rule, or reference, establish the problem it solves before presenting the solution — so the reader understands why they are reading before the content begins.

### Why the latent-need qualifier was removed

The CR draft scoped the facet to artefacts "the reader may not yet know they need." Challenge A surfaced that this qualifier restricts the facet to latent-need cases — readers who arrived by discovery. A reader who arrived with intent still benefits from seeing the problem stated before the solution: it confirms they are in the right place and frames the content before it arrives. The value of problem introduction does not depend on the reader's awareness. The qualifier was removed; the condition is now solely that the artefact presents a solution (process, rule, or reference).

### Why "establish before" was chosen over "open with"

The CR draft said "open with the problem." Challenge B identified this as positionally prescriptive: some artefacts require brief framing (audience declaration, scope boundary) before the problem. An artefact that opens with a one-sentence scope statement and then states the problem would be non-compliant under the positional form. The intent is sequencing — the problem precedes the solution — not that the problem is the literal first sentence. "Establish the problem before presenting the solution" captures the sequencing intent without prescribing position.

### Conviction

Conviction (S|L): high | high — both parties, 2026-04-09.