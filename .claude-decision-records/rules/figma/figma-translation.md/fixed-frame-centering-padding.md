## Fixed-frame centering padding — translation rule and file placement

**Date:** 2026-04-09
**Authors:** Peter Sixhøj Petersen & Claude Sonnet 4.6
**Concern:** How to identify and translate Figma's fixed-frame centering padding pattern to CSS; what enforcement level is appropriate; where translation rules should live relative to structural linking rules.
**Decision:** Three decisions from the same deliberation:

1. **Pattern** — Equal `paddingLeft`/`paddingRight` on a FIXED-width container is a visual centering workaround, not a sizing constraint. Translate using a responsive primitive; never copy the literal values. Developer must flag the pattern to the designer: correct Figma expression is FILL width on the content child, no centering padding on the parent frame.

2. **Enforcement** — Level-3 (explicit acknowledgement). ESLint flags `px-[Npx]` where N > 100. Override requires an `// eslint-disable-line` comment stating why the fixed value is intentional.

3. **File placement** — Translation rules live in `figma-translation.md`, separate from `figma-integration.md` (structural/linking rules). The two files serve different primary audiences: structural rules serve developers registering and connecting components; translation rules serve developers implementing layout and designers understanding how their intent becomes code.

**Trigger:** GlobalTopBar in Manager-Assistant-v2 had `px-[389px]` — a direct copy of Figma's `paddingLeft: 389` on a FIXED 1352px container, causing the manager name/avatar to render outside the visible area on any viewport narrower than 1352px.

**Alternatives considered:**
- Level-5 (documentation only) — rejected: a rule that can be silently violated is not a rule
- Level-2 (hard block) — rejected: legitimate exceptions exist (hero/marketing sections with intentional fixed widths); a hard block would generate suppression noise
- Adding to `figma-integration.md` — rejected: mixing translation and structural rules overloads both audiences

**Conviction:** Peter Sixhøj Petersen: high | high — Claude Sonnet 4.6: high | high — 2026-04-09

**Value:** Correctness (prevents copy-paste layout bugs from Figma specs); waste eliminated (one recurring error class removed for all developers reading Figma specs); cognitive focus (rule placed in the right file for its audience)

**Outcome:**
