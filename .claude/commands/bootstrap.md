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

## Invariant

Every script declared in `package.json` must pass after `git clone` + `npm install` + documented env setup. A script that has never successfully run must not exist.

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
4. Run every declared script — all must pass before the first commit
5. Apply the bootstrap checklist — no item may remain unchecked

---

# Verify

Invoked after DNA distribution on a freshly cloned repo.

1. Run every script declared in `package.json`
2. Report pass/fail for each
3. For each failure: surface what is missing — config file, plugin, or env var
4. Repo is verified only when all scripts pass
