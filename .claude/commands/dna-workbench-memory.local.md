# DNA Workbench Memory

Persistent state for the dna-workbench skill. Not loaded at startup — read and updated by the workbench as needed.

---

# Anthropic Skills Registry

Tracks skills from `anthropics/skills` — reviewed, adopted, deferred, or rejected.
Review when: a new skill is published, a deferred trigger condition is met, or a major version ships.
License: Apache 2.0 applies to all skills in this repo — copy and modify freely, retain attribution.

---

## skill-creator

- **Source:** `anthropics/skills/skills/skill-creator`
- **Commit reviewed:** `b0cbd3df1533b396d281a6886d5132f623393a9c`
- **Reviewed:** 2026-03-11
- **License:** Apache 2.0
- **Status:** deferred
- **Reason:** Eval loop requires subagents and API key — neither available yet. Core loop (draft → test → review → iterate) aligns with our `.claude-test/` approach and would replace or complement it.
- **Recheck when:** Anthropic API key in place (KAN-83). Evaluate whether to adopt the full eval loop or integrate selectively. Note: our `.claude-test/` suite serves the same dual purpose (rule regression + model acceptance) — skill-creator's eval loop is the execution layer that would run it.
- **Using:** no