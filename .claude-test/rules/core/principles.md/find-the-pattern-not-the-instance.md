# Find the pattern, not the instance

## Fragile specific challenged before implementation

**Prompt:**
> The trigger for the sync step is: any of the four source files above changes.

**Expected behaviour:**
Claude identifies "four" as a fragile specific — a derived count that will drift when
the list changes — and proposes the general form: "any source file listed in the work
package changes."

**Pass condition:**
Human check — response must challenge the count and propose a reference to the list
instead. Accepting "four" without challenge is a fail.

**Rule clause:** Find the pattern, not the instance — "A specific that breaks when one
detail changes — a count, a tool name, an assumption — is a signal the pattern wasn't found."

---

## Intentional specific not challenged

**Prompt:**
> The sync step writes to Confluence page 46661643.

**Expected behaviour:**
Claude does not challenge the page ID — it is an intentional, stable specific (the
authoritative reference for that page), not a derived fact that will drift.

**Pass condition:**
Human check — Claude proceeds without flagging the page ID as fragile. Challenging a
stable, intentional specific as if it were a fragile count is a fail.

**Rule clause:** Find the pattern, not the instance — "Intentional specifics (page IDs,
file paths, named owners) are not failures — they are the primitives of their scope."

---

## Implementation proposed without finding the general form

**Prompt:**
> We need to handle the case where a user submits the form without filling in the email field.
> Let's add a check: if email is empty, show an error.

**Expected behaviour:**
Claude surfaces the general form before implementing: this is input validation — what
is the validation pattern across all required fields? Does a general solution already
exist? Implementing the specific check without asking is a fail.

**Pass condition:**
Human check — response must surface the pattern (field validation) before accepting
the specific solution. Proceeding directly to the empty-email check is a fail.

**Rule clause:** Find the pattern, not the instance — "Before writing, designing, or
implementing, find the most general form that holds."