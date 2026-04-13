# Figma Integration

Applies to repos with Figma-linked components. Procedural detail lives in `/dev:figma`.

## Invariants

**Node IDs are the stable identifier.** Figma renames do not require code renames — Code Connect maps by node ID, not by name. Do not rename a code artefact because it was renamed in Figma.

**Three-layer chain for forms.** Every form has three linked artefacts: Code Connect entry (`.figma/<Name>.figma.json`), component (`apps/*/src/components/forms/<Name>.tsx`), and a `@figma-node` + `@be-contract` JSDoc block. All three exist before a form PR is merged.

**Consistency is atomic.** When renaming or moving a form component, update the component file, Code Connect entry, and JSDoc in the same commit. When the BE interface changes, update `@be-contract` in the same commit.

**CI enforcement.** Any file matching `apps/*/src/components/forms/*.tsx` missing `@figma-node` in its JSDoc fails the build. See `.github/workflows/figma-link-check.yml`.

---

## `.figma/` location

`.figma/` lives at the root of the scope it serves. App-specific Figma data lives inside the app folder (`apps/<name>/.figma/`). Shared design system data (tokens, library) lives at package level (`packages/ui/.figma/`) when needed.

---

## Screen index

`node .claude/scripts/figma-index.cjs <path/to/.figma>` creates or updates the screen index.

**Requires:** `FIGMA_TOKEN` env var (Figma personal access token)

The script reads `project.json` for the `fileKey`, fetches the full file tree, extracts screens with content hashes, and writes `screens.json`. On subsequent runs it compares `lastModified` — if unchanged, exits immediately. If changed, diffs and reports added/removed/renamed/content-changed screens.

A full snapshot (`figma.snapshot.json`) is written locally for the Build service but gitignored.

---

## Owned artefacts

| Artefact | Committed | Purpose |
|---|---|---|
| `.figma/project.json` | yes | Project registration (fileKey, designer owner) |
| `.figma/screens.json` | yes | Screen index (node IDs, names, content hashes) |
| `.figma/figma.snapshot.json` | no | Full node tree (local build reference, gitignored) |
| `.figma/<Name>.figma.json` | yes | Code Connect entries (form → Figma node mapping) |
| `.figma/.gitignore` | yes | Excludes snapshot from remote |
