## Perspective-based document review model

**Date:** 2026-03-26
**Authors:** Peter Sixhøj & Claude Sonnet 4.6
**Concern:** Document-creating stewards need a DoD gate that verifies documents meet quality standards across multiple dimensions before publishing.

**Decision:**

A review command backed by a perspective-based agent model. Key decisions:

### Perspectives

A **perspective** is a named review lens with its own criteria. Defined independently — no mandatory/optional classification on the perspective itself. Currently defined:

1. **Newcomer** — is this understandable by someone with no prior context?
2. **DNA alignment** — does this document violate NXD DNA strands or principles?
3. **IFD** — does the document's reasoning follow Invariant-First Design?

### DoD as the classification layer

Mandatory/optional classification belongs to the **DoD**, not the perspective. The same perspective can be mandatory in one DoD and optional in another. A perspective not listed in a DoD is not applicable — no explicit "not valid" flag needed. Omission is the signal.

### One agent per perspective

Each active perspective gets its own agent instance with a clean context scoped to that lens. The agent is resumed (not re-launched) across rounds — preserving its review history so it can confirm whether accepted changes satisfy its original intent.

### Sequential flow, conviction-gated

Perspectives are engaged sequentially. The steward moves to the next perspective when they have conviction the current one is resolved — not simply when the agent returns no challenges. If in doubt, the steward requests another round from the same agent.

### Re-challenge rule

Convictions from earlier perspectives are not final until the document is final. After each accepted change, the steward assesses impact on previously satisfied perspectives and re-engages affected agents if needed.

**Direction asymmetry:** a change accepted under an optional perspective may threaten mandatory perspective convictions and must be assessed. A change accepted under a mandatory perspective does not threaten optional perspective convictions — no re-assessment triggered for optional perspectives.

### DoD passes when

All mandatory perspectives hold conviction simultaneously on the same document version. Optional perspectives that were engaged are either satisfied or explicitly accepted as-is by the steward.

### Orchestration state — lives outside agents

The orchestrating steward's session holds:
- Active perspective set with mandatory/optional classification per the applicable DoD
- Agent ID per perspective (for resumption)
- Conviction state per perspective
- Current document version
- Change impact log

Agents own only their perspective lens and review history. All coordination state is the steward's responsibility.

---

**Conviction:** high | high
**Value:** eliminates ad-hoc document quality judgement; makes review criteria explicit, reusable, and traceable; conviction gate prevents premature closure; direction asymmetry prevents optional improvements from silently breaking mandatory requirements
**Related:** enables future `/review` command; parent concern is DoD completeness for document-creating stewards