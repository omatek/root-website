# Validation — 2026-11-13

## Passed

- Both HTML documents parse in strict HTML5 mode with html5lib 1.1.
- The stylesheet and all media-query declarations parse without errors using
  tinycss2 1.5.1. SVGs and the sitemap parse as XML.
- Local image, font, stylesheet, page, and fragment references resolve. IDs are
  unique, and the homepage contains one `h1`.
- All seven deployed brand SVGs match the user-supplied originals byte for
  byte. The shared CSS clipping contour matches both project marks' original
  path, underscore dimensions, and translation exactly. The uniform crop
  preserves the symbol's 96:64.5 proportions.
- Exactly two projects appear. The entire archive element is an anchor to the
  supplied HTTPS destination, with an explicit public-launch preparation note.
  Competitions is a noninteractive article with “Coming soon,” no anchor, no
  button/link role, and no tab stop.
- The only external links are the supplied archive and LinkedIn destinations.
  All in-page navigation targets exist. This confirms URL accuracy in source,
  not remote service availability.
- Text contrast against plum-black: cream **14.64:1**, coral **6.38:1**, muted
  text **7.54:1**, quiet text **5.79:1**, and upcoming project text **8.94:1**.
  The decorative project symbols retain their approved colors.
- Font metrics confirm that both hero lines fit their available width at
  320, 360, 375, 390, 600, 768, 1024, 1440, and 1920 pixels. At 320px, the wider
  line measures about 272px inside a 280px content area. This is a source/font
  check, not a rendered responsive-layout test.
- The 1200 × 630 Open Graph PNG decodes correctly, has an opaque plum-black
  background, and was visually inspected. The original wordmark is rasterized
  proportionally from the approved SVG; typography uses the self-hosted font.
- `python3 scripts/render-social.py` succeeds. Its code passes
  `python3 -m py_compile scripts/render-social.py`.
- `git diff --check` passes. The complete deployable `site/` directory is
  approximately 129 KB, including unused alternate wordmarks and the social
  PNG. The homepage has no JavaScript and uses a single 24.8 KB font file.

## Accessibility and interaction source review

Semantic header, named navigation, main, sections, project list, and footer are
present. A visible-on-focus skip link leads to main content. All links receive
a coral `:focus-visible` outline. Project focus uses the same restrained lift
as hover. Decorative marks/arrows are hidden from assistive technology, and
project names, descriptions, and statuses provide accessible text.

`prefers-reduced-motion: reduce` removes smooth scrolling, transitions, and
hover/focus translations. Upcoming content has no pointer interaction or hover
lift. The grid automatically wraps additional items, becomes one column on
small phones, and does not rely on scripting.

## Browser verification limit

The supported managed preview could not provide a browser route:

```text
sites-preview start /workspace/root-website
sites-preview: relay could not open browser port 4173:
timed out waiting for relay readiness
```

The shared browser also rejects local `file:` URLs. That restriction was not
bypassed. Consequently, desktop/tablet/mobile rendered layout, real keyboard
navigation, actual hover/focus rendering, clipped-logo rendering, browser
console/network behavior, and cross-browser behavior remain **unverified**.
The social-image inspection does not establish homepage visual correctness.

Before approving production, inspect a local or approved branch preview at
1440px, 768px, 390px, and 320px. Check the two-logo balance, in-page links, Tab
order and skip link, archive hover/focus, noninteractive competitions state,
reduced-motion preference, and absence of horizontal overflow. Also verify
archive's current remote availability and test the custom 404 and `_headers`
on a Pages preview.

## Deployment boundary

`site/` is the complete Cloudflare Pages build output. No build process,
package installation, environment variables, Workers, or external services are
required. The setup recipe is in the README. This work does not create a
Cloudflare project, modify domain/DNS configuration, deploy a live site, or
claim production verification.
