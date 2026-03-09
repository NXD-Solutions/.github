# Promotion state not tracked

**Occurrences:** 1
**First seen:** 2026-03-09
**Last seen:** 2026-03-09
**Consequences:** uncertainty about whether .claude-static/ mirrors .claude/; unnecessary verification steps; risk of distributing stale content or failing to distribute at all
**Status:** open

**Related:** [pr-conflicts-from-stale-branch.md](pr-conflicts-from-stale-branch.md) — both stem from the same workflow gap: no single source of truth for delivery state

## Description

After a session involving multiple PRs and promotions, it becomes unclear which `.claude/` files have been promoted to `.claude-static/` and which haven't. Promotion happens as part of commits but is not tracked separately — the only way to verify is to diff every file pair manually.

Root cause: promotion is a manual step embedded in commits with no dedicated tracking. The PR titles and commit messages mention promotion inconsistently.

## Evidence

### 2026-03-09
`dna-workbench.md` was updated with audit goals during the session. After multiple PRs and branch operations, it was unclear whether the promotion had been included. A manual diff was required to confirm the files were in sync.