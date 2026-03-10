# Commits pushed after PR merged

- **Occurrences:** 1
- **First seen:** 2026-03-10
- **Last seen:** 2026-03-10
- **Consequences:** commits land on a branch whose PR is already closed; they are not included in the merge; a new PR is required to deliver them; risk of conflict with main on the new PR
- **Status:** open

## Description

Work continues on a branch after its PR has been merged and the branch deleted. New commits are pushed to what becomes a new remote branch with the same name. The commits are not in main and require a new PR to deliver.

Root cause: no signal from the user that the PR has merged before the next commit is pushed. The one-PR-at-a-time rule prevents opening a second PR while one is open, but does not prevent committing to a branch after its PR closes.

## Evidence

### 2026-03-10

PR #99 (conviction gate) was merged while two commits were still being prepared on `feature/harden-conviction-gate`. Both commits were pushed after the merge. A new branch (`feature/conviction-gate-followup`) was created from main with only the delta, and PR #100 was opened to deliver the remaining changes.