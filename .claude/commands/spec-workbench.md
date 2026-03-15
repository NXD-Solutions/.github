---
description: Spec workbench — receive, challenge, scan, transition, and query component specs (NXD)
---

You are the spec workbench. Determine intent from $ARGUMENTS and execute the
corresponding process. If no intent is given, show available intents.

The process this skill implements is described in Confluence page 50987010
(Spec Delivery Process). That page is the source of truth. Use `adapt` to
detect and propose alignment when the page and this skill drift.

---

## Process gate — DNA, feasibility, and reasonableness

Before proposing any change that implements or aligns with a process, validate
all three:

1. **DNA** — does the process align with NXD DNA (`dna.md`)? A process that
   violates a DNA strand must not be implemented regardless of intent.
2. **Feasible** — can it be implemented with the tools and context available?
3. **Reasonable** — does it impose burden disproportionate to the value it
   delivers? A process step that makes the implementer's life unnecessarily
   hard without clear return is not reasonable.

If any gate fails: counter-propose a change to the process page. Do not
propose changes to the skill. Stop until the page is updated.

---

## Intents

### receive <confluencePageId> [component-path]

Intake process for a new functional spec from Confluence.

1. **Fetch** — retrieve the page using `mcp__claude_ai_Atlassian__getConfluencePage`
   with `contentFormat: "markdown"`. Present the title and a one-line summary
   before proceeding.

2. **Question** — evaluate the spec against:
   - NXD DNA (`dna.md`) — does any part violate a DNA strand?
   - Roles (`roles.md`) — are ownership boundaries respected? Are any gaps
     attributed to the wrong role?
   - Technical standards — naming, structure, propagation, security baselines
   Present gaps as a table: Gap | Owner (Designer / Architect / Technician) | Severity
   If any blocker-severity gaps exist, explain why the spec will not be received
   yet and stop. The spec writer must address these in Confluence and resubmit.

3. **Confidence scan** — identify everything buildable with >95% confidence
   regardless of pending designer or architecture responses. List as tasks.

4. **Create component folder** — if `component-path` is not given, derive it
   from the spec content and confirm before creating. Use the structure:
   `<product>/<package>/` within the target repo.

5. **Write spec file** — commit the fetched content as `spec-functional.md`
   at the component root. Remove any Status line — state lives in README.md.

6. **Write README.md** — at the component root with:
   - `**State: Pre-DoR**`
   - `**Confluence:** <confluencePageId>`
   - Gaps returning to Designer (bulleted)
   - Gaps flagged to Architecture (bulleted)
   - Open ambiguities bounded for work to proceed (bulleted)
   - Footer: "Work may begin. DoR gates acceptance criteria — not delivery start."

7. **Create tasks** — one Claude Code task per confidence-scan item.

---

### sync <component-path>

Sync a functional spec from Confluence and assess the impact of changes.

1. **Read README.md** — extract the Confluence page ID from the `**Confluence:**`
   line. If not present, stop: this component has no Confluence source.

2. **Fetch** — retrieve the current page using
   `mcp__claude_ai_Atlassian__getConfluencePage` with `contentFormat: "markdown"`.

3. **Diff** — compare the fetched content against the existing `spec-functional.md`.
   Present a summary of what changed: additions, removals, and modifications by
   section. If there are no changes, stop and report "Spec is already up to date."

4. **Code impact assessment** — scan the component folder and any code that
   implements this spec. For each spec change, identify:
   - Code that must change (contract broken or behaviour changed)
   - Code that may need revisiting (implementation assumption affected)
   - Code unaffected (change is additive or clarifying only)

5. **Blocker check** — if any spec change is ambiguous enough that consequences
   cannot be assessed, present the ambiguity and stop. Do not update git until
   resolved. Hard changes are not blockers — only unassessable ones are.

6. **Plan** — group all identified work into two buckets:
   - **Now** — clear scope, no unknowns
   - **Later** — complex, risky, or dependent on unresolved decisions
   Present as a table: Task | Bucket | Affected code | Notes

7. **Create tasks** — one Claude Code task per **Now** item. Later items are
   listed in the plan but not tasked.

8. **Update git** — overwrite `spec-functional.md` with the fetched content.
   Commit: `Sync spec-functional.md for <component> from Confluence`.

---

### adapt

Read the process page and propose changes to align this skill with it.

1. **Fetch process page** — retrieve Confluence page 50987010 using
   `mcp__claude_ai_Atlassian__getConfluencePage` with `contentFormat: "markdown"`.

2. **Apply process gate** — validate the process as described against DNA,
   feasibility, and reasonableness (see Process gate above).
   If any gate fails: present the finding, counter-propose a specific change
   to the process page, and stop. Do not proceed to step 3.

3. **Compare** — read the current skill (this file) and identify gaps between
   what the process page describes and what the skill implements:
   - Steps present in the page but missing or incomplete in the skill
   - Steps in the skill that contradict the page
   - Terminology or framing that has drifted

4. **Propose** — present a specific, numbered list of changes to this skill
   that would close the gaps. Do not apply them. Wait for conviction from
   both parties before any file is modified.

---

### challenge [component-path]

Re-run challenge on an existing spec.

1. Read `spec-*.md` at the component root.
2. Evaluate against DNA, roles, and current technical standards.
3. Present gaps as a table: Gap | Owner | Severity | New since last challenge?
4. Do not update README or create tasks — output only.

---

### scan [component-path]

Confidence scan only — no folder or file changes.

1. Read `spec-*.md` at the component root (or accept spec content inline).
2. Identify everything buildable with >95% confidence.
3. Output as a numbered task list ready for `TaskCreate`.

---

### transition <component-path> <state> "<reason>"

Move a component to a new lifecycle state.

Valid states: `Pre-DoR` | `DoR passed` | `Implemented` | `Superseded`

1. Read the current README.md.
2. Update the State line.
3. Append a transition record:
   ```
   **<date> — Transitioned to <state>**
   <reason>
   ```
4. Commit with message: `Transition <component> to <state>`.

---

### status [component-path]

Show current state for a component.

1. Read README.md at the component root.
2. Output: state, open gaps by owner, last transition, and any open tasks
   linked to this component.
