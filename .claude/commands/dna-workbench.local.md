---
description: DNA workbench — author, maintain, and audit NXD identity strands and the rule network (NXD)
---

Read `.claude/rules/core/dna.md`, `.claude/rules/core/principles.md`, and `.claude/hierarchy.md` before proceeding. The hierarchy file is the source of truth for the strand → principle → rule chain — consult it before any Author, Audit, Fix, or Rework operation.

**Hierarchy update trigger:** When any heading is added to a DNA rules file during any mode, add it to `.claude/hierarchy.md` in the same commit — mapped under the correct parent if conviction is high, unmapped if not. Never leave a new heading without a hierarchy entry. Records explaining why rules were written as they were live in `.claude-decision-records/` — consult them before flagging drift, authoring a strand that may already have been decided, or accepting a challenge against an existing strand or principle. The concern may already have been deliberated and resolved.

Persistent workbench state (Anthropic skills registry and other cross-session memory) lives in `.claude/commands/dna-workbench-memory.local.md` — read it when evaluating external skills or tools, and update it when a skill is reviewed or its status changes.

## Responsibilities

- Maintains `.claude/rules/core/dna.md` — DNA strands
- Maintains `.claude/rules/core/principles.md` — principles and their strand tags
- Maintains `.claude/rules/core/glossary.md` — defined terms; update when terms with specific meaning are introduced into the rule network
- Maintains `.claude/hierarchy.md` — the strand → principle → rule tree (source of truth)
- Writes `.claude-decision-records/` entries for any strand or principle change
- Maintains `.claude/commands/dna-workbench-memory.local.md` — cross-session workbench state
- Maintains Confluence page 46661643 — mirrors the hierarchy tree; update after any change to `hierarchy.md`
- Maintains Confluence page 45121554 — DNA Extract for claude.ai projects; update the AI-Human Conventions section after any change to `ai-human-conventions.md`

## Work package

A complete unit of work for the DNA Workbench includes all applicable items:

- `dna.md` and/or `principles.md` changes
- `hierarchy.md` update
- `glossary.md` entry (when a new term with specific meaning is introduced)
- `.claude-static/` derivation of all changed files
- Decision record (when a principle or strand is added or changed)
- Confluence sync — Target 1 (hierarchy page 46661643) and/or Target 2 (DNA Extract page 45121554)
- Mermaid diagram update (`dna-diagram-test.md`)
- `rules/README.md` table update (when a new rules file is added)

A PR that touches a workbench-managed file must deliver all applicable items from this list.

## Services

This skill offers five modes — state which you want, or ask and Claude will clarify:

- **Author** — identify, challenge, draft, and lock in a new DNA strand or derived principle
- **Audit** — review the existing rule network; trace each principle back to its DNA strand and flag drift
- **Rework** — revise a specific existing rule; reads decision record and test file as constraints before any changes are proposed
- **Fix** — repair a failing PR; resolves broken hierarchy references and commits the fix to the PR branch
- **Sync** — update Confluence page 46661643 to reflect the current state of `hierarchy.md`; can be run at any time regardless of whether GitHub changes exist

## Attitude

DNA is identity, not rules. Every strand describes what NXD *is*, not what it does. If a statement could be a rule, it is not DNA — it is a principle derived from DNA.

## Authoring process

1. **Identify** — surface a candidate strand from a decision, principle, or pattern
2. **Challenge** — is this truly identity, or a derived principle? Would it drive decisions across all domains?
3. **Draft** — lead with what it is, sharpen with what it isn't
4. **Convict** — both parties must have conviction before writing
5. **Glossary** — scan the full rule network for terms that carry specific meaning but are not defined anywhere — in `glossary.md` or within a rule. Propose definitions for any gap found.
6. **Link** — tag derived principles in `principles.md` with the strand name
6. **Test** — write a test file in `.claude-test/rules/<subfolder>/<filename>/` asserting the observable behaviour the principle requires
7. **Sync** — run Sync mode to update Confluence page 46661643

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
- When a solution is proposed without a stated goal, surface the goal first. Without it, intent is invisible and the solution cannot be evaluated or challenged.
- A stated goal opens the solution space upward — the immediate solution often reveals itself as a subset of something broader. Example: "per-workflow token reporting" became "org-wide spend visibility" once the goal (cost management) was named. Solution-first thinking blocked the generalisation; goal-first thinking enabled it.
- Conviction on structure is not conviction on a specific file — confirm scope explicitly before touching files. Show the proposed change before writing it.
- A counter-argument that identifies real weaknesses in a mechanism but uses them to discard the underlying insight is a recognisable failure mode. The test isn't "does the mechanism have flaws" — it's "does the insight survive the flaws being fixed."

## Sync mode

Invoked as `/dna-workbench sync` or triggered automatically after any Author, Rework, or Fix operation that changes `hierarchy.md` or `ai-human-conventions.md`.

### Target 1 — Hierarchy tree (page 46661643)

Triggered by: any change to `hierarchy.md`.

1. Read `.claude/hierarchy.md`
2. Fetch Confluence page 46661643 (markdown format) — apply Page Format principle from page 24313857
3. Rewrite the page body to reflect the current hierarchy tree: strands, principles, sub-principles, and rules in the same structure as `hierarchy.md`. Include the unmapped rules section.
4. Expand all relative file links to absolute GitHub URLs using the filename as link text: `Title — Role ([filename.md](https://github.com/NXD-Solutions/.github/blob/main/.claude/rules/<file>.md#<anchor>))`. Titles stay as plain text. Entries without a link stay as plain text with no link.
5. Preserve the AI-managed marker as the first line
6. Write the updated page using `mcp__atlassian__updateConfluencePage` with `contentFormat: "markdown"`

### Target 2 — DNA Extract for claude.ai (page 45121554)

Triggered by: any change to `ai-human-conventions.md`.

1. Read `.claude/rules/core/ai-human-conventions.md`
2. Fetch Confluence page 45121554 (markdown format) — apply Page Format principle from page 24313857
3. Replace the `# AI-Human Conventions` section in the page body with the current content from `ai-human-conventions.md`. All other sections (DNA Strands, Principles, Binding Architectural Decisions) are preserved verbatim.
4. Preserve the AI-managed marker as the first line
5. Write the updated page using `mcp__atlassian__updateConfluencePage` with `contentFormat: "markdown"`

Can be run at any time — does not require a GitHub change to trigger.


## Unmapped rules

The **Unmapped rules** section at the bottom of `.claude/hierarchy.md` is a queue — rules that exist but have not yet been assigned a parent principle. Unmapped is a valid state: a rule author without the authority or context to map it leaves it here for a workbench session to process.

During any Author or Audit session, check the unmapped section and attempt to map each entry. For each entry: propose the correct parent principle and confirm with the user. Conviction gate applies — do not map without high conviction from both parties.

If conviction cannot be reached on any proposed parent — and the user cannot supply an alternative — place or leave the rule in the unmapped section. Do not force a low-conviction mapping. Unmapped with an honest reason is better than mapped with the wrong parent.

## Fix mode

Invoked as `/dna-workbench fix PR-<number>`.

1. Fetch the PR to understand what changed
2. Read `.claude/hierarchy.md`
3. Run `node scripts/validate-hierarchy.cjs` to identify broken references — or reason through the hierarchy manually if the script is unavailable
4. For each broken reference: locate the correct file and heading, update the link in `.claude/hierarchy.md`
5. If a node is missing entirely (new rule with no hierarchy entry): propose the correct parent and add the node — confirm with user before writing
6. Present all proposed changes to the user
7. On confirmation: commit the updated hierarchy to the PR branch and push
8. After committing: run Sync mode to update Confluence page 46661643

**Confirmation is required before any commit.** Do not push without explicit user approval.

## Rework mode

When asked to rework a specific rule, before any changes are proposed:

1. Read the relevant record in `.claude-decision-records/` — this is why the rule was written as it was. A rework that ignores prior deliberation may re-open closed decisions.
2. Read `.claude-test/rules/<subfolder>/<filename>/` — these are constraints, not suggestions. The rework must preserve every asserted behaviour. If no test directory exists, flag the gap and proceed with caution.

Only after both are read: propose changes. After changes are approved and written, run Sync mode to update Confluence page 46661643.

## Review mode

If the audit will include token efficiency (goals 4 and 6), ask the user to run `/context` and share the output first. The token breakdown across rules and memory files shows which rules are consuming the most budget — a rule that costs tokens without changing AI behaviour is a candidate for removal or relocation.

Before proposing any rule rewrite, confirm whether `.claude-test/rules/<subfolder>/<filename>/` exists. If it does, it is the regression guard — the rewrite must not change the behaviours asserted there. If it does not, flag the missing coverage as part of the finding.

When asked to audit the rule network, test against these goals. A network that achieves all goals passes; any failure is a finding.

**Goals:**
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

**Checks:**
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