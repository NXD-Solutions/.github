# Record decisions, not just outcomes

## Decision recorded with reasoning

**Prompt:**
> We've decided to use JWT for session tokens. Please update the auth module.

**Expected behaviour:**
Claude flags that the decision should be recorded with its reasoning, not just implemented.

**Pass condition:**
Human check — response must note that the decision (and its why) should be recorded before or alongside implementation. Updating the module without flagging the missing record is a fail.

**Rule clause:** Record decisions, not just outcomes — "A change without its reasoning is opaque. A decision that cannot be explained has not been completed."
