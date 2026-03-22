# Framework Standards

Framework concerns live under `packages/` in the monorepo. A separate framework repo
is deferred until cross-repo sharing is needed.

## Framework by nature

One implementation across all teams creates value that many independent implementations
cannot. Never implement per-repo.

| Concern | Examples |
|---|---|
| Security | Auth, authorisation, encryption, mTLS |
| Compliance | GDPR, NIS2, data residency, retention |
| Audit trail | Consistent event schema |
| Observability | Log schema, metrics contract, tracing |
| Multi-tenancy | Tenant isolation, data separation |

**The test:** would independent implementations produce waste, inconsistency, or risk
that a single implementation eliminates? If yes, flag before code is written.

## Before and after you build

**Before:** Does a local or framework component already cover this?
- Check `packages/` and any published `@nxd-solutions/*` packages
- If yes — use it. If it doesn't fully fit, propose an extension rather than a parallel implementation.

**After (if nothing existed):** Is there a structural reason this problem will recur for others?
- If yes — draft a candidate: a title and one-line description of the problem and why it recurs.
  Surface the draft and ask whether to log it. The draft is the flag; logging starts the discussion.
- This is a signal, not a commitment to build. Promotion follows the standard path below.

## When code is framework by reuse

Used across 2+ repos — promote out of the monorepo into a shared framework package.

## Package structure

Framework concerns live under `packages/<product>/<package>/`. Product folders group
related packages under one owned concern — ownership declared via CODEOWNERS.
One package per concern; never bundle unrelated functionality.

| Product | Package | Contents |
|---|---|---|
| `logging` | `logger` | Structured logging, log levels |
| `logging` | `log-schema` | Log content contract |
| `security` | `auth` | Authentication, authorisation, token handling |
| `ui` | `primitives` | Design system primitives (Button, Input, etc.) |

Add packages as new framework concerns are identified — do not extend an existing
package beyond its stated concern.

## Package isolation (split-ready)

Product folders are the natural extraction boundary. Enforce from day one:
- No imports between packages — each package must be self-contained
- Each package has its own `package.json`, `tsconfig.json`, and test suite
- Shared dev tooling (ESLint, Vitest config) at monorepo root but overridable per package

Extract a product to its own repo only when it requires an independent release
cadence or dedicated ownership — not before.

## Distribution

When packages are published cross-repo, use GitHub Packages (npm-compatible registry).

- Scope all packages to the org: `@nxd-solutions/<name>`
- Publish on tag push (`v*`) via GitHub Actions using `GITHUB_TOKEN` — no extra secrets needed
- Consuming repos must have an `.npmrc` pointing to `https://npm.pkg.github.com` with a PAT (`read:packages` scope)
- Pin versions in `package.json` — do not use range specifiers (`^`, `~`) for framework packages

Do not publish framework packages to the public npm registry without explicit Architecture approval.