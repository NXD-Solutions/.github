# Records — principles.md

Decision records for `.claude/rules/core/principles.md`. One entry per important change — anything that can answer "why did we write it as we did."

Trivial changes (spelling, single word additions) do not require a record.

---

## Impact precedes action

**Date:** 2026-03-18
**Authors:** Peter Sixhøj & claude-sonnet-4-6

**Concern:** During the rules subfolder reorganisation, two sets of affected artefacts were missed before execution started: (1) a pre-existing rename (`git-workflow.md` → `github-workflow.md`) not propagated to commands that referenced it; (2) structural mirrors (`.claude-decision-records/`, `.claude-test/`) not identified as part of the same unit of work. Both were discovered mid-execution — after changes were already partially applied. Without a principle naming the obligation to identify all dependents before starting, the same gap recurs.

**Decision:** Principle added under *Lean by Design* (Culture): before the first change is made, the full set of affected artefacts must be known. Three categories: structural mirrors (files that duplicate the same structure elsewhere), content references (files that name or link to the changed artefact), and semantic dependents (tests, documentation, examples that assert the artefact's behaviour). All are part of the same unit of work. Incomplete scope discovered mid-execution is waste.

**Related:** Lean by Design (parent), Shared scope, shared lifecycle (complementary — artefacts that belong together live together; this principle names the obligation to identify them before starting), Unit of work (glossary — the principle operationalises what constitutes a complete unit of work)

**Trigger:** Rules subfolder reorganisation session — two mid-execution discoveries named the gap and prompted the principle.

**Alternatives considered:** "When renaming a rule file, check commands" — rejected, too specific; misses semantic dependents and only fires on rename. Adding to Rework mode only — rejected, the obligation applies to all execution contexts. "Impact analysis" as a process step — the name "Impact precedes action" chosen to signal prerequisite, not optional step.

**Conviction (S|L):** high | high

**Value:**
- *Waste eliminated* — incomplete scope discovered mid-execution is the source of rework; naming it up front prevents it
- *Correctness* — the unit of work is complete at commit time, not at "I think that's all" time
- *Consumer benefit* — AI has an explicit trigger: before the first file is touched, name all three categories of dependents
- *Cognitive focus* — explicit scope commitment makes later additions visible as scope creep, not undiscovered work

---

## The task list is a contract

**Date:** 2026-03-10
**Authors:** Peter Sixhøj & claude-sonnet-4-6

**Concern:** Work was being done without externalising the plan. Both parties knew what was happening within the flow of conversation, but a returning participant — after lunch, after a crash, or after a context switch — had no fixed point to orient from. The task list existed as a tool but its role as a shared contract was not named.

**Decision:** Principle added under *Transparent by Nature*: externalise all work as tasks before starting, regardless of size. The task list is a contract — both parties see what will happen before it happens. Whether the work is a single step or many, the mechanism is the same. A contract that exists only in the AI's context is not a contract — it cannot be observed, challenged, or recovered.

The threshold was deliberately set to 1 (all work) rather than 3+ steps. A single-task list serves two purposes beyond sequencing: orientation for a returning participant, and a crash-recovery anchor.

**Related:** Transparent by Nature (parent), Task list for all work convention in `ai-human-conventions.md` (implements), Task crash recovery convention (extends)

**Trigger:** Session exploring how to improve user use of Claude Code Tasks. Observation that the task list provided a fixed orientation point — "previously I had to scroll through the command to understand what you were doing at the moment." Named the principle behind the practice.

**Alternatives considered:** Threshold of 3+ steps — rejected, single-step tasks still serve the orientation and crash-recovery purposes. "For multi-step work" framing — rejected, the word "contract" applies regardless of length; the value is the shared visibility, not the sequencing.

**Conviction (S|L):** high | high

**Value:**
- *Orientation* — a returning participant sees current state at a glance without asking
- *Crash recovery* — tasks are the anchor that `memory/tasks.md` preserves across session death
- *Shared visibility* — the contract is observable and challengeable before execution begins
- *Transparency* — the AI's work is not opaque; it is structured and verifiable

---

## Prefer reversible decisions

**Date:** 2026-03-09
**Authors:** Peter Sixhøj & claude-sonnet-4-6

**Concern:** *Sovereign by Design* had one principle (No vendor lock-in) covering one specific form of irreversibility. The strand's intent — own your choices, preserve your ability to change — applies to every architectural and design decision, not just vendor selection. Without a broader principle, sovereignty only fires at vendor evaluation and misses architectural coupling, data structures, and design choices that quietly remove optionality.

**Decision:** Add *Prefer reversible decisions* as the parent principle that No vendor lock-in derives from. Vendor lock-in is one instance of irreversible dependency; this principle covers all instances. The "unless clearly justified" boundary prevents over-engineering — abstraction layers added "just in case" are not justified. The cost framing ("paid once upfront vs. compounds silently") gives AI and humans a practical test: is the cost of reversibility justified by the risk of irreversibility?

**Related:** Sovereign by Design (parent), No vendor lock-in (child — specific instance of this principle)

**Trigger:** DNA audit — Sovereign by Design flagged as underrepresented with one principle covering only vendor lock-in. The strand's broader intent was not operationalised.

**Alternatives considered:** Multiple specific principles (data portability, loose coupling, etc.) — rejected in favour of one parent principle that covers all cases; specific instances can be added as Engineering principles if needed. Dropping the "unless clearly justified" qualifier — rejected, without it the principle becomes a license to over-engineer every decision.

**Conviction:** high | high

**Value:**
- *Correctness* — sovereignty is now applied at every design decision, not just vendor selection
- *Waste eliminated* — irreversible decisions caught before they compound into rewrites
- *Consumer benefit* — AI flags tight coupling, hardwired structures, and shared databases with the same authority as vendor lock-in
- *Speed* — reversibility costs less to build in upfront than to retrofit after the fact

---

## Build context that lasts

**Date:** 2026-03-10
**Authors:** Peter Sixhøj & claude-sonnet-4-6

**Concern:** Multiple practices (decision records, waste archive) share the same underlying intent — building knowledge that outlasts the moment it was created — but no principle named that intent. The practices existed without a parent that explained why they exist.

**Decision:** Principle added under *Transparent by Nature* as the parent of "Record decisions, not just outcomes" and the waste archive practice. Names the intent: document why, not just what. The boundary is explicit — only non-obvious or consequential decisions earn a record; routine actions create noise.

**Related:** Transparent by Nature (parent), Record decisions, not just outcomes (child), .claude-waste/ archive (child practice)

**Trigger:** A hiring session surfaced the trait "Transparent communicator — documents why, not just what. Leaves context that survives the session." The phrasing matched what we had built and named the discipline behind it.

**Alternatives considered:** Treating this as a discipline (H1 grouping) rather than a principle — rejected, it governs a specific behaviour, not a container for multiple disciplines. Including "Write for the widest audience first" as a child — rejected, that principle governs how to write; this governs why. Different concerns.

**Conviction:** high | high

**Value:**
- *Correctness* — the intent behind decision records and the waste archive is now named; future practices can derive from the parent rather than from the specific examples
- *Context preservation* — the principle itself demonstrates what it preaches: it records why the practice exists, not just what it requires
- *Cognitive focus* — the boundary sentence prevents over-documentation; readers have an explicit test for whether a record is warranted

---

## Challenge until conviction

**Date:** 2026-03-08

**Authors:** Peter Sixhøj & claude-sonnet-4-6

**Concern:** Proposals were being accepted without sufficient challenge. Short-term conviction was treated as sufficient — long-term impact was not consistently tested before locking in.

**Decision:** Challenge before committing, not after. Conviction must hold short AND long term. The boundary is explicit: challenge ends at conviction; what follows is execution — not gold-plating.

**Related:** Evolving by Instinct (parent), Lean by Design (resolved tension)

**Trigger:** Authoring the conviction gate convention surfaced that the principle behind it was missing from principles.md.

**Alternatives considered:** No explicit boundary on challenge — rejected, creates gold-plating risk. Challenge until "good enough" — rejected, "good enough" is not a testable gate.

**Conviction:** high | high

---

## Record decisions, not just outcomes

**Date:** 2026-03-08

**Authors:** Peter Sixhøj & claude-sonnet-4-6

**Concern:** Changes to DNA, principles, and rules were being made without capturing the reasoning behind them. A future reader — human or AI — would see what was decided but not why. This creates opaque evolution and undermines informed auditing.

**Decision:** Add a principle requiring important changes to the rule network to be recorded with their trigger, reasoning, and conviction level. "Important" means anything that can answer "why did we write it as we did" — trivial changes (spelling, single word additions) are excluded. Records live in `.claude-decision-records/`, are not loaded into the system prompt, and are mutable — updated in place when we get wiser, with git as the history layer.

**Related:** Transparent by Nature (parent), Evolving by Instinct (enables)

**Trigger:** Reviewing dna.md surfaced that no record existed for why strands were written as they were.

**Alternatives considered:** Immutable records (append-only) — rejected in favour of mutable records updated in place. Overlapping records hurt transparency more than they help. `.claude/records/` nested folder — rejected in favour of `.claude-decision-records/` as a sibling to `.claude/` for clean separation and navigability.

**Conviction:** high | high

**Value:**
- *Transparency* — a change without its reasoning is opaque; the record makes it legible to any observer
- *Context preservation* — the record survives the session; a future human or AI can resume without starting over. The why, the alternatives rejected, and the conviction at the time are all recoverable
- *Cognitive focus* — auditors and authors consult records before challenging existing decisions; this prevents relitigating settled questions

**Tests:** Does this principle pass "Record decisions, not just outcomes" applied to itself? Yes — this record is the proof.

**Examples:** This record.

**Outcome:**

---

## Trace the flow before building

**Date:** 2026-03-09
**Authors:** Peter Sixhøj & claude-sonnet-4-6

**Concern:** No principle existed that named the design discipline of seeking the overarching structure before implementing. Teams and individuals defaulted to building at the specifics level, producing solutions that couldn't survive change because their structure was never separated from their implementation.

**Decision:** Principle added under *Lean by Design* and *Uniform by Design* — the first principle tagged with two strands. The discipline: trace the expected data flow before building. The flow reveals sub-components and their boundaries, and once validated becomes the processing strategy. Each step is a replaceable component. The recursive dimension is explicit: once the strategy is visible, apply the same question to the strategy itself. Each level of abstraction reached is another level of freedom gained.

**Related:** Lean by Design (parent — building at the wrong abstraction level is waste), Uniform by Design (parent — the flow is the consistent foundation), Build once for many (enables — the structure reveals what is reusable), No vendor lock-in (complementary — replaceability at the structure level extends beyond vendors)

**Trigger:** A real-world story: Peter was asked to build a news distribution system for mobile units. The boss could not answer any question about content, source, device type, or operator. Rather than waiting for specifics, the data flow was derived from the problem statement alone — receive → normalise → format for device → format for operator — and implemented as a strategy pattern with stubbed components. Later, making the strategy itself replaceable revealed a second meta level. The principle captures both the discipline and the recursive instinct the story demonstrated.

**Alternatives considered:** Single parent strand — rejected, the principle genuinely serves Lean (avoids waste from wrong abstraction) and Uniform (creates consistent foundation) equally; forcing one parent misrepresents it. Splitting into two principles (mindset vs. outcome) — rejected, the discipline and the recursive outcome belong together; splitting produces two thin principles that only make sense in combination. Deriving from *Sovereign by Design* — considered but rejected; sovereignty links too tightly to external dependencies, and the principle applies equally in fully internal systems with no vendor involvement.

**Conviction:** high | high

**Value:**
- *Correctness* — solutions designed from the flow are correct at the structural level before any implementation decision is made; specifics cannot break the structure
- *Waste eliminated* — building at the wrong abstraction level is the most expensive form of rework; the flow prevents it before a line of code is written
- *Consumer benefit* — each step is a replaceable component; consumers can substitute any step without rewriting the whole
- *Cognitive focus* — the flow is a shared artefact that makes the design legible to any reader before implementation begins
- *Speed* — validated flow means implementation decisions are made in the right order; no backtracking from hardwired specifics

**Examples:**
> Receive news → normalise → format for device → format for operator
>
> Four steps, four replaceable components, derived with zero specifics known. Making the strategy itself replaceable revealed a second meta level — the same pipeline pattern applicable to any transformation sequence.

---

## Build once for many

**Date:** 2026-03-09
**Authors:** Peter Sixhøj & claude-sonnet-4-6

**Concern:** Framework promotion was purely reactive — code becomes shared after a second repo picks it up. No trigger existed at creation time to flag candidates. By the time a second repo needs something, someone may have already built their own version in parallel. The gap is structural: the rules told AI when to promote, not when to ask whether to promote.

**Decision:** Principle added under *Evolving by Instinct* that fires at creation — not at reuse. Two modes honoured: proactive (seeing structural recurrence at first encounter, before others feel the pain) and reactive (experience as teacher — pain felt is a signal to act so others don't feel it again). Proactive is the ideal; reactive is the fallback. Both are valid triggers for the same outcome. Paired with a practical trigger in `framework-standards.md` asking the question explicitly at build time.

**Related:** Evolving by Instinct (parent), Domain ownership means building the shared component (enables), When code is framework by reuse in `framework-standards.md` (implements)

**Trigger:** Session exploring how to encourage AI to identify framework candidates earlier in the development cycle. The innovation angle surfaced: the "genius" is recognising a problem will be universal without needing to see it repeated — some learn from anticipated pain, some from experienced pain. The principle must honour both.

**Alternatives considered:** Proactive-only framing ("see structural recurrence at first encounter") — rejected, forgets that experienced pain is also a valid and important teacher; the principle would implicitly shame reactive learners. Reactive-only ("flag after reuse") — already covered; adds nothing. "Look before you build" as a Lean principle — rejected, the core concern is contribution (flagging candidates for others), not just avoiding duplication for oneself.

**Conviction:** high | high

**Value:**
- *Correctness* — framework candidates are surfaced before duplication occurs, not after
- *Waste eliminated* — parallel implementations of the same gap prevented at source
- *Consumer benefit* — AI has an explicit trigger to fire during development, not just during audit
- *Cognitive focus* — the question is structural ("will others face this?"), not anecdotal ("have I seen this before?")
- *Speed* — flagging while context is fresh costs less than consolidating after the fact

---

## Domain ownership means building the shared component

**Date:** 2026-03-09

**Authors:** Peter Sixhøj & claude-sonnet-4-6

**Concern:** When uniformity is discouraged, every team inherits full ownership of every concern — including deep ones like GDPR, NIS2, and security. Most teams lack the time to go deep enough. The result: teams act in good faith, believe they have done it correctly, and have not. The failure is not negligence — it is structural. Depth requires focus. A team that partially owns ten concerns cannot go deep enough on any of them.

**Decision:** A principle naming the obligation that comes with domain ownership: the owner is not just the expert — they are accountable for ensuring a framework component exists and is used across all projects. They may delegate the build; they may not delegate the outcome. This closes the gap between "we have a security team" and "every project is actually secure."

**Related:** Uniform by Design (parent), Security is baseline (complementary — Security is baseline says never per-repo; this principle names the accountability structure that makes that true)

**Trigger:** Authoring Uniform by Design derived principles. Real experience from an organisation where uniformity was discouraged: teams cross-examined on GDPR and NIS2 compliance held genuine but incorrect beliefs. The failure was not negligence — it was the predictable result of distributing deep concerns across generalists without the time to go deep.

**Alternatives considered:** "Centralise expertise" — rejected, too passive; expertise without the obligation to deliver a component leaves the problem structurally unsolved. Scoping to security only — rejected, the same failure mode applies to logging, observability, and any concern requiring depth that generalists cannot sustain.

**Conviction:** high | high

**Examples:** Security team owns authentication — they ensure `@nxd-solutions/auth` exists and is used. Operators own log contents — they ensure the logging component implementing the contract is in place.