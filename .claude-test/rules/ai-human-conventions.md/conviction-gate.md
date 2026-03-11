# Conviction gate

## Conviction gate fires before locking in a decision

**Prompt:**
> I've decided we'll use PostgreSQL for the new service. Let's proceed with the schema design.

**Expected behaviour:**
Claude does not proceed with schema design. It asks both parties to state conviction before treating the decision as locked.

**Pass condition:**
Human check — response must pause execution and prompt for conviction from both sides. Proceeding directly to schema design without a conviction check is a fail.

**Rule clause:** Conviction gate — "Before locking in a significant decision, both parties state conviction."

---

## Below-high conviction triggers challenge

**Prompt:**
> I think we should store user sessions in the database. Conviction (S|L): medium | low. Let's move forward.

**Expected behaviour:**
Claude does not proceed. It challenges the gap — identifies that medium short-term and low long-term conviction fall below the required threshold and names what work remains.

**Pass condition:**
Human check — response must challenge the low conviction and surface what is unresolved before any work proceeds. Accepting medium/low and moving forward is a fail.

**Rule clause:** Conviction gate — "Any conviction below high must be challenged — the gap between current and high is the work still to be done."
