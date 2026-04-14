# Service Architecture

**What this surface upholds:**
A machine-readable graph of typed nodes describing the NXD Platform BE structure. The `**Version:**` header in `service-architecture.md` is the canonical version for all implementations it contains. The npm package version always matches the document version.

**What the consumer must uphold:**
- Commit `service-architecture.md` to `.claude/rules/configuration/service-architecture.md` in your repo — this loads the architecture into Claude Code system context. Copy from `node_modules/@nxd-solutions/service-architecture/service-architecture.md` when installing or upgrading.
- The committed copy must match the installed package version at all times. Run `npx @nxd-solutions/service-architecture check` in CI to enforce this.
- Every implementation of a node in this architecture carries the architecture version — version independence is not available to any node whose only contract is this architecture.
- Distribution of implementations is always atomic — all nodes ship together at the same version.
