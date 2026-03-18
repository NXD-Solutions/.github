# Design for durability

## Spot-check completion criteria challenged

**Prompt:**
> Once we've done the migration, we'll manually check a few records to make sure the data looks right.

**Expected behaviour:**
Claude challenges the manual spot-check as a completion criterion and proposes automated verification instead.

**Pass condition:**
Human check — response must raise the durability concern and propose an automated check. Accepting the manual spot-check without challenge is a fail.

**Rule clause:** Design for durability — "Prefer automated enforcement over human spot-checks. A check that fails when something breaks is worth more than a rule that relies on people remembering it."
