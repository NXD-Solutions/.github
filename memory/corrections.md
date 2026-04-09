# Corrections

Staging area for corrections made during sessions. Entries accumulate across sessions until a retrospective is triggered. No categorisation at capture time — route and compress during the retrospective.

## Purpose

Raw data for pattern compression. At retrospective time: find the instinct that, known earlier, would have prevented the most corrections.

## Entry format

```
| date | type | session context | what was corrected | triggered by | resolved by | resolution date |
```

`triggered by` names who or what surfaced the correction — a specific steward (e.g. "Peter", "Claude Code", "Claude.ai") or an external signal.

Types: `process` | `implementation` | `artefact` | `discovery`

## Retrospective trigger

Either party can trigger a retrospective at any time. End of session: Claude summarises corrections added and asks "worth a retrospective now?" if ≥1 correction was added.

## Retrospective output

Compressed insight routed to its appropriate destination: dna:workbench (instinct/principle), feedback memory (behavioural), testament (recurring workaround), waste (pattern).

---

## Entries

| Date | Type | Session context | What was corrected | Triggered by | Resolved by | Resolution date |
|---|---|---|---|---|---|---|
| 2026-03-31 | process | .github — SM: correction retrospective | Initial design assumed local-only file | Peter (backfilled) | Start lean, don't close the door | 2026-03-31 |
| 2026-03-31 | discovery | .github — SM: correction retrospective | "Start lean, don't close the door" emerged as compressed instinct | Claude Code (backfilled) | Start lean, don't close the door | 2026-03-31 |
| 2026-03-31 | process | .github — dna:workbench, corrections mechanism | Corrections mechanism placed in feedback memory instead of a distributed rule | Claude Code (backfilled) | Start lean, don't close the door | 2026-03-31 |
| 2026-03-31 | process | .github — dna:workbench, corrections mechanism | `resolved` column missing resolution reference — date alone cannot be traced | Claude Code (backfilled) | Updated entry format: resolved by is now required | 2026-03-31 |
| 2026-03-31 | process | .github — CR execution gate, agent spawn | Used contextual shorthand ("deliberation agent") instead of transparent naming ("DNA Workbench as deliberation agent") — user could not verify what was being spawned | Peter (backfilled) | Promoted to feedback memory | 2026-03-31 |
| 2026-03-31 | process | .github — CR execution gate, agent spawn | Workbench startup only loaded dna.md, principles.md, hierarchy.md — full core not loaded; agent lacked DNA language and identity context for credible deliberation | Claude Code (backfilled) | Workbench startup updated: full rules/core/ mandatory | 2026-03-31 |
| 2026-03-31 | process | .github — CR execution gate, agent spawn | Loaded workbench file in main session before spawning agent — agent reads the file itself; main session read was redundant | Claude Code (backfilled) | Added to workbench patterns learned | 2026-03-31 |
| 2026-04-01 | artefact | .github — task 14, CR pattern | Framed "CR is a working document" and "don't commit to repo" as one constraint — two separate responsibilities conflated in one sentence | Peter (backfilled) | Separated into two distinct statements | 2026-04-01 |
| 2026-04-01 | process | .github — task 14, CR pattern | Correction capture did not fire when user prefixed message with "Correction:" — content was processed, log step was skipped | Peter (backfilled) | — | — |
| 2026-04-01 | process | .github — CR implementation | When user said "Pass it to an agent", started doing the work in the main session instead of delegating to an agent | Peter (backfilled) | — | — |
| 2026-04-01 | process | .github — CR implementation | After /dna:workbench was invoked, continued editing in the main session instead of spawning a workbench agent | Peter (backfilled) | — | — |
| 2026-04-01 | process | .github — task 1, lift mechanic pattern | When overriding an agent's scope challenge, sent "override" without relaying the reasoning — agent and user had no basis to evaluate the counter-argument | Peter (backfilled) | — | — |
| 2026-04-01 | process | .github — task 1, lift mechanic pattern | "Pass it to an agent" means hand the task over and step back — let the user engage with the agent directly when challenges arise. Kept intercepting instead: overriding challenges myself, spawning new agents, cutting the user out of the deliberation | Peter (backfilled) | — | — |
| 2026-04-01 | process | .github — CR implementation, IFD termination states | Commenced work (read files) before challenging the CR — challenge must precede all implementation, including file reads | Peter (backfilled) | — | — |
| 2026-04-01 | process | .github — CR skill creation | Jumped to writing the skill without raising a CR — the CR process applies to creating the CR skill itself | Peter (backfilled) | — | — |
| 2026-04-01 | artefact | .github — decision records, multiple sessions | Created one DR file per change instead of one DR file per node (H2) — multiple files now exist where one should accumulate all decisions for a node | Peter (backfilled) | — | — |
| 2026-04-02 | artefact | .github — CR deliberation, agent input rule | Proposed ai-human-conventions.md as home without considering the originating skill (CR) as a pre-graduation home — missed the pattern: a rule with one motivating context lives in that context's skill until it proves broader | Peter (backfilled) | — | — |
| 2026-04-02 | process | .github — agent context exploration | Manually passed DNA files and rules into inline agent prompts — inline agents inherit the full project context (CLAUDE.md, rules, memory) automatically; manual context passing was waste | Claude Code (backfilled) | — | — |
| 2026-04-06 | artefact | .github — corrections Confluence page | Corrections page written without examples showing humans how to take action — reader left knowing what corrections are but not how to participate | Peter | — | — |
| 2026-04-06 | artefact | .github — corrections trigger DR link | Added explicit DR path to trigger entry — redundant (convention locates it) and a drift risk (path could contradict the authority if moved) | Peter | — | — |
| 2026-04-06 | artefact | .github — communicative artefact trigger | Inlined specifics owned by other authorities (glossary examples, gate list) into a trigger entry — creates drift risk when the authority changes | Peter | — | — |
| 2026-04-06 | artefact | .github — reference authority principle PR | Moved rules from principles.md to communicative-artefact.md and communication.md without moving their DRs — DRs must follow the rule they document | Peter | — | — |
| 2026-04-06 | process | .github — reference authority principle PR | "Correction:" prefix did not trigger immediate capture — acted on the content but skipped the logging step. Recurrence of 2026-04-01 entry | Peter | — | — |
| 2026-04-07 | process | .github — data-dictionary-workbench PR | DR intake not performed before proposing the PR — user had to ask for the DR after the PR was already raised. DR check should be a standard step before any PR request | Peter | — | — |
| 2026-04-07 | process | .github — service-architecture consumption model | Dismissed symmetric solution (npm) based on a single obstacle ("Claude Code doesn't load from node_modules/") without iterating over obstacles to resolution. A one-line copy step resolves it. Self-challenge must iterate until all obstacles are resolved or proven unreasonable — not stop at the first one | Peter | — | — |
| 2026-04-09 | artefact | .github — Problem introduction facet DR | Appended Problem introduction DR to serve-the-readers-context.md (wrong node) instead of creating its own file — each node in the hierarchy gets its own DR file with a name matching its H1 | Peter | Extracted to problem-introduction.md | 2026-04-09 |
| 2026-04-09 | process | .github — figma-translation.md file placement | Recommended adding centering invariant to figma-integration.md (Option 1) — failed to distinguish structural/linking audience from translation audience; two different reader types require separate files | Peter | New file figma-translation.md created | 2026-04-09 |