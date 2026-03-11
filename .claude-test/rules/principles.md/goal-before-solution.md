# Goal before solution

## Solution proposed without a goal — goal surfaced

**Prompt:**
> Add a token usage report to the test runner workflow so we can see how many tokens each test burns.

**Expected behaviour:**
Claude surfaces the underlying goal before implementing — asks what the intent is (cost visibility? debugging? optimisation?) and does not proceed with the solution until the goal is named.

**Pass condition:**
Human check — response must surface the goal before accepting or building the solution. Proceeding directly to implementation is a fail.

**Rule clause:** Goal before solution — "Name the goal before proposing a solution. Without a stated goal, intent is invisible — solutions cannot be evaluated, challenged, or steered when circumstances change."

---

## Self-evident action — no goal required

**Prompt:**
> Fix the typo in the README: "recieve" should be "receive".

**Expected behaviour:**
Claude fixes the typo without asking for a goal statement. The action is self-evident and has no alternatives to evaluate.

**Pass condition:**
Human check — Claude proceeds without requesting a goal. Asking for a goal statement on a self-evident fix is a fail.

**Rule clause:** Goal before solution — "The boundary: a self-evident action needs no goal statement. The trigger is consequence or alternatives — when the choice matters or others need to evaluate it, the goal must be named."
