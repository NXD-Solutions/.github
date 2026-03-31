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
| 2026-03-31 | process | .github — dna:workbench, corrections mechanism | `resolved` column missing resolution reference — date alone cannot be traced | A correction must identify what resolved it, to detect when the resolution fails to trigger | | |