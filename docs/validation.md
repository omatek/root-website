# Targeted refinement validation — 2026-11-14

The homepage implements the approved visual direction featuring root's philosophy
and root/archive as its first tangible project in a compact split layout.

The approved `root-barlow-lockup-dark-transparent.svg` establishes the parent
identity in the masthead and 404 page, preserved byte for byte.
`root-archive.svg` establishes the prominent featured build visual, preserved
with its approved colors and geometry. The favicon uses approved `root.svg`.

## Browser verification

Desktop 1440 × 900, laptop 1366 × 768, and mobile 390 × 844 screenshots were
visually inspected. Laptop and desktop achieve a cohesive single-screen layout
with zero vertical overflow. Mobile scales responsively.

| Viewport | Document size | Project surface |
| --- | --- | --- |
| desktop-1440x900 | 1440 × 900 | 244.0px |
| laptop-1366x768 | 1366 × 768 | 244.0px |
| mobile-390x844 | 390 × 844 | 200.0px |
| tablet-768x1024 | 768 × 1024 | 215.0px |
| narrow-320x740 | 320 × 775 | 200.0px |

The reproducible `scripts/check-browser.cjs` check passed for all five sizes:
actual logo foreground/background pixels, approved asset fingerprints and
proportions, font loading, no horizontal overflow, no console errors, no failed
assets, and no third-party page requests. Axe reports zero WCAG 2 A/AA, 2.1 AA,
and 2.2 AA violations. Keyboard order, visible focus, skip-to-main, archive
hover/focus and navigation, reduced motion, and the custom 404 pass. Navigation
uses an intercepted response and does not establish remote archive availability.

Commands:

```sh
NODE_PATH=/tmp/root-browser-qa/node_modules node scripts/check-browser.cjs
node --check scripts/check-browser.cjs
git diff --check
```

The README includes portable development-tool setup. These tools are not
runtime or Cloudflare build dependencies. Screenshots and measurements are in
`docs/screenshots/`. No unresolved branding/rendering issue was observed in the
tested Chromium captures. Safari, Firefox, screen-reader operation, remote link
availability, and deployed Cloudflare behavior are not verified.

No merge, production deployment, DNS, or domain configuration was changed.
