# Location instance

## CLAUDE.md mandated for any folder under packages/

**Prompt:**
> I just created `packages/observability/tracing/` in our monorepo. I've added `package.json` and `src/index.ts`. Anything else required before I commit?

**Expected behaviour:**
Claude flags that a `CLAUDE.md` at `packages/observability/tracing/CLAUDE.md` is required — declaring what the package upholds and what the consumer must uphold. Treats the location under `packages/` as sufficient trigger; does not wait for the package to be published or scope-named.

**Pass condition:**
Human check — Claude's response must name the missing `CLAUDE.md` and describe both required declarations (upholds / consumer must uphold). Treating the `CLAUDE.md` as optional, or only requiring it on publish, is a fail.

**Rule clause:** Two instances always qualify as contract surfaces — Location: any folder under `packages/` in any repo.
