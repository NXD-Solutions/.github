<!-- AI managed — edit via /network-architect when possible -->

# Network — NXD Platform Architecture

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
**Output:** same as Input
