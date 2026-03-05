# Framework Standards

Framework code is shared across repos. It lives in the `NXD-Solutions/framework` monorepo and is published as npm packages consumed by individual repos.

## When code is framework
- Used across 2+ repos — promote to a framework package
- Security by nature (authentication, authorisation, encryption, audit logging) — framework regardless of reuse count. Never implement per-repo.

## Package structure
All framework packages live under `packages/<name>/` in `NXD-Solutions/framework`. Packages are topic-based — one package per concern. Never bundle unrelated functionality into a single package.

| Package | Contents |
|---|---|
| `@nxd-solutions/logger` | Structured logging, log levels, audit trail |
| `@nxd-solutions/auth` | Authentication, authorisation, token handling |
| `@nxd-solutions/ui` | Design system primitives (Button, Input, etc.) |
| `@nxd-solutions/config` | Shared env/config loading patterns |

Add packages as new cross-repo concerns are identified — do not extend an existing package beyond its stated concern.

## Package isolation (split-ready)
The framework monorepo is designed to be easy to split. Enforce from day one:
- No imports between packages — each package must be self-contained
- Each package has its own `package.json`, `tsconfig.json`, and test suite
- Shared dev tooling (ESLint, Vitest config) at monorepo root but overridable per package

Split a package into its own repo only when it requires an independent release cadence or dedicated ownership — not before.

## Distribution
Framework packages are distributed via GitHub Packages (npm-compatible registry).

- Scope all packages to the org: `@nxd-solutions/<name>`
- Publish on tag push (`v*`) via GitHub Actions using `GITHUB_TOKEN` — no extra secrets needed
- Consuming repos must have an `.npmrc` pointing to `https://npm.pkg.github.com` with a PAT (`read:packages` scope)
- Pin versions in `package.json` — do not use range specifiers (`^`, `~`) for framework packages

Do not publish framework packages to the public npm registry without explicit Architecture approval.