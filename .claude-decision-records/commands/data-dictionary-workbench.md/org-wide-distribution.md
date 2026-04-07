## Org-wide distribution of a package-scoped command

**Date:** 2026-04-07
**Authors:** Peter Sixhøj & Claude Sonnet 4.6
**Concern:** `/data-dictionary-workbench` is scoped to repos containing
`packages/data/dictionary/`. The NXD distribution system has no mechanism
to target a subset of repos — a command is either distributed to all or
kept local to `.github`. Keeping it local means it never reaches the repo
that actually needs it.

**Decision:** Distribute to all repos. An applicability guard in Foundation
self-limits invocation in repos without the package. This is a deliberate
workaround for a current platform gap. When selective distribution is
supported, the scope should be narrowed to data-dictionary repos.

**Related:** enables `.claude/commands/data-dictionary-workbench.md`
**Trigger:** PR #279, 2026-04-07
**Alternatives considered:** Local to `.github` only (rejected — command
never reaches the repo that needs it); distribute with no guard (rejected
— confusing for repos that don't have the package)
**Conviction:** Peter: high | Claude: high (S|L)
**Value:** Waste eliminated — command reaches the repo that needs it
without waiting for platform capability; context preservation — reasoning
for the applicability guard is recorded so future editors don't remove it
as defensive boilerplate
