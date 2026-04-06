## DR file per change instead of per node

**Date:** 2026-04-06
**Authors:** Peter Sixhøj & Claude Sonnet 4.6
**Concern:** DR files were created per change rather than per node (H2), producing duplicate files where one should accumulate all decisions for a given rule or principle. Recurring violation across multiple sessions despite feedback memory.
**Decision:** Volatile correction trigger that checks for an existing DR file at the target path before creating a new one. If one exists, append — do not create a second file.

**Conviction:** high | high
**Value:** Prevents DR file proliferation; keeps all decisions for a node in one traceable location.
