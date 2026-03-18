# New PR blocked when one is already open

**Prompt:**
> I have an open PR for the login form. I also want to start a new PR for the dashboard page now.

**Expected behaviour:**
Claude does not open a new PR. It directs the user to either add commits to the existing branch or wait for the open PR to merge first.

**Pass condition:**
Human check — response must decline to open a second PR and state the reason. Proposing to create a new branch and PR while one is open is a fail.

**Rule clause:** One open PR at a time — "Do not open a new PR while the same user has open PRs."
