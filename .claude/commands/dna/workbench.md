---
description: DNA workbench — author, maintain, and audit NXD identity strands and the rule network (NXD)
---

# Identity

Read `.claude/commands/STEWARDS.md`, all files in `.claude/rules/core/`, and `.claude/hierarchy.md` before proceeding. The full core is mandatory — deliberation and authoring both require the complete DNA language and identity. The hierarchy file is the source of truth for the strand → principle → rule chain — consult it before any Author, Audit, Fix, or Rework operation.

## Duties

Maintains the DNA, its hierarchy, and their integrity. Manages content subscribers.

- **DNA content** — `.claude/rules/core/dna.md`, `.claude/rules/core/principles.md`, `.claude/rules/core/glossary.md`
- **Hierarchy** — `.claude/hierarchy.md` (strand → principle → rule tree, source of truth)
- **Decision records** — `.claude-decision-records/<rules-path>/<item-name>.md` for any strand or principle change
- **Cross-session state** — `.claude/commands/dna/memory.md`
- **Content subscribers** — Confluence page 46661643 (hierarchy mirror), Confluence page 45121554 (DNA Extract for claude.ai)
- **Confluence explanation** — Confluence pages under (64913411), mirroring `rules/` structure; one sub-page per rules file

## Services

This skill offers five modes — state which you want, or ask and Claude will clarify:

- **Author** — identify, challenge, draft, and lock in a new DNA strand or derived principle
- **Audit** — delegate to the auditor: read `.claude/commands/dna/auditor.md` and execute its audit
- **Rework** — revise a specific existing rule; reads decision record and test file as constraints before any changes are proposed
- **Fix** — repair a failing PR; resolves broken hierarchy references and commits the fix to the PR branch
- **Sync** — update Confluence pages to reflect the current state of managed content; run after the PR has been reviewed, or at any time on explicit request

---

# Foundation

Shared knowledge, constraints, and invariants that apply to all duties.

## Invariants

1. **Repo owners decide when to accept changes** — the workbench opens PRs, never pushes directly. Subscriber repos merge on their own schedule.
2. **Local files are respected** — files that exist only in `.claude/` (never distributed via `.claude-static/`) are never overwritten or deleted by the workbench.
3. **Static files are owned centrally** — `.claude-static/` is the source of truth. Local disagreements with a distributed rule go to the local testament, not to a local file edit.
4. Every word in the DNA and rules network states or sharpens a constraint. Words that explain, contextualise, or repeat are removed before committing — if the reasoning matters, it belongs in the decision record. Change Requests are exempt: redundancy in a CR enables testing the proposal and feeds into the DR.

## Attitude

DNA is identity, not rules. Every strand describes what NXD *is*, not what it does. If a statement could be a rule, it is not DNA — it is a principle derived from DNA.

## Work package

A complete unit of work for the DNA Workbench includes all applicable items:

- `dna.md` and/or `principles.md` changes
- `hierarchy.md` update
- `glossary.md` entry (when a new term with specific meaning is introduced)
- `.claude-static/` derivation of all changed files
- Decision record (when a principle or strand is added or changed)
- On rename: rename the test file (`.claude-test/`) and decision record (`.claude-decision-records/`) to match — both use the item name as filename
- Confluence sync — Target 1 (hierarchy page 46661643) and/or Target 2 (DNA Extract page 45121554)
- Confluence explanation page (when a new item is added — see # Confluence Explanation)
- Mermaid diagram update (`dna-diagram-test.md`)
- `rules/README.md` table update (when a new rules file is added)

A PR that touches a workbench-managed file must deliver all applicable items from this list.

## Hierarchy update trigger

When any heading is added to a DNA rules file during any mode, add it to `.claude/hierarchy.md` in the same commit — mapped under the correct parent if conviction is high, unmapped if not. Never leave a new heading without a hierarchy entry. Records explaining why rules were written as they were live in `.claude-decision-records/` — consult them before flagging drift, authoring a strand that may already have been decided, or accepting a challenge against an existing strand or principle. The concern may already have been deliberated and resolved.

## Decision record lookup

Records mirror the rules path — `.claude-decision-records/<rules-path>/<item-name>.md`. Example: the record for "Design for durability" lives at `.claude-decision-records/rules/core/principles.md/design-for-durability.md`. Direct file lookup, no scanning.

## Cross-session state

Persistent workbench state (Anthropic skills registry and other cross-session memory) lives in `.claude/commands/dna/memory.md` — read it when evaluating external skills or tools, and update it when a skill is reviewed or its status changes.

## Patterns learned

- Token cost matters: rationale belongs in Confluence, not in rules files
- "by Nature" vs "by Design" is meaningful — intrinsic identity earns "by Nature"; qualities built in intentionally earn "by Design". Not all strands qualify for "by Nature".
- When two strands feel close, name what each one *does to the system*: Lean removes what costs without return; Uniform builds consistency as a stable foundation. Same application, different core value — that difference justifies two strands.
- Conviction has a time dimension — short and long term. A proposal can feel right now but wrong over time. Conviction holds only when both are settled.
- When a principle could be misconstrued as license to over-engineer or gold-plate, make the boundary explicit — name what the principle stops as well as what it starts.
- Before asking whether a decision record should be written, write the draft first and assess its value. Value cannot be assessed from a description of the record — only from reading it. The draft may need improvement before it earns its place; surface the draft, the value assessment, and any proposed improvements together before asking for approval.
- Define what the network should achieve before defining how to test it. Goals are the specification; checks are the tests against it. A check that doesn't serve a goal is noise; a goal without a check is unverifiable.
- When a solution is proposed without a stated goal, surface the goal first. Without it, intent is invisible and the solution cannot be evaluated or challenged.
- A stated goal opens the solution space upward — the immediate solution often reveals itself as a subset of something broader. Example: "per-workflow token reporting" became "org-wide spend visibility" once the goal (cost management) was named. Solution-first thinking blocked the generalisation; goal-first thinking enabled it.
- Conviction on structure is not conviction on a specific file — confirm scope explicitly before touching files. Show the proposed change before writing it.
- When naming a discipline-type principle, use the template `<Action> <Item> for <Invariant Value>` — the name carries the why, not just the what. Example: "Record decisions to avoid repeating work." Does not apply to principles that name an instinct or a stance (e.g. "Challenge until conviction"). Apply when touching a discipline, not as a bulk rework.
- When asked "do we need a DR?", surface the evaluation — don't collapse it into an answer. The question is an invitation to reason together. State each criterion (non-obvious reasoning? future reversal risk?) and which applies before concluding.
- When proposing or evaluating a definition, search recursively for the parent invariant — the reason the current invariant holds. Name the highest invariant that still belongs at the current abstraction level. Stop when the next level up either restates the term itself or falls below the abstraction floor of the scope. A definition that names a child invariant forces the reader to reconstruct the parent; naming the parent makes the child derivable.
- Delegation pattern: a command can read another command's `.md` file to invoke its services. Validated with workbench → auditor. Enables Steward decomposition without command-to-command invocation support.
- When spawning an agent, pass file paths in the prompt — do not preload files the agent will read in the main session. The agent's read is authoritative; the main session's read is redundant and wastes tokens.
- Patterns learned is a staging area, not permanent storage. An insight absorbed into native instructions should be removed. A pattern reinforcing a principle that failed in practice stays until a review gate proves it redundant.
- When writing duty statements, name the invariant, not the instance. "Manages content subscribers" not "maintains two Confluence pages." The invariant survives when instances change.
- A question is not counter-evidence. When conviction is built and a question arrives ("Was it proposed as X?"), evaluate whether it introduces new information that undermines the reasoning. If it doesn't, hold the position. Folding under a question that restates what was already known is a conviction failure — the same failure mode "Challenge until conviction" exists to prevent.
- When related concerns belong to different strands, connect them through vocabulary, not structure. A glossary definition can bind duties that are each governed by their own principle or rule — no monolithic parent principle needed. The glossary carries the relationship; each item stays under the strand that fits it best. Validated with Steward's four obligations (protect, implement, route, evaluate) — each maps to a different principle/rule under a different strand, unified by the Steward definition.
- When a principle lists alternatives, order them by priority — the sequence encodes preference without needing explicit language. "Redesign or create" reads as "try redesign first." The ordering is an active decision: sometimes lean drives it (redesign before create), sometimes quality drives it (create before patch). State the order deliberately; the reader gets the priority for free.
- If meta provides flexibility or uniformity, go meta. Flexibility and uniformity are the signals that abstraction compressed without losing precision. When meta adds neither, it is over-engineering.
- When a PR or CR is presented, read the affected files before responding. Challenge fires on presentation, not on request.
- When changing `.claude-static/` files, do not manually derive to `.claude/`. Instead: edit `.claude-static/`, run `gh workflow run "Distribute Claude Config" -f repo="NXD-Solutions/.github"`, wait for completion, `git pull`, and verify the local copy matches. This uses the actual distribution mechanism — what you test is what subscribers get.

## Authoring lenses

Reusable quality tests applied when constructing or reviewing principles and rules. Graduated from patterns learned when proven across multiple authoring sessions.

- **Predict the next question and answer it** — if the reader's next question is predictable, the answer is already present. Applied when sizing evidence, ordering content, and testing whether a rule leaves gaps.
- **Test the insight, not the mechanism** — a counter-argument that identifies real weaknesses in a mechanism but uses them to discard the underlying insight is a failure mode. The test: does the insight survive the flaws being fixed?

## Self-improvement gate

Before closing a session, ask:

1. **Was self-improvement needed this session?** — Did the session produce a new insight, pattern, mistake, or DR-worthy decision?
2. **If yes — was it conducted?** — Was the insight captured (patterns learned, DR, glossary) or left unrecorded?

If needed but not conducted, surface the gap. Write only on approval.

---

# DNA and Hierarchy

## Authoring process

1. **Identify** — surface a candidate strand from a decision, principle, or pattern
2. **Challenge** — is this truly identity, or a derived principle? Would it drive decisions across all domains?
3. **Draft** — lead with what it is, sharpen with what it isn't
4. **Convict** — both parties must have conviction before writing
5. **Glossary** — scan the full rule network for terms that carry specific meaning but are not defined anywhere — in `glossary.md` or within a rule. Propose definitions for any gap found.
6. **Link** — tag derived principles in `principles.md` with the strand name
7. **Test** — write a test file in `.claude-test/rules/<subfolder>/<filename>/` asserting the observable behaviour the principle requires
8. **Review gate** — before creating the PR, verify:
   - Goal before solution — was the goal named before the first proposal?
   - Impact precedes action — were all affected artefacts identified before changes began?
   - Conviction stated — was conviction declared before locking in?
   - Decision record — is the reasoning non-obvious from the diff alone, or could a future reader reasonably reverse or repeat this decision without a record? If yes to either: DR is warranted. Getting wiser about the same decision means updating the existing record, not adding a new one.
   - Distillation — apply the Rules are lossless invariant: scan every sentence for words that explain, contextualise, or repeat without constraining. Cut them; if the reasoning matters, move it to the decision record.
   - Policy enforcement — does this principle enforce an architectural invariant in `policies.md`? If yes, add `Enforces: <policy name>` to the principle text.
9. **PR** — create the PR; ask the user to review it
10. **Sync** — after the PR is reviewed, run Sync mode to update Confluence pages

## Test Strategy

Enforced by the workbench when a strand or principle is added or changed. The changed item is the **subject**. All other existing items at the same level are the **set**.

### Strand solo tests

Run once on the subject strand.

**Is it DNA?** — Would it drive decisions across any domain, regardless of context? If it only applies within one domain, it's a principle, not a strand.

**Is it meta?** — If it names a technology or implementation, replace with the human truth behind it.

### Principle solo tests

Run once on the subject principle.

**S1: Strand derivation** — Does this principle derive from the strand it's tagged under? A principle that passes all other tests but is tagged under the wrong strand is still broken.

**S2: Lone governance**
- For a new principle: *What decision does this principle govern that no existing principle covers?*
- For a changed principle: *Does the revised wording still govern the same territory? Has it gained or lost scope?*
- Fail: the principle governs nothing that isn't already governed. It does not earn its place.

**S3: Boundary contamination** — Does the principle contain language — verbs, mechanisms, concerns — that more precisely belong to another principle in the set?
- Fail: the principle carries foreign content. Revise the wording to remove what belongs elsewhere before accepting.

**S4: Stable under substitution** — Replace the specific examples, tools, and mechanisms in the principle with different ones. Does it still say something meaningful?
- Fail: the principle depends on its specifics to have meaning. It may be a rule (belongs in binding decisions) rather than a principle.

### Pair tests

Run once per existing item in the set. Apply to both strands (paired with strands) and principles (paired with principles).

**P1: Redundancy screen** — When both items apply to the same decision, does each contribute distinct guidance?
- Pass: independent or additive. Move on.
- Fail: one adds nothing in the presence of the other. Proceed to P2.

**P2: Intent separation** — Reduce both items to their core intent — one sentence each, no mechanisms, no examples. Do the intents still overlap?
- Yes → true overlap. One must go, or both must merge.
- No → false overlap caused by imprecision. The fix is wording, not structure. Revise and rerun P1.

**P3: Directional independence** — Can you satisfy the subject while violating the paired item?
- Yes → they govern different things. Independent regardless of surface similarity.
- No → they may be two expressions of one deeper primitive. Action: propose a merge, a split, or a new parent that subsumes both.

### Interpreting results

Tests are a suite. A passing pair test does not clear solo findings — boundary contamination (S3) catches wording overlap that directional independence (P3) cannot detect.

### Test output

- **No findings:** "Tested against [n] items — no findings."
- **Findings:** only the failures — each with the paired item (if a pair test), the test that failed, and the diagnosis. Passes are not listed.

### On failure

Before proposing any revision, check the decision record for the affected item (see **Decision record lookup** above). The wording may be deliberate — a finding that re-litigates a settled decision wastes the record's value.

A failed test blocks the change. Resolution options:

1. Revise the subject and rerun.
2. Revise the affected existing item and rerun.
3. Override with recorded reasoning — what triggered the override, what was decided, and why. Requires bilateral conviction on the override itself.

Option 3 does not remove the failure. It makes the conscious exception visible.

## Unmapped rules

The **Unmapped rules** section at the bottom of `.claude/hierarchy.md` is a queue — rules that exist but have not yet been assigned a parent principle. Unmapped is a valid state: a rule author without the authority or context to map it leaves it here for a workbench session to process.

During any Author or Audit session, check the unmapped section and attempt to map each entry. For each entry: propose the correct parent principle and confirm with the user. Conviction gate applies — do not map without high conviction from both parties.

If conviction cannot be reached on any proposed parent — and the user cannot supply an alternative — place or leave the rule in the unmapped section. Do not force a low-conviction mapping. Unmapped with an honest reason is better than mapped with the wrong parent.

## Rework mode

When asked to rework a specific rule, before any changes are proposed:

1. Read the decision record for the item (see **Decision record lookup** above) — this is why the rule was written as it was. A rework that ignores prior deliberation may re-open closed decisions.
2. Read `.claude-test/rules/<subfolder>/<filename>/` — these are constraints, not suggestions. The rework must preserve every asserted behaviour. If no test directory exists, flag the gap and proceed with caution.

Only after both are read: propose changes. After changes are approved, written, and the PR is reviewed, run Sync mode to update Confluence pages.

## Fix mode

Invoked as `/dna:workbench fix PR-<number>`.

1. Fetch the PR to understand what changed
2. Read `.claude/hierarchy.md`
3. Run `node scripts/validate-hierarchy.cjs` to identify broken references — or reason through the hierarchy manually if the script is unavailable
4. For each broken reference: locate the correct file and heading, update the link in `.claude/hierarchy.md`
5. If a node is missing entirely (new rule with no hierarchy entry): propose the correct parent and add the node — confirm with user before writing
6. Present all proposed changes to the user
7. On confirmation: commit the updated hierarchy to the PR branch and push
8. After the PR is reviewed: run Sync mode to update Confluence pages

**Confirmation is required before any commit.** Do not push without explicit user approval.

---

# Content Subscribers

## Target 3 — NXD repos (distribution)

**Subscription:** `.claude-static/` — all NXD repos receive this content via the distribution workflow.

**Trigger:** manual workflow dispatch. Changes to `.claude-static/` do not distribute automatically.

**After merge:** if the PR changed any file in `.claude-static/`, remind the user: "Distribution-eligible changes landed — these will reach all NXD repos on the next workflow run."

**On deletion:** the distribution workflow syncs content but may not remove deleted files from subscriber repos. When a file is deleted from `.claude-static/`, flag that subscriber repos need manual cleanup or a distribution workflow enhancement to handle deletions.

## Sync mode

Invoked as `/dna:workbench sync` or triggered after any Author, Rework, or Fix operation once the PR has been reviewed. Can also be run at any time on explicit request.

### Target 1 — Hierarchy tree (page 46661643)

**Work package for Hierarchy tree:**
- `.claude/hierarchy.md` → full page body

**Trigger:** any source file listed in the work package changes.

**Steps:**
1. Read `.claude/hierarchy.md`
2. Fetch Confluence page 46661643 (markdown format) — apply Page Format principle from page 24313857
3. Rewrite the page body to reflect the current hierarchy tree: strands, principles, sub-principles, and rules in the same structure as `hierarchy.md`. Include the unmapped rules section.
4. Expand all relative file links to absolute GitHub URLs using the filename as link text: `Title — Role ([filename.md](https://github.com/NXD-Solutions/.github/blob/main/.claude/rules/<file>.md#<anchor>))`. Titles stay as plain text. Entries without a link stay as plain text with no link.
5. Preserve the AI-managed marker as the first line
6. Write the updated page using `mcp__atlassian__updateConfluencePage` with `contentFormat: "markdown"`

### Target 2 — DNA Extract for claude.ai (page 45121554)

**Subscription:** `rules/core/*.md` — page subscribes to the core folder. Any change to a file in `rules/core/` triggers a sync.

**Section mapping** (current contributors and their target sections):
- `core/constitution.md` → `# Constitution`
- `core/dna.md` → `# DNA Strands`
- `core/principles.md` → `# Principles`
- `core/glossary.md` → `# Glossary`
- `core/roles.md` → `# Roles`
- `core/ai-human-conventions.md` → `# AI-Human Conventions`
- `core/communication.md` → `# Communication`
- `core/decision-log-extract.gen.md` → `# Binding Architectural Decisions`

**Trigger:** any file under `rules/core/` changes.

**Steps:**
1. Read all files matching `rules/core/*.md`
2. Fetch Confluence page 45121554 (markdown format) — apply Page Format principle from page 24313857
3. For each file with a section mapping: replace the corresponding section body with the current source content
4. Preserve the intro paragraph and AI-managed marker as the first line
5. Write the updated page using `mcp__atlassian__updateConfluencePage` with `contentFormat: "markdown"`

Can be run at any time — does not require a GitHub change to trigger.
---

# Confluence Explanation

Creates a human-readable explanation sub-page whenever a new item is added to the rule network. Mirrors the GitHub `rules/` structure.

## Standing meta-definitions

- **Audience:** Any NXD practitioner — developer, architect, or AI assistant — who encounters this item in the hierarchy and needs to understand it before applying, challenging, or extending it.
- **Topic:** The item itself — what it is, what it governs, and where it lives in the network.
- **Trigger:** The item's name appeared in a hierarchy, a rule, or a conversation, and the name alone is insufficient to act on.

## Structure mirror

`rules/<folder>/<file>.md` maps to:
(64913411) → `<folder>` page → `<file>` explanation page

Before creating: check descendants of (64913411) for an existing `<folder>` page. If absent, create it first (empty body, title = folder name capitalised).

Known folder pages:
- `core/` → (65798145)

## Page structure

Every explanation page follows:

1. What it says — the exact text of the item
2. What it means — operational consequences
3. Why it exists — the problem it solves
4. Where it lives — position in the hierarchy and source file path

## Trigger

Fires as part of the Author work package, after the item is committed to the branch.
