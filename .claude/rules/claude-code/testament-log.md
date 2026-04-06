# Testament

Local log of recurring problems and non-obvious workarounds.

---

## Global `~/.claude/rules/` appeared with unknown origin — caused double-loading

**Symptom:** Agent startup took minutes in some sessions. Slow cases coincided with `~/.claude/rules/` existing alongside `.claude/rules/` — Claude Code loaded both, sending identical distributed rules twice into every agent's system context. Additionally, agents receive DNA via two channels: system context (loaded files) and prompt context (rules content inline). The global duplication compounded both channels.

**Unknown:** How `~/.claude/rules/` came to be populated. The distribution workflow does not copy there. Its origin is unexplained.

**Solution:** Deleted `~/.claude/rules/`. Confirmed absent via `/context` — only the local `.claude/rules/` copy now loads.

**Permanent fix candidate:** Monitor for recurrence. If `~/.claude/rules/` reappears, investigate what created it before deleting again.

---

## /plan clears context — prior work becomes invisible

**Symptom:** After `/plan` is run mid-session, Claude loses awareness of files it created or modified earlier in the session. On resuming, it treats those files as pre-existing modifications of unknown origin — leaving them out of commits or flagging them as "changed before this session."

**Solution:** Before committing, run `git diff --stat`. Any modified file without an obvious external cause was likely created before `/plan` cleared context — tell the user this is the probable reason.

**Permanent fix candidate:** A mechanism to preserve session work context across `/plan` invocations — e.g. writing a session work log to `memory/` before entering plan mode.

---

## git pull skipped after MAD

**Symptom:** After a PR is merged and branch deleted (MAD), Claude continues working on the next task without pulling `main`. The local `main` is stale — any subsequent branch is cut from an outdated base, risking merge conflicts on the next PR.

**Solution:** When the user signals MAD, immediately run `git checkout main && git pull` before starting the next task.

---

## Command frontmatter corruption

**Symptom:** The opening `---` of a command file's YAML frontmatter gets text prepended to it (e.g. `ful---`, `So /dna---`). The command's description in the picker shows the corrupted text instead of the intended description. Observed twice in one session on different files.

**Solution:** After editing a command file, verify the first line is exactly `---` with no preceding text. If the picker shows unexpected text for a command, check line 1 of the file.

**Permanent fix candidate:** Unknown root cause — may be an editor auto-save collision or a paste artefact. Monitor for recurrence to identify the trigger.

---

## Manual scaffold missing package-lock.json

**Symptom:** When scaffolding a Node.js project by writing files manually (instead of running `create-vite` or equivalent), `package-lock.json` is not generated. CI fails immediately — `npm ci` and `actions/setup-node` cache both require it.

**Solution:** After writing `package.json` files manually, run `npm install` before the first commit. The lock file is an inherent part of a complete scaffold — not an optional follow-up.

**Permanent fix candidate:** Add a step to the scaffold checklist: "run `npm install` and stage `package-lock.json` before committing."