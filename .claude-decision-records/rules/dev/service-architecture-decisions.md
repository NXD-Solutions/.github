# Decision: Service architecture decisions staging file

**Date:** 2026-04-08
**Status:** Accepted
**Conviction (S|L):** high | high

## Trigger

Decisions made during service architecture work had no persistent home. They were lost between sessions, unavailable to new repos, and re-deliberated unnecessarily. Full decision records were too heavy — these are straightforward choices that need persistence, not the full DR treatment.

## Decision

Two-file split:

1. **Instructions** (`rules/dev/service-architecture-decisions.md`) — distributed via `.claude-static/`. Contains lifecycle rules: entry format, promotion trigger, data file location.
2. **Data** (`rules/configuration/service-architecture-decisions.md`) — repo-owned, not distributed. Created by each repo when the first decision needs recording.

Entry format: `### <Title>` followed by one to two sentences — the decision and why. Promotion trigger: when a second repo reuses a decision, promote it to a distributed artefact and remove it from the data file.

## Alternatives considered

1. **Single file with header and entries** — rejected during deliberation. Instructions mixed with data means accidental edits to lifecycle rules. Separating instruction from data follows the existing pattern: rules files constrain, configuration files hold state.
2. **Full decision records** — rejected. DR overhead exceeds value for straightforward architectural choices that don't carry non-obvious reasoning.
3. **CLAUDE.md or memory** — rejected. Neither persists across repos or loads into system context as a rules file.
4. **Inline in service-architecture.md** — rejected. The architecture contract describes what is; decisions describe what was chosen. Mixing them makes neither readable.

## Consequences

- Repos gain a lightweight, convention-backed location for architectural decisions below DR weight.
- The promotion trigger prevents premature standardization — cross-repo reuse is the signal of durability.
- Instructions arrive at every repo via distribution. Data file is created only when needed — zero cost for repos that don't use it.
