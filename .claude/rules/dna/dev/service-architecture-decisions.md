# Service Architecture Decisions

Lifecycle rules for lightweight service architecture decisions that need persistence but fall below decision record weight.

## Location

Entries live in `rules/configuration/service-architecture-decisions.md` — repo-owned, not distributed. Create the file when the first decision needs recording.

## Entry format

```
### <Title>

<One to two sentences — the decision and why.>
```

## Promotion

When a second repo reuses a decision, promote it to a distributed artefact and remove it from the file. Cross-repo reuse is the signal of durability.
