# Glossary

Terms used in NXD DNA, principles, and rules. If a term carries specific meaning that rules depend on, it belongs here. Definitions only — rationale lives in decision records.

---

## Unit of work

A change and everything — inherent or declared — required for it to be understood, verified, and used by its consumer, delivered as one. An incomplete unit creates rework.

- **Inherent** — what must travel together by nature (e.g. code + tests + migration)
- **Declared** — what must travel together because a rule or work package says so

The direction of travel is from inherent toward declared as the system matures.

## Work package

The declared list of artefacts a unit of work comprises — whether consumed or produced.

---

## Artefact

A discrete, named item that is part of a scope of work — as input, output, or both. Examples: a spec, a component file, a decision record, a migration.

## Decision record

A written record of a significant decision: what triggered it, what was decided, why, and with what conviction. Stored in `.claude-decision-records/`. The artefact produced by a `Decision:` label.

## Framework

An authoritative, decided direction for how a problem must be solved. Mandatory where reasonably applicable.

## Rule network

The complete hierarchy of DNA strands, principles, and rules that govern NXD development. Maintained in `.claude/rules/` with `.claude/hierarchy.md` as its map.

## Primitive

The smallest meaningful unit at a given level of abstraction — the form that holds
across instances. Finding the right primitive is the goal of pattern-seeking;
compression is the signal it was found.

## Invariant

A node in a dataflow whose behaviour holds regardless of what is substituted
beneath it. Invariants are the primitives of a perspective — found before
the specifics are known, stable across all instances.

## Role

A named lens applied to a unit of work; defines what must be seen and what falls outside scope. Not a job title.

## Worker

Any named unit — person, system, role, or process — that holds duties at a given abstraction level. A microservice, a team, a workbench, and a developer are all Workers; what distinguishes them is the abstraction level at which their duties are defined.

## Change Request

A named artefact proposing a change to an artefact. Contains a finding — what problem was encountered — and a proposed change. The input to a deliberation; distinct from a Decision Record, which is the output.

## Perspective

A lens applied at a single abstraction level that defines the units of a
system and what happens between them. An invariant in one perspective can be
the parent for many invariants one level down — each perspective reveals its
own set. Only invariants at the current level belong in the perspective —
pulling from levels above or below pollutes the view. The dataflow perspective
defines nodes and the data moving between them.