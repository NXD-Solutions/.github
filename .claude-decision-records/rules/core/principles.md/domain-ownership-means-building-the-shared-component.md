# Domain ownership means building the shared component

**Date:** 2026-03-09

**Authors:** Peter Sixhøj & claude-sonnet-4-6

**Concern:** When uniformity is discouraged, every team inherits full ownership of every concern — including deep ones like GDPR, NIS2, and security. Most teams lack the time to go deep enough. The result: teams act in good faith, believe they have done it correctly, and have not. The failure is not negligence — it is structural. Depth requires focus. A team that partially owns ten concerns cannot go deep enough on any of them.

**Decision:** A principle naming the obligation that comes with domain ownership: the owner is not just the expert — they are accountable for ensuring a framework component exists and is used across all projects. They may delegate the build; they may not delegate the outcome. This closes the gap between "we have a security team" and "every project is actually secure."

**Related:** Uniform by Design (parent), Security is baseline (complementary — Security is baseline says never per-repo; this principle names the accountability structure that makes that true)

**Trigger:** Authoring Uniform by Design derived principles. Real experience from an organisation where uniformity was discouraged: teams cross-examined on GDPR and NIS2 compliance held genuine but incorrect beliefs. The failure was not negligence — it was the predictable result of distributing deep concerns across generalists without the time to go deep.

**Alternatives considered:** "Centralise expertise" — rejected, too passive; expertise without the obligation to deliver a component leaves the problem structurally unsolved. Scoping to security only — rejected, the same failure mode applies to logging, observability, and any concern requiring depth that generalists cannot sustain.

**Conviction:** high | high

**Examples:** Security team owns authentication — they ensure `@nxd-solutions/auth` exists and is used. Operators own log contents — they ensure the logging component implementing the contract is in place.