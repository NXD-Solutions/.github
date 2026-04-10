# Configuration

Project-level vendored contracts loaded into Claude Code system context. Separated from DNA rules (`core/`, `dev/`) to prevent namespace confusion between distributed org-wide rules and repo-owned pinned contracts.

## Contract

- **Distributed:** the folder and this README are distributed via `.claude-static/` — every repo receives the container.
- **Contents are local:** files placed inside `configuration/` by a repo are repo-owned and pinned. They are not added to `.claude-static/` and not synced by the distribution workflow. **Exception:** `governance.config.md` is distributed via `.claude-static/` until the governance configuration migration is complete — at which point repos own their own copy.
- **Loading:** all `.md` files in this folder are loaded into Claude Code system context at session start, like any other file under `.claude/rules/`.

## When to use

Place a file here when it must be loaded into system context but is owned by the repo — not by the org-wide rule network. Examples: vendored service architecture contracts, repo-specific integration constraints.

## Ownership

Container structure and this README are owned by `dna:workbench`. File contents placed by repos are owned by the repo.
