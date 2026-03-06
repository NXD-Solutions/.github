# Figma Integration

## Scope

Applies to all form components — files matching `apps/*/src/components/forms/*.tsx`.

---

## Figma project registration

A Figma project must be formally registered before any form DoR can run. This is a one-time
step per repo.

### Prerequisites

- [ ] **[hard]** Figma API access confirmed — MCP tool calls must succeed before the gate can run
- [ ] **[hard]** Dev team has view access to the Figma file

### Acceptance gate

- [ ] **[hard]** File is a proper Figma project — not a draft, personal file, or community fork being actively edited without permission
- [ ] **[hard]** File structure is navigable — pages and components are organised, not a dumping ground
- [ ] **[hard]** A named designer owner is identified and reachable
- [ ] **[soft]** Community or third-party files: confirm licence permits use in production

### Registration

Once accepted, register the project in two places:

**`README.md` (root)** — human entry point, linked from onboarding:
```md
## Design
Figma: <url>
```

**`.figma/project.json`** — machine-readable metadata:
```json
{
  "fileKey": "<fileKey>",
  "projectName": "<name>",
  "url": "<url>",
  "designerOwner": "<name or null>",
  "status": "accepted",
  "registeredAt": "<YYYY-MM-DD>"
}
```

The `fileKey` is extracted from the Figma URL: `figma.com/design/<fileKey>/...`

---

## The three-layer chain

Every form has exactly three linked artefacts. All three must exist before a form PR is merged.

| Layer | Artefact | Location |
|---|---|---|
| Figma → UI | Code Connect entry | `.figma/<CanonicalName>.figma.json` |
| UI | Form component | `apps/*/src/components/forms/<CanonicalName>.tsx` |
| UI → BE | JSDoc block in the component | top of `<CanonicalName>.tsx` |

---

## Naming convention

The developer chooses a canonical PascalCase name for the form at creation time. This name drives the filename and Code Connect filename. It should match the Figma component name for readability, but a Figma rename does not require a code rename — the Code Connect mapping uses the node ID (stable), not the component name.

Do not rename a form component just because it was renamed in Figma.

---

## Definition of Ready — pre-acceptance gate

Before a form component enters implementation, all hard gates must pass. Soft gates must be
checked and flagged if applicable — they do not block implementation but must be noted.

**Identity**
- [ ] **[hard]** Canonical name chosen — spelling verified, naming convention compliant *(naming convention: TBD — define before first form)*
- [ ] **[hard]** Figma component is a proper component, not a frame or group — only components have stable node IDs
- [ ] **[hard]** All form-factor variants identified — full list of node IDs confirmed before any code is written

**Design completeness**
- [ ] **[hard]** All field states present in the design: default, focus, error, disabled, loading — missing states block full implementation
- [ ] **[hard]** Component marked ready for development in Figma — not draft or WIP

**Structure preview**
- [ ] **[hard]** Proposed file structure presented to and approved by the developer before any code is written: component path(s), Code Connect entries, `@be-contract` value

**Integration readiness**
- [ ] **[hard]** BE interface confirmed to exist — route or MCP tools are implemented before the form, not in parallel
- [ ] **[hard]** No existing form covers the same use case — a form that should be extended must not be duplicated

**Dependencies (flag if applicable)**
- [ ] **[soft]** Does the form imply a DB schema change? If yes, track as a blocking dependency.
- [ ] **[soft]** Is there a named designer owner in Figma who has signed off the component as final?

---

## Code Connect entry

Each form must have a Code Connect JSON entry mapping the Figma node ID to the component path.
The node ID is the stable identifier — it does not change when a Figma component is renamed.

```json
{
  "figmaNode": "<nodeId>",
  "component": "apps/<app-name>/src/components/forms/<CanonicalName>.tsx"
}
```

Obtain the node ID from the Figma URL (`node-id` query parameter, convert `-` to `:`).

If Figma defines separate nodes per form factor (mobile, tablet, desktop), each node gets its own
Code Connect entry, all pointing to the same component file.

---

## Form factors

Use one responsive component (Tailwind breakpoints) as the default. All form-factor node IDs are
listed in `@figma-node` and each gets its own Code Connect entry pointing to the same file.

Split into separate files (`<CanonicalName>.mobile.tsx`, `<CanonicalName>.desktop.tsx`) only when
the layouts share no logic. In that case:
- Each file carries its own `@figma-node` for the relevant node ID
- All files carry the same `@be-contract`
- Each file gets its own Code Connect entry

---

## JSDoc block

Every form component must carry this block as the first JSDoc comment:

```ts
/**
 * @figma-node   <nodeId> [<nodeId2> ...]  (one per form-factor node if multiple)
 * @be-contract  <description of the BE interface this form talks to>
 */
```

- `@figma-node` — the Figma node ID(s) (must match the Code Connect entries)
- `@be-contract` — free-form description of the BE interface: endpoint, operations, or service

Each repo defines its own convention for `@be-contract`. Example formats:

```ts
// REST service
 * @be-contract  POST /api/users

// MCP + web-api (this repo)
 * @be-contract  POST /chat → mcp-tools: create_task, update_task (queued write via /apply)

// BFF / GraphQL
 * @be-contract  mutation CreateTask (TaskService)
```

---

## Consistency obligations

When renaming or moving a form component:

1. Update the component filename
2. Update the Code Connect JSON entry (filename and `component` path)
3. Update `@figma-node` and `@be-contract` in the JSDoc
4. All three changes must appear in the same commit

A Figma component rename does **not** require a code rename — node IDs are stable.

When the BE interface changes (new route, new operation), update `@be-contract` in the same commit.

---

## CI enforcement

A CI check must fail the build if any file matching `apps/*/src/components/forms/*.tsx` is missing
the `@figma-node` tag in its JSDoc. This is the minimum gate — the check does not validate that
the node ID resolves to a live Figma component.

See `.github/workflows/figma-link-check.yml`.

---

## Adding a new form

Checklist:
- [ ] Canonical PascalCase name chosen
- [ ] Figma component node ID(s) obtained from the Figma URL
- [ ] `.figma/<CanonicalName>.figma.json` created — one entry per form-factor node if multiple
- [ ] `apps/*/src/components/forms/<CanonicalName>.tsx` created (responsive) or split files if layouts share no logic
- [ ] JSDoc block at top with `@figma-node` and `@be-contract`
- [ ] CI check passes