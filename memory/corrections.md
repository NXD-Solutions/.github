# Corrections

Staging area for corrections made during sessions. Entries accumulate across sessions until a retrospective is triggered. No categorisation at capture time — route and compress during the retrospective.

## Purpose

Raw data for pattern compression. At retrospective time: find the instinct that, known earlier, would have prevented the most corrections.

## Entry format

```
| date | type | session context | what was corrected | what triggered it | resolved by | resolution date |
```

Types: `process` | `implementation` | `artefact` | `discovery`

## Retrospective trigger

Either party can trigger a retrospective at any time. End of session: Claude summarises corrections added and asks "worth a retrospective now?" if ≥1 correction was added.

## Retrospective output

Compressed insight routed to its appropriate destination: dna:workbench (instinct/principle), feedback memory (behavioural), testament (recurring workaround), waste (pattern).

---

## Entries

| Date | Type | Session context | What was corrected | What triggered it | Resolved by | Resolution date |
|---|---|---|---|---|---|---|
| 2026-03-31 | process | .github — SM: correction retrospective | Initial design assumed local-only file | Scaling to multi-person/repo was raised — design needed to stay open without over-engineering it now | Start lean, don't close the door | 2026-03-31 |
| 2026-03-31 | discovery | .github — SM: correction retrospective | "Start lean, don't close the door" emerged as compressed instinct | The correction above produced a candidate instinct during the same session that designed the corrections process | Start lean, don't close the door | 2026-03-31 |
| 2026-03-31 | process | .github — dna:workbench, corrections mechanism | Corrections mechanism placed in feedback memory instead of a distributed rule | Feedback memory is machine-local; the mechanism needs to travel with the DNA to all repos | Start lean, don't close the door | 2026-03-31 |
| 2026-03-31 | process | .github — dna:workbench, corrections mechanism | `resolved` column missing resolution reference — date alone cannot be traced | A correction must identify what resolved it, to detect when the resolution fails to trigger | Updated entry format: resolved by is now required | 2026-03-31 |
| 2026-03-31 | process | .github — CR execution gate, agent spawn | Used contextual shorthand ("deliberation agent") instead of transparent naming ("DNA Workbench as deliberation agent") — user could not verify what was being spawned | User had to assume intent; transparency at decision points is not optional | Promoted to feedback memory | 2026-03-31 |
| 2026-03-31 | process | .github — CR execution gate, agent spawn | Workbench startup only loaded dna.md, principles.md, hierarchy.md — full core not loaded; agent lacked DNA language and identity context for credible deliberation | A deliberation agent that doesn't carry the full DNA cannot catch identity violations or speak the shared language | Workbench startup updated: full rules/core/ mandatory | 2026-03-31 |
| 2026-03-31 | process | .github — CR execution gate, agent spawn | Loaded workbench file in main session before spawning agent — agent reads the file itself; main session read was redundant | Files the agent will read should be passed as paths in the prompt, not preloaded in the main session | Added to workbench patterns learned | 2026-03-31 |
| 2026-04-01 | artefact | .github — task 14, CR pattern | Framed "CR is a working document" and "don't commit to repo" as one constraint — two separate responsibilities conflated in one sentence | User flagged: storage is a process element; artefact nature and process rule must be stated separately | Separated into two distinct statements | 2026-04-01 |
| 2026-04-01 | process | .github — task 14, CR pattern | Correction capture did not fire when user prefixed message with "Correction:" — content was processed, log step was skipped | User had to explicitly ask why the trigger didn't fire | — | — |
| 2026-04-01 | process | .github — CR implementation | When user said "Pass it to an agent", started doing the work in the main session instead of delegating to an agent | User corrected twice: "Pass it to an agent" | — | — |
| 2026-04-01 | process | .github — CR implementation | After /dna:workbench was invoked, continued editing in the main session instead of spawning a workbench agent | User corrected: "Pass it to a workbench agent" — the workbench agent does the editing, not the main session | — | — |
| 2026-04-01 | process | .github — task 1, lift mechanic pattern | When overriding an agent's scope challenge, sent "override" without relaying the reasoning — agent and user had no basis to evaluate the counter-argument | User: "you should relay the arguments to the agent, otherwise I will have to stay firm" | — | — |
| 2026-04-01 | process | .github — task 1, lift mechanic pattern | "Pass it to an agent" means hand the task over and step back — let the user engage with the agent directly when challenges arise. Kept intercepting instead: overriding challenges myself, spawning new agents, cutting the user out of the deliberation | User: "I said you are keeping me in the dark — I will relay all information" | — | — |
| 2026-04-01 | process | .github — CR implementation, IFD termination states | Commenced work (read files) before challenging the CR — challenge must precede all implementation, including file reads | User: "No challenges?" then "Correction: you should challenge before commencing work" | — | — |
| 2026-04-01 | process | .github — CR skill creation | Jumped to writing the skill without raising a CR — the CR process applies to creating the CR skill itself | User: "Correction: you should create the CR" | — | — |