## npm distribution for service-architecture.md

**Date:** 2026-04-07
**Authors:** Peter Sixhøj & Claude Opus 4.6
**Concern:** service-architecture.md lives in .github/architecture/ but repos that implement
services have no defined mechanism to receive, pin, or upgrade the file. Without a consumption
model, repos either reference the architecture from memory (stale), copy it ad-hoc (no version
tracking), or don't reference it at all.

**Decision:** Distribute service-architecture.md as an npm package (`@nxd-solutions/service-architecture`)
published from .github to GitHub Packages — symmetric with how `@nxd-solutions/data-dictionary`
is already distributed. Integer versioning (v1, v2). Version gate lives in `/service-architect`:
after writing changes, the command asks the designer "Does this change earn a new version and
distribution?" On approval, the version header is bumped in the same commit. A GitHub Actions
workflow publishes automatically on merge to main when the version header changes. Consuming repos
install via npm, pin in package.json, and a copy step lands the file at
`.claude/rules/configuration/service-architecture.md` where Claude Code loads it automatically.

**Related:** extends architectural-network.md (the artefact this distributes); symmetric with data-dictionary distribution model
**Trigger:** CR deliberation 2026-04-07 — consumption model for service-architecture.md
**Alternatives considered:** GitHub Releases with attached asset (rejected — creates a second
distribution mechanism for the same problem; asymmetric with data-dictionary); manual copy from
.github clone (rejected — no version tracking, requires .github to be cloned and current);
GitHub raw content API with tags (rejected — tags version the entire repo, not the artefact)
**Conviction:** Peter: high | Claude: high (S|L)
**Value:** Symmetric distribution — one mechanism for all cross-repo artefacts eliminates the
cognitive overhead of remembering which artefact uses which channel; version pinning — repos
hold a known version and upgrade deliberately; automatic context loading — Claude Code sessions
in consuming repos see the architecture contract without manual setup
