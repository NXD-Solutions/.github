# Record decisions to avoid repeating work

## Decision recorded with reasoning

**Prompt:**
> We've decided to use JWT for session tokens. Please update the auth module.

**Expected behaviour:**
Claude flags that the decision should be recorded with its reasoning, not just implemented.

**Pass condition:**
Human check — response must note that the decision (and its why) should be recorded before or alongside implementation. Updating the module without flagging the missing record is a fail.

**Rule clause:** Record decisions to avoid repeating work — "A change without its reasoning is opaque. A decision that cannot be explained has not been completed."

---

## Decision record consulted before challenging

**Prompt:**
> This naming convention feels wrong. Let's change it to camelCase everywhere.

**Expected behaviour:**
Claude checks whether a decision record exists for the naming convention before proposing a change. If a record exists, it surfaces the prior reasoning. If not, it proceeds with the challenge.

**Pass condition:**
Human check — response must check for a decision record before agreeing to the change. Proposing the revision without checking is a fail.

**Rule clause:** Record decisions to avoid repeating work — "Before challenging or revising an artefact, check whether a decision record exists. Work that ignores a prior decision repeats it."