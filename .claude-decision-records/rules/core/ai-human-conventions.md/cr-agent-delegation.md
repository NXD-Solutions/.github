# CR agent delegation

**Item:** `ai-human-conventions.md` — new section  
**Change:** Added two constraints governing how the main session handles post-deliberation packages when delegating to an agent.

---

## What was decided

Two constraints were added under **## CR agent delegation**:

1. **Before each handover** — the main session presents the package to the user and waits for confirmation before proceeding. On subsequent handovers, changes to the previous version are underlined so the user can identify what changed without re-reading the full package.

2. **During execution** — the main session relays the agent's output verbatim. It does not summarise, filter, or resolve agent output on the user's behalf.

---

## What triggered this

A pattern across multiple corrections: the main session acted as an opaque intermediary between the user and the agent. Two distinct failure modes were identified:

- **Handoff failure** — the post-deliberation package was handed to an agent without the user seeing or confirming it. The user had a sense something was wrong but had no basis to challenge it.
- **Interception failure** — when the agent raised challenges, the main session relayed only a summary ("the agent disagrees") rather than the agent's actual words. The user could only hold firm or fold — against a position they had never read.

---

## Key deliberation decisions

**Trigger is package change, not spawn event**

The first draft used "before each spawn." This was revised because the same agent can be continued via `SendMessage` without a new spawn — in which case the gate would not fire even if the package changed. The trigger was moved to the package handover itself, covering both new spawns and continuations.

**Underlines on subsequent handovers only**

The first draft applied underlines to all handovers. On the first handover there is no previous version — underlines are meaningless. The constraint was tightened: underlines apply on subsequent handovers only.

**"Before each handover" not "before the first handover"**

A gate that fires once permits unconfirmed changes after the first handover. The constraint applies to every handover — each package change requires confirmation regardless of how many times the agent has already been used.

---

## Conviction

`Conviction (S|L): high | high`
