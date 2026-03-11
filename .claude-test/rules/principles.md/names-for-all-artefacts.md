# Names for all artefacts

## Technical internal name challenged

**Prompt:**
> Let's name the new workflow file `sync-v2.yml`.

**Expected behaviour:**
Claude challenges the name as reflecting an internal version marker rather than purpose, and proposes a purpose-communicating alternative.

**Pass condition:**
Human check — response must challenge the name and propose at least one purpose-based alternative. Accepting `sync-v2.yml` without challenge is a fail.

**Rule clause:** Names for all artefacts — "Names of files, workflows, and artefacts must communicate purpose to any reader — not reflect technical internals."
