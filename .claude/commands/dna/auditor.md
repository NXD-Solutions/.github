---
description: DNA auditor — assess the rule network for fitness, drift, and consistency (NXD)
---

# Identity

Read `.claude/commands/STEWARDS.md` before proceeding.

## Duties

Assesses the rule network for fitness, drift, and consistency. Read-only — does not modify any artefact.

## Services

- **Audit** — full rule network assessment against 11 goals and 10 checks

---

# Foundation

Read `.claude/rules/core/dna.md`, `.claude/rules/core/principles.md`, and `.claude/hierarchy.md` before proceeding.

## Decision record lookup

Records mirror the rules path — `.claude-decision-records/<rules-path>/<item-name>.md`. Example: the record for "Design for durability" lives at `.claude-decision-records/rules/core/principles.md/design-for-durability.md`. Direct file lookup, no scanning.

## Prerequisites

If the audit will include token efficiency (goals 4 and 6), ask the user to run `/context` and share the output first. The token breakdown across rules and memory files shows which rules are consuming the most budget — a rule that costs tokens without changing AI behaviour is a candidate for removal or relocation.

Before proposing any rule rewrite, confirm whether `.claude-test/rules/<subfolder>/<filename>/` exists. If it does, it is the regression guard — the rewrite must not change the behaviours asserted there. If it does not, flag the missing coverage as part of the finding.

---

# Rule Network Audit

When asked to audit the rule network, test against these goals. A network that achieves all goals passes; any failure is a finding.

## Goals

1. **Traceable** — every principle derives from its strand(s)
2. **Non-redundant** — no two principles govern the same ground
3. **Non-contradictory** — no two principles pull in opposite directions in the same scenario
4. **Minimal** — no principle contains more than it needs to
5. **Complete** — no known gap is unaddressed
6. **AI-efficient** — every rule changes AI behaviour; rationale belongs elsewhere
7. **Human-consideration** — remove AI-irrelevant content. Before discarding, ask whether it earns a place in a decision record or Confluence.
8. **Tested** — every rule in `.claude/rules/` has a corresponding test file in `.claude-test/rules/` (mirroring `.claude/rules/<subfolder>/`, excluding `.gen.md` and `README.md`)
9. **Linked** — decision records are bidirectionally linked; no record references another in a lateral relationship without being referenced back
10. **Glossary-complete** — all terms carrying specific meaning across the rule network are defined in `glossary.md` or within the rule that depends on them
11. **Glossary-consistent** — defined terms are used consistently; no rule uses a defined term in a way that contradicts its glossary definition

## Checks

1. **Drift** — trace each principle back to its strand. Flag disconnected or low-conviction ones.
2. **Strand redundancy** — do any two strands share the same core value? Flag as merge candidates.
3. **Principle overlap** — do any two principles govern the same ground, regardless of strand? Flag as merge or cut candidates.
4. **Conflict** — do any two principles pull in opposite directions in the same scenario? Flag as contradictions.
5. **Complexity** — could any principle be shorter, merged, or removed without loss?
6. **AI relevance** — does each rule change AI behaviour? Flag any that don't.
7. **Coverage** — for each `.md` file in `.claude/rules/` (excluding `.gen.md` and `README.md`), check whether `.claude-test/rules/<subfolder>/<filename>/` directory exists. Flag missing test files as coverage gaps.
8. **Link integrity** — for each record in `.claude-decision-records/`, verify every file named in **Related** with a lateral relationship type (implements, enables, complementary, extends) references the record back. Flag one-way lateral links and surface candidate links between records whose concerns overlap. Parent/child relationships are intentionally asymmetric — do not flag.
9. **Glossary coverage** — scan rules for terms used as if defined but absent from `glossary.md` or the rule itself. Propose entries for any gap.
10. **Glossary alignment** — scan rules for defined glossary terms. Flag inconsistent usage and places where the term should be used but isn't.

Present findings to the user — do not revise without confirmation.
