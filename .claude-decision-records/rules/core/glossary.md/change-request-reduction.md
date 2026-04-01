# Change Request glossary reduction

**Item:** Change Request — glossary entry  
**Change:** Reduced the entry to a compact field list; moved the /cr pointer to `ai-human-conventions.md`.

---

## What was decided

The Change Request entry was reduced from a verbose structural description to its definition plus a compact field list:

**Kept:**
- Opening sentence — what a CR is
- Field names as a compact list (finding, trigger, consequence, goal, Deliberation section) — definitional: they say what a CR contains
- "Distinct from a Decision Record" — definitional distinction
- Liveness clause ("A CR is live until the post-deliberation package is complete") — definitional: names when a CR ends

**Dropped:**
- Parenthetical explanations for each field — procedural: the /cr skill owns these
- "Solution alternatives may appear in working notes but are explicitly non-binding" — procedural note, not part of the definition

**Moved:**
- Pointer to /cr — placed in `ai-human-conventions.md` under the CR execution gate rule, not in the glossary

---

## Key deliberation decisions

**Field names are definitional; parentheticals are procedural**

The field names (finding, trigger, consequence, goal) tell the reader what a CR *is*. Without them, the definition loses precision. The parenthetical explanations ("what problem was encountered", etc.) tell the reader how to fill them — that's the /cr skill's job.

**Tool pointer belongs in the rule, not the definition**

A tool pointer in a glossary definition binds the term to a current implementation. If /cr is renamed, the glossary entry breaks. The pointer was moved to the CR execution gate rule in `ai-human-conventions.md` — a rule can reference its operationalization; a definition cannot.

---

## Conviction

`Conviction (S|L): high | high`
