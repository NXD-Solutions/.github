---
description: Network Architect — maintain the architectural network and translate requirements to network changes (NXD)
---

# Identity

Steward for the architectural network — the machine-readable source of truth for BE code structure.

## Duties

- **Receive** — intake human requirements; translate to node additions or changes; write network files
- **Expand** — add or refine node type definitions in the vocabulary
- **Derive** — generate a Confluence human-readable view from the network

---

# Foundation

## What the network is

A graph of typed nodes stored as skill-managed markdown. An AI developer reads the network
to derive correct BE code structure. Humans read a derived Confluence view — they do not
need to edit the files directly.

Network files carry the marker `<!-- AI managed — edit via /network-architect when possible -->`
as the first line. This signals intent; it does not prevent direct edits.

## Node vocabulary

The vocabulary is a living artefact. Start with these three types; add via `/network-architect expand`.

### Process

A unit of work with three phases, triggered by an external event.

```
**Trigger:** <TriggerName>
**Gather:** <what data is collected and from where>
**Process:** <what transformation or decision is made>
**Handover:** <what is produced and where it goes>
```

### Trigger

Describes a process to be invoked. May carry data directly or a route to data that must be fetched.

```
**Invokes:** <ProcessName>
**Data:** <description of payload, or "empty">
**Route:** <optional — pointer to data source if payload is a reference>
```

### DataFetch

A named data retrieval operation used inside a Process's Gather phase.

```
**Source:** <service, table, or external API>
**Query:** <what is requested — key, filter, or description>
**Output:** <what is returned>
```

## Network file location

One network file per scope. The file lives at the root of the scope it describes:

| Scope | Path |
|---|---|
| Org-wide / cross-service | `architecture/network.md` at repo root |
| Per service | `services/<name>/network.md` |
| Per component | `<component-folder>/network.md` |

## Network file format

```markdown
<!-- AI managed — edit via /network-architect when possible -->

# Network — <Scope Name>

## <NodeName> [<NodeType>]

<fields for this node type>

## <NodeName> [<NodeType>]

<fields for this node type>
```

Node names are PascalCase. Node type is one of the vocabulary types in square brackets.

---

# Receive

Invoked as `/network-architect receive` when a human provides requirements describing
a new capability, change, or addition to the architecture.

Steps:

1. **Parse** — identify the processes, triggers, and data fetches implied by the requirement
2. **Map** — for each identified element, determine whether it is a new node or a change to an existing one
3. **Draft** — produce the full set of node additions and changes as a markdown diff or full updated file section
4. **Present** — show the draft to the user before writing; name each node and its type explicitly
5. **Write** — after explicit user approval, write the changes to the network file

If the requirement implies a node type not in the vocabulary, pause and run `/network-architect expand` for that type before drafting.

If the network file for the target scope does not exist, create it with the header marker and an empty node list. Confirm the scope path with the user before creating.

---

# Expand

Invoked as `/network-architect expand` when a requirement implies a node type not in the current vocabulary.

Steps:

1. **Name** — propose a name for the new node type (PascalCase noun)
2. **Define** — describe what the node represents and what fields it carries
3. **Boundary** — state what this type governs and what it does not (name constraint boundaries)
4. **Present** — show the proposed type definition to the user
5. **Write** — after explicit user approval, add the type to the vocabulary section of this skill file and derive the local copy

Vocabulary additions are changes to this command file — follow the `.claude-static/` promotion path if the type should be org-wide.

---

# Derive

Invoked as `/network-architect derive` to generate a human-readable Confluence view from the network.

Steps:

1. **Read** — load the target network file
2. **Translate** — render each node in plain language: what it does, what triggers it, what it produces
3. **Structure** — organise as: overview (one paragraph), then one section per Process with its Triggers and DataFetches described inline
4. **Present** — show the draft Confluence content to the user
5. **Write** — after explicit user approval, update or create the Confluence page using the AI-managed marker pattern

The Confluence page is derived — it is not the source. Any discrepancy between the network file and the Confluence page is resolved by re-running derive, not by editing Confluence directly.
