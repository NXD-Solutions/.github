# Roles and Responsibility Model

A role is a named lens applied to a unit of work — see [glossary](glossary.md#role). Standing roles carry domain ownership across all work. Task roles are declared per unit of work without standing ownership.

Questions are returned to the role that owns the gap — never to a role that does not own it.

---

## Standing roles

### Designer

Owns problem space, intent, behavioral contract, process decisions,
and acceptance criteria.

**Business Data Model** — what data means from a business perspective.
Field definitions, semantics, and domain concepts.

Does not dictate technical interfaces or technology choices.

---

### Architect

Owns technology standards, platform decisions, cross-cutting constraints,
and structural guidance.

**System Collaboration Data Model** — the integration contract governing
how systems communicate across boundaries: formats, schemas, protocols.

**Structural Guidance** — how systems and components are organised at the
macro level: repo patterns, tier placement, separation of concerns.

---

### Technician

Applies architectural guidance. Owns technical interface design,
implementation, and library selection within architecture constraints.
Translates the designer's behavioral spec into a working system.

**Development Data Model** — all data representations below the
integration boundary: TypeScript interfaces, internal types,
serialization, implementation-level models.

Does not return questions that fall within their own domain.

---

## Task roles

Declared for a unit of work. No standing ownership — any executor may claim them. Expected to grow as gaps are encountered.

| Role | Lens |
|---|---|
| Librarian | Elements are present and correctly formed |
| Author's advocate | Work serves the author's intent |
| Reviewer | Quality, completeness, and fitness for purpose |
| Domain owner | Correctness within a bounded domain concern |

---

## Escalation

| Gap | Owner | Action |
|---|---|---|
| Behavioral or process decision | Designer | Return question |
| Platform, technology, or structure | Architect | Flag to architecture |
| Technical interface or implementation | Technician | Solve it |
| DataDictionary structural change | Architect | Information Architect recommends, Architect accepts |