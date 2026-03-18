# Claude Tests

Test cases for Claude Code rules and commands. One file per test case.

## Purpose

These tests serve two purposes:

1. **Rule regression guard** — when a rule or command is rewritten (e.g. for token efficiency), tests verify the rewrite preserved the intended behaviour. Test cases and decision records are first-class information for reworking rules.
2. **Model acceptance** — when the underlying LLM changes, running the suite verifies the new model still honours the rules before it is adopted. The rule didn't change; the model did.

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
| `rules/<subfolder>/<rule>.md/` | `dna.md` + `principles.md` + the rule under test |
| `rules/core/principles.md/` | `dna.md` only |
| `commands/<command>.md/` | `dna.md` + `principles.md` |

## File structure

Mirrors `.claude/rules/` subfolder structure.

```
.claude-test/
  README.md
  rules/
    core/
      ai-human-conventions.md/
        conviction-gate-fires.md
        ...
      principles.md/
        task-list-before-starting.md
        ...
    github/
      github-workflow.md/
        direct-commit-to-main.md
        ...
  commands/
    (test files added as commands are covered)
```

## Coverage

A rule is covered when a directory exists for it under `rules/`, mirroring the rule's location in `.claude/rules/<subfolder>/`. The directory name matches the rule filename exactly (including `.md`). For each `.md` in `.claude/rules/` (excluding `.gen.md` and `README.md`), a corresponding directory should exist here.

## Running tests

**Runner:** blocked on Anthropic API key — not yet implemented.

**Manual review:** load the system prompt files in order, send the prompt verbatim, evaluate against the pass condition.
