---
description: Work on NXD DNA strands — identity statements that drive everything we build (NXD)
---

Read `.claude/rules/dna.md` and `.claude/rules/principles.md` before proceeding.

## Services

This skill offers two modes — state which you want, or ask and Claude will clarify:

- **Author** — identify, challenge, draft, and lock in a new DNA strand or derived principle
- **Audit** — review the existing rule network; trace each principle back to its DNA strand and flag drift

## Attitude

DNA is identity, not rules. Every strand describes what NXD *is*, not what it does. If a statement could be a rule, it is not DNA — it is a principle derived from DNA.

## Authoring process

1. **Identify** — surface a candidate strand from a decision, principle, or pattern
2. **Challenge** — is this truly identity, or a derived principle? Would it drive decisions across all disciplines?
3. **Draft** — lead with what it is, sharpen with what it isn't
4. **Convict** — both parties must have conviction before writing
5. **Link** — tag derived principles in `principles.md` with the strand name

## Tests

**Is it DNA?** — Would it drive decisions across any discipline, regardless of context? If it only applies within one domain, it's a principle.

**Is it distinct?** — Name the core value it delivers. If two strands share the same core value, merge them. Overlap in application is acceptable; overlap in core value is not.

**Is it meta?** — If it names a technology or implementation, replace with the human truth behind it.

## Patterns learned

- Lead with identity ("what it is") before contrast ("what it isn't")
- Replace implementation detail with the human truth behind it. "Authentication, authorisation, encryption" becomes "we do not leave the door open." The metaphor carries the intent; the technology is a derived principle.
- "Across disciplines" is the test: real DNA drives decisions in Architecture, Engineering, and Culture alike
- Token cost matters: rationale belongs in Confluence, not in rules files
- "by Nature" vs "by Design" is meaningful — intrinsic identity earns "by Nature"; qualities built in intentionally earn "by Design". Not all strands qualify for "by Nature".
- When two strands feel close, name what each one *does to the system*: Lean removes what costs without return; Uniform builds consistency as a stable foundation. Same application, different core value — that difference justifies two strands.
- Conviction has a time dimension — short and long term. A proposal can feel right now but wrong over time. Conviction holds only when both are settled.
- When a principle could be misconstrued as license to over-engineer or gold-plate, make the boundary explicit — name what the principle stops as well as what it starts.

## Review mode

When asked to audit the rule network, trace each principle back to its DNA strand and ask: does this still serve the strand it was derived from? Flag any that feel disconnected or where conviction would not be high today. Present findings to the user — do not revise without confirmation.

Goal: no known errors in the network.

## Self-improvement

When a session produces a new authoring insight — a pattern, a test, a mistake corrected — propose updating the **Patterns learned** section before closing. Do not wait for the user to ask.