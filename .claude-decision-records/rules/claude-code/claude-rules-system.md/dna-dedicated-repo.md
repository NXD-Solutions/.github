## DNA dedicated repo

**Date:** 2026-04-13
**Authors:** Peter Sixhøj & Claude Sonnet 4.6
**Concern:** The DNA — strands, principles, rules, and commands — is co-located in
`.github`, the org-level GitHub configuration repo. `.github`'s change regime (org
config: templates, workflows, CODEOWNERS) differs from the DNA's change drivers.
Co-location couples them, making independent versioning impossible.
**Decision:** DNA moves to `NXD-Solutions/dna`. The subscription registry — describing
which repos receive which content — lives in `.github` as org-level config, not in the
DNA repo. Folder naming (`.claude/`, `.claude-static/`) unchanged during migration. No
versioning introduced in this change — separation is the prerequisite for it.

**Related:** enables — independent versioning of the DNA
**Trigger:** SM: is .github the right home for the DNA? — 2026-04-13
**Alternatives considered:** Keep DNA in `.github` — rejected; `.github`'s change regime
would contaminate any versioning model applied to the DNA.
**Conviction:** high | high
**Value:** Correctness — DNA lifecycle decoupled from GitHub org config. Waste eliminated
— change regime coupling removed before it becomes structural debt. Context preservation
— versioning can be introduced cleanly without a prior migration.
