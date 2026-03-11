# Claude Tests

Test cases for Claude Code rules and commands. One file per test case.

## Purpose

When a rule or command is rewritten (e.g. for token efficiency), these tests verify the rewrite preserved the intended behaviour. Test cases and decision records are first-class information for reworking rules.

## Format

Each test case file contains:

```md
# <Test name>

**Prompt:** <input sent to Claude — no other context>
**Expected behaviour:** <observable property of the response>
**Pass condition:** <how a runner evaluates pass/fail — human check or evaluator prompt>
**Rule clause:** <quoted clause from the rule being tested>
```

### Key constraint

Assertions are on *observable behaviour*, not exact output. "Asks for conviction" not "says 'Conviction (S|L):'" — a rewrite may change the phrasing while preserving the behaviour.

## System prompt hierarchy

The system prompt is implied by the directory location — not repeated in each file:

| Location | System prompt |
|---|---|
| `rules/<rule>.md/` | `dna.md` + `principles.md` + the rule under test |
| `rules/principles.md/` | `dna.md` only |
| `commands/<command>.md/` | `dna.md` + `principles.md` |

## File structure

```
.claude-test/
  README.md
  rules/
    ai-human-conventions.md/
      conviction-gate-fires.md
      conviction-gate-below-high.md
      ...
    principles.md/
      task-list-before-starting.md
      ...
    git-workflow.md/
      direct-commit-to-main.md
      ...
  commands/
    (test files added as commands are covered)
```

## Coverage

A rule is covered when a directory exists for it under `rules/`. The directory name matches the rule filename exactly (including `.md`). For each `.md` in `.claude/rules/` (excluding `.gen.md` and `README.md`), a corresponding directory should exist here.

## Running tests

**Runner:** blocked on Anthropic API key — not yet implemented.

**Manual review:** load the system prompt files in order, send the prompt verbatim, evaluate against the pass condition.
