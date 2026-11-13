# Targeted refinement validation — 2026-11-14

The supplied `root-barlow-lockup-dark-transparent.svg` now establishes the
parent identity in the masthead and 404 page. It is copied byte for byte from
the latest upload, preserving its outlined Barlow wordmark, geometry, colors,
and transparency. Its rendered header appearance was visually compared against
the supplied SVG reference. The sharing image was regenerated with the same
approved parent lockup. The earlier missing-asset blocker is resolved.

The project artwork is a further approximately 8% smaller than the preceding
revision, with equal sizing and the same original project SVGs. Heading and
supporting text are slightly smaller, the desktop content width is narrower,
and the introduction/launcher group sits higher. Content and behavior remain
unchanged. No new section or effect was added.

## Browser verification

Desktop 1440 × 900 and mobile 390 × 844 screenshots were visually inspected,
including the actual bold header artwork. Laptop and desktop retain a natural
single-screen layout. Mobile scrolls vertically without horizontal overflow.

| Viewport | Document size | Project surface, each |
| --- | --- | --- |
| desktop-1440x900 | 1440 × 900 | 244.0px |
| laptop-1366x768 | 1366 × 768 | 215.0px |
| mobile-390x844 | 390 × 1039 | 194.0px |
| tablet-768x1024 | 768 × 1024 | 204.0px |
| narrow-320x740 | 320 × 1078 | 194.0px |

The reproducible `scripts/check-browser.cjs` check passed for all five sizes:
actual logo foreground/background pixels, approved asset fingerprints and
proportions, font loading, no horizontal overflow, no console errors, no failed
assets, and no third-party page requests. Axe reports zero WCAG 2 A/AA, 2.1 AA,
and 2.2 AA violations. Keyboard order, visible focus, skip-to-main, archive
hover/focus and navigation, noninteractive competitions, reduced motion, and
the custom 404 pass. Navigation uses an intercepted response and does not
establish remote archive availability.

Commands:

```sh
NODE_PATH=/tmp/root-qa-node/node_modules:/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules node scripts/check-browser.cjs
python3 scripts/render-social.py
node --check scripts/check-browser.cjs
git diff --check
```

The README includes portable development-tool setup. These tools are not
runtime or Cloudflare build dependencies. Screenshots and measurements are in
`docs/screenshots/`. No unresolved branding/rendering issue was observed in the
tested Chromium captures. Safari, Firefox, screen-reader operation, remote link
availability, and deployed Cloudflare behavior are not verified.

No merge, production deployment, DNS, or domain configuration was changed.
