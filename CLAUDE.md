# Claude Code — .github repo

## No session works here

This repo never hosts a session (Peter, 2026-10-18; recorded as `standards-exemption` in `.github/claude-rules-overrides.yml`). It receives no DNA copy, so a session opened here would load none of the rules it is bound by. The Framework Steward builds its code from a clone, in a session running in `NXD-Solutions/packages`, where the dev standards load.

## Built by Framework, required by the DNA

**Framework builds this repo's code** — every workflow, script and test in it (`NXD-Solutions/dna#1388`; `domains/framework.md`). Each change is a Framework pull request, written against a requirement issue.

**The DNA states the requirements, as issues on `NXD-Solutions/dna`.** It does not write the code, so each requirement meets a builder who can question and challenge it before it lands.

**The DNA still changes what is content, not code:** `.github/PULL_REQUEST_TEMPLATE.md` and the subscription registry's values (`.github/claude-rules-overrides.yml`). A change to the registry's *shape* is read by code, so the DNA states it as a requirement and Framework implements it.

**Found a defect here?**
- In the code: an issue on `NXD-Solutions/packages`, for the Framework Steward.
- In what the code is required to do: an issue on `NXD-Solutions/dna`.

**Merging into `main` is the principal's** until the merge right is recorded in `org.config.md`.

**Why the code sits here.** GitHub requires the org's workflows and PR template to live in the org's own `.github` repo, so they cannot sit beside the DNA content that governs them.

Decided at `NXD-Solutions/dna#1388`; the earlier ownership declaration, `NXD-Solutions/dna#1043`, is superseded for the code.
