---
allowed-tools: Glob, Grep, Read
description: Full codebase audit against code-standards.md (NXD)
---

## Context

Monorepo structure:
!`find apps services packages infra -maxdepth 2 -not -path "*/node_modules/*" -not -path "*/dist/*" 2>/dev/null | sort`

Source files:
!`find apps services packages -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v dist | sort`

## Your task

Audit the entire codebase against the rules in `.claude/rules/code-standards.md` (already loaded). For each check below, read the relevant files and report every violation found. If no violations, state that explicitly.

### 1. Tier placement
Verify every directory sits in the correct tier: `apps/` (FE only), `services/` (BE only), `packages/` (shared, framework-agnostic), `infra/` (root-level cluster infra only). Flag anything misplaced.

### 2. FE app structure
For each app in `apps/`, verify `src/` contains only: `components/`, `hooks/`, `types.ts`, `api.ts`. Flag unexpected directories or files. Verify tests are co-located (`ComponentName.test.tsx`), not in a separate `__tests__/` folder.

### 3. BE service structure
For each service in `services/`, verify `src/` contains only: `index.ts`, `routes/`, `tools/` (where applicable), `queries/` (where applicable). Flag unexpected directories. Flag any DB query logic not delegated to `packages/db`.

### 4. Component extraction threshold
Find any JSX structure that appears in 3+ components without being extracted to `components/ui/`. Class reuse alone does not count — structure must be near-identical.

### 5. Exports
Scan all files in `packages/` and `components/ui/` for default exports. Flag any found — named exports are required.

### 6. Naming conventions
- Scan all TypeScript source files for snake_case variable names, function parameters, and interface/type fields (excluding env var names in `SCREAMING_SNAKE_CASE`).
- Specifically check `packages/db` types: all exported interfaces must use camelCase fields only.
- Flag any snake_case field names in TypeScript types that are not env vars.

### 7. PostgreSQL client
Find all `postgres(` instantiation calls. Verify each includes `transform: { column: { from: postgres.toCamel } }`. Flag any that do not.

### 8. Redundancy
#### 8a. Structural duplication
Identify any logic, constants, or types defined in 2+ locations within the repo that could be unified in `packages/`. Propose the correct location for each.

#### 8b. Semantic redundancy
Identify cases where the same domain concern is expressed multiple times in different formats or styles — for example, the same set of operations described once as validation schemas and again as API contracts, the same business rules encoded in multiple places, or the same domain types reconstructed independently in different services.

For each finding, assess reducibility:
- **Reducible** — the representations can be unified. Propose a `packages/` location and approach.
- **Irreducible** — the representations must remain separate (e.g. different protocols require different formats). Flag as a **consistency obligation**: state explicitly what "same" means (same operation names, same required fields, same validation constraints). Add an entry to `.claude/rules/consistency-obligations.local.md` so the obligation is known to every future session and drift is caught at PR time rather than after the fact. Do not add duplicates — check if an entry already exists before writing.

### 9. Framework candidates
Identify any code that: (a) is used across 2+ repos (security, auth, logging, config), or (b) is security-related by nature regardless of reuse count. Flag these as framework candidates — do not auto-promote, surface as proposals only.

## Output format

Report findings grouped by check number. For each violation include the file path and line number. End with a summary table:

| Check | Status | Violations |
|---|---|---|
| 1. Tier placement | ✓ / ✗ | count |
| ... | | |