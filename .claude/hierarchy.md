# NXD DNA Hierarchy

*Source of truth for the domain → strand → principle → rule chain. Maintained by the DNA Workbench. Validated by CI on every PR.*

---

# Constitution

- **[The DNA governs by what is true, not by what is stated](rules/core/constitution.md#constitution)** — Constitutional clause

---

# Culture

- **[Transparent by Nature](rules/core/dna.md#transparent-by-nature)** — Strand
  - **[Principles are processes](rules/core/principles.md#principles-are-processes)** — Principle
  - **[Goal before solution](rules/core/principles.md#goal-before-solution)** — Principle
    - [Scope confirmation](rules/core/ai-human-conventions.md#scope-confirmation) — Rule
    - [Role assignment](rules/core/ai-human-conventions.md#role-assignment) — Rule
  - **[Build context that lasts](rules/core/principles.md#build-context-that-lasts)** — Principle
    - [Commit messages](rules/github/github-workflow.md#commit-messages) — Rule
    - [Workflow summary](rules/github/github-actions.md#workflow-summary--process-explanation) — Rule
    - **[Record decisions to avoid repeating work](rules/core/principles.md#record-decisions-to-avoid-repeating-work)** — Sub-principle
      - [Task crash recovery](rules/claude-code/task-management.md#task-crash-recovery) — Rule
      - [Testament](rules/claude-code/testament.md) — Rule
      - Decision records format — Rule *(missing — to be added to `rules/claude-code/claude-rules-system.md`)*
  - **[The task list is a contract](rules/core/principles.md#the-task-list-is-a-contract)** — Principle
    - [Task list for all work](rules/claude-code/task-management.md#task-list-for-all-work) — Rule
    - [Task references](rules/claude-code/task-management.md#task-references) — Rule
    - [Task visibility in Claude Code](rules/claude-code/task-management.md#task-visibility-in-claude-code) — Rule
  - **[Communicate consequences of change](rules/core/principles.md#communicate-consequences-of-change)** — Principle
    - [Blast radius](rules/claude-code/claude-rules-system.md#blast-radius) — Rule
  - **[Names for all artefacts](rules/core/principles.md#names-for-all-artefacts)** — Principle
    - [Branch naming](rules/github/github-workflow.md#branch-naming) — Rule
    - [Repo references](rules/github/github-workflow.md#repo-references) — Rule
  - **[Write for the widest audience first](rules/core/principles.md#write-for-the-widest-audience-first)** — Principle
    - [Proposals and options](rules/core/ai-human-conventions.md#proposals-and-options) — Rule
  - **[Every communicative artefact serves the reader's context — not the system's structure](rules/core/principles.md#every-communicative-artefact-serves-the-readers-context--not-the-systems-structure)** — Principle
    - [Define Audience before writing](rules/core/communication.md#define-audience-before-writing) — Rule
    - [Define Topic before writing](rules/core/communication.md#define-topic-before-writing) — Rule
    - [Define Trigger before writing](rules/core/communication.md#define-trigger-before-writing) — Rule
    - [Reader-need filter](rules/core/communication.md#reader-need-filter) — Rule
    - [Evidence serves the reader, not the author](rules/core/communication.md#evidence-serves-the-reader-not-the-author) — Rule
    - **[Every element earns its place by serving the reader's current position in the document](rules/core/principles.md#every-element-earns-its-place-by-serving-the-readers-current-position-in-the-document)** — Sub-principle
      - [Sequencing](rules/core/communication.md#sequencing--do-not-present-what-the-reader-cannot-yet-receive) — Rule
      - [Bridging](rules/core/communication.md#bridging--close-what-came-before-earn-what-comes-next) — Rule
      - [Signposting](rules/core/communication.md#signposting--advance-the-reader-do-not-narrate-the-argument) — Rule
  - **[Shared language](rules/core/principles.md#shared-language)** — Principle
    - [Glossary](rules/core/glossary.md) — Rule
---
- **[Lean by Design](rules/core/dna.md#lean-by-design)** — Strand
  - **[Impact precedes action](rules/core/principles.md#impact-precedes-action)** — Principle
  - **[Shared scope, shared lifecycle](rules/core/principles.md#shared-scope-shared-lifecycle)** — Principle
  - **[Prefer enforcement over documentation](rules/core/principles.md#prefer-enforcement-over-documentation)** — Principle
    - [Triggers](rules/claude-code/claude-rules-system.md#triggers) — Rule
    - [One open PR at a time](rules/github/github-workflow.md#one-open-pr-at-a-time-per-user) — Rule
  - **[Start lean, don't close the door](rules/core/principles.md#start-lean-dont-close-the-door)** — Principle
---
- **[Resilient by Design](rules/core/dna.md#resilient-by-design)** — Strand
  - **[Protect assigned scope](rules/core/principles.md#protect-assigned-scope)** — Principle
    - [Route gaps to their owner](rules/core/ai-human-conventions.md#route-gaps-to-their-owner) — Rule
  - **[Preserve the source that enables recreation](rules/core/principles.md#preserve-the-source-that-enables-recreation)** — Principle
  - **[Design for durability](rules/core/principles.md#design-for-durability)** — Principle
    - [Never commit to main](rules/github/github-workflow.md) — Rule
    - [Autogenerated files](rules/claude-code/claude-rules-system.md#autogenerated-files) — Rule
---
- **[Evolving by Instinct](rules/core/dna.md#evolving-by-instinct)** — Strand
  - **[Challenge until conviction](rules/core/principles.md#challenge-until-conviction)** — Principle
    - [Honesty and challenge](rules/core/ai-human-conventions.md#honesty-and-challenge) — Rule
    - [Conviction gate](rules/core/ai-human-conventions.md#conviction-gate) — Rule
    - [Conviction at task transitions](rules/claude-code/task-management.md#conviction-at-task-transitions) — Rule
    - [Deliberation required for every CR](rules/core/ai-human-conventions.md#deliberation-required-for-every-cr) — Rule
    - [CR execution gate — deliberation package travels to implementation](rules/core/ai-human-conventions.md#cr-execution-gate--deliberation-package-travels-to-implementation) — Rule
  - **[Every gap signal is an improvement trigger](rules/core/principles.md#every-gap-signal-is-an-improvement-trigger)** — Principle
    - [Every question is an opportunity to improve the artefact](rules/core/communication.md#every-question-is-an-opportunity-to-improve-the-artefact) — Rule
    - [Every correction is an opportunity to improve the process](rules/core/ai-human-conventions.md#every-correction-is-an-opportunity-to-improve-the-process) — Rule
      - [Corrections](rules/claude-code/corrections.md) — Rule
---
- **[Pattern-seeking by Instinct](rules/core/dna.md#pattern-seeking-by-instinct)** — Strand
  - **[What holds for one holds for many — uniqueness requires justification](rules/core/principles.md#what-holds-for-one-holds-for-many--uniqueness-requires-justification)** — Principle
  - **[A misfit is a signal — redesign the container or create one](rules/core/principles.md#a-misfit-is-a-signal--redesign-the-container-or-create-one)** — Principle
  - **[Find the pattern, not the instance](rules/core/principles.md#find-the-pattern-not-the-instance)** — Principle
  - **[Scope fitness (Architectural Thinking)](rules/core/principles.md#scope-fitness-architectural-thinking)** — Principle

---

# Architecture

- **[Lean by Design](rules/core/dna.md#lean-by-design)** — Strand
---
- **[Sovereign by Design](rules/core/dna.md#sovereign-by-design)** — Strand
  - **[No vendor lock-in](rules/core/principles.md#no-vendor-lock-in)** — Principle
  - **[Prefer reversible decisions](rules/core/principles.md#prefer-reversible-decisions)** — Principle
    - [Local testing](rules/claude-code/claude-rules-system.md#local-testing) — Rule
---
- **[Uniform by Design](rules/core/dna.md#uniform-by-design)** — Strand
  - **[Domain ownership means building the shared component](rules/core/principles.md#domain-ownership-means-building-the-shared-component)** — Principle
    - [Where rules and commands live](rules/claude-code/claude-rules-system.md#where-rules-and-commands-live) — Rule
    - [Workflow](rules/claude-code/claude-rules-system.md#workflow) — Rule
    - [Deriving local copy](rules/claude-code/claude-rules-system.md#deriving-local-copy-from-claude-static) — Rule
    - [Commands](rules/claude-code/claude-rules-system.md#commands) — Rule
---
- **[Evolving by Instinct](rules/core/dna.md#evolving-by-instinct)** — Strand
  - **[Build once for many](rules/core/principles.md#build-once-for-many)** — Principle
    - [Proposing new rules](rules/claude-code/claude-rules-system.md#proposing-new-rules) — Rule
---
- **[Secure by Design](rules/core/dna.md#secure-by-design)** — Strand
  - **[Security is baseline](rules/core/principles.md#security-is-baseline)** — Principle
---
- **[Pattern-seeking by Instinct](rules/core/dna.md#pattern-seeking-by-instinct)** — Strand
  - **[Trace the flow to find the invariants](rules/core/principles.md#trace-the-flow-to-find-the-invariants)** — Principle

---

# Engineering

- **[Resilient by Design](rules/core/dna.md#resilient-by-design)** — Strand
  - **[Stateless by default](rules/core/principles.md#stateless-by-default)** — Principle

---

# Policies

- **[Preserve the ability to change](rules/core/policies.md#preserve-the-ability-to-change)** — Policy
  - [No vendor lock-in](rules/core/principles.md#no-vendor-lock-in) — enforcing principle
  - [Prefer reversible decisions](rules/core/principles.md#prefer-reversible-decisions) — enforcing principle
  - [Start lean, don't close the door](rules/core/principles.md#start-lean-dont-close-the-door) — enforcing principle

---

## Unmapped rules

Rules not yet assigned to a parent principle — workbench to resolve.

- [Conciseness](rules/core/ai-human-conventions.md#conciseness)
- [Shorthand](rules/core/ai-human-conventions.md#shorthand)
- [Autogenerated files note](rules/claude-code/claude-rules-system.md#autogenerated-files)
- [Labels](rules/claude-code/labels.md#labels)
- [Figma invariants](rules/figma/figma-integration.md#invariants)
- [`.figma/` location](rules/figma/figma-integration.md#figma-location)
- [Screen index](rules/figma/figma-integration.md#screen-index)
- [Owned artefacts](rules/figma/figma-integration.md#owned-artefacts)
