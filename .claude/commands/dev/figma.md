---
description: Figma steward — register the repo-to-Figma project link (NXD)
---

# Identity

Read `.claude/commands/STEWARDS.md` before proceeding.

## Duties

- **Register** — run the one-time Figma project registration for this repo
- **Document** — create and maintain a newcomer Confluence page introducing this command

## Services

- **Register** — verify prerequisites, run the acceptance gate, and write `.figma/project.json` and the root `README.md` design entry
- **Document** — create a newcomer child page under Confluence 62947329; review with newcomer perspective before publishing

---

# Foundation

## Registration gate

No form DoR may proceed until `Register` has been completed for this repo. Verify `.figma/project.json` exists before allowing any form work to begin.

## Owned artefacts

- `.figma/project.json` — machine-readable project registration
- Root `README.md` design entry — human-readable pointer to the Figma project

## Out of scope

Figma project structure, component organisation, and designer workflows. This steward owns only the link between the repo and the Figma project.

---

# Register

One-time setup. Run before any form component enters DoR.

## Prerequisites

- [ ] **[hard]** Figma API access confirmed — MCP tool calls must succeed before the gate can run
- [ ] **[hard]** Dev team has view access to the Figma file

## Acceptance gate

- [ ] **[hard]** File is a proper Figma project — not a draft, personal file, or community fork being actively edited without permission
- [ ] **[hard]** File structure is navigable — pages and components are organised, not a dumping ground
- [ ] **[hard]** A named designer owner is identified and reachable
- [ ] **[soft]** Community or third-party files: confirm licence permits use in production

## Prompting for the URL

When asking the user for the Figma URL, include the expected format inline — do not wait for them to ask:

> Please share the Figma project URL. It looks like:
> `https://www.figma.com/design/<fileKey>/<fileName>`
> The `fileKey` is the alphanumeric segment after `/design/`. Your URL may also include `?node-id=...` — that identifies a specific component or frame and can be ignored for registration.

## Registration

Once the acceptance gate passes, register the project in two places:

**Root `README.md`** — human entry point, linked from onboarding:
```md
## Design
Figma: <url>
```

**`.figma/project.json`** — machine-readable metadata:
```json
{
  "fileKey": "<fileKey>",
  "projectName": "<name>",
  "url": "<url>",
  "designerOwner": "<name or null>",
  "status": "accepted",
  "registeredAt": "<YYYY-MM-DD>"
}
```

The `fileKey` is extracted from the Figma URL: `figma.com/design/<fileKey>/...`

---

# Document

Create and maintain a newcomer-friendly Confluence page introducing `/dev:figma` to developers who have never used it.

## Setup

Create a child page under Confluence root page 62947329. Record the page ID in `STEWARDS.md` under the `dev:figma` entry.

## Content

The page must answer:
- What is `/dev:figma` and when is it needed?
- What does registration involve — what will the developer be asked for?
- What does the developer need to have ready before running it?
- What does a successful registration look like?

## Review gate

Before authoring or making significant changes to the page, read the Newcomer perspective criteria in `review.md`. Pre-applying criteria reduces review cost.

Before publishing, run `/review` with the newcomer perspective (mandatory). The page must pass before it is considered complete. Once published, update `STEWARDS.md` with the page ID.
