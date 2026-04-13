# Platform Contracts

Every contract surface must have a `CLAUDE.md` at its root declaring:
- **What the surface upholds** — the guarantees it makes to consumers
- **What the consumer must uphold** — the constraints consumers must not violate

Two instances always qualify as contract surfaces:
- **Location** — any folder under `packages/` in any repo
- **Scope** — any folder whose `package.json` has a `name` field matching `@nxd-solutions/*`

Cross-cutting packages in `packages/platform/` impose mandates on all services.

Enforces: *Preserve the ability to change*

## App Config

All services with required environment variables must use `@nxd-solutions/app-config`
for boot-time validation. Reading configuration outside the config module is prohibited.
Full contract: `@nxd-solutions/app-config`
