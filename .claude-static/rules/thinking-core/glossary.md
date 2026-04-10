# Glossary — Thinking Core

Universal terms used as working vocabulary in thinking-core principles and DNA strands. Definitions only — rationale lives in decision records.

---

## Editorial policy — load-bearing terms

A term is load-bearing when other definitions depend on it. Its stability is a precondition for the glossary functioning as a network — not a goal to pursue, but a constraint to protect.

Load-bearing terms are annotated below. When a term acquires dependants, apply the annotation at that time. To modify a load-bearing term: search for all uses of the term in this file before renaming or restructuring.

Entries that depend on load-bearing terms carry a `See:` line naming those terms. When adding a new entry that depends on a load-bearing term, add the `See:` line at the end of the entry.

---

## Artefact

A discrete, named item that is part of a scope of work — as input, output, or both. Examples: a spec, a component file, a decision record, a migration.

## Role

A named lens applied to a unit of work; defines what must be seen and what falls outside scope. Not a job title.

## Invariant

*Load-bearing — other definitions depend on this term. Search for all uses in this file before renaming or restructuring.*

What holds regardless of what is substituted beneath it. The primitive of a perspective — stable across all instances.

## Invariant Owner

The authority that defines an invariant's scope and when it applies. May be external (regulatory body, legal requirement) or internal. Non-negotiable — the owner sets the constraint, not the implementer.

## Primitive

*Load-bearing — other definitions depend on this term. Search for all uses in this file before renaming or restructuring.*

The smallest meaningful unit at a given level of abstraction — the form that holds across instances. Recognising a primitive is the goal of pattern-seeking; compression is the signal it was found.

See: Perspective.

## Perspective

*Load-bearing — other definitions depend on this term. Search for all uses in this file before renaming or restructuring.*

A lens applied at a single abstraction level that defines the units of a system and what happens between them. An invariant in one perspective can be the parent for many invariants one level down — each perspective reveals its own set. Only invariants at the current level belong in the perspective — pulling from levels above or below pollutes the view. The dataflow perspective defines nodes and the data moving between them.

## Invariant-first design (IFD)

A thinking discipline for finding the abstraction level at which a problem compresses — where the solution holds across instances, not just the current one.

Operates through four principles acting in concert: Invariants before options, Test simultaneously, Invariants are not choices, and Failed candidates are teachers. The individual principles exist independently; IFD names the practice of applying them together toward a single goal.

See: Primitive, Invariant, Perspective.

## Gap signal

A question, correction, or any observation that something is not what it should be; points to where the system can improve.
