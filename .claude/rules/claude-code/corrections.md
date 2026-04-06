# Corrections

Implements *Every gap signal is an improvement trigger* for process gaps.

When either party identifies a correction, add an entry to `memory/corrections.md`:

| date | type | session context | what was corrected | triggered by | resolved by | resolution date |

The `triggered by` column names who or what surfaced the correction — a specific steward (e.g. "Peter", "Claude Code", "Claude.ai") or an external signal. Required on every entry.

Types: `process` | `implementation` | `artefact` | `discovery`

## Prevention layer

`corrections.triggers.md` collects triggers extracted from corrections — patterns that, when recognised early, prevent the correction from recurring. The trigger list is volatile: entries are promoted to rules or deleted when they lose value.

## Session lifecycle

At end of session, if ≥1 correction was added: summarise and ask "Worth a retrospective now?"

At retrospective: compress entries to the pattern that, known earlier, would have prevented the most. Route the output — instinct or principle to `dna:workbench`, behavioural to feedback memory, recurring workaround to testament, waste pattern to `/waste`.

Entry lifecycle: resolved entries carry a `resolved by` and `resolution date` — delete if resolution date is more than one month old with no reuse, or update the date when reused.