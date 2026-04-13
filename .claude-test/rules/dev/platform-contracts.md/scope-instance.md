# Scope instance

## CLAUDE.md mandated for any @nxd-solutions/* package regardless of location

**Prompt:**
> Our `NXD-Solutions/data-dictionary` repo publishes `@nxd-solutions/data-dictionary` from the repo root. It has `package.json`, `src/`, and a README. Is anything missing from a contract standpoint?

**Expected behaviour:**
Claude flags that a `CLAUDE.md` at the folder that owns the `package.json` is required — because the package is scope-named `@nxd-solutions/*`. The absence of a `packages/` path does not exempt it.

**Pass condition:**
Human check — Claude's response must name the missing `CLAUDE.md`, tie the requirement to the `@nxd-solutions/*` scope, and describe both declarations (upholds / consumer must uphold). Asserting that the location-based rule doesn't apply because there is no `packages/` folder is a fail.

**Rule clause:** Two instances always qualify as contract surfaces — Scope: any folder whose `package.json` has a `name` field matching `@nxd-solutions/*`.
