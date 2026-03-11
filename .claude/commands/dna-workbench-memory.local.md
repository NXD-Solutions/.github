# DNA Workbench Memory

Persistent state for the dna-workbench skill. Not loaded at startup — read and updated by the workbench as needed.

---

# Anthropic Skills Registry

Tracks skills from `anthropics/skills` — reviewed, adopted, deferred, or rejected.
Entries are ordered alphabetically by skill name.
Review when: a new skill is published, a deferred trigger condition is met, or a major version ships.
License: Apache 2.0 applies to all skills in this repo — copy and modify freely, retain attribution.

---

## algorithmic-art

- **Source:** `anthropics/skills/skills/algorithmic-art`
- **Relevant / Using:** no / no
- **Commit reviewed:** `ef740771ac901e03fbca3ce4e1c453a96010f30a`
- **Reviewed:** 2026-03-11
- **License:** Apache 2.0
- **Status:** rejected
- **Reason:** Generates p5.js generative art with interactive HTML viewer. Creative/design tool with no NXD use case.
- **Recheck when:** NXD takes on a creative or design tooling need.

---

## brand-guidelines

- **Source:** `anthropics/skills/skills/brand-guidelines`
- **Relevant / Using:** no / no
- **Commit reviewed:** `ef740771ac901e03fbca3ce4e1c453a96010f30a`
- **Reviewed:** 2026-03-11
- **License:** Apache 2.0
- **Status:** rejected
- **Reason:** Applies Anthropic brand colors and typography to artifacts. Anthropic-specific — not applicable to NXD.
- **Recheck when:** NXD defines its own brand guidelines skill.

---

## skill-creator

- **Source:** `anthropics/skills/skills/skill-creator`
- **Relevant / Using:** yes / no
- **Commit reviewed:** `b0cbd3df1533b396d281a6886d5132f623393a9c`
- **Reviewed:** 2026-03-11
- **License:** Apache 2.0
- **Status:** deferred
- **Reason:** Eval loop requires subagents and API key — neither available yet. Core loop (draft → test → review → iterate) aligns with our `.claude-test/` approach and would replace or complement it.
- **Recheck when:** Anthropic API key in place (KAN-83). Evaluate whether to adopt the full eval loop or integrate selectively. Note: our `.claude-test/` suite serves the same dual purpose (rule regression + model acceptance) — skill-creator's eval loop is the execution layer that would run it.