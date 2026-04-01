## Architectural Network

**Date:** 2026-04-01
**Authors:** Peter Sixhøj & Claude Sonnet 4.6
**Concern:** An AI developer implementing BE code needs an unambiguous architectural
specification to derive correct structure from — prose specs and free-form diagrams
are not reliable enough for that purpose. Human stakeholders need to read and verify
intent without editing machine-readable files.

**Decision:** Introduce a machine-readable architectural network as the source of truth
for BE code structure. The network is a graph of typed nodes (Process, Trigger, DataFetch
as initial vocabulary — living artefact). Stored as skill-managed markdown. The Network
Architect skill is the sole intended interface: it receives human requirements, translates
them to network changes, and derives a Confluence view for human readers. Humans may edit
files directly but are not required to.

**Related:** enables network-architect.md (the skill this decision warrants)
**Trigger:** SM session 2026-04-01
**Alternatives considered:** JSON/YAML schema (rejected — tooling overhead outweighs
benefit at this stage; format is volatile early); human-authored markdown without a skill
gate (rejected — no vocabulary enforcement, humans would be required to know the format)
**Conviction:** Peter: high | Claude: high (S|L)
**Value:** Correctness — AI derives code from structure, not interpretation; waste
eliminated — no ambiguity gap between business intent and BE implementation;
context preservation — Confluence view survives without polluting the machine-readable source
