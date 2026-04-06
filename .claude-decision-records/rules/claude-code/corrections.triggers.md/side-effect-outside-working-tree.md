## Side-effect outside working tree

**Date:** 2026-04-06
**Authors:** Peter Sixhøj & Claude Sonnet 4.6
**Concern:** `~/.claude/rules/` was populated by an unknown process, causing double-loading of distributed rules and multi-minute agent startup. The distribution workflow does not copy there — the origin is unidentified.
**Decision:** Volatile correction trigger that surfaces any file-system write outside the repo's working tree. User must approve before it executes.

**Alternatives considered:** Permanent rule in `claude-rules-system.md` — rejected as premature while the root cause is unknown.
**Conviction:** high | high
**Value:** Catches recurrence at the moment it would occur; removable when root cause is found.
