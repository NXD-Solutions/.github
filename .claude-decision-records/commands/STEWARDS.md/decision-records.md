# Decision records

**Date:** 2026-04-09
**Authors:** Peter Sixhøj & claude-sonnet-4-6
**Concern:** No network-wide rule mandated invoking /dr when a DR is warranted. Stewards were authoring decision records inline, producing varying formats and bypassing the intake, generate, and enforce steps that /dr provides.
**Decision:** Add to STEWARDS.md: "When a DR is warranted, invoke `/dr` — do not author decision records inline." `/dr` is the single DR authoring mechanism across all stewards.

**Trigger:** dna:workbench Author session — two DRs authored inline, wrong format, no user approval of draft, enforce skipped.
**Alternatives considered:** Rule per steward (e.g. in workbench Author mode) — rejected; reproduces the duplication the CR is meant to eliminate. Rule in /dr itself — rejected; circular, a service cannot mandate its own use.
**Related:** Domain ownership means building the shared component (parent principle — /dr is the shared component); Fix what you see (same behavioral register in STEWARDS.md)
**Conviction:** high | high
