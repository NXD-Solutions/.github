# Testament — scope correction and relocation

**Trigger:** During governance/ extraction, `testament.md` was abstracted to "workaround log."
When the governance.config.md.template CR required naming the log path, the label "workaround log"
was challenged: testament entries include improvement signals from repo work not yet accepted
upstream — not only workarounds.

**Decided:**

1. **Scope broadened** — testament is a local, auto-loaded record that injects repo-specific
   behavioral changes into context ahead of permanent formalization. Two entry types:
   - *Workaround* — recurring problem with a non-obvious solution
   - *Improvement signal* — repo finding not yet proposed upstream

2. **Name kept** — "testament" was deliberate: it names the persistence-across-sessions quality,
   not the content type. "Workaround log" was rejected because it excludes improvement signals
   and misrepresents the broader intent.

3. **Templates preferred, not mandatory** — title is the only required field. Free form is
   acceptable when neither template fits.

4. **Relocated** — `testament-log.md` moved from `claude-code/` to `governance/`: governing
   rule is in `governance/`, log co-locates with it. Stays under `rules/` to remain auto-loaded.

**Ruled out:**
- Renaming to `workaround-log.md` — rejected; narrows the name to one entry type and loses
  the session-persistence meaning "testament" carries.
- Keeping in `claude-code/` — rejected; governing rule has moved to `governance/`, co-location
  with `claude-code/` no longer reflects the governing relationship.
