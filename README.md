# NXD-Solutions — .github

This repository holds **organisation-level defaults and shared automation** for all
repositories under the [NXD-Solutions](https://github.com/NXD-Solutions) GitHub organisation.

A `.github` repository is a GitHub convention: files placed here are inherited by every
repository in the organisation that does not define its own equivalent, and reusable
workflows stored here can be called from any repository in the organisation.

---

## Structure

```
.github/
  workflows/
    sync-decisions.yml   # Reusable workflow — syncs the NXD Decision Log from Confluence
scripts/
  sync-decisions.ts      # Script invoked by the workflow above
package.json             # Node dependencies for the scripts
```

---

## Reusable workflows

### `sync-decisions.yml`

Fetches binding decision constraints from the
[NXD Decision Log](https://nordicexperiencedesign.atlassian.net/wiki/spaces/NSME/pages/17104898/Decision+Log)
in Confluence and opens a pull request in the calling repository with an updated
`.claude/rules/decisions-developer.md` file.

**Inputs**

| Name   | Required | Description                                                   |
|--------|----------|---------------------------------------------------------------|
| `role` | Yes      | Target audience for extracted constraints (e.g. `Developer`)  |

**Secrets required** (passed by the caller)

| Name                   | Description             |
|------------------------|-------------------------|
| `CONFLUENCE_EMAIL`     | Atlassian account email |
| `CONFLUENCE_API_TOKEN` | Atlassian API token     |

**Usage**

```yaml
jobs:
  sync:
    uses: NXD-Solutions/.github/.github/workflows/sync-decisions.yml@main
    with:
      role: Developer
    secrets:
      CONFLUENCE_EMAIL: ${{ secrets.CONFLUENCE_EMAIL }}
      CONFLUENCE_API_TOKEN: ${{ secrets.CONFLUENCE_API_TOKEN }}
```

---

## Further reading

- [Reusing workflows](https://docs.github.com/en/actions/sharing-automations/reusing-workflows) — GitHub Docs
- [About organisations](https://docs.github.com/en/organizations/collaborating-with-groups-in-organizations/about-organizations) — GitHub Docs
