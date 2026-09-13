# Claude Code — .github repo

## Session start

Read `memory/tasks.md`. If it is not empty, recreate the tasks using TaskCreate and warn the user:

> *"Previous session tasks recovered from crash checkpoint. Full context may be partial — review before proceeding."*

## Hosted here, owned elsewhere

**This repo's content is owned by the DNA** (`NXD-Solutions/dna`) and hosted here — every workflow, script and test in it, and `.github/PULL_REQUEST_TEMPLATE.md`.

Never hand-edit them here. Changes are authored in the DNA and land as a PR against this repo, where they pass the Library domain's review like any other DNA output (`nxd-practices/domains/library.md`). Editing in place puts this repo's copy ahead of its owner with nothing to reconcile it.

**Found a defect here? Open an issue on `NXD-Solutions/dna`** rather than fixing it in place. That routing is the cost of the declaration and it is deliberate: with no owner declared, a defect found here had nowhere to go — which is how a failed publish sat unattended for five months.

**Why the path cannot say this.** GitHub requires the org's workflows and PR template to live in the org's own `.github` repo, so they cannot sit beside the DNA content that governs them. Ownership is stated here because the location points at the host instead.

Decided at `NXD-Solutions/dna#1043`; reasoning at `rules/claude-code/.governance/claude-rules-system.md/decision-records/github-repo-content-ownership.md` in that repo.
