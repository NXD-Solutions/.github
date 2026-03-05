# Code Standards

## Monorepo tier placement
- `apps/<name>/` — FE applications (React/Vite). One app per directory.
- `services/<name>/` — BE services (Node.js/TypeScript). One service per directory.
- `packages/<name>/` — Shared code within this repo. Framework-agnostic. No FE/BE-specific dependencies.
- `infra/` — Root-level dev infra (Docker Compose etc.) only. Service-specific infra lives inside the service directory.

## FE app structure (`apps/<name>/src/`)
- `components/` — UI components, co-located with tests (`ComponentName.test.tsx`)
- `components/ui/` — Shared primitive components (Button, Input, etc.)
- `hooks/` — Custom React hooks
- `types.ts` — App-level shared types
- `api.ts` — API client layer (one file per app unless it grows large)

## BE service structure (`services/<name>/src/`)
- `index.ts` — Entry point
- `routes/` — HTTP route handlers
- `tools/` — MCP tool definitions (where applicable)
- `queries/` — DB query functions (delegate to `packages/db` where shared)

## Component extraction threshold
Extract a shared component to `components/ui/` when the same JSX structure appears in 3+ places.
Class reuse alone is not sufficient — structure must be identical or near-identical.

## Shared vs Framework code
**Shared** — code shared within this repo. Lives in `packages/<name>/`, `src/lib/`, or `components/ui/`.
**Framework** — code shared across repos. See `framework-standards.md`.

## Shared code
Define any value used in 2+ locations once and import it — never duplicate.
App-level shared data (e.g. nav links, route constants) lives in `src/lib/`.
Cross-app or cross-service shared logic lives in `packages/<name>/`.

## Exports
Prefer named exports over default exports in all packages and shared modules.

## Naming conventions

**TypeScript code is always camelCase.** This applies to variables, function parameters, and type/interface fields. Exceptions: environment variable names and module-level constants that are semantically immutable (fixed configuration, lookup tables, magic values — the TypeScript equivalent of C's `#define`) use `SCREAMING_SNAKE_CASE` (e.g. `GROQ_API_KEY`, `MAX_ITERATIONS`, `SYSTEM_PROMPT`).

**DB row types are camelCase.** Database column names are an implementation detail and must not appear in TypeScript types. `packages/db` is responsible for transforming snake_case column names to camelCase before returning data. Consumers of `packages/db` never handle snake_case.

**External contracts are snake_case.** REST request/response bodies, MCP tool parameters, and OpenAI tool definitions use snake_case — this matches the conventions of those protocols.

**Translation happens at the service boundary.** Each service translates between its external snake_case contract and the camelCase types from `packages/db`. This translation must not leak into shared packages.

## PostgreSQL client

All postgres.js clients must configure the `toCamel` column transform:

```ts
const sql = postgres(url, {
  transform: { column: { from: postgres.toCamel } },
});
```

This ensures DB column names (snake_case) are converted to camelCase before data reaches TypeScript — consistently across all repos. Omitting this transform violates the naming conventions rule.

## Audit skill responsibilities
A `/audit` skill must:
1. Flag violations of the rules above (tier placement, structure, extraction threshold, export style, naming conventions).
2. Identify shared code that is duplicated instead of shared — and propose the correct `packages/` location.
3. Identify shared code that is used across multiple repos — and propose promoting it to a framework package. Do not auto-promote; surface as a proposal only.
4. Flag any code that is framework by nature (e.g. security) but implemented locally — treat as a violation regardless of reuse count.
