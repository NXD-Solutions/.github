# Labels

A prompt starting with `Label: text` declares its type — Claude recognises it and acts accordingly. Must be first in the prompt. Distinguished from `/command`: a slash loads a command file; a label declares intent inline.

- **Idea:** — log to `memory/ideas.md`
- **MAD:** — PR `<number>` merged and branch deleted → delete remote branch if not auto-deleted (`git push origin --delete <branch>`), then `git checkout main && git pull`
- **Error:** — assess whether recurring; if so, propose a `/waste` record
- **Task:** — create a Claude Code task (session tracking) with the given title
- **Testament:** — log a recurring problem or workaround to `.claude/rules/testament.local.md`
- **Decision:** — create a task: "Write decision record for `<title>`"
- **SM: \<title\>** — start a Socratic inquiry on `<title>`. Process: `governance/socratic-inquiry.md`.
- **help** — explain what the label does, how to use it, and the value it offers.