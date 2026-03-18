# Session tasks

## Explore rules organisation with subfolders and path-scoped loading

**Why:** Investigating Claude Code capabilities for structuring `.claude/rules/`.
**What was agreed:**
- Subfolders under `.claude/rules/` are loaded recursively — purely organisational
- `paths:` frontmatter on a rule file controls *when* it loads, based on files in scope (not folder-based)
- These can be combined: subfolder for organisation + `paths:` for conditional loading

**Next step:** Decide whether to restructure `.claude/rules/` using subfolders and/or add `paths:` frontmatter to domain-specific rules (e.g. `figma-integration.md`, `code-standards.md`).