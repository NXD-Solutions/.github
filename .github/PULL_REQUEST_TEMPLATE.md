## Summary
<!-- What changed and why — one line is fine. High-blast-radius or rule-network
     change? Expand into Goal / What / Why / Value / Risks. Multiple goals?
     Repeat the block, numbered: ## Goal 1, ## Goal 2. -->

## Version impact
<!-- Required only if this PR touches a versioned @nxd-solutions/* package.
     One line per package touched, omit entirely otherwise:
     Version Impact: <package-path>: Major|Minor|Patch — <one-sentence reason> -->

## Checklist
- [ ] No absorbed contract violations — no code compensates for another component
      failing its contract (would this code exist if it met its contract?), unless
      the absorption carries a stated exemption and a tracking issue routed to the owner
