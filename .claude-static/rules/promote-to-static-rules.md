# Promote to Static

`.claude-static/` mirrors `.claude/` — the destination path matches the source path exactly. Promotion happens in the same branch as the rule change — not in a separate PR.

## How to promote

```bash
cp .claude/<subdir>/<file>.md .claude-static/<subdir>/<file>.md
```

Stage and commit alongside the `.claude/` change. Both ship in the same PR.

## When to promote

Every `.md` file under `.claude/` that applies to all NXD repos must be promoted. Exceptions:
- `.local.md` — never promote
- `.gen.md` — never promote manually

## PR body

Cover **What**, **Why**, **Value**, **Risks**. Blast radius assessment must identify which repos are affected and whether any may not match the rule's assumptions.
