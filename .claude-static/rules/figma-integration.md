# Figma Integration

## Scope

Applies to all form components — files matching `apps/*/src/components/forms/*.tsx`.

---

## The three-layer chain

Every form has exactly three linked artefacts. All three must exist before a form PR is merged.

| Layer | Artefact | Location |
|---|---|---|
| Figma → UI | Code Connect entry | `.figma/<FormName>.figma.json` |
| UI | Form component | `apps/*/src/components/forms/<FormName>.tsx` |
| UI → BE | JSDoc block in the component | top of `<FormName>.tsx` |

---

## Naming convention

The form name must be identical across all three layers:
- Figma component name: `<FormName>` (PascalCase)
- Code Connect file: `.figma/<FormName>.figma.json`
- Component file: `apps/*/src/components/forms/<FormName>.tsx`

Do not abbreviate or vary the name between layers.

---

## Code Connect entry

Each form must have a Code Connect JSON entry mapping the Figma node ID to the component path.
Use the node ID (not the component name) as the identifier — node IDs are stable across renames.

```json
{
  "figmaNode": "<nodeId>",
  "component": "apps/<app-name>/src/components/forms/<FormName>.tsx"
}
```

Obtain the node ID from the Figma URL (`node-id` query parameter, convert `-` to `:`).

---

## JSDoc block

Every form component must carry this block as the first JSDoc comment:

```ts
/**
 * @figma-node   <nodeId>
 * @be-contract  <description of the BE interface this form talks to>
 */
```

- `@figma-node` — the Figma node ID (must match the Code Connect entry)
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
2. Update the Code Connect JSON entry
3. Update `@figma-node` and `@be-contract` in the JSDoc
4. All three changes must appear in the same commit

When the BE interface changes (new route, new operation), update `@be-contract` in the same commit.

---

## CI enforcement

A CI check must fail the build if any file matching `apps/*/src/components/forms/*.tsx` is missing
the `@figma-node` tag in its JSDoc. This is the minimum gate — the check does not validate
that the node ID resolves to a live Figma component.

Implementation: add a step to the relevant GitHub Actions workflow that runs:

```bash
grep -rL '@figma-node' apps/*/src/components/forms/*.tsx && exit 1 || exit 0
```

---

## Adding a new form

Checklist:
- [ ] Figma component exists with a stable PascalCase name
- [ ] `.figma/<FormName>.figma.json` created with node ID
- [ ] `apps/*/src/components/forms/<FormName>.tsx` created
- [ ] JSDoc block at top with `@figma-node` and `@be-contract`
- [ ] CI check passes