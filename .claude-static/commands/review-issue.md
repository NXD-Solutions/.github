---
description: Review a Jira issue against NXD principles and flag gaps (NXD)
---

Fetch Jira issue $ARGUMENTS and review it against the principles in `.claude/rules/principles.md`.

For each principle, determine whether the issue:
- Satisfies the principle (no comment needed)
- Has a gap or contradiction (flag it clearly)
- Is silent where the principle requires a decision (flag it as unaddressed)

Structure the output as:

**[PRINCIPLE NAME]** — Pass / Gap / Unaddressed
> Finding (one or two sentences). Omit passing principles unless the user asks for a full report.

End with a summary of how many gaps/unaddressed items were found and offer to update the issue with a comment or edit the description to address them.