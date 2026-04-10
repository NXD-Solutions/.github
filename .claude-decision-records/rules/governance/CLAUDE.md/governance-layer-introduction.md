# Governance layer introduction — three-layer rules structure

**Decision:** Introduce `governance/` as a third layer in the rules structure, alongside `thinking-core/` and `nxd-practices/`.

**Finding:** `thinking-core/` holds universal vocabulary and principles. `nxd-practices/` holds NXD-specific application. Neither is the correct home for the processes that maintain `thinking-core/` — those processes are universal but operational, not conceptual.

**Trigger:** As `thinking-core/` matures, governance artefacts (change processes, deprecation conventions, editorial policies) need a home. Without one, they either pollute `thinking-core/` with process content or absorb false org-specificity in `nxd-practices/`.

**Consequence of no record:** A future session encountering three layers has no basis for the separation. The process/vocabulary distinction is not recoverable from the folder structure alone. Risk of governance content being merged into `thinking-core/` or `nxd-practices/` on the mistaken assumption the layer is redundant.

**Goal:** Make the three-layer structure and its rationale recoverable without re-deliberation.

---

## Rationale

**Process is not vocabulary**

`thinking-core/` holds what things mean — concepts, principles, definitions. Governance artefacts define how to act on those concepts: how to change them, deprecate them, annotate them, keep them recoverable. These are distinct in kind. A process artefact in `thinking-core/` would make the folder answer two questions: "what does this mean?" and "how do I maintain it?" Separating the concerns keeps each layer answerable to one question.

**Governance is usable standalone**

`governance/` carries no NXD dependency. It is a standalone add-on to `thinking-core/` — any adopter of `thinking-core/` can adopt `governance/` alongside it without taking on NXD-specific content. NXD extends governance; governance does not depend on NXD. This makes the layer coherent as a distribution unit.

**Two layers were insufficient**

Two alternatives were considered and rejected:

- *Governance in `thinking-core/`*: mixes process artefacts with vocabulary and principles. Compromises the folder's adoptability — an adopter taking `thinking-core/` standalone would inherit process dependencies that may not apply to their context.

- *Governance in `nxd-practices/`*: governance processes are universal, not NXD-specific. Placing them in `nxd-practices/` assigns false org-specificity and prevents their use as a standalone layer.

Three layers is the minimum that keeps each concern cleanly separated.

---

**Conviction (S|L): high | high**
