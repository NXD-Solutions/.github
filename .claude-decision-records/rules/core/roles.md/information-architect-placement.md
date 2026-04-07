# Information Architect — role placement

## Trigger

CR proposed adding "Information Architect" as a standing role in `roles.md` — on par with Designer, Architect, Technician. The DataDictionary steward needed documented authority boundaries and escalation paths visible to developer AIs in consumer repos.

## Decision

Information Architect is a **steward with duties**, not a standing role. Authority and escalation live in `STEWARDS.md` (distributed to all repos), not in `roles.md`.

## Reasoning

The three existing standing roles — Designer, Architect, Technician — are domain-agnostic lenses. They apply across all work. Any unit of work can have a Designer, Architect, or Technician.

Information Architect fails this test:
- Scoped to a specific system (DataDictionary)
- Names a specific person (Peter)
- Defines authority over a specific artefact, not a lens across all work
- Its escalation routes *to* the Architect role — confirming the relationship is steward → role, not role → role

The glossary confirms the distinction: a Role is "a named lens applied to a unit of work"; a Steward is "any named unit that holds duties at a given abstraction level."

## What was done

1. **`roles.md`** — escalation row added: `DataDictionary structural change → Architect`
2. **`STEWARDS.md`** — extended from 3 to 5 columns (Authority, Escalation). DataDictionary entry carries the authority split: unilateral for technical correctness, Architect sign-off for structural changes.
3. **`command-workbench.md`** — format definition updated to reflect 5-column registry.

## What was not done

- No standing role entry in `roles.md` — that's the decision this record protects.
- Full authority split documentation in the data-dictionary repo deferred to when that repo is active.

## Conviction

S|L: high | high — the distinction (steward vs. role) is clean and the glossary supports it. The 5-column STEWARDS.md scales to future stewards with authority splits.
