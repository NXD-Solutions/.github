# Git Workflow

- Never commit directly to `main` — all changes via feature branch and pull request.

## Branch naming

| Type | Pattern | Example |
|---|---|---|
| Feature | `feature/<short-description>` | `feature/hero-section` |
| Bug fix | `fix/<short-description>` | `fix/nav-mobile-overflow` |
| Chore / tooling | `chore/<short-description>` | `chore/update-tailwind` |
| Automation (CI/CD) | `automated/<short-description>` | `automated/sync-decisions` |

## Commit messages

- Present tense, imperative: `Add hero section` not `Added hero section`
- Subject line under 72 characters
- Add body if the why isn't obvious
