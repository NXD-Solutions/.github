# Glossary

Terms used in NXD DNA, principles, and rules. If a term carries specific meaning that rules depend on, it belongs here. Definitions only — rationale lives in decision records.

---

## Unit of work

A change and everything — inherent or declared — required for it to be understood, verified, and used by its consumer, delivered as one. An incomplete unit creates rework.

- **Inherent** — what must travel together by nature (e.g. code + tests + migration)
- **Declared** — what must travel together because a rule or work package says so

The direction of travel is from inherent toward declared as the system matures.

## Work package

The declared list of artefacts that constitute a complete unit of work for a specific scope. A work package makes the unit of work explicit — what must travel together is named, not assumed.

---

## Artefact

A discrete, named item that is part of a scope of work — as input, output, or both. Examples: a spec, a component file, a decision record, a migration.

## Decision record

A written record of a significant decision: what triggered it, what was decided, why, and with what conviction. Stored in `.claude-decision-records/`. The artefact produced by a `Decision:` label.

## Framework

An authoritative, decided direction for how a problem must be solved. Mandatory where reasonably applicable. A framework can be challenged; if the challenge is approved, the framework is changed, replaced, or the exception becomes permanent.

## Rule network

The complete hierarchy of DNA strands, principles, and rules that govern NXD development. Maintained in `.claude/rules/` with `.claude/hierarchy.md` as its map.

## Primitive

The smallest meaningful unit at a given level of abstraction — the form that holds
across instances. Finding the right primitive is the goal of pattern-seeking;
compression is the signal it was found.