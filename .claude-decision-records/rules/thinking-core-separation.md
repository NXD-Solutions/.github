# Thinking Core Separation

## Two-layer separation of the rules network (D1)

**Trigger:** Review of `.claude/rules/core/` on 10 April 2026 identified that the folder held two distinct classes of content without structural distinction: universal thinking principles (portable, timeless, no dependency on NXD, software development, or AI tooling) alongside NXD-specific practices (organisation-scoped). Location alone gave no signal for which class a file belonged to, and new content had no structural gate at placement time.

**Decision:** Introduce two new sibling folders under `.claude/rules/` and `.claude-static/rules/`:

- `thinking-core/` — portable, timeless thinking principles
- `nxd-practices/` — NXD-specific practices (empty at creation; migration is a subsequent CR)

`core/` is not deleted or renamed. Only `dna.md` and `principles.md` move in this CR.

**Why:** Two classes of content that differ on portability and timelessness cannot be managed, extracted, or enforced without a structural boundary. A folder that mixes them signals neither class to new contributors and provides no placement gate. The separation makes the distinction machine-checkable.

`Conviction (S|L): high | high`

---

## Universality gate for `thinking-core/` (D4)

**Decision:** A file belongs in `thinking-core/` only when it satisfies all three invariants simultaneously:

1. **Universal** — no dependency on NXD, software development, or AI tooling
2. **Timeless** — the principle survives context change; it does not age with a tool or platform
3. **No domain dependency** — no named tools, platforms, or org terms appear as load-bearing references

All three must hold. Failing any one places the file outside `thinking-core/`.

**Why:** A single-invariant gate (e.g. "timeless") would admit NXD-specific content that happens to be long-lived. The three invariants together define portability — content that holds for any team, in any tool, at any time.

`Conviction (S|L): high | high`

---

## Phase discipline — classification before reframing (D7)

**Decision:** A file is classified by its intent, not by its current wording. If the intent is universal, the file is placed in `thinking-core/` now — even if its body contains known wording debt (NXD branding, "We are..." phrasing, org-specific examples). Reframing is a separate CR that follows classification.

**Why:** Deferring classification until wording is clean inverts the dependency. Wording cannot be improved systematically without ownership boundaries first established — there is no stable target to rewrite toward. Imperfect wording is acceptable debt; incorrect placement is not. Placement is the gate; reframing is the next step.

Known debt at time of decision: `dna.md` contains NXD branding and "We are..." phrasing. Five principles in `principles.md` contain NXD/software language. All travel as-is pending a dedicated reword CR.

`Conviction (S|L): high | high`

---

## Core/ migration complete — classification of remaining files (D8)

**Trigger:** PR #299 merged — `thinking-core/` and `nxd-practices/` established, making the remaining `core/` files structurally misplaced. This CR completes the migration and deletes `core/`.

**Classification: `thinking-core/`**

`communication.md` and `communicative-artefact.md` are classified as universal by the D4 gate:

- **Universal** — neither file names NXD, any software platform, or AI tooling. Both address how any writer structures and delivers information to a human reader.
- **Timeless** — the principles (evidence thresholds, sequencing, bridging, signposting, pre-writing gates) are independent of tool or platform change.
- **No domain dependency** — no named tools, org terms, or platform references appear as load-bearing content.

Both satisfy all three invariants simultaneously. They move to `thinking-core/`.

**Classification: `nxd-practices/`**

The following files are NXD-specific and do not satisfy the universality gate — they reference NXD processes, tooling, or organisational structure as load-bearing content:

- `ai-human-conventions.md` — governs the NXD AI–human working relationship; references Claude Code, CRs, deliberation process, and NXD-specific labels
- `constitution.md` — states the constitutional clause for how the NXD DNA network governs
- `debug.md` — scoped to NXD rule validation and the rule network
- `decision-log-extract.gen.md` — auto-generated NXD decision log; organisation-scoped by definition
- `glossary.md` — defines terms used in NXD DNA, principles, and rules; NXD-scoped by charter
- `invariant-storage.md` — governs artefact placement in the NXD rules network
- `policies.md` — states NXD architectural policies
- `roles.md` — defines NXD standing and task roles
- `spec-lifecycle.md` — governs NXD component spec delivery

All nine move to `nxd-practices/`.

**`core/` deletion**

`core/` is deleted from both `.claude/rules/` and `.claude-static/rules/` after all files are moved. The structural separation introduced in D1 is now complete — no files remain in the ambiguous container.

`Conviction (S|L): high | high`
