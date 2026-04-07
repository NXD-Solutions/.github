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
- **Transforms** — field-level transform rules in `dictionary/transforms.yaml`
- **Sensitivity** — GDPR/NIS2 sensitivity classifications in `dictionary/sensitivity.yaml`
- **Generator** — the TypeScript code generator in `generator/generate.ts`
- **Types** — hand-authored type contracts in `src/types.ts` and `src/index.ts`

## Services

- **Audit** — detect drift, redundancy, and gaps across all dictionary files and generated output
- **Add field** — add a new canonical field end-to-end (YAML → generate → verify)
- **Add system** — add a new system mapping file and regenerate
- **Add transform** — add a transform rule for a field/system pair
- **Retire field** — remove a field and all references across YAML files, then regenerate

---

# Foundation

## Applicability

This command only applies to repos that contain `packages/data/dictionary/`. If that path does not exist in the current repo, this command is not applicable.

## Repository layout

```
packages/data/dictionary/
├── dictionary/                  ← source of truth (YAML)
│   ├── fields.yaml
│   ├── sensitivity.yaml
│   ├── transforms.yaml
│   └── mappings/
│       ├── sap.yaml
│       └── workday.yaml
├── generator/
│   ├── generate.ts              ← code generator (hand-authored)
│   └── types.ts                 ← generator-local types (hand-authored)
├── src/
│   ├── types.ts                 ← public type contracts (hand-authored)
│   ├── index.ts                 ← public barrel export (hand-authored)
│   ├── fields.ts                ← AUTO-GENERATED
│   ├── mappings.ts              ← AUTO-GENERATED
│   ├── transforms.ts            ← AUTO-GENERATED
│   └── sensitivity.ts           ← AUTO-GENERATED
└── dist/                        ← compiled output (not committed)
```

**Source of truth:** all dictionary content lives in `dictionary/`. The `src/*.ts` files (except `types.ts` and `index.ts`) are generated and must never be edited directly.

## Branch policy

Never commit directly to `main`. All changes go through a feature branch and pull request. Generated files must be committed in the same commit as the YAML changes that produced them — never alone.

## Published package

`@nxd-solutions/data-dictionary` v0.1.0 — exported via `dist/index.js`. Consumers import fields, mappings, transforms, sensitivity, and all types from this package.

## Current canonical fields (v0.1.0)

| Field | Type | Sensitivity |
|---|---|---|
| `employeeId` | string | none |
| `firstName` | string | pii |
| `lastName` | string | pii |
| `salary` | number | salary |

## Current system mappings

| System | Fields mapped |
|---|---|
| SAP | PERNR, VORNA, NACHN, ANSAL |
| Workday | Worker_ID, First_Name, Last_Name, Annual_Pay_Rate |

## Regenerate

Single-step utility — run whenever YAML source changes:

```bash
npm run generate -w packages/data/dictionary
```

Always follow with `npm test`. Generated files must be committed in the same commit as the YAML changes that produced them.

## Known design tensions

Open decisions, not defects. Surface to the user when relevant:

1. **Sensitivity redundancy.** `fields.yaml` carries a `sensitivity` property per field, and `sensitivity.yaml` maintains a parallel classification list (adding a `reason` annotation). The two can drift. Decision pending: which file is authoritative, or should the generator enforce consistency between them?

2. **Type duplication.** `generator/types.ts` mirrors `src/types.ts`. A type shape change requires both files to be updated manually. A future improvement: have the generator import from `src/types.ts` directly.

3. **Workday transforms absent.** `transforms.yaml` only contains SAP rules. Confirm this is intentional before adding a new system.

## Immutability contract

All generated exports use `Object.freeze` recursively. Any new generated file must follow the same pattern. The test suite (`src/index.test.ts`) asserts immutability — run tests after every regeneration.

---

# Audit

Scan the dictionary for structural and consistency issues. Present findings before making any changes.

## Before starting

Create a task: `Audit data dictionary`.

## Checks

1. **Field ↔ sensitivity alignment** — every field in `fields.yaml` must have a matching entry in `sensitivity.yaml` (same `field` name, same `level`). Flag any mismatch or missing entry.

2. **Mapping completeness** — every canonical field must appear in every system mapping file. Flag fields absent from any system's mapping.

3. **Transform referential integrity** — every `canonical` in `transforms.yaml` must name a field that exists in `fields.yaml`. Flag orphan transforms.

4. **Sensitivity referential integrity** — every `field` in `sensitivity.yaml` must name a field that exists in `fields.yaml`. Flag orphan classifications.

5. **Generated file freshness** — read the generated `src/*.ts` files and confirm their content is consistent with the current YAML. Flag any discrepancy (generator may need to be run).

6. **Type duplication drift** — compare `generator/types.ts` and `src/types.ts`. Flag any fields or interfaces that differ between the two files.

7. **Test coverage** — confirm `index.test.ts` has at least one assertion for each export (`fields`, `mappings`, `transforms`, `sensitivity`).

---

# Add Field

Add a new canonical field end-to-end.

## Before starting

Create a task: `Add field — <name>`.

## Steps

1. Confirm with the user: field `name`, `type`, `description`, `validation` constraints, and `sensitivity` level.
2. Append the field to `dictionary/fields.yaml`.
3. Append a matching classification to `dictionary/sensitivity.yaml` (same `level`, with a `reason`).
4. For each system in `dictionary/mappings/`: append a mapping entry with the correct system-side `path`. If the system-side path is unknown, flag it as `TODO` and note it for the user.
5. If a transform is needed (e.g. type coercion from a string source), append to `dictionary/transforms.yaml`.
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

1. Confirm the system name (kebab-case, lowercase — e.g. `hr-portal`) and that the user is ready to map all current canonical fields. Reach conviction before continuing.
2. Create `dictionary/mappings/<system>.yaml` with `system: <name>` and a `mappings:` list. For each canonical field, either provide the system-side path or mark as `TODO`.
3. If any fields require transforms from this system, append rules to `dictionary/transforms.yaml`.
4. Run regenerate (see Foundation).
5. Run `npm test` — the test `exports mappings for known systems` will need updating to include the new system name. Update `index.test.ts` if so.
6. Confirm the user commits all changes (YAML + generated + test) on a feature branch.

---

# Add Transform

Add a transform rule for a field/system pair.

## Before starting

Create a task: `Add transform — <field> / <system>`.

## Steps

1. Confirm the target canonical field exists in `dictionary/fields.yaml`.
2. Confirm the target system — the transform's `system` must match a file in `dictionary/mappings/`.
3. Confirm transform details with the user: `from` (source type), `to` (target type), and any format or expression rules.
4. Append the rule to `dictionary/transforms.yaml`.
5. Run regenerate (see Foundation).
6. Run `npm test` — confirm all tests pass.
7. Confirm the user commits YAML changes and generated files together on a feature branch.

---

# Retire Field

Remove a canonical field and all references to it.

## Before starting

Create a task: `Retire field — <name>`.

Retiring a field is a **breaking change** for any consumer of `@nxd-solutions/data-dictionary`. Conviction is required before proceeding past Step 1:

`Conviction (S|L): high | high` — required from both parties before Step 2.

## Steps

1. Confirm with the user — check whether consumers exist before proceeding. Reach conviction before continuing.
2. Remove the field from `dictionary/fields.yaml`.
3. Remove its entry from `dictionary/sensitivity.yaml`.
4. Remove its entries from every file under `dictionary/mappings/`.
5. Remove any transform rules referencing it from `dictionary/transforms.yaml`.
6. Run regenerate (see Foundation).
7. Run `npm test` — confirm tests pass (update `index.test.ts` if the field was explicitly referenced).
8. Bump the `version` in `packages/data/dictionary/package.json` (semver major if published externally).
9. Confirm the user commits all changes on a feature branch.
