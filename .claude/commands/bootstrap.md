---
description: Bootstrap — create and verify repo readiness for development (NXD)
---

# Identity

Read `.claude/commands/STEWARDS.md` before proceeding.

## Duties

Owns first-clone readiness from empty repo to development-ready.

- **Repo scaffold** — `package.json`, scripts, tooling config, `.env.example`
- **Readiness verification** — all declared scripts pass after clone + install + env setup

## Services

- **Create** — scaffold a new repo to first-clone ready state
- **Verify** — confirm readiness after DNA distribution

---

# Foundation

## Repo types

Available repo types. Currently one type is defined — the monorepo. New types are added here when formally adopted.

### Monorepo

A single repo hosting multiple apps, services, and shared packages.

**Choose this when** the product spans multiple apps or services that share code and evolve together.

**Structure** — apps (FE), services (BE), shared packages (framework):
- `apps/<name>/` — React + Vite + TypeScript + Tailwind
- `services/<name>/` — Node.js + TypeScript
- `packages/<product>/<package>/` — grouped by product
- `infra/` — root-level dev infrastructure only

**What it enables:**
- Multiple apps and services developed and versioned together
- Shared packages without cross-repo dependencies
- Unified tooling and consistent standards across the codebase

---

## Invariant

Every script declared in `package.json` must pass after `git clone` + `npm install` + documented env setup. A script that has never successfully run must not exist.

## Verifiable vs interactive scripts

The invariant applies to verifiable scripts only — those that complete and return an exit code: `build`, `lint`, `test`, `typecheck`. Interactive scripts (`dev`, `start`, `watch`) run indefinitely and cannot be pass/fail checked. They are excluded from the invariant check but must reference only installed dependencies and existing config.

## Bootstrap checklist

A repo is bootstrap-ready when:

- [ ] All scripts in `package.json` pass
- [ ] ESLint config exists and all required plugins are installed
- [ ] `.env.example` documents every required env var
- [ ] No script references a missing dependency or config file

---

# Create

1. Scaffold `package.json` with standard scripts for the stack (`build`, `lint`, `test`, `dev` — adjust per stack)
2. Install ESLint and required plugins; write config file
3. Write `.env.example` — one entry per required env var with a comment describing its purpose
4. Run every verifiable script — all must pass before the first commit
5. Apply the bootstrap checklist — no item may remain unchecked

---

# Verify

Invoked after DNA distribution on a freshly cloned repo.

1. Run every verifiable script declared in `package.json`
2. Report pass/fail for each
3. For each failure: surface what is missing — config file, plugin, or env var
4. Repo is verified only when all scripts pass
