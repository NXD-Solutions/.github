---
name: Ideas catalogue
description: One-line ideas noted during sessions for future consideration
type: project
---

- Command instructions rot as sessions age — a general rule for detecting stale command context and suggesting re-invocation
- Share the ideas catalogue so others can see and contribute to it
- Ideas should be shipped or noted as a principle — the catalogue is a forcing function, not a parking lot
- Create a command template derived from existing commands — captures the established structure (Responsibilities, Services/Modes, per-mode sections)
- Find a way to make conviction statements more explicit — scope drift between what was convicted on and what was acted on is a recurring problem; may be a universal principle, not just a conviction gate fix
- Maintain a technology baseline list (e.g. python3, node, git) — declared prerequisites for NXD developer machines; used to validate that tooling and hooks can rely on these being present
- Git-aware safety hooks — a pattern of PostToolUse/PreToolUse hooks on the Bash tool that intercept git commands and surface warnings; current instance: detect rule changes after git pull; candidate: detect push to a branch whose PR is already merged
- Add Reorg mode to dna-workbench — invariant: workbench owns .claude*/; reorg task: test owned files for consistency, then sync Confluence
- Extend validate-hierarchy.cjs to cover full .claude*/ broken-reference patterns, not just hierarchy links
- Defer: does claude-rules-system.md belong in the workbench? All sections appear workbench-owned; risk is sessions touching .claude-static/ without invoking workbench