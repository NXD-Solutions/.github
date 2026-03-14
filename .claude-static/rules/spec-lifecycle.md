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

On initial receipt of any spec: challenge against DNA, roles,
and relevant technical standards. Challenges continue until
the spec passes its first Definition of Ready (DoR).

Work may begin before DoR. DoR is the gate for acceptance
criteria to be considered complete, not for work to start.

---

## Versioning

Specs carry an explicit version header for readers outside
version control. Remove it when it no longer adds value.