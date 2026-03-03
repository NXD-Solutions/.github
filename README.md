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
  decisions-subscribers.yml          # Central registry of repos that receive decision sync PRs
  workflows/
    sync-decisions.yml     # Standalone workflow — syncs the NXD Decision Log to all subscribers
scripts/
  sync-decisions.ts        # Script invoked by the workflow above
package.json               # Node dependencies for the scripts
```

---

## How decision syncing works

The [NXD Decision Log](https://nordicexperiencedesign.atlassian.net/wiki/spaces/NSME/pages/17104898/Decision+Log)
in Confluence is the source of truth for binding platform decisions.

Each decision page contains an **AI Summary** section with bullet-point constraints for a
given audience (e.g. `Developer`). The sync script extracts these and writes them to
`.claude/rules/decisions-developer.md` in each subscriber repo, so AI coding assistants
pick up the latest constraints automatically.

---

## Registering a subscriber

Subscribers are defined in `.github/decisions-subscribers.yml`, organised by role. Each role key
matches an `## AI Summary — <role>` heading in Confluence.

```yaml
subscriptions:
  Developer:
    - NXD-Solutions/prototype
    - NXD-Solutions/landing-page
```

To add a repo, append it under the appropriate role. The next workflow run will open a PR
in that repository with an updated `.claude/rules/decisions-<role>.md`.

---

## Workflows

### `sync-decisions.yml`

The centralised dispatch workflow. Runs weekly (Monday 06:00 UTC) and on manual trigger.

For each subscriber in `.github/decisions-subscribers.yml` it:

1. Checks out the subscriber repository
2. Runs `scripts/sync-decisions.ts` to fetch the latest decision constraints from Confluence
3. Opens a pull request in the subscriber repository if `.claude/rules/decisions-<role>.md` changed

**Secrets required in `NXD-Solutions/.github`**

| Name                   | Description                                                                   |
|------------------------|-------------------------------------------------------------------------------|
| `CONFLUENCE_EMAIL`     | Atlassian account email used to authenticate with the Confluence API          |
| `CONFLUENCE_API_TOKEN` | Atlassian API token                                                           |
| `REPOS_PAT`            | GitHub PAT with `contents: write` and `pull-requests: write` on all subscriber repos |

---

## Further reading

- [Reusing workflows](https://docs.github.com/en/actions/sharing-automations/reusing-workflows) — GitHub Docs
- [About organisations](https://docs.github.com/en/organizations/collaborating-with-groups-in-organizations/about-organizations) — GitHub Docs
