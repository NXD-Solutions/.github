# Platform Contracts

Every package in `packages/` must have a `CLAUDE.md` at its root declaring:
- **What the package upholds** — the guarantees it makes to consumers
- **What the consumer must uphold** — the constraints consumers must not violate

Cross-cutting packages in `packages/platform/` impose mandates on all services.

## App Config

All services with required environment variables must use `@nxd-solutions/app-config`
for boot-time validation. Reading configuration outside the config module is prohibited.
Full contract: `@nxd-solutions/app-config`
