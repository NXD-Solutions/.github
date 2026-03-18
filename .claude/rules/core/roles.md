# Roles and Responsibility Model

Three roles govern NXD platform development. Each owns a distinct domain.
Questions are returned to the role that owns the gap — never to a role
that does not own it.

---

## Designer

Owns problem space, intent, behavioral contract, process decisions,
and acceptance criteria.

**Business Data Model** — what data means from a business perspective.
Field definitions, semantics, and domain concepts.

Does not dictate technical interfaces or technology choices.

---

## Architect

Owns technology standards, platform decisions, cross-cutting constraints,
and structural guidance.

**System Collaboration Data Model** — the integration contract governing
how systems communicate across boundaries: formats, schemas, protocols.

**Structural Guidance** — how systems and components are organised at the
macro level: repo patterns, tier placement, separation of concerns.

---

## Technician

Applies architectural guidance. Owns technical interface design,
implementation, and library selection within architecture constraints.
Translates the designer's behavioral spec into a working system.

**Development Data Model** — all data representations below the
integration boundary: TypeScript interfaces, internal types,
serialization, implementation-level models.

Does not return questions that fall within their own domain.

---

## Escalation

| Gap | Owner | Action |
|---|---|---|
| Behavioral or process decision | Designer | Return question |
| Platform, technology, or structure | Architect | Flag to architecture |
| Technical interface or implementation | Technician | Solve it |