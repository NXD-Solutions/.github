# Distributed rules require manual pull and session restart

- **Occurrences:** 1
- **First seen:** 2026-03-10
- **Last seen:** 2026-03-10
- **Consequences:** After every distribution, all active sessions across all repos are running stale rules. Each user must manually pull main and restart their Claude Code session — friction that scales with the number of active repos and users.
- **Status:** resolved — 2026-03-20

## Description

When `.claude-static/` is distributed to all NXD repos, the updated rules are written to disk but active Claude Code sessions are unaware of the change. Nothing prompts the user to pull and restart. The new rules are only picked up when a new session starts on an up-to-date branch.

This is inherent to how Claude Code loads rules at session start — there is no live reload mechanism. The waste is not the limitation itself, but the absence of any signal to the user that their session is stale.

## Solution Ideas

- **Spike:** Can a git hook (post-merge, post-pull) detect changes to `.claude/rules/` and warn the user to restart their Claude Code session? If feasible, this is the strongest enforcement level — the signal fires at the moment the rules land, with no reliance on the user checking notifications.

- After distribution completes, post a notification (Slack, GitHub Discussion, or similar) prompting all users to pull main and restart their session.
- Add a step to the distribution workflow that creates a GitHub issue or discussion noting the distribution and what changed.
- Document the restart requirement explicitly in the distribution workflow summary (`$GITHUB_STEP_SUMMARY`) so it is visible in the Actions run.

## Evidence

### 2026-03-10
Distribution of updated rules triggered by PR #107 (task list contract + crash recovery). Observation: active sessions continue running old rules until the user manually pulls main and restarts.

### Resolution — 2026-03-20

A `PostToolUse` hook on the Bash tool was added to `~/.claude/settings.json`. After any `git pull` run via Claude, it checks `git diff HEAD@{1} HEAD -- .claude/rules/ .claude/commands/` and outputs a `systemMessage` prompting the user to restart if rules changed. The live reload limitation is inherent to Claude Code and unchanged — but the signal now fires at the moment the rules land.