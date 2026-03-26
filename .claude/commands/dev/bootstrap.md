---
description: Bootstrap — create and verify repo readiness for development (NXD)
---

# Identity

Read `.claude/commands/STEWARDS.md` before proceeding.

## Duties

Owns first-clone readiness from empty repo to development-ready.

- **Repo scaffold** — `package.json`, scripts, tooling config, `.env.example`
- **Readiness verification** — all declared scripts pass after clone + install + env setup

## Ownership during Create

From the moment Create begins until the repo is confirmed development-ready, this Steward owns the repo. Execute all steps — branch creation, PRs, merges, DNA distribution, verification — without stopping to ask permission. The only valid stop is an unrecoverable blocker that genuinely requires user input. Hand off ownership by announcing the repo is development-ready.

## Services

- **Types** — display available repo types to help choose before creating
- **Process** — show what creating a repo involves, step by step
- **Create** — scaffold a new repo to first-clone ready state
- **Verify** — confirm readiness after DNA distribution

## Session preamble

After crash recovery, print exactly:

```
What would you like to do?

1. Types — display available repo types
2. Process — show what creating a repo involves
3. Create — scaffold a new repo
4. Verify — confirm readiness after DNA distribution
```

Do not display repo types or any other content at startup. Wait for the user to choose.

---

# Foundation

## Repo types

Available repo types. Currently one type is defined — the monorepo. New types are added here when formally adopted.

### Monorepo

A single repo hosting multiple apps (FE), services (BE), and shared packages (framework).

**Choose this when** the product spans multiple apps or services that share code and evolve together.

**Structure** — apps, services, shared packages:
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

# Types

Print the repo types from Foundation using this exact format — no deviation:

```
Repo Types

<Type name>

<Description>

Choose this when <criterion>.

Structure:
<path>    <stack>
...

What it enables:
- <point>
...
```

Repeat the block above for each type, separated by `---`. After the last type, add a blank line followed by:

`Currently one type is formally adopted. Additional types are added here when formally approved.`

---

# Process

Print the creation process exactly as follows — no deviation:

```
Creating a repo involves:

1. Create GitHub repo
2. Scaffold structure — package.json, scripts, tooling, .env.example
3. Distribute DNA — rules and commands from .github synced to the repo
4. Create CLAUDE.md — enforces branch policy for AI coding assistants
5. Configure branch protection on main
6. Verify — all declared scripts pass

All steps are automated by bootstrap.
```

---

# Create

1. Scaffold `package.json` with standard scripts for the stack (`build`, `lint`, `test`, `dev` — adjust per stack)
2. Install ESLint and required plugins; write config file
3. Write `.env.example` — one entry per required env var with a comment describing its purpose
4. Distribute DNA — trigger the workflow and wait for completion:
   ```bash
   gh workflow run distribute-claude-config.yml -f repo=<org/repo>
   sleep 5
   RUN_ID=$(gh run list --workflow=distribute-claude-config.yml --limit=1 --json databaseId --jq '.[0].databaseId')
   gh run watch $RUN_ID --exit-status
   ```
5. Run every verifiable script — all must pass before the first commit
6. Apply the bootstrap checklist — no item may remain unchecked

---

# Verify

Invoked after DNA distribution on a freshly cloned repo.

1. Run every verifiable script declared in `package.json`
2. Report pass/fail for each
3. For each failure: surface what is missing — config file, plugin, or env var
4. Repo is verified only when all scripts pass
