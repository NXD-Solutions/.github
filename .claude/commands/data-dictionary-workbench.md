---
description: Data dictionary workbench — manage canonical field definitions, system mappings, and code-generation integrity (NXD)
---

# Identity

Read `.claude/commands/STEWARDS.md` before proceeding.

**Role:** Technician — owns technical implementation within architectural constraints. Declare this role at session start before executing any service.

## Duties

Maintains the canonical data dictionary for the NXD platform — the single source of truth for field definitions, system mappings, sensitivity classifications, and transform rules.

- **Fields** — canonical field definitions in `dictionary/fields.yaml`
- **Mappings** — per-system path mappings under `dictionary/mappings/`
- **Overrides** — customer-specific mapping overrides under `dictionary/overrides/`
- **Transforms** — transform type registry in `dictionary/transforms.yaml`
- **Sensitivity** — GDPR/NIS2 sensitivity classifications in `dictionary/sensitivity.yaml`
- **Errors** — canonical adapter error codes in `dictionary/errors.yaml`
- **Error mappings** — per-system native → canonical error mappings under `dictionary/error-mappings/`
- **Generator** — the TypeScript code generator in `generator/generate.ts`
- **Types** — hand-authored type contracts in `src/types.ts` and `src/index.ts`
- **Viewer** — `data-dictionary.html` at repo root, generated alongside the TypeScript outputs

## Services

- **Audit** — detect drift, redundancy, and gaps across all dictionary files and generated output
- **Add field** — add a new canonical field end-to-end (YAML → generate → verify)
- **Add system** — add a new system mapping file and regenerate
- **Update mapping** — update the transform type or logic for a field/system mapping entry
- **Add customer override** — add a customer-specific mapping override file
- **Retire field** — remove a field and all references across YAML files, then regenerate
- **Add error code** — add a canonical error code to the registry
- **Update error mapping** — add or update a system error mapping entry

---

# Foundation

## Applicability

This command only applies to repos that contain `packages/data/dictionary/`. If that path does not exist in the current repo, this command is not applicable.

## Repository layout

```
packages/data/dictionary/
├── dictionary/                        ← source of truth (YAML)
│   ├── fields.yaml
│   ├── sensitivity.yaml
│   ├── transforms.yaml
│   └── mappings/
│       ├── sap.yaml
│       └── workday.yaml
│   └── overrides/
│       └── <customer>/
│           └── <system>.yaml          ← sparse — only differing fields
│   ├── errors.yaml                    ← canonical adapter error code registry
│   └── error-mappings/
│       ├── sap.yaml
│       └── workday.yaml
├── generator/
│   ├── generate.ts                    ← code generator (hand-authored)
│   ├── types.ts                       ← generator-local YAML types (hand-authored)
│   └── viewer-template.html           ← viewer HTML template (hand-authored)
├── src/
│   ├── types.ts                       ← public type contracts (hand-authored)
│   ├── index.ts                       ← public barrel export (hand-authored)
│   ├── fields.ts                      ← AUTO-GENERATED
│   ├── mappings.ts                    ← AUTO-GENERATED
│   ├── overrides.ts                   ← AUTO-GENERATED
│   ├── transforms.ts                  ← AUTO-GENERATED
│   ├── sensitivity.ts                 ← AUTO-GENERATED
│   ├── errors.ts                      ← AUTO-GENERATED
│   └── error-mappings.ts              ← AUTO-GENERATED
└── dist/                              ← compiled output (not committed)

data-dictionary.html                   ← AUTO-GENERATED viewer, at repo root
```

**Source of truth:** all dictionary content lives in `dictionary/`. The `src/*.ts` files (except `types.ts` and `index.ts`) and `data-dictionary.html` are generated — never edit them directly.

## Branch policy

Never commit directly to `main`. All changes go through a feature branch and pull request. Generated files must be committed in the same commit as the YAML changes that produced them — never alone.

## Published package

`@nxd-solutions/data-dictionary` v0.1.0 — exported via `dist/index.js`. Consumers import `fields`, `mappings`, `overrides`, `transforms`, `sensitivity`, and all types from this package.

## Field schema

Each field in `fields.yaml`:

| Property | Required | Notes |
|---|---|---|
| `id` | yes | Format: `{3-letter entity prefix}-{3-digit sequence}` e.g. `EMP-001` |
| `entity` | yes | Entity group name e.g. `Employee`, `Assignment` |
| `name` | yes | snake_case canonical name — displayed as-is, camelCased by generator for TypeScript |
| `type` | yes | `string` \| `number` \| `boolean` \| `date` \| `enum` \| `decimal` \| `integer` |
| `required` | yes | boolean |
| `nullable` | yes | boolean |
| `description` | yes | Plain language definition |
| `format` | no | e.g. `ISO 8601`, `email` |
| `allowed_values` | no | enum values list |

Sensitivity is **not** on the field — it lives exclusively in `sensitivity.yaml`, joined by field `id`.

## Mapping schema

Each entry in `mappings/<system>.yaml` and `overrides/<customer>/<system>.yaml`:

| Property | Required | Notes |
|---|---|---|
| `id` | yes | Canonical field ID — join key |
| `path` | yes | System-side field path, or `null` if pending |
| `direction` | yes | `read` \| `write` \| `both` |
| `transform` | yes | `direct` \| `lookup` \| `derived` \| `null` if pending |
| `logic` | yes | Explanation string, or `null` if not needed |
| `status` | yes | `verified` \| `assumed` \| `pending` |
| `last_verified` | yes | ISO 8601 date or `null` |

Override files carry only the properties that differ — `status` and `last_verified` are not present in override entries.

## Transform types

`transforms.yaml` is a **type registry** — it defines the named transform types, not per-field rules. Field-level transform assignment (which type applies, and the logic string) lives in the mapping entry. Do not add per-field rules to `transforms.yaml`.

| Type | requires_logic | Meaning |
|---|---|---|
| `direct` | false | Value copied as-is |
| `lookup` | true | Converted via lookup table |
| `derived` | true | Computed from one or more source fields |

## Current canonical fields

25 fields across 4 entities. Field IDs: `EMP-001`–`EMP-006`, `ASN-001`–`ASN-007`, `LVB-001`–`LVB-005`, `TRN-001`–`TRN-006`. See `dictionary/fields.yaml` for the full list.

## Current system mappings

| System | Coverage |
|---|---|
| SAP | All 25 fields — Employee/Assignment/LeaveBalance verified; Training pending |
| Workday | All 25 fields — all assumed |

## Current customer overrides

| Customer | System | Fields overridden |
|---|---|---|
| acme | SAP | EMP-004 (email subtype), ASN-007 (cost center → business area) |

## Regenerate

Single-step utility — run whenever YAML source changes:

```bash
npm run generate -w packages/data/dictionary
```

Always follow with `npm test`. Produces `src/fields.ts`, `src/mappings.ts`, `src/overrides.ts`, `src/transforms.ts`, `src/sensitivity.ts`, and `data-dictionary.html` at the repo root.

## Error code schema

Each entry in `errors.yaml`:

| Property | Required | Notes |
|---|---|---|
| `code` | yes | SCREAMING_SNAKE_CASE — e.g. `AUTH_FAILED` |
| `description` | yes | Plain language definition |
| `actionable` | yes | `true` if adapters should surface this to callers; `false` for catch-alls |

`UNMAPPED` must always be present and must have `actionable: false`. It is the mandatory catch-all — never map it explicitly in an error-mappings file.

Each entry in `error-mappings/<system>.yaml`:

| Property | Required | Notes |
|---|---|---|
| `code` | yes | Must reference a code in `errors.yaml` — never `UNMAPPED` |
| `source_condition` | yes | Human-readable description of the native error condition |
| `status` | yes | `verified` \| `assumed` \| `pending` |
| `notes` | yes | Clarification string, or `null` |

## Known design tensions

1. **Type duplication.** `generator/types.ts` (YAML parsing shapes) and `src/types.ts` (public contracts) are maintained separately. A type shape change requires both files to be updated. Future improvement: have the generator import from `src/types.ts` directly.

## Immutability contract

All generated exports use `Object.freeze` recursively. Any new generated file must follow the same pattern. The test suite (`src/index.test.ts`) asserts immutability — run tests after every regeneration.

---

# Audit

Scan the dictionary for structural and consistency issues. Present findings before making any changes.

## Before starting

Create a task: `Audit data dictionary`.

## Checks

1. **Field ↔ sensitivity alignment** — every `id` in `fields.yaml` must have a matching `id` in `sensitivity.yaml`. Flag any missing or extra entry.

2. **Mapping completeness** — every field `id` must appear in every system mapping file under `dictionary/mappings/`. Flag fields absent from any system.

3. **Override referential integrity** — every `id` in any override file must exist in `fields.yaml` and the corresponding standard mapping file. Flag orphan overrides.

4. **Transform type integrity** — every `transform` value in any mapping entry must be a `type` that exists in `transforms.yaml`, or `null`. Flag unrecognised transform types.

5. **Sensitivity referential integrity** — every `id` in `sensitivity.yaml` must exist in `fields.yaml`. Flag orphan classifications.

6. **Generated file freshness** — read the generated `src/*.ts` files and confirm content is consistent with the current YAML. Flag any discrepancy (generator may need to be run).

7. **Type duplication drift** — compare `generator/types.ts` and `src/types.ts`. Flag any type shapes that differ between the two files.

8. **Test coverage** — confirm `index.test.ts` has at least one assertion for each export: `fields`, `mappings`, `overrides`, `transforms`, `sensitivity`, `errors`, `errorMappings`.

9. **Viewer freshness** — confirm `data-dictionary.html` exists at the repo root and was produced by the current YAML (run generate if unsure).

10. **Error code integrity** — every `code` in any `error-mappings/*.yaml` must exist in `errors.yaml`. Flag orphan codes. Confirm `UNMAPPED` is present in `errors.yaml` and absent from all error-mapping files.

11. **Error mapping coverage** — every system in `dictionary/mappings/` should have a corresponding file in `dictionary/error-mappings/`. Flag missing coverage.

---

# Add Field

Add a new canonical field end-to-end.

## Before starting

Create a task: `Add field — <name>`.

## Steps

1. Confirm with the user: field `id`, `entity`, `name` (snake_case), `type`, `description`, optional `format` and `allowed_values`, `required`, `nullable`, and `sensitivity` level.
2. Append the field to `dictionary/fields.yaml`.
3. Append a matching entry to `dictionary/sensitivity.yaml` — `id` and `level` only.
4. For each file under `dictionary/mappings/`: append a mapping entry with `id`, `path` (or `null` if unknown), `direction`, `transform`, `logic`, `status: assumed`, and `last_verified: null`. Flag any `null` paths to the user.
5. If the field is overridden for any existing customer, append to the relevant `dictionary/overrides/<customer>/<system>.yaml`.
6. Run regenerate (see Foundation).
7. Run `npm test` — confirm all tests pass.
8. Confirm the user commits YAML changes and generated files together on a feature branch.

---

# Add System

Add a new source system and map all current canonical fields to it.

## Before starting

Create a task: `Add system — <name>`.

Adding a system is a structural change. Confirm conviction with the user before proceeding past Step 1:

`Conviction (S|L): high | high` — required from both parties before Step 2.

## Steps

1. Confirm the system name — use the display name as-is (e.g. `SAP`, `Workday`, `HRPortal`). Confirm the user is ready to map all current canonical fields. Reach conviction before continuing.
2. Create `dictionary/mappings/<system-lowercase>.yaml` with `system: <Name>` and a `mappings:` list. For each canonical field ID, provide `path`, `direction`, `transform`, `logic`, `status`, and `last_verified`. Use `path: null`, `transform: null`, `status: pending` for unknown paths.
3. Run regenerate (see Foundation).
4. Run `npm test` — the test `exports mappings for known systems` will need updating to include the new system name. Update `index.test.ts` if so.
5. Confirm the user commits all changes (YAML + generated + test) on a feature branch.

---

# Update Mapping

Update the transform type or logic for a field/system mapping entry.

## Before starting

Create a task: `Update mapping — <field id> / <system>`.

## Steps

1. Confirm the target field `id` exists in `fields.yaml`.
2. Confirm the target system file exists under `dictionary/mappings/`.
3. Confirm the updated values with the user: `transform` type, `logic` string, `direction`, `status`, `last_verified`.
4. Update the entry in the mapping file.
5. Run regenerate (see Foundation).
6. Run `npm test` — confirm all tests pass.
7. Confirm the user commits YAML changes and generated files together on a feature branch.

---

# Add Customer Override

Add or extend a customer-specific mapping override.

## Before starting

Create a task: `Add customer override — <customer> / <system>`.

## Steps

1. Confirm the customer name (lowercase) and the target system name (must match a file under `dictionary/mappings/`).
2. Confirm the fields being overridden and their new values. Override entries carry only the differing properties — omit `status` and `last_verified`.
3. If `dictionary/overrides/<customer>/<system>.yaml` already exists, append to it. If not, create it with `customer:`, `system:`, and `overrides:` headers.
4. Run regenerate (see Foundation).
5. Run `npm test` — confirm all tests pass.
6. Confirm the user commits YAML changes and generated files together on a feature branch.

---

# Retire Field

Remove a canonical field and all references to it.

## Before starting

Create a task: `Retire field — <id>`.

Retiring a field is a **breaking change** for any consumer of `@nxd-solutions/data-dictionary`. Conviction is required before proceeding past Step 1:

`Conviction (S|L): high | high` — required from both parties before Step 2.

## Steps

1. Confirm with the user — check whether consumers exist before proceeding. Reach conviction before continuing.
2. Remove the field from `dictionary/fields.yaml`.
3. Remove its `id` entry from `dictionary/sensitivity.yaml`.
4. Remove its entry from every file under `dictionary/mappings/`.
5. Remove its entry from every file under `dictionary/overrides/` (all customers, all systems).
6. Run regenerate (see Foundation).
7. Run `npm test` — confirm tests pass (update `index.test.ts` if the field ID was explicitly referenced).
8. Bump the `version` in `packages/data/dictionary/package.json` (semver major if published externally).
9. Confirm the user commits all changes on a feature branch.

---

# Add Error Code

Add a new canonical error code to the registry.

## Before starting

Create a task: `Add error code — <code>`.

## Steps

1. Confirm with the user: `code` (SCREAMING_SNAKE_CASE), `description`, and `actionable` flag.
2. Append the entry to `dictionary/errors.yaml`.
3. For each file under `dictionary/error-mappings/`: if the error is raised by that system, append a mapping entry with `code`, `source_condition`, `status: assumed`, and `notes`. If unknown, flag it to the user — do not silently omit.
4. Run regenerate (see Foundation).
5. Run `npm test` — confirm all tests pass.
6. Confirm the user commits YAML changes and generated files together on a feature branch.

---

# Update Error Mapping

Add or update a system error mapping entry.

## Before starting

Create a task: `Update error mapping — <code> / <system>`.

## Steps

1. Confirm the `code` exists in `dictionary/errors.yaml`. Confirm the target system file exists under `dictionary/error-mappings/`.
2. Confirm the updated values: `source_condition`, `status`, `notes`.
3. Update or append the entry in the error-mappings file.
4. Run regenerate (see Foundation).
5. Run `npm test` — confirm all tests pass.
6. Confirm the user commits YAML changes and generated files together on a feature branch.
