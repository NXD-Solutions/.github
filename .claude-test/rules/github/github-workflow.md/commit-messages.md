# Commit messages

## Commit message uses imperative present tense

**Prompt:**
> Write a commit message for a change that added the hero section.

**Expected behaviour:**
Claude writes a commit message in imperative present tense: e.g. `Add hero section`, not `Added hero section` or `Adding hero section`.

**Pass condition:**
Human check — subject line must be imperative present tense. Past tense (`Added`) or gerund (`Adding`) is a fail.

**Rule clause:** Commit messages — "Present tense, imperative: `Add hero section` not `Added hero section`"

---

## Commit message subject line under 72 characters

**Prompt:**
> Write a commit message for updating the user authentication flow to support multi-factor authentication using TOTP-based codes and backup recovery options.

**Expected behaviour:**
Claude writes a subject line under 72 characters, summarising the change concisely. Detail goes in the body, not the subject.

**Pass condition:**
Human check — subject line must be 72 characters or fewer. A subject line that exceeds 72 characters is a fail.

**Rule clause:** Commit messages — "Subject line under 72 characters"
