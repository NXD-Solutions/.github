# Glossary

Terms used in NXD DNA, principles, and rules. If a term carries specific meaning that rules depend on, it belongs here. Definitions only — rationale lives in decision records.

## Editorial policy — load-bearing terms

A term is load-bearing when other definitions depend on it. Its stability is a precondition for the glossary functioning as a network — not a goal to pursue, but a constraint to protect.

Load-bearing terms are annotated below. When a term acquires dependants, apply the annotation at that time. To modify a load-bearing term: search for all uses of the term in this file before renaming or restructuring.

Entries that depend on load-bearing terms carry a `See:` line naming those terms. When adding a new entry that depends on a load-bearing term, add the `See:` line at the end of the entry.

---

## Unit of work

*Load-bearing — other definitions depend on this term. Search for all uses in this file before renaming or restructuring.*

A change and everything — inherent or declared — required for it to be understood, verified, and used by its consumer, delivered as one. An incomplete unit creates rework.

- **Inherent** — what must travel together by nature (e.g. code + tests + migration)
- **Declared** — what must travel together because a rule or work package says so

The direction of travel is from inherent toward declared as the system matures.

## Work package

The declared list of artefacts a unit of work comprises — whether consumed or produced.

---

## Artefact

A discrete, named item that is part of a scope of work — as input, output, or both. Examples: a spec, a component file, a decision record, a migration.

## Charter

A principal's declaration about a bounded entity — what was commissioned, what falls within scope and what does not, and what must hold.

## Principal

*Load-bearing — other definitions depend on this term. Search for all uses in this file before renaming or restructuring.*

Any party with authority over a bounded entity.

## Communicative artefact

Any written output whose primary purpose is to convey meaning to a human reader, where the organisation is not overridden by formal structural constraints (e.g. compiler, runtime, or schema requirements). Includes pages, blog posts, ADRs, specifications, PR descriptions, comments, and emails. Excludes code files.

Production of communicative artefacts is governed by pre-writing gates in `communicative-artefact.md`. General communication rules — sequencing, bridging, evidence — apply to all information delivery and live in `communication.md`.

## Decision record

A written record of a significant decision: what triggered it, what was decided, why, and with what conviction. Stored in `.claude-decision-records/`. The artefact produced by a `Decision:` label. When writing a DR, invoke `/dr`.

## Framework

An authoritative, decided direction for how a problem must be solved. Mandatory where reasonably applicable.

## Rule network

The complete hierarchy of DNA strands, principles, and rules that govern NXD development. Maintained in `.claude/rules/` with `.claude/hierarchy.md` as its map.

## Primitive

*Load-bearing — other definitions depend on this term. Search for all uses in this file before renaming or restructuring.*

The smallest meaningful unit at a given level of abstraction — the form that holds
across instances. Finding the right primitive is the goal of pattern-seeking;
compression is the signal it was found.

## Invariant

*Load-bearing — other definitions depend on this term. Search for all uses in this file before renaming or restructuring.*

What holds regardless of what is substituted beneath it. The primitive of a perspective — stable across all instances.

## Invariant Owner

The authority that defines an invariant's scope and when it applies. May be external (regulatory body, legal requirement) or internal. Non-negotiable — the owner sets the constraint, not the implementer.

## Role

A named lens applied to a unit of work; defines what must be seen and what falls outside scope. Not a job title.

## Steward

Any named unit — person, system, role, or process — that holds duties at a given abstraction level. A microservice, a team, a workbench, and a developer are all Stewards; what distinguishes them is the abstraction level at which their duties are defined.

A Steward's duties are assigned, not self-declared. Four obligations follow from holding duties: **protect assigned scope**, **implement within scope**, **route gaps to their owner**, **evaluate fitness**.

Fitness dimensions — what "evaluate fitness" evaluates against:

- **Scope** — correctly assigned and cleanly held?
- **Received tasks** — appropriate for this Steward?
- **Implementation** — output meets conviction?
- **Processes** — methods serving or hindering?
- **Captured knowledge** — insights survive beyond the session?
- **Scope integration** — boundaries meet adjacent Stewards?

## Invariant-first design (IFD)

A thinking discipline for finding the abstraction level at which a problem compresses — where the solution holds across instances, not just the current one.

Operates through four principles acting in concert: Invariants before options, Test simultaneously, Invariants are not choices, and Failed candidates are teachers. The individual principles exist independently; IFD names the practice of applying them together toward a single goal.

See: Primitive, Invariant, Perspective.

## Change Request

A named artefact that carries a finding through deliberation to a recorded outcome. Contains: **finding**, **trigger**, **consequence**, **goal**, and a **Deliberation section**. Distinct from a Decision Record, which captures the full reasoning for future editors. A CR is live until the post-deliberation package is complete.

## Deliberation

The process by which a proposal is examined through challenge until conviction is reached or the proposal is abandoned. Produces a Deliberation section in the CR recording the outcome, and a Decision Record when the reasoning is non-obvious or consequential. `SM: <title>` is its current implementation.

## Policy

An architectural invariant that drives decisions from necessity — what the system must hold regardless of who we are. Defined in `policies.md`. Principles that enforce a policy name it with `Enforces: <policy name>`.

Distinct from a glossary term (which defines meaning) by its obligation weight: a principle that enforces a policy without naming it is a coverage gap.

## Gap signal

A question, correction, or any observation that something is not what it should be; points to where the system can improve.

## Term

A label that carries meaning but no obligation. It appears in DNA, principles, rules, and the glossary without holding a position in the hierarchy. It does not constrain reasoning on its own — the obligation lives in the instinct that uses it.

A term becomes a hierarchy item when it acquires an obligation — when its meaning affects how a principle is applied.

## Perspective

*Load-bearing — other definitions depend on this term. Search for all uses in this file before renaming or restructuring.*

A lens applied at a single abstraction level that defines the units of a
system and what happens between them. An invariant in one perspective can be
the parent for many invariants one level down — each perspective reveals its
own set. Only invariants at the current level belong in the perspective —
pulling from levels above or below pollutes the view. The dataflow perspective
defines nodes and the data moving between them.