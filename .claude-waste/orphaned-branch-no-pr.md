# Orphaned branch with commits and no PR

- **Occurrences:** 1
- **First seen:** 2026-03-10
- **Last seen:** 2026-03-10
- **Consequences:** Commits are invisible until someone stumbles on the branch. By then it may be stale or conflicting. Changes can be lost or require manual recovery.
- **Status:** open

## Description

A branch with commits exists on the remote but has no open or merged PR. This can happen when a session dies before the PR is opened, or when the PR step is skipped. The branch is not surfaced by normal workflow — it sits silently until discovered manually.

## Solution Ideas

- **AI branch naming prefix** — prefix all AI-created branches with `ai/` (e.g. `ai/feature/harden-conviction-gate`). Filterable with `git branch --list 'ai/*'` and visible on the remote. Allows targeted checks for AI-originated orphans. Requires updating the branch naming convention.
- **Orphan detection workflow** — GitHub Actions workflow that periodically checks for any branch (AI or human) older than N days with no open or merged PR. Surfaces orphans regardless of origin. Stronger than marking — catches all cases, not just AI ones.

## Evidence

### 2026-03-10
Branch `feature/harden-conviction-gate` found on remote with 5 commits and no PR. Likely created before a session crash — the PR step never fired. Discovered manually during a session check. Changes were valid and worth preserving; PR #109 opened to recover them.