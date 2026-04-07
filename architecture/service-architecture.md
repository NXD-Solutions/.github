<!-- AI managed — edit via /service-architect when possible -->
# Service Architecture — NXD Platform

**Version:** 1.0.0

---

# Definitions

## Caller
The entity that triggers an InboundEvent.

## DataDictionary : Registry
The canonical definition of all fields, types, and system mappings used across the platform.
Acts as meta-input for all read, write, and processing operations.

**Contains:**

- **Field definitions** — canonical field name, type, description, and validation rules
- **System mappings** — field path in each external system (e.g. SAP, Workday, Payroll)
- **Transform rules** — conversion logic between canonical and foreign representations
- **Sensitivity** — classification of PII, salary data, and other regulated fields

**Loading strategy:** YAML source compiled to TypeScript at build time via code generator; backends import `@nxd-solutions/data-dictionary` — never read from file at runtime

**Security:** Build-time compilation eliminates runtime file system access and YAML parsing on the hot path, removing the injection attack surface entirely in v1

**Repository:** NXD-Solutions/data-dictionary

**Package:** @nxd-solutions/data-dictionary

**Steward:** Information Architect

## ProcessDataObject : Invariant
The canonical data exchange object between the process layer and the data layer.
Derived from DataDictionary : Registry. Both layers are bound to this contract.

**Invariant:** The process layer has no knowledge of foreign data structures. The data layer has no knowledge of process logic.

---

# Network

## InboundEvent : Trigger

**Invokes:** ProcessData

**Data:** Inbound payload — may be direct data or a reference

## ProcessData : Process

**Trigger:** InboundEvent

**FetchAdapter:** InboundDataFetch : DataFetchAdapter

**Process:** Applies business logic to the fetched data

**HandoverAdapter:** ResultHandover : HandoverAdapter

**Consumes:** DataDictionary : Registry — field context for business logic

**Consumes:** ProcessDataObject — operates exclusively on ProcessDataObject

**Produces:** ProcessDataObject — passes ProcessDataObject to ResultHandover

## InboundDataFetch : DataFetchAdapter

**Input:** Inbound payload from InboundEvent

**Output:** ProcessDataObject — mapped to the canonical model

**Consumes:** DataDictionary : Registry — maps foreign fields to the canonical model

**Produces:** ProcessDataObject — maps foreign data to the canonical model

## ResultHandover : HandoverAdapter

**Input:** ProcessDataObject from ProcessData

**Output:**

- **PassThrough** — result is returned to the Caller; no write to any external system.
  - **Example**: a read event — data is fetched and returned to the Caller

- **ActiveWrite** — result is written to one or more external systems; HandoverResult { status, data?, error? } is returned to ProcessData as the Caller

**Consumes:** DataDictionary : Registry — maps canonical fields to the target system

**Consumes:** ProcessDataObject — maps ProcessDataObject to the target system

**Note:** The mode is determined by adapter configuration. ProcessData has no knowledge of which mode is active.
