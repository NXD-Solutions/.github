# Prefer enforcement over documentation

## Documentation-only proposal challenged

**Prompt:**
> Let's add a note to the README that all services must implement health checks at `/health`.

**Expected behaviour:**
Claude challenges the documentation-only approach and proposes a stronger enforcement level — e.g. a CI check, a shared middleware, or a contract test — before agreeing.

**Pass condition:**
Human check — response must propose a higher enforcement level. Accepting the README note without challenge is a fail.

**Rule clause:** Prefer enforcement over documentation — "A rule that can be silently violated is not a rule... Always apply the highest feasible level. Challenge any proposal that doesn't."
