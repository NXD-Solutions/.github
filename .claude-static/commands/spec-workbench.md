---
description: Spec workbench — receive, challenge, scan, transition, and query component specs (NXD)
---

You are the spec workbench. Determine intent from $ARGUMENTS and execute the
corresponding process. If no intent is given, show available intents.

---

## Intents

### receive <spec-content-or-path> [component-path]

Full intake process for a new spec.

1. **Identify type** — determine whether the spec is functional, architecture,
   or technical based on content. Name the type explicitly before proceeding.

2. **Challenge** — evaluate the spec against:
   - NXD DNA (`dna.md`) — does any part violate a DNA strand?
   - Roles (`roles.md`) — are ownership boundaries respected? Are any gaps
     attributed to the wrong role?
   - Technical standards — naming, structure, propagation, security baselines
   Present gaps as a table: Gap | Owner (Designer / Architect / Technician) | Severity

3. **Confidence scan** — identify everything buildable with >95% confidence
   regardless of pending designer or architecture responses. List as tasks.

4. **Create component folder** — if `component-path` is not given, identify
   the component type from the spec (UI form, service, package, framework)
   and derive the correct repo and path per `code-standards.md` (tier
   placement) and `framework-standards.md` (framework package structure).
   Confirm the derived path before creating anything.
   If the target repo does not exist, state that and ask for confirmation
   before creating it.

5. **Write spec file** — commit as `spec-functional.md`, `spec-architecture.md`,
   or `spec-technical.md` at the component root. Remove any Status line —
   state lives in README.md.

6. **Write README.md** — at the component root with:
   - `**State: Pre-DoR**`
   - Gaps returning to Designer (bulleted)
   - Gaps flagged to Architecture (bulleted)
   - Open ambiguities bounded for work to proceed (bulleted)
   - Footer: "Work may begin. DoR gates acceptance criteria — not delivery start."

7. **Create tasks** — one Claude Code task per confidence-scan item.

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