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
