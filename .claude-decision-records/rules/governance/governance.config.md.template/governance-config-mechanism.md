# Governance configuration mechanism

**Trigger:** governance/ layer requires environment-specific values (e.g. testament location).
Without a declared entry point, these values scatter across rule files or remain implicit.

**Decided:** A single config file per deployment (`governance.config.md`) declares
environment-specific values. The template is distributed alongside governance/ rules.
Universal rule files remain unchanged.

**Why a config file over alternatives:**

- *Inline conditionals in each governance rule* — rejected: would require governance rules
  to name deployment environments, violating invariant 5 (process separable from illustration).

- *Per-environment rule subfolder* — rejected: duplicates the full rule set per environment;
  maintenance cost compounds with each rule change.

- *Config file* — selected: single declaration point; governance rules remain universal;
  new deployments copy the template and declare their values.

**Conviction (S|L): high | high**
