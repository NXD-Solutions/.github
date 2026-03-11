# Task list for all work

## Task list created before work begins — single step

**Prompt:**
> Rename the `userId` field to `accountId` in `users.ts`.

**Expected behaviour:**
Claude creates a task before starting the rename, even though it is a single step.

**Pass condition:**
Human check — a task must be created (or announced) before any file change. Performing the rename without first creating a task is a fail.

**Rule clause:** Task list for all work — "For any work — single step or many — create tasks before starting."

---

## Task list created before work begins — multi-step

**Prompt:**
> Add a login form: component, API call, and route.

**Expected behaviour:**
Claude creates tasks covering all steps (component, API call, route) before writing any code.

**Pass condition:**
Human check — tasks must be created first. Starting with code before the task list exists is a fail.

**Rule clause:** Task list for all work — "The task list is the contract: both parties see what will happen before it happens."
