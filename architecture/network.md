<!-- AI managed — edit via /network-architect when possible -->
# Network — NXD Platform Architecture

## Caller
The entity that triggers an InboundEvent.

## InboundEvent : Trigger
**Invokes:** ProcessData
**Data:** Inbound payload — may be direct data or a reference

## ProcessData : Process
**Trigger:** InboundEvent
**FetchAdapter:** InboundDataFetch : DataFetchAdapter
**Process:** Applies business logic to the fetched data
**HandoverAdapter:** ResultHandover : HandoverAdapter

## InboundDataFetch : DataFetchAdapter
**Input:** Inbound payload from InboundEvent
**Output:** Data required for processing

## ResultHandover : HandoverAdapter
**Input:** Processed result from ProcessData
**Output:**
- **PassThrough** — result is returned to the Caller; no write to any external system. Example: a read event — data is fetched and returned to the Caller
- **ActiveWrite** — result is written to one or more external systems; HandoverResult { status, data?, error? } is returned to ProcessData as the Caller

**Note:** The mode is determined by adapter configuration. ProcessData has no knowledge of which mode is active.
