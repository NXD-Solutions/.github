<!-- AI managed — edit via /network-architect when possible -->
# Network — NXD Platform Architecture

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

**Steward:** Information Architect

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

## InboundDataFetch : DataFetchAdapter

**Input:** Inbound payload from InboundEvent

**Output:** Data required for processing, mapped to the canonical model

**Consumes:** DataDictionary : Registry — maps foreign fields to the canonical model

## ResultHandover : HandoverAdapter

**Input:** Processed result from ProcessData

**Output:**

- **PassThrough** — result is returned to the Caller; no write to any external system.
  - **Example**: a read event — data is fetched and returned to the Caller

- **ActiveWrite** — result is written to one or more external systems; HandoverResult { status, data?, error? } is returned to ProcessData as the Caller

**Consumes:** DataDictionary : Registry — maps canonical fields to the target system

**Note:** The mode is determined by adapter configuration. ProcessData has no knowledge of which mode is active.
