# Git Workflow

- Never commit directly to `main` — all changes via feature branch and pull request.

## Branch naming

| Type | Pattern | Example |
|---|---|---|
| Feature | `feature/<short-description>` | `feature/hero-section` |
| Bug fix | `fix/<short-description>` | `fix/nav-mobile-overflow` |
| Chore / tooling | `chore/<short-description>` | `chore/update-tailwind` |
| Automation (CI/CD) | `automated/<short-description>` | `automated/sync-decisions` |

## One open PR at a time (per user)

Do not open a new PR while the same user has open PRs. Instead: add commits to the existing branch (reuse) or wait for the open PR to merge first. This keeps delivery atomic and avoids conflicts caused by parallel branches diverging from the same base.

## Commit messages

- Present tense, imperative: `Add hero section` not `Added hero section`
- Subject line under 72 characters
- Add body if the why isn't obvious
