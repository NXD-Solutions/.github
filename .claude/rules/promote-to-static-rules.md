# Promote to Static Rules

Procedure for promoting a rules file to `static-claude-rules` in `NXD-Solutions/.github`. Execute autonomously on user approval.

## 1. Prepare the branch
```
# Get main SHA
gh api repos/NXD-Solutions/.github/git/refs/heads/main | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['object']['sha'])"

# Create feature branch
gh api repos/NXD-Solutions/.github/git/refs -X POST \
  -f ref="refs/heads/feature/promote-<name>" \
  -f sha="<main-sha>"
```

## 2. For each file to promote
```
# Check if file already exists (get SHA if so, 404 if not)
gh api "repos/NXD-Solutions/.github/contents/static-claude-rules/<file>.md?ref=feature/promote-<name>" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('sha','NEW'))"

# Base64-encode the file
cat .claude/rules/<file>.md | base64 -w 0

# Create (no sha field) or update (sha field required)
gh api repos/NXD-Solutions/.github/contents/static-claude-rules/<file>.md \
  -X PUT --input - <<EOF
{"message":"<Add|Update> <file>","content":"<base64>","branch":"feature/promote-<name>"}
EOF
# For update, add: ,"sha":"<existing-sha>"
```

## 3. Create the PR
```
gh pr create \
  --repo NXD-Solutions/.github \
  --base main \
  --head feature/promote-<name> \
  --title "<concise title>" \
  --body "..."
```

PR body must cover **What**, **Why**, **Value**, **Risks** — reason from the actual file content, not generic placeholders. Blast radius assessment must identify which repos are affected and whether any may not match the rule's assumptions.

## Notes
- If `claude-rules-system.md` itself was modified locally, include it in the same PR
- `jq` is not available — use `python3` to parse JSON responses
- Output the PR URL when done