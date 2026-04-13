---
description: Figma steward — register, DoR, form creation, and screen index (DNA)
---

# Identity

Read `.claude/commands/STEWARDS.md` before proceeding.

## Duties

- **Register** — run the one-time Figma project registration for this repo
- **Form DoR** — run the pre-acceptance gate before a form component enters implementation
- **Add Form** — create a new form component with all three linked artefacts
- **Screen Index** — create or update the screen index for a `.figma/` folder

## Services

- **Register** — verify prerequisites, run the acceptance gate, and write `.figma/project.json` and the root `README.md` design entry
- **Form DoR** — check all hard gates, flag soft gates, and confirm the structure before any code is written
- **Add Form** — create the Code Connect entry, component file with JSDoc block, and confirm CI passes
- **Screen Index** — run `figma-index.cjs`, report what changed, and commit updated `screens.json`

---

# Foundation

## Invariants

These hold regardless of tooling. Violations block a PR.

- **Node IDs are the stable identifier.** Figma renames do not require code renames — Code Connect maps by node ID, not name.
- **Three-layer chain for forms.** Every form has exactly three linked artefacts: Code Connect entry, component, and JSDoc block. All three exist before a form PR is merged.
- **Consistency is atomic.** Renaming or moving a form updates the component file, Code Connect entry, and JSDoc in the same commit. BE interface changes update `@be-contract` in the same commit.
- **CI enforcement.** Any file matching `apps/*/src/components/forms/*.tsx` missing `@figma-node` in its JSDoc fails the build.

## Registration gate

No form DoR may proceed until `Register` has been completed for this repo. Verify `.figma/project.json` exists before allowing any form work to begin.

## `.figma/` location

`.figma/` lives at the root of the scope it serves. App-specific Figma data lives inside the app folder (`apps/<name>/.figma/`). Shared design system data lives at package level (`packages/ui/.figma/`) when needed.

## Owned artefacts

| Artefact | Committed | Purpose |
|---|---|---|
| `apps/<name>/.figma/project.json` | yes | Project registration (fileKey, designer owner) |
| `apps/<name>/.figma/screens.json` | yes | Screen index (node IDs, names, content hashes) |
| `apps/<name>/.figma/figma.snapshot.json` | no | Full node tree (local build reference, gitignored) |
| `apps/<name>/.figma/<Name>.figma.json` | yes | Code Connect entries (form → Figma node mapping) |
| `apps/<name>/.figma/.gitignore` | yes | Excludes snapshot from remote |

---

# Register

One-time setup. Run before any form component enters DoR.

## Prerequisites

- [ ] **[hard]** Figma API access confirmed — MCP tool calls must succeed before the gate can run
- [ ] **[hard]** Dev team has view access to the Figma file

## Acceptance gate

- [ ] **[hard]** File is a proper Figma project — not a draft, personal file, or community fork being actively edited without permission
- [ ] **[hard]** File structure is navigable — pages and components are organised, not a dumping ground
- [ ] **[hard]** A named designer owner is identified and reachable
- [ ] **[soft]** Community or third-party files: confirm licence permits use in production

## Prompting for the URL

When asking the user for the Figma URL, include the expected format inline — do not wait for them to ask:

> Please share the Figma project URL. It looks like:
> `https://www.figma.com/design/<fileKey>/<fileName>`
> The `fileKey` is the alphanumeric segment after `/design/`. Your URL may also include `?node-id=...` — that identifies a specific component or frame and can be ignored for registration.

## Registration

Once the acceptance gate passes, register the project in two places:

**Root `README.md`** — human entry point, linked from onboarding:
```md
## Design
Figma: <url>
```

**`apps/<name>/.figma/project.json`** — machine-readable metadata:
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

# Form DoR

Pre-acceptance gate. All hard gates must pass before implementation begins. Soft gates are checked and flagged — they do not block implementation but must be noted.

## Identity

- [ ] **[hard]** Canonical PascalCase name chosen — spelling verified
- [ ] **[hard]** Figma component is a proper component, not a frame or group — only components have stable node IDs
- [ ] **[hard]** All form-factor variants identified — full list of node IDs confirmed before any code is written

## Design completeness

- [ ] **[hard]** All field states present in the design: default, focus, error, disabled, loading — missing states block full implementation
- [ ] **[hard]** Component marked ready for development in Figma — not draft or WIP

## Structure preview

- [ ] **[hard]** Proposed file structure presented to and approved by the developer before any code is written: component path(s), Code Connect entries, `@be-contract` value

## Integration readiness

- [ ] **[hard]** BE interface confirmed to exist — route or MCP tools are implemented before the form, not in parallel
- [ ] **[hard]** No existing form covers the same use case — a form that should be extended must not be duplicated

## Dependencies (flag if applicable)

- [ ] **[soft]** Does the form imply a DB schema change? If yes, track as a blocking dependency.
- [ ] **[soft]** Is there a named designer owner in Figma who has signed off the component as final?

---

# Add Form

Creates all three linked artefacts for a new form component. Run after DoR passes.

## Naming

The canonical PascalCase name (confirmed at DoR) drives all filenames. It should match the Figma component name for readability, but a Figma rename never requires a code rename — the Code Connect mapping uses the node ID.

## Code Connect entry

Create `apps/<name>/.figma/<CanonicalName>.figma.json`:

```json
{
  "figmaNode": "<nodeId>",
  "component": "apps/<app-name>/src/components/forms/<CanonicalName>.tsx"
}
```

Obtain the node ID from the Figma URL (`node-id` query parameter — convert `-` to `:`).

If Figma defines separate nodes per form factor (mobile, tablet, desktop), each node gets its own Code Connect entry, all pointing to the same component file.

## Form factors

Use one responsive component (Tailwind breakpoints) as the default. List all form-factor node IDs in `@figma-node`; each gets its own Code Connect entry pointing to the same file.

Split into separate files (`<CanonicalName>.mobile.tsx`, `<CanonicalName>.desktop.tsx`) only when the layouts share no logic. In that case each file carries its own `@figma-node` for the relevant node ID, all files carry the same `@be-contract`, and each file gets its own Code Connect entry.

## JSDoc block

Every form component must carry this block as the first JSDoc comment:

```ts
/**
 * @figma-node   <nodeId> [<nodeId2> ...]  (one per form-factor node if multiple)
 * @be-contract  <description of the BE interface this form talks to>
 */
```

`@be-contract` format examples for this repo:

```ts
// REST
 * @be-contract  POST /api/users

// MCP + web-api
 * @be-contract  POST /chat → mcp-tools: create_task, update_task (queued write via /apply)
```

## Checklist

- [ ] Canonical PascalCase name confirmed from DoR
- [ ] Figma component node ID(s) obtained from the Figma URL
- [ ] `apps/<name>/.figma/<CanonicalName>.figma.json` created — one entry per form-factor node if multiple
- [ ] `apps/*/src/components/forms/<CanonicalName>.tsx` created with JSDoc block (`@figma-node` and `@be-contract`)
- [ ] CI check passes (`figma-link-check` workflow)

---

# Screen Index

Creates or updates `screens.json` for a `.figma/` folder.

## Project selection

1. Discover all `.figma/project.json` files in the repo
2. If one — run it, no prompt
3. If multiple — list them with project names, ask which to check (or "all")

## Run

```bash
FIGMA_TOKEN=<token> node .claude/scripts/figma-index.cjs <selected-path>
```

Where `<selected-path>` is resolved by Project selection above. Requires `FIGMA_TOKEN` env var (Figma personal access token).

## What it does

1. Reads `project.json` for the `fileKey`
2. Fetches the file tree from the Figma REST API
3. Compares `lastModified` — if unchanged since last run, exits immediately
4. If changed: extracts screens with content hashes, diffs against `screens.json`, and reports added / removed / renamed / content-changed screens
5. Writes updated `screens.json` and a full snapshot (`figma.snapshot.json`) — snapshot is gitignored

## When to run

- When starting a new build cycle — before referencing `screens.json` as a source of truth
- When the designer signals a Figma update
- Anytime `lastModified` on the Figma file may have advanced

## After running

Commit the updated `screens.json` if screens changed. Do not commit `figma.snapshot.json`.