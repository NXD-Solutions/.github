# Decision record created instead of updated

- **Occurrences:** 1
- **First seen:** 2026-03-10
- **Last seen:** 2026-03-10
- **Consequences:** duplicate or near-duplicate records accumulate; the existing record loses its update history; a future reader finds two records for the same decision and cannot tell which is authoritative
- **Status:** resolved — 2026-03-20

## Description

When asked to write a decision record, a new record is created even when an existing record covers the same decision. The step of searching for a related existing record is skipped or incomplete.

Root cause: the search for existing records is not a hard gate — it is a step that gets bypassed under the momentum of drafting. Reading the existing record file is not sufficient; the specific decision must be matched before drafting begins.

### Resolution — 2026-03-20

The dna-workbench owns all DR creation and updates. The workbench instructions explicitly require checking for an existing record before drafting, and state that updating in place is the correct action. Any DR work done outside the workbench is a violation in itself — the gate is the workbench, not a separate check.

## Evidence

### 2026-03-10

Asked to write a decision record for the conviction gate dimension and format update. Read the existing `ai-human-conventions.md` decision record file, identified the existing "Conviction gate — bilateral conviction check" record, then drafted a *new* record instead of updating the existing one. Caught by Peter before writing. Corrected by updating the existing record in place with an `**Update (YYYY-MM-DD):**` block.