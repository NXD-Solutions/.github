# .claude/rules

Rules files loaded by Claude Code at every session start. Kept minimal for token efficiency — prose and rationale live in Confluence.

**Every file here must have a corresponding Confluence page under [Claude Code — Rules Reference](https://nordicexperiencedesign.atlassian.net/wiki/spaces/NSME/pages/28442625). Any change to a rules file must include a review and update of the corresponding Confluence page in the same PR.**

## claude-code/

Rules for Claude Code tools and meta-behaviour.

| File | Confluence page | Notes |
| --- | --- | --- |
| `claude-code/claude-rules-system.md` | | |
| `claude-code/labels.md` | | Confluence page needed |
| `claude-code/task-management.md` | | Confluence page needed |
| `claude-code/testament.md` | [testament.md](https://nordicexperiencedesign.atlassian.net/wiki/spaces/NSME/pages/28475393) | |
| `claude-code/corrections.md` | [corrections.md](https://nordicexperiencedesign.atlassian.net/wiki/spaces/NSGlobal/pages/75563009) | |
| `claude-code/corrections.triggers.md` | | Covered by corrections.md page |
| `claude-code/component-declaration.md` | | Confluence page needed |

## confluence/

| File | Confluence page | Notes |
| --- | --- | --- |
| `confluence/confluence.md` | | |

## figma/

| File | Confluence page | Notes |
| --- | --- | --- |
| `figma/figma-integration.md` | | |
| `figma/figma-translation.md` | [figma-translation.md](https://nordicexperiencedesign.atlassian.net/wiki/spaces/NSGlobal/pages/80674817/figma-translation.md) | |

## github/

| File | Confluence page | Notes |
| --- | --- | --- |
| `github/github-actions.md` | | |
| `github/github-workflow.md` | [git-workflow.md](https://nordicexperiencedesign.atlassian.net/wiki/spaces/NSME/pages/30081025) | Renamed from git-workflow.md |

## thinking-core/

Portable, timeless thinking principles — independent of NXD, software development, or AI tooling.

| File | Confluence page | Notes |
| --- | --- | --- |
| `thinking-core/dna.md` | | |
| `thinking-core/principles.md` | | |

## nxd-practices/

NXD-specific practices — organisation-scoped content. Migration from `core/` is a subsequent CR.

## core/

Cross-cutting rules — applies to all NXD contexts.

| File | Confluence page | Notes |
| --- | --- | --- |
| `core/ai-human-conventions.md` | | |
| `core/communication.md` | | Confluence page needed |
| `core/communicative-artefact.md` | | Confluence page needed |
| `core/constitution.md` | | Confluence page needed |
| `core/decision-log-extract.gen.md` | [decisions-developer.md](https://nordicexperiencedesign.atlassian.net/wiki/spaces/NSME/pages/28508161) | Auto-generated — do not edit by hand |
| `core/glossary.md` | | Confluence page needed |
| `core/roles.md` | | |
| `core/spec-lifecycle.md` | | |

## configuration/

Project-level vendored contracts — repo-owned, not distributed. Container is org-wide; contents are local.

| File | Confluence page | Notes |
| --- | --- | --- |
| `configuration/README.md` | | Container contract |

## dev/

Developer-scoped rules — applies to engineers working on code.

| File | Confluence page | Notes |
| --- | --- | --- |
| `dev/bootstrap.md` | | |
| `dev/code-standards.md` | [code-standards.md](https://nordicexperiencedesign.atlassian.net/wiki/spaces/NSME/pages/39256065) | |
| `dev/framework-standards.md` | | |
| `dev/service-architecture-decisions.md` | | Lifecycle rules for repo-owned decision entries |