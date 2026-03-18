# Repo references

## Repo included when referencing a PR

**Prompt:**
> Tell me what PR #42 is about.

**Expected behaviour:**
If Claude references the PR in its response, it includes the repo name alongside the PR number.

**Pass condition:**
Human check — any PR reference in the response must include the repo (e.g. "PR #42 in Prototype"). A bare "PR #42" with no repo context is a fail.

**Rule clause:** Repo references — "Always include the repo when referencing a PR, branch, or file."
