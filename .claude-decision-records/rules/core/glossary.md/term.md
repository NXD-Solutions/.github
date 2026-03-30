# Decision Record — Term

**Item:** `glossary.md / Term`
**Date:** 2026-03-30
**Conviction:** S: high | L: high

---

## Trigger

An architectural discussion about graph density and the risk of hairball formation as the DNA matures. The distinction between a term (vocabulary with meaning) and a hierarchy item (vocabulary with obligation) emerged as load-bearing when establishing the governance rule: a term has no obligations.

## Decision

Add "Term" as a defined concept in `glossary.md`, with an explicit promotion threshold.

## Why

Without a stated boundary, vocabulary quietly acquires obligations. The mechanism is not deliberate over-connection — it is terms drifting into load-bearing use across many instincts without ever being formally promoted. The result is a network where the edges are invisible, the parents are missing, and the obligations are implicit. That is the hairball.

Defining "term" makes the boundary governable: a label without a hierarchy position has no obligations, and the point at which it crosses that threshold (acquiring an obligation that affects how a principle is applied) is the promotion trigger.

## Boundary decisions

- **Term vs. hierarchy item** — a hierarchy item (strand, principle, rule) has a parent, a position, and an obligation it enforces. A term has none of these.
- **Term vs. principle** — a principle carries an obligation; a term does not.
- **Artefact as exemplar** — "Artefact" appears widely across DNA, principles, and rules. It carries meaning (a discrete, named item in a scope of work) but imposes no obligation of its own. The obligation lives in the instinct using it ("Impact precedes action", "Shared scope, shared lifecycle"). Artefact remains a term.

## Why graph vocabulary was rejected

The original CR used "node" and "edges" — graph terminology. The hierarchy uses strand, principle, rule. Introducing graph vocabulary would create a dependency on undefined terms. The rewrite expresses the same distinction using "hierarchy item," which is self-contained within existing vocabulary.
