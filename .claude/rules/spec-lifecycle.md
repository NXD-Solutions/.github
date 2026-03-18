# Spec Lifecycle

---

## Types

Each spec is named by the expertise that owns it.

| Type | Filename | Owner |
|---|---|---|
| Functional / behavioral | `spec-functional.md` | Designer |
| Architecture / integration | `spec-architecture.md` | Architect |
| Technical | `spec-technical.md` | Technician |

---

## Source of truth — functional specs

`spec-functional.md` is authored and maintained in Confluence.
The git copy is the last explicitly synced version — what implementers are
working against. The Confluence page ID is stored in `README.md`
(`**Confluence:** <pageId>`).

Run `/spec-workbench sync` to pull a new version and assess the impact of
changes. The process this workbench implements is defined in Confluence page
50987010 (Spec Delivery Process). Run `/spec-workbench adapt` to detect and
propose alignment when the page and the skill drift.

---

## Location

Every spec lives at the root of its component folder.
Each component has its own specs — no shared spec folders.

---

## Project acceptance

On acceptance, create the component folder and commit the spec
immediately — before any code. The folder is the component:
everything about it lives there, nothing outside it.
Delete the folder and nothing is orphaned.

---

## Challenge process

Run `/spec-workbench receive` to perform intake — challenge,
confidence scan, folder creation, and task generation are
handled by the skill.

Work may begin before DoR. DoR is the gate for acceptance
criteria to be considered complete, not for work to start.

---

## State

Every component folder contains a `README.md` that carries the current
lifecycle state and a comment explaining why the component is in that state.
The state is not stored in the spec file.

| State | Meaning |
|---|---|
| `Pre-DoR` | Accepted as realistic; challenge in progress; DoR not yet passed |
| `DoR passed` | Spec has passed Definition of Ready; implementation may proceed |
| `Implemented` | Component delivered against this spec |
| `Superseded` | Replaced by a later version |

---

## Versioning

Specs carry an explicit version header for readers outside
version control. Remove it when it no longer adds value.

---

## Work package (candidate)

*To be validated after a full development cycle. See `.claude-test/rules/spec-lifecycle.md/` for the evaluation test.*

**Acceptance** — artefacts required to accept a component:

- Component folder created
- `spec-functional.md` committed before any code
- `README.md` with lifecycle state (`Pre-DoR`) and a comment explaining why

**Implementation** — artefacts required to mark a component `Implemented`:

- All implementation artefacts agreed at DoR
- `README.md` state updated to `Implemented`
- Specs updated if they changed during implementation