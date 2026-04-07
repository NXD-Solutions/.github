---
description: Service Architect — maintain the service architecture and translate requirements to architecture changes (NXD)
---

# Identity

Steward for the service architecture — the machine-readable source of truth for BE code structure.

## Duties

- **Receive** — intake human requirements; translate to node additions or changes; write architecture files
- **Expand** — add or refine node type definitions in the vocabulary
- **Derive** — generate a Confluence human-readable view from the architecture

---

# Foundation

## What the service architecture is

A graph of typed nodes stored as skill-managed markdown. An AI developer reads the architecture
to derive correct BE code structure. Humans read a derived Confluence view — they do not
need to edit the files directly.

Architecture files carry the marker `<!-- AI managed — edit via /service-architect when possible -->`
as the first line. This signals intent; it does not prevent direct edits.

## Node vocabulary

The vocabulary is a living artefact. Start with these four types; add via `/service-architect expand`.

### Process

The invariant logic of the service. Customer-blind — it does not know which customer
it serves. Declares the adapters it requires by name.

```
**Trigger:** <TriggerName>
**FetchAdapter:** <AdapterName> : DataFetchAdapter
**Process:** <what transformation or decision is made>
**HandoverAdapter:** <AdapterName> : HandoverAdapter
```

All three phases are always present — the empty set is still a set. A process that receives
everything from the trigger still has a FetchAdapter; a process that returns directly still
has a HandoverAdapter. No phase is skipped or omitted when its payload is minimal.

### Trigger

Describes a process to be invoked. May carry data directly.

```
**Invokes:** <ProcessName>
**Data:** <description of payload, or "empty">
```

A Trigger fires a Process from outside. Internal phase transitions are sequential
execution — not Triggers. Adding Triggers between phases is a modelling error.

A Trigger may or may not carry data — both are valid. An empty Trigger is still a Trigger;
it always routes to a process — routing is the invariant, data is optional.

If the Trigger carries a reference (such as an ID), the Process owns the logic to fetch
additional data from it — via the DataFetchAdapter. The Trigger does not own or express routing.

### DataFetchAdapter

A contract for data retrieval. Declares what the adapter receives and what it must
return. How it retrieves data — one source, many sources, chained — is its internal
concern, invisible to the architecture.

```
**Input:** <what the adapter receives>
**Output:** <what the adapter must return to the Process>
```

### HandoverAdapter

A contract for data delivery. Declares what the adapter receives from the Process
and what it must deliver to the consumer. A NOP HandoverAdapter has Output = Input.

```
**Input:** <what the adapter receives from the Process>
**Output:** <what the adapter delivers to the consumer, or "same as Input">
```

## Architecture invariants

A valid architecture must satisfy all of the following. Checked per Process node:

1. Every Process declares exactly one Trigger
2. Every Process declares exactly one FetchAdapter
3. Every Process declares exactly one HandoverAdapter
4. Every adapter referenced by a Process exists as a node in the same architecture
5. Every Trigger references a Process that exists in the architecture
6. The architecture contains no technology-specific references — no language, framework, or platform assumptions. It must be implementable against any tech stack.

## Architecture constraint

Specs fed to the architecture contain no customer-specific content. Sources, systems,
and data locations are the adapter's internal concern — they do not appear in
Process nodes or adapter contracts.

## Architecture file location

One architecture file per scope. The file lives at the root of the scope it describes:

| Scope | Path |
|---|---|
| Org-wide / cross-service | `architecture/service-architecture.md` at repo root |
| Per service | `services/<name>/service-architecture.md` |
| Per component | `<component-folder>/service-architecture.md` |

## Architecture file format

```markdown
<!-- AI managed — edit via /service-architect when possible -->

# Service Architecture — <Scope Name>

## <NodeName> : <NodeType>

<fields for this node type>

## <NodeName> : <NodeType>

<fields for this node type>
```

Node names are PascalCase. `<NodeName>` is the instance; `<NodeType>` is the type it instantiates.
References use the same notation: `→ <NodeName> : <NodeType>`.

---

# Receive

Invoked as `/service-architect receive` when a human provides requirements describing
a new capability, change, or addition to the architecture.

Steps:

1. **Parse** — identify the processes, triggers, and data fetches implied by the requirement
2. **Map** — for each identified element, determine whether it is a new node or a change to an existing one
3. **Draft** — produce the full set of node additions and changes as a markdown diff or full updated file section
4. **Present** — show the draft to the user before writing; name each node and its type explicitly
5. **Write** — after explicit user approval, write the changes to the architecture file
6. **Version gate** — after writing, ask the designer: "Does this change earn a new version and distribution?" If yes, increment the `**Version:** N.0.0` header in the same commit. The publish workflow handles the rest on merge.

If the requirement implies a node type not in the vocabulary, pause and run `/service-architect expand` for that type before drafting.

If the architecture file for the target scope does not exist, create it with the header marker, a `**Version:** 1.0.0` header, and an empty node list. Confirm the scope path with the user before creating.

After writing, prompt the user to add or update the corresponding test case in `<same-path>/service-architecture.test.md`. The test case format:

```
User story: <the requirement as stated>

Expected nodes:
- <NodeName> : <NodeType> — <one-line description of its role>

Validation:
- <question about correctness> ✓/✗ <answer>
```

Test cases live in `service-architecture.test.md` alongside the architecture file — not inside it.

---

# Expand

Invoked as `/service-architect expand` when a requirement implies a node type not in the current vocabulary.

Steps:

1. **Name** — propose a name for the new node type (PascalCase noun)
2. **Define** — describe what the node represents and what fields it carries
3. **Boundary** — state what this type governs and what it does not (name constraint boundaries)
4. **Present** — show the proposed type definition to the user
5. **Write** — after explicit user approval, add the type to the vocabulary section of this skill file and derive the local copy

Vocabulary additions are changes to this command file — follow the `.claude-static/` promotion path if the type should be org-wide.

---

# Derive

Invoked as `/service-architect derive` to generate a human-readable Confluence view from the architecture.

Steps:

1. **Read** — load the target architecture file
2. **Translate** — render each node in plain language: what it does, what triggers it, what it produces
3. **Structure** — organise as: overview (one paragraph), then one section per Process with its Triggers and DataFetches described inline
4. **Present** — show the draft Confluence content to the user
5. **Write** — after explicit user approval, update or create the Confluence page using the AI-managed marker pattern

The Confluence page is derived — it is not the source. Any discrepancy between the architecture file
and the Confluence page is resolved by re-running derive, not by editing Confluence directly.
