---
description: DNA workbench — author, maintain, and audit NXD identity strands and the rule network (NXD)
---

Read `.claude/rules/dna.md` and `.claude/rules/principles.md` before proceeding. Records explaining why rules were written as they were live in `.claude-decision-records/` — consult them before flagging drift, authoring a strand that may already have been decided, or accepting a challenge against an existing strand or principle. The concern may already have been deliberated and resolved.

## Services

This skill offers three modes — state which you want, or ask and Claude will clarify:

- **Author** — identify, challenge, draft, and lock in a new DNA strand or derived principle
- **Audit** — review the existing rule network; trace each principle back to its DNA strand and flag drift
- **Rework** — revise a specific existing rule; reads decision record and test file as constraints before any changes are proposed

## Attitude

DNA is identity, not rules. Every strand describes what NXD *is*, not what it does. If a statement could be a rule, it is not DNA — it is a principle derived from DNA.

## Authoring process

1. **Identify** — surface a candidate strand from a decision, principle, or pattern
2. **Challenge** — is this truly identity, or a derived principle? Would it drive decisions across all domains?
3. **Draft** — lead with what it is, sharpen with what it isn't
4. **Convict** — both parties must have conviction before writing
5. **Link** — tag derived principles in `principles.md` with the strand name

## Tests

**Is it DNA?** — Would it drive decisions across any domain, regardless of context? If it only applies within one domain, it's a principle.

**Is it distinct?** — Name the core value it delivers. If two strands share the same core value, merge them. Overlap in application is acceptable; overlap in core value is not.

**Is it meta?** — If it names a technology or implementation, replace with the human truth behind it.

## Patterns learned

- Lead with identity ("what it is") before contrast ("what it isn't")
- Replace implementation detail with the human truth behind it. "Authentication, authorisation, encryption" becomes "we do not leave the door open." The metaphor carries the intent; the technology is a derived principle.
- "Across domains" is the test: real DNA drives decisions in Architecture, Engineering, and Culture alike
- Token cost matters: rationale belongs in Confluence, not in rules files
- "by Nature" vs "by Design" is meaningful — intrinsic identity earns "by Nature"; qualities built in intentionally earn "by Design". Not all strands qualify for "by Nature".
- When two strands feel close, name what each one *does to the system*: Lean removes what costs without return; Uniform builds consistency as a stable foundation. Same application, different core value — that difference justifies two strands.
- Conviction has a time dimension — short and long term. A proposal can feel right now but wrong over time. Conviction holds only when both are settled.
- When a principle could be misconstrued as license to over-engineer or gold-plate, make the boundary explicit — name what the principle stops as well as what it starts.
- Before asking whether a decision record should be written, write the draft first and assess its value. Value cannot be assessed from a description of the record — only from reading it. The draft may need improvement before it earns its place; surface the draft, the value assessment, and any proposed improvements together before asking for approval.
- Define what the network should achieve before defining how to test it. Goals are the specification; checks are the tests against it. A check that doesn't serve a goal is noise; a goal without a check is unverifiable.
- Challenge audit findings before presenting them as errors. A finding that doesn't survive challenge was not an error — it was a misread. Reversed findings erode trust in the audit; only surface findings with conviction.

## Rework mode

When asked to rework a specific rule, before any changes are proposed:

1. Read the relevant record in `.claude-decision-records/` — this is why the rule was written as it was. A rework that ignores prior deliberation may re-open closed decisions.
2. Read `.claude-test/rules/<filename>.test.md` — these are constraints, not suggestions. The rework must preserve every asserted behaviour. If no test file exists, flag the gap and proceed with caution.

Only after both are read: propose changes.

## Review mode

If the audit will include token efficiency (goals 4 and 6), ask the user to run `/context` and share the output first. The token breakdown across rules and memory files shows which rules are consuming the most budget — a rule that costs tokens without changing AI behaviour is a candidate for removal or relocation.

Before proposing any rule rewrite, confirm whether `.claude-test/rules/<filename>.test.md` exists. If it does, it is the regression guard — the rewrite must not change the behaviours asserted there. If it does not, flag the missing coverage as part of the finding.

When asked to audit the rule network, test against these goals. A network that achieves all goals passes; any failure is a finding.

**Goals:**
1. **Traceable** — every principle derives from its strand(s)
2. **Non-redundant** — no two principles govern the same ground
3. **Non-contradictory** — no two principles pull in opposite directions in the same scenario
4. **Minimal** — no principle contains more than it needs to
5. **Complete** — no known gap is unaddressed
6. **AI-efficient** — every rule changes AI behaviour; rationale belongs elsewhere
7. **Human-consideration** — remove AI-irrelevant content. Before discarding, ask whether it earns a place in a decision record or Confluence.
8. **Tested** — every rule in `.claude/rules/` has a corresponding test file in `.claude-test/rules/` (excluding `.gen.md` and `README.md`)
9. **Linked** — decision records are bidirectionally linked; no record references another without being referenced back

**Checks:**
1. **Drift** — trace each principle back to its strand. Flag disconnected or low-conviction ones.
2. **Strand redundancy** — do any two strands share the same core value? Flag as merge candidates.
3. **Principle overlap** — do any two principles govern the same ground, regardless of strand? Flag as merge or cut candidates.
4. **Conflict** — do any two principles pull in opposite directions in the same scenario? Flag as contradictions.
5. **Complexity** — could any principle be shorter, merged, or removed without loss?
6. **AI relevance** — does each rule change AI behaviour? Flag any that don't.
7. **Coverage** — for each `.md` file in `.claude/rules/` (excluding `.gen.md` and `README.md`), check whether `.claude-test/rules/<filename>/` directory exists. Flag missing test files as coverage gaps.
8. **Link integrity** — for each record in `.claude-decision-records/`, verify every file named in **Related** references the record back. Flag one-way links and surface candidate links between records whose concerns overlap.

Present findings to the user — do not revise without confirmation.

## Self-improvement

When a session produces a new authoring insight — a pattern, a test, a mistake corrected —
surface the proposed addition or update to **Patterns learned** before closing, with the
value it adds. Update existing entries in place where the insight refines rather than
extends. Do not wait for the user to ask. Write only on approval.

When a significant strand or principle decision is made in the session, check whether a
decision record should be written or updated in `.claude-decision-records/`. Getting wiser
about the same decision means updating the existing record — not adding a new one. Surface
the proposed change with its rationale. Write only on approval. Apply the same trigger:
anything that can answer "why did we write it as we did."