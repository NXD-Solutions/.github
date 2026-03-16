# Claude Code / claude.ai file separation

**Date:** 2026-03-16

**Status:** Accepted

**Conviction (S|L):** high | high

**What triggered it:** The DNA Extract page (45121554) was being extended with AI-Human Conventions. The review surfaced a structural constraint: the conventions file contained Claude Code-specific content (task tooling, label declarations, crash recovery) that would be meaningless or misleading to a claude.ai reader. Extracting that content into dedicated files was driven by this constraint, not only by separation-of-concerns tidiness.

**What was decided:**

Any MD file shared with claude.ai must not contain Claude Code-specific content. Claude Code specifics — task lifecycle rules, label declarations, crash recovery — are only meaningful inside Claude Code sessions. A shared file that references them gives a claude.ai reader instructions it cannot act on.

Three files were extracted from `ai-human-conventions.md` as a result:
- `task-management.md` — task lifecycle, crash recovery (Claude Code only)
- `labels.md` — label declarations (Claude Code only)
- `github-workflow.md` — repo conventions (shared, but renamed for clarity)

`ai-human-conventions.md` now contains only content applicable to both audiences: proposals and options, scope confirmation, honesty and challenge, conviction gate, conciseness, shorthand.

**Why this is a constraint, not a preference:**

A file that instructs a reader to "create a Claude Code task" has no effect in claude.ai — there are no task tools. Worse, it may create confusion about what is expected. The separation is correctness, not aesthetics.

**Why the conviction gate stays in the shared file:**

The conviction gate applies universally — it governs how both Claude Code and claude.ai sessions make decisions. It is not Claude Code-specific behaviour; it is an interaction principle. Shared files may contain interaction principles; they must not contain platform-specific mechanics.

**Implication for future additions to shared files:**

Before adding any content to a file that is or may be shared with claude.ai, ask: can a claude.ai reader act on this? If the answer depends on Claude Code tooling, it does not belong in a shared file.

**Related:** `ai-human-conventions.md`, `task-management.md`, `labels.md`, Confluence page 45121554