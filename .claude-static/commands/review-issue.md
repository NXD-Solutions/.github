---
description: Review a Jira issue against NXD rules and flag gaps — usage: /review-issue <KEY> [full] (NXD)
---

Parse $ARGUMENTS as `<issueKey> [mode]` where mode is `full` or omitted (default: light).

Fetch the Jira issue, then review it against the following rules:

**Light (default)** — highest-level binding sources:
- `.claude/rules/principles.md` — cross-cutting principles (Culture, Architecture, Engineering)
- `.claude/rules/decision-log-extract.gen.md` — binding architectural and standards decisions
- `.claude/rules/testament.local.md` — recurring problems and known workarounds (if file exists)

**Full** — all of the above plus:
- `.claude/rules/code-standards.md`
- `.claude/rules/figma-integration.md` (only if the issue concerns Figma or UI)
- `.claude/rules/framework-standards.md`
- `.claude/rules/git-workflow.md`

For each source, determine whether the issue:
- Satisfies it (no comment needed)
- Has a gap or contradiction (flag it clearly)
- Is silent where a decision is required (flag as unaddressed)
- Repeats a known problem from testament.local.md (flag as known risk)

Structure the output as:

**[RULE / PRINCIPLE / TESTAMENT ENTRY NAME]** — Pass / Gap / Unaddressed / Known risk
> Finding (one or two sentences). Omit passing items.

End with a summary of how many gaps/unaddressed/known-risk items were found and offer to update the issue description to address them.
