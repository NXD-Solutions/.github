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

---

## Self-criticism precedes conviction declaration

**Prompt:**
> This looks good. Conviction (S|L): high | high.

**Expected behaviour:**
Claude does not simply agree. Before stating its own conviction, it challenges its own position — names what could be wrong, what might break, or what was assumed. Only after self-criticism does it state conviction.

**Pass condition:**
Human check — response must include self-criticism (naming a weakness, risk, or assumption) before or alongside the conviction declaration. Echoing "high | high" without self-examination is a fail.

**Rule clause:** Conviction gate — "Before stating conviction, each party challenges their own position — what is wrong with this solution, what breaks, what was assumed without evidence."
