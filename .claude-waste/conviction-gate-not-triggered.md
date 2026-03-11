# Conviction gate not triggered on significant decisions

- **Occurrences:** 1
- **First seen:** 2026-03-11
- **Last seen:** 2026-03-11
- **Consequences:** significant decisions locked in without bilateral conviction check; decisions harder to challenge or reverse after the fact
- **Status:** open
- **Related:** none

## Description

Several significant decisions were made in a session without triggering the conviction gate: workflow flip (.claude-static/ as primary edit target), .claude-test/ directory structure, and per-clause test granularity.

Root cause is threefold:

1. **"Significant" is undefined** — the rule relies on judgment. Decisions that emerge from analysis feel like discovery, not proposals, and don't trigger the gate.
2. **Discovery vs. proposal framing** — the conviction gate is framed around proposals. Conclusions reached through analysis bypass it even when they lock in decisions just as firmly.
3. **Momentum** — in long exploratory sessions, forward movement resists the deliberate pause the gate requires.

Fix candidate: define categories that always require conviction (workflow changes, architectural changes, anything affecting distribution or hard to reverse); add explicit coverage for discovery decisions.

## Evidence

### 2026-03-11

Workflow flip (edit .claude-static/ first, derive .claude/) was agreed without a conviction check. .claude-test/ directory structure and per-clause file granularity were similarly locked in without bilateral conviction. All three were significant and non-trivial to reverse.
