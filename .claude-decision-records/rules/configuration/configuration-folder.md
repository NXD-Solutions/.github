# Decision: Configuration folder for repo-owned vendored contracts

**Date:** 2026-04-07
**Status:** Accepted
**Conviction (S|L):** high | high

## Trigger

Deliberation on how repos consume vendored contracts (e.g. service-architecture.md) that must load into Claude Code system context. These files must live under `.claude/rules/` for automatic loading but must not be overwritten by the distribution cycle that syncs `.claude-static/` to all repos.

## Decision

Create `.claude/rules/configuration/` as a dedicated container for project-level vendored contracts.

- The folder and its README are distributed via `.claude-static/` — every repo receives the empty container.
- Files placed inside by individual repos are repo-owned and pinned — never added to `.claude-static/`, never synced.
- `dna:workbench` owns the container structure and README. File contents are repo-owned.

## Alternatives considered

1. **Place vendored contracts in `core/` or `dev/`** — rejected. These folders are distributed org-wide. A repo-owned file in a distributed folder would be overwritten or cause merge conflicts on the next distribution run.
2. **Place vendored contracts outside `.claude/rules/`** — rejected. Files outside this path are not loaded into system context automatically. Manual loading is fragile and violates *Prefer enforcement over documentation*.
3. **Use `.claude/rules/` root (no subfolder)** — rejected. Pollutes the top-level namespace and provides no signal that a file is repo-owned vs distributed.

## Consequences

- Repos gain a clear, convention-backed location for pinned contracts that need system-context loading.
- The distribution workflow does not need modification — it already syncs `.claude-static/` and ignores files that exist only in `.claude/`.
- New folder must be documented in `rules/README.md` and registered in `STEWARDS.md`.
