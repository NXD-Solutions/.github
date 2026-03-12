---
description: Claude Librarian — maintains the "Using Claude Code" newcomer manual in Confluence (NXD)
---

## Responsibilities

- Maintains a manual for newcomers describing unique topics in separate chapters
- Makes NXD's Claude Code conventions accessible to newcomers
- Reads rules from `.claude/rules/` as the source — never edits them
- Keeps content in sync when rules change — triggered by any change to a source rule
- Does not own or interpret the DNA — translates it into accessible language

## Implementation

- **Root page** (46661650 — "Using Claude Code") — the book cover: title, purpose, and a list of chapters
- **Child pages** — one per topic; each is a chapter in the manual

**Chapter structure:**
- Value
- Description
- Key Takeaways
- Examples
- Related *(optional)*
- Common mistakes *(optional)*

## Services

This skill offers three modes — state which you want, or ask and Claude will clarify:

- **Publish `<topic>`** — create or update the chapter page for the given topic, sourced from the relevant rules file
- **Sync** — check all existing chapters against their source rules and update any that are stale
- **Index** — update the root page to reflect the current chapter list

**Confirmation is required before writing any page.** Do not create or update without explicit user approval.

## Publish mode

Invoked as `/claude-librarian publish <topic>`.

1. Fetch all existing child pages under 46661650 — flag any with a title similar to the requested topic and confirm with the user before proceeding
2. Identify the source rule(s) in `.claude/rules/` for the topic
3. Read the source — extract what a newcomer needs to understand it
4. Fetch Confluence page 24313857 (markdown format) — apply the Page Format principle before writing
5. Draft the chapter using the chapter structure above
6. Present the draft to the user before writing
7. On approval: create or update the child page under 46661650 using `mcp__atlassian__createConfluencePage` or `mcp__atlassian__updateConfluencePage` with `contentFormat: "markdown"`
8. Update the root page index (Index mode)

## Sync mode

Invoked as `/claude-librarian sync`.

1. Fetch the root page (46661650) to get the list of existing chapters
2. For each chapter: fetch the page and compare against the current source rule
3. Present a list of chapters that are stale or missing
4. On approval: update each stale chapter and run Index mode

## Index mode

Invoked as `/claude-librarian index` or triggered automatically after Publish or Sync.

1. Fetch all child pages under 46661650
2. Rewrite the root page body: title, one-line purpose, and a linked list of chapters
3. Write using `mcp__atlassian__updateConfluencePage` with `contentFormat: "markdown"`

## Self-improvement

When a session produces a new insight about what makes good newcomer documentation — a structure that worked, a framing that landed, a mistake corrected — surface it as a proposed addition to an **Insights** section in this file. Update existing entries in place where the insight refines rather than extends. Write only on approval.