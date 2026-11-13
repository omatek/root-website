# Design revision validation — 2026-11-14

## Targeted size correction and pending brand asset

Project artwork is uniformly 22% smaller than the preceding revision at all
five tested widths. Grid width, introduction spacing, artwork-to-caption gaps,
and mobile/footer spacing were adjusted without changing content or behavior.
Desktop and mobile screenshots were visually inspected again; all automated
browser checks pass and axe reports zero violations.

The requested `root-barlow-lockup-dark-transparent.svg` is missing after a
workspace search. The new upload is `root-barlow-lockup-dark.svg`, which has
the intended bold outlined Barlow wordmark and a solid plum background. Its
reference rendering was inspected. It has not been substituted: use of that
exact opaque asset is awaiting the user's answer. Screenshots currently retain
the previous thin wordmark, which remains an unresolved branding issue.

## Rendered result

The compact homepage was rendered in Chromium using an isolated localhost
server with the site's actual Content Security Policy and response headers.
The complete approved SVGs render directly, including their original background
colors. No mask, clip path, reconstructed brand path, opacity change, or
perspective transform is used on the logo images.

| Viewport | Document size | Logo surface | Result |
| --- | --- | --- | --- |
| Desktop 1440 × 900 | 1440 × 900 | About 265 × 265 each | Fits one viewport |
| Laptop 1366 × 768 | 1366 × 768 | About 234 × 234 each | Fits one viewport |
| Mobile 390 × 844 | 390 × 1103 | About 211 × 211 each | Natural vertical scroll |
| Tablet 768 × 1024 | 768 × 1024 | About 222 × 222 each | No horizontal overflow |
| Narrow mobile 320 × 740 | 320 × 1141 | About 211 × 211 each | No horizontal overflow |

All three requested screenshots were inspected. The first revision's laptop
capture exposed a 15px vertical overflow. The visual correction pass shortened
the supporting copy and tightened the main/footer spacing, while increasing
the laptop artwork from about 292px to 300px. A second rendered inspection
confirmed that the full laptop page fits naturally, without a fixed page height
or overflow clipping. The desktop screenshot also fits naturally. Mobile keeps
prominent artwork and stacks the projects.

- [Desktop — 1440 × 900](screenshots/desktop-1440x900.png)
- [Laptop — 1366 × 768](screenshots/laptop-1366x768.png)
- [Mobile — 390 × 844, full page](screenshots/mobile-390x844.png)
- [Machine-readable measurements](screenshots/results.json)

## Branding

The visible parent brand is `site/assets/brand/root-lockup-dark-transparent.svg`.
The two launcher identities are `root-archive.svg` and `root-competitions.svg`.
The favicon is `root.svg`. Each matches its corresponding user-supplied original
byte for byte. The unused light/dark lockup alternatives also remain unchanged.
SHA-256 fingerprints for the four used assets are enforced by the browser check.

The standalone square logo artwork supplies its own approved surface. Only
that surface receives rounded background corners, a thin perimeter highlight,
and a shallow shadow. The project text is outside the artwork; no card or
bordered panel surrounds the full project element. Competitions retains its
original colors and uses a quieter perimeter treatment.

## Automated browser checks

Run from the repository root with the optional development tools available:

```sh
NODE_PATH=/tmp/root-qa-node/node_modules:/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules node scripts/check-browser.cjs
```

The README gives a portable installation command. None of these tools is a
site runtime or Cloudflare build dependency.

Passed at all five widths:

- Both logo images load at their original square proportions and remain large.
- Actual screenshot pixels contain the expected oxide/ivory and silver/graphite
  artwork. This catches the previous failure where the files loaded but the
  CSS treatment hid all artwork. Both symbols occupy approximately 4% of their
  approved square surfaces; original backgrounds remain visible.
- Desktop document heights equal the viewport heights. No horizontal overflow
  occurs at any tested size.
- Header SVG retains its exact original 592:217 proportions.
- The self-hosted Manrope font loads, all assets return successfully, there are
  no browser console/page errors, and page loading makes no third-party requests.
- Axe WCAG 2 A/AA, 2.1 AA, and 2.2 AA checks report **zero violations**.

Additional browser checks passed:

- Tab order: skip link, parent logo, Explore, Connect, archive, LinkedIn.
- Every tab stop has a visible focus outline; the skip link focuses `main`.
- Archive responds to hover/focus with a restrained 2px lift.
- Competitions has no link/button role or tab stop and does not lift on hover.
- Reduced-motion preference disables translations, transitions, and smooth scroll.
- Clicking the archive artwork navigates to its exact supplied URL. The
  response was intercepted locally; this does not verify remote availability.
- Unknown paths return the custom 404 document in the test server.

## Source checks

Strict HTML5 parsing of both pages passed with html5lib 1.1. CSS and media-query
syntax passed with tinycss2 1.5.1. SVGs and the sitemap parse as XML. All local
file and fragment references resolve, IDs are unique, and every brand file
matches the original attachment. `node --check scripts/check-browser.cjs` and
`git diff --check` pass. Body text palette contrast remains at least 5.79:1
against plum-black.

## Limits and deployment boundary

The header asset issue described above remains unresolved. No other rendering
issue was observed in the tested Chromium renders. Firefox, Safari, screen-reader operation, remote service availability,
and Cloudflare's deployed response behavior were not tested. Axe and keyboard
checks do not replace a full assistive-technology audit.

The deployable output remains the buildless `site/` directory. This revision
changes no Cloudflare project, production deployment, DNS, domain configuration,
or merge state. The existing feature branch and PR are used for review.
