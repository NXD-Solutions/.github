# PR conflicts from stale branch

- **Occurrences:** 3
- **First seen:** 2026-03-09
- **Last seen:** 2026-03-09
- **Consequences:** PR cannot merge; requires rebase and force push; interrupts delivery flow; risks losing uncommitted work if not handled carefully
- **Status:** open
- **Related:** [promotion-state-not-tracked.md](promotion-state-not-tracked.md) — both stem from the same workflow gap: no single source of truth for delivery state

## Description

A branch is created from main, work is committed, and a PR is opened. Meanwhile another PR merges to main. The open PR now conflicts. Requires rebasing onto main and force pushing before the PR can merge.

Root cause: branches are not rebased before opening a PR, and PRs are sometimes opened while other PRs are still in flight on the same base.

## Evidence

### 2026-03-09
PR #75 conflicted after PR #74 merged first during the dna-workbench session. Fixed by rebasing and force pushing.

### 2026-03-09
PR #78 conflicted after PRs from the same session merged first. Fixed by rebasing and force pushing.

### 2026-03-09
PR #81 conflicted for the same reason. Addressed by adding the one-PR-at-a-time rule to git-workflow.md (PR #82) — partial mitigation but root cause not fully eliminated.