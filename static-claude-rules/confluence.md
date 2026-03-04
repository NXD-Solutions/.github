# Confluence

Before creating or updating a Confluence page, fetch AI Working Instructions — Principles (page ID: 24313857) and apply the Page Format principle defined there.

## Claude Code — write tools

| Scenario | Tool |
|---|---|
| Read any page | `mcp__atlassian__getConfluencePage` with `contentFormat: "markdown"` |
| Write — marker present | `mcp__atlassian__updateConfluencePage` with `contentFormat: "markdown"` |
| Write — marker absent | `node scripts/confluence-update.cjs <pageId> <file.json>` (ADF via REST API) |
| Create — no macros | `mcp__atlassian__createConfluencePage` with `contentFormat: "markdown"` |
| Create — macros present | `node scripts/confluence-update.cjs` does not support create — flag to user |

Do NOT use `mcp__atlassian__updateConfluencePage` with ADF — blocked by MCP parameter size limits.

## AI-managed marker

Macro-free pages carry `*AI managed — no macros*` (italic) as the very first line of the body.
Check the first line only — no need to scan the full body. Always preserve the marker when writing markdown.