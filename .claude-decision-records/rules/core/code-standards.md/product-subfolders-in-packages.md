# Product subfolders in `packages/`

**Date:** 2026-03-09

**Authors:** Peter Sixhøj & claude-sonnet-4-6

**Concern:** The flat `packages/<name>/` convention makes relatedness implicit — you must parse names to understand which packages belong together. As shared packages grow (logging, security, observability), navigation degrades and CODEOWNERS paths become harder to reason about.

**Decision:** Product subfolders within `packages/` — `packages/<product>/<package>/` instead of `packages/<package>/`. Related packages group visibly under their product. CODEOWNERS paths follow the structure, making ownership assignments readable at the product level. "Product" is used over "domain" — it carries the ownership obligation: a product has an owner accountable for it existing and being used, not just a conceptual grouping.

**Related:** Uniform by Design (parent), Transparent by Nature (enables), Domain ownership means building the shared component (enables)

**Trigger:** Authoring the *Domain ownership* principle surfaced that domain experts own the contract and platform owns the mechanism — two packages, one concern. Expressing that relationship in structure requires grouping; flat naming only implies it.

**Alternatives considered:** Flat with naming prefix (`packages/logging-logger/`) — rejected, relatedness is implied not visible, and CODEOWNERS paths become harder to read. "Domain" as the grouping term — rejected in favour of "product": domain is abstract; product carries the ownership obligation the principle names. Separate repos per product — deferred, monorepo is the current decision; the product folder IS the future repo boundary if extraction is ever needed — no refactoring required.

**Conviction:** high | high

**Examples:**
```
packages/
  logging/          # product — owned by operators
    logger/         # sub-package: mechanism
    log-schema/     # sub-package: contract
  security/         # product — owned by security team
    auth/           # sub-package: mechanism + contract
```
