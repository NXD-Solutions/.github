# Figma Translation

Rules for translating Figma design intent to code. Applies to repos with Figma-linked components.

## Invariants

**Fixed-frame centering padding is a layout workaround — translate intent, not values.** Equal `paddingLeft`/`paddingRight` on a FIXED-width container centres content within the design-time frame — it is not a sizing constraint. Copying these values to CSS produces a layout that breaks at any viewport narrower than the design-time width. Translate the centering intent using a responsive primitive (`grid-cols-[auto_1fr_auto]`, `mx-auto`, or equivalent) — never the literal pixel values. When this pattern is present, flag it to the designer: the correct Figma expression is FILL width on the content child with no centering padding on the parent frame.

## Enforcement

ESLint enforces the fixed-frame centering rule as a level-3 gate: `px-[Npx]` where N > 100 requires an `// eslint-disable-line` comment stating why the fixed value is intentional.
