# NXD DNA Hierarchy

*Source of truth for the domain → strand → principle → rule chain. Maintained by the DNA Workbench. Validated by CI on every PR.*

---

# Constitution

- **[The DNA governs by what is true, not by what is stated](rules/nxd-practices/constitution.md#constitution)** — Constitutional clause

---

# Culture

- **[Transparent by Nature](rules/thinking-core/dna.md#transparent-by-nature)** — Strand
  - **[Principles are processes](rules/thinking-core/principles.md#principles-are-processes)** — Principle
  - **[Goal before solution](rules/thinking-core/principles.md#goal-before-solution)** — Principle
    - [Scope confirmation](rules/nxd-practices/ai-human-conventions.md#scope-confirmation) — Rule
    - [Role assignment](rules/nxd-practices/ai-human-conventions.md#role-assignment) — Rule
  - **[Build context that lasts](rules/thinking-core/principles.md#build-context-that-lasts)** — Principle
    - [Commit messages](rules/github/github-workflow.md#commit-messages) — Rule
    - [Workflow summary](rules/github/github-actions.md#workflow-summary--process-explanation) — Rule
    - **[Record decisions to avoid repeating work](rules/thinking-core/principles.md#record-decisions-to-avoid-repeating-work)** — Sub-principle
      - [Task crash recovery](rules/claude-code/task-management.md#task-crash-recovery) — Rule
      - [Testament](rules/claude-code/testament.md) — Rule
      - Decision records format — Rule *(missing — to be added to `rules/claude-code/claude-rules-system.md`)*
  - **[The task list is a contract](rules/thinking-core/principles.md#the-task-list-is-a-contract)** — Principle
    - [Task list for all work](rules/claude-code/task-management.md#task-list-for-all-work) — Rule
    - [Task references](rules/claude-code/task-management.md#task-references) — Rule
    - [Task visibility in Claude Code](rules/claude-code/task-management.md#task-visibility-in-claude-code) — Rule
  - **[Communicate consequences of change](rules/thinking-core/principles.md#communicate-consequences-of-change)** — Principle
    - [Blast radius](rules/claude-code/claude-rules-system.md#blast-radius) — Rule
  - **[Names for all artefacts](rules/thinking-core/principles.md#names-for-all-artefacts)** — Principle
    - [Branch naming](rules/github/github-workflow.md#branch-naming) — Rule
    - [Repo references](rules/github/github-workflow.md#repo-references) — Rule
  - **[Write for the widest audience first](rules/thinking-core/principles.md#write-for-the-widest-audience-first)** — Principle
    - [Proposals and options](rules/nxd-practices/ai-human-conventions.md#proposals-and-options) — Rule
  - **[Every communicative artefact serves the reader's context — not the system's structure](rules/thinking-core/principles.md#every-communicative-artefact-serves-the-readers-context--not-the-systems-structure)** — Principle
    - [Define Audience before writing](rules/thinking-core/communication.md#define-audience-before-writing) — Rule
    - [Define Topic before writing](rules/thinking-core/communication.md#define-topic-before-writing) — Rule
    - [Define Trigger before writing](rules/thinking-core/communication.md#define-trigger-before-writing) — Rule
    - [Reader-need filter](rules/thinking-core/communication.md#reader-need-filter) — Rule
    - [Evidence serves the reader, not the author](rules/thinking-core/communication.md#evidence-serves-the-reader-not-the-author) — Rule
    - **[Every element earns its place by serving the reader's current position in the document](rules/thinking-core/principles.md#every-element-earns-its-place-by-serving-the-readers-current-position-in-the-document)** — Sub-principle
      - [Sequencing](rules/thinking-core/communication.md#sequencing--do-not-present-what-the-reader-cannot-yet-receive) — Rule
      - [Bridging](rules/thinking-core/communication.md#bridging--close-what-came-before-earn-what-comes-next) — Rule
      - [Signposting](rules/thinking-core/communication.md#signposting--advance-the-reader-do-not-narrate-the-argument) — Rule
    - [Every question is an opportunity to improve the artefact](rules/thinking-core/communication.md#every-question-is-an-opportunity-to-improve-the-artefact) — Rule
  - **[Shared language](rules/thinking-core/principles.md#shared-language)** — Principle
    - [Glossary](rules/nxd-practices/glossary.md) — Rule
---
- **[Lean by Design](rules/thinking-core/dna.md#lean-by-design)** — Strand
  - **[Impact precedes action](rules/thinking-core/principles.md#impact-precedes-action)** — Principle
  - **[Shared scope, shared lifecycle](rules/thinking-core/principles.md#shared-scope-shared-lifecycle)** — Principle
  - **[Prefer enforcement over documentation](rules/thinking-core/principles.md#prefer-enforcement-over-documentation)** — Principle
    - [Triggers](rules/claude-code/claude-rules-system.md#triggers) — Rule
    - [One open PR at a time](rules/github/github-workflow.md#one-open-pr-at-a-time-per-user) — Rule
---
- **[Resilient by Design](rules/thinking-core/dna.md#resilient-by-design)** — Strand
  - **[Protect assigned scope](rules/thinking-core/principles.md#protect-assigned-scope)** — Principle
    - [Route gaps to their owner](rules/nxd-practices/ai-human-conventions.md#route-gaps-to-their-owner) — Rule
  - **[Preserve the source that enables recreation](rules/thinking-core/principles.md#preserve-the-source-that-enables-recreation)** — Principle
  - **[Design for durability](rules/thinking-core/principles.md#design-for-durability)** — Principle
    - [Never commit to main](rules/github/github-workflow.md) — Rule
    - [Autogenerated files](rules/claude-code/claude-rules-system.md#autogenerated-files) — Rule
---
- **[Evolving by Instinct](rules/thinking-core/dna.md#evolving-by-instinct)** — Strand
  - **[Challenge until conviction](rules/thinking-core/principles.md#challenge-until-conviction)** — Principle
    - [Honesty and challenge](rules/nxd-practices/ai-human-conventions.md#honesty-and-challenge) — Rule
    - [Conviction gate](rules/nxd-practices/ai-human-conventions.md#conviction-gate) — Rule
    - [Conviction at task transitions](rules/claude-code/task-management.md#conviction-at-task-transitions) — Rule
    - [Deliberation required for every CR](rules/nxd-practices/ai-human-conventions.md#deliberation-required-for-every-cr) — Rule
---
- **[Pattern-seeking by Instinct](rules/thinking-core/dna.md#pattern-seeking-by-instinct)** — Strand
  - **[What holds for one holds for many — uniqueness requires justification](rules/thinking-core/principles.md#what-holds-for-one-holds-for-many--uniqueness-requires-justification)** — Principle
  - **[A misfit is a signal — redesign the container or create one](rules/thinking-core/principles.md#a-misfit-is-a-signal--redesign-the-container-or-create-one)** — Principle
  - **[Find the pattern, not the instance](rules/thinking-core/principles.md#find-the-pattern-not-the-instance)** — Principle
  - **[Scope fitness (Architectural Thinking)](rules/thinking-core/principles.md#scope-fitness-architectural-thinking)** — Principle

---

# Architecture

- **[Lean by Design](rules/thinking-core/dna.md#lean-by-design)** — Strand
---
- **[Sovereign by Design](rules/thinking-core/dna.md#sovereign-by-design)** — Strand
  - **[No vendor lock-in](rules/thinking-core/principles.md#no-vendor-lock-in)** — Principle
  - **[Prefer reversible decisions](rules/thinking-core/principles.md#prefer-reversible-decisions)** — Principle
    - [Local testing](rules/claude-code/claude-rules-system.md#local-testing) — Rule
---
- **[Uniform by Design](rules/thinking-core/dna.md#uniform-by-design)** — Strand
  - **[Domain ownership means building the shared component](rules/thinking-core/principles.md#domain-ownership-means-building-the-shared-component)** — Principle
    - [Where rules and commands live](rules/claude-code/claude-rules-system.md#where-rules-and-commands-live) — Rule
    - [Workflow](rules/claude-code/claude-rules-system.md#workflow) — Rule
    - [Deriving local copy](rules/claude-code/claude-rules-system.md#deriving-local-copy-from-claude-static) — Rule
    - [Commands](rules/claude-code/claude-rules-system.md#commands) — Rule
---
- **[Evolving by Instinct](rules/thinking-core/dna.md#evolving-by-instinct)** — Strand
  - **[Build once for many](rules/thinking-core/principles.md#build-once-for-many)** — Principle
    - [Proposing new rules](rules/claude-code/claude-rules-system.md#proposing-new-rules) — Rule
---
- **[Secure by Design](rules/thinking-core/dna.md#secure-by-design)** — Strand
  - **[Security is baseline](rules/thinking-core/principles.md#security-is-baseline)** — Principle
---
- **[Pattern-seeking by Instinct](rules/thinking-core/dna.md#pattern-seeking-by-instinct)** — Strand
  - **[Trace the flow to find the invariants](rules/thinking-core/principles.md#trace-the-flow-to-find-the-invariants)** — Principle

---

# Engineering

- **[Resilient by Design](rules/thinking-core/dna.md#resilient-by-design)** — Strand
  - **[Stateless by default](rules/thinking-core/principles.md#stateless-by-default)** — Principle

---

## Unmapped rules

Rules not yet assigned to a parent principle — workbench to resolve.

- [Conciseness](rules/nxd-practices/ai-human-conventions.md#conciseness)
- [Shorthand](rules/nxd-practices/ai-human-conventions.md#shorthand)
- [Autogenerated files note](rules/claude-code/claude-rules-system.md#autogenerated-files)
- [Labels](rules/claude-code/labels.md#labels)
- [Figma invariants](rules/figma/figma-integration.md#invariants)
- [`.figma/` location](rules/figma/figma-integration.md#figma-location)
- [Screen index](rules/figma/figma-integration.md#screen-index)
- [Owned artefacts](rules/figma/figma-integration.md#owned-artefacts)
