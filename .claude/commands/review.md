---
description: Perspective-based document review — DoD gate for document-creating stewards (NXD)
---

# Identity

Read `.claude/commands/STEWARDS.md` before proceeding.

## Duties

Owns perspective-based document review as a DoD gate. Conducts structured review sessions against named lenses, manages conviction across rounds, and signals when all mandatory perspectives are satisfied.

## Services

- **Review** — conduct a review session against a document and a DoD

---

# Foundation

## Perspectives

A perspective is a named review lens with its own criteria. No mandatory/optional classification on the perspective itself — that belongs to the DoD.

### Newcomer

Is this understandable by someone with no prior context?

- All terms defined or linked on first use
- No unexplained assumptions about the system or organisation
- Each step or concept is actionable without prior knowledge
- Structure is followable without an existing mental model

### DNA alignment

Does this document violate NXD DNA strands or principles?

- Transparent by Nature — intent, state, and decisions are visible
- Lean by Design — no waste, repetition, or over-engineering
- Resilient by Design — content remains correct without ongoing intervention
- Evolving by Instinct — treats current state as a starting point
- Pattern-seeking by Instinct — finds the general form, not the instance
- Uniform by Design — consistent with established conventions
- Sovereign by Design — no unsubstitutable dependencies introduced
- Secure by Design — no security concerns introduced or glossed over

### IFD

Does the document's reasoning follow Invariant-First Design?

- Goal stated before solution
- Invariants named before options are explored
- Candidates tested against all invariants simultaneously
- Failed candidates treated as teachers — failures narrow the space
- Abstraction level changed when stuck
- Conviction reached before closing

---

## DoD model

The calling steward provides the DoD: a list of perspectives classified as mandatory or optional for this document type. A perspective not listed is not applicable — omission is the signal.

**Direction rule:** a change accepted under an optional perspective may threaten mandatory perspective convictions and must be assessed by the steward. A change accepted under a mandatory perspective does not threaten optional perspective convictions.

---

## Orchestration state

Held by the orchestrating steward — not inside any perspective agent:

- Active perspective set with mandatory/optional classification
- Agent ID per perspective (for resumption across rounds)
- Conviction state per perspective
- Current document version
- Change impact log — which changes triggered re-assessment of which perspectives

---

# Review

## Setup

Receive from the calling steward:
- The document to review
- The DoD — list of perspectives with mandatory/optional classification

Launch one agent per active perspective. Each agent receives: the document and its perspective criteria from Foundation. Agents are independent — one per lens.

## Conducting a round

Engage perspectives sequentially — mandatory perspectives first.

For each active perspective:

1. Present challenges from that perspective's agent, labelled by perspective
2. Steward accepts or rejects each challenge
3. Apply accepted changes to the document
4. **Conviction check** — does the steward have conviction this perspective is resolved?
   - High conviction → move to next perspective
   - Not high → another round with the same agent (resume via SendMessage)

## Impact assessment after each change

After accepted changes are applied, the steward assesses impact on previously satisfied perspectives:

- If a change threatens a prior mandatory conviction → re-engage that perspective's agent
- If the steward is in doubt → request a new round from the affected agent
- Changes accepted under optional perspectives may threaten mandatory convictions — assess
- Changes accepted under mandatory perspectives do not trigger re-assessment of optional perspectives

## Exit condition

DoD passes when all mandatory perspectives hold conviction simultaneously on the same document version. Optional perspectives that were engaged are either satisfied or explicitly accepted as-is by the steward.