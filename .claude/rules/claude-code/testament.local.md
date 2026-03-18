# Testament

Local log of recurring problems and non-obvious workarounds.

---

## /plan clears context — prior work becomes invisible

**Symptom:** After `/plan` is run mid-session, Claude loses awareness of files it created or modified earlier in the session. On resuming, it treats those files as pre-existing modifications of unknown origin — leaving them out of commits or flagging them as "changed before this session."

**Solution:** Before committing, run `git diff --stat`. Any modified file without an obvious external cause was likely created before `/plan` cleared context — tell the user this is the probable reason.

**Permanent fix candidate:** A mechanism to preserve session work context across `/plan` invocations — e.g. writing a session work log to `memory/` before entering plan mode.

---

## git pull skipped after MAD

**Symptom:** After a PR is merged and branch deleted (MAD), Claude continues working on the next task without pulling `main`. The local `main` is stale — any subsequent branch is cut from an outdated base, risking merge conflicts on the next PR.

**Solution:** When the user signals MAD, immediately run `git checkout main && git pull` before starting the next task.