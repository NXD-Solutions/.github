# Decision — Delegate duty wording (2026-04-01)

**Item:** `/cr` skill — `# Delegate`
**Conviction:** `Conviction (S|L): high | high`

## Key deliberation decisions

**"Handover" not "spawn"**
The first draft used "before each spawn." Revised because the same agent can be continued via `SendMessage` without a new spawn — the gate would not fire even if the package changed. "Handover" covers both new spawns and continuations; the trigger is the package moving to the agent, not the technical act of spawning.

**Underlines on subsequent handovers only**
The first draft applied underlines to all handovers. On the first handover there is no previous version — underlines are meaningless. Tightened: underlines apply on subsequent handovers only.

**"Before each" not "before the first"**
A gate that fires once permits unconfirmed changes on all subsequent handovers. The constraint applies to every handover — each package change requires confirmation regardless of how many times the agent has already been used.

---

# Decision — Content delivery rule (2026-04-02)

**Item:** `/cr` skill — `# Delegate` — **Content delivery**
**Conviction:** `Conviction (S|L): high | high`

## Key deliberation decisions

**Narrow scope, not broad**
The initial CR goal was scoped to deliberation agents. Challenged: is the invariant "any agent input with no independent consumer travels inline"? Tested against review agents (receive file paths for files that exist on disk — established pattern, not waste) and implementation agents (if the post-deliberation package exists on disk for record-keeping, passing the path is correct). The broader form broke on those cases. The narrow form — CR content to deliberation agent — held where the broader one did not. Goal tightened accordingly.

**Waste framing, not liveness framing**
Liveness (the CR is a live document, not a committed artefact) was proposed as the parent invariant. Rejected as mechanism, not invariant. The actual invariant: an intermediate with no independent consumer is waste (Lean by Design). Liveness explains *why* the CR has no independent consumer at deliberation time — it is the derivation path, not the principle itself.

**Rule, not principle**
A principle holds when the tool changes. This rule governs Claude Code agent spawning behaviour specifically — change the tool, the rule changes. A principle would either restate the Lean by Design strand for one context or over-generalise. Rule is the correct abstraction level.

**Home: cr.md # Delegate, not ai-human-conventions.md**
`ai-human-conventions.md` governs AI-human interaction. This rule governs AI-to-agent content delivery — a different axis. The motivating context is the CR Delegate duty; scope-local first. Graduation signal: a second steward hitting the same constraint, triggering promotion to a shared rules file.
