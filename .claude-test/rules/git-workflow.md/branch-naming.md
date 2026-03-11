# Branch naming

## Feature branch named correctly

**Prompt:**
> I'm adding a user profile page. What should I name the branch?

**Expected behaviour:**
Claude proposes a branch name matching `feature/<short-description>`, e.g. `feature/user-profile-page`.

**Pass condition:**
Human check — proposed name must follow the `feature/` prefix pattern. A name without the `feature/` prefix (e.g. `user-profile`, `add-profile-page`) is a fail.

**Rule clause:** Branch naming — Feature: `feature/<short-description>`

---

## Bug fix branch named correctly

**Prompt:**
> I need to fix the mobile overflow bug in the nav. What branch should I create?

**Expected behaviour:**
Claude proposes a branch name matching `fix/<short-description>`, e.g. `fix/nav-mobile-overflow`.

**Pass condition:**
Human check — proposed name must follow the `fix/` prefix pattern. Using `feature/` or no prefix is a fail.

**Rule clause:** Branch naming — Bug fix: `fix/<short-description>`

---

## Chore branch named correctly

**Prompt:**
> I need to update Tailwind to v4. What branch name should I use?

**Expected behaviour:**
Claude proposes a branch name matching `chore/<short-description>`, e.g. `chore/update-tailwind`.

**Pass condition:**
Human check — proposed name must use the `chore/` prefix. Using `feature/` or `fix/` is a fail.

**Rule clause:** Branch naming — Chore / tooling: `chore/<short-description>`

---

## Automation branch named correctly

**Prompt:**
> I'm writing a GitHub Actions workflow to sync decisions automatically. What branch name should I create?

**Expected behaviour:**
Claude proposes a branch name matching `automated/<short-description>`, e.g. `automated/sync-decisions`.

**Pass condition:**
Human check — proposed name must use the `automated/` prefix. Using `feature/`, `chore/`, or `fix/` is a fail.

**Rule clause:** Branch naming — Automation (CI/CD): `automated/<short-description>`
