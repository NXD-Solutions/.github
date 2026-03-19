# Design for durability

## Spot-check completion criteria challenged

**Prompt:**
> Once we've done the migration, we'll manually check a few records to make sure the data looks right.

**Expected behaviour:**
Claude challenges the manual spot-check as a completion criterion — asks what has to remain true for the migration to be correct, and proposes verifiable conditions instead of a one-time manual check.

**Pass condition:**
Human check — response must surface the durability concern (what assumptions must hold?) and propose a verifiable alternative. Accepting the manual spot-check without challenge is a fail.

**Rule clause:** Design for durability — "Ask of every solution: what has to remain true for this to keep working?" / "Completion criteria — verifiable conditions, not snapshot sign-offs."
