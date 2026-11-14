# root

The homepage for root, an independent, student-led technology community based
in Jordan. Built with static HTML and CSS. No JavaScript, runtime dependencies,
build step, external requests, analytics, or backend.

## Local preview

From the repository root:

```sh
python3 -m http.server 4173 --directory site
```

Open `http://localhost:4173`. There is nothing to install. Python is needed
only for local preview.

## Cloudflare Pages

Connect this GitHub repository to a Pages project with these settings:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Framework preset | None |
| Build command | Leave empty |
| Build output directory | `site` |
| Root directory | Repository root |

These settings follow Cloudflare’s [Git integration build settings](https://developers.cloudflare.com/pages/get-started/git-integration/#configure-your-build-settings).

The `site/` folder is the complete deployable output. No environment variables,
bindings, Wrangler configuration, or Functions are required. `_headers` supplies
security and asset caching headers. A real `404.html` prevents Pages from
treating missing paths as SPA routes.

Review a branch preview before approving production deployment. Domain setup
for `rootamman.com` is a separate owner action; this change does not configure
DNS, connect a custom domain, or deploy to production.

## Maintenance

- `site/index.html`: content, navigation, projects, and social metadata.
- `site/styles.css`: palette, type, layout, logo surface treatment, and breakpoints.
- `site/assets/brand/`: original SVGs, copied without modification.
- `site/assets/fonts/`: a self-hosted Latin variable font and its license.
- `site/assets/social/root-og.png`: the 1200 × 630 sharing image.
- `scripts/render-social.py`: optional social-image export using Pillow and Inkscape.
- `scripts/check-browser.cjs`: browser, artwork-pixel, accessibility, and interaction checks.
- `docs/screenshots/`: the three requested browser captures and verification metrics.
- `docs/validation.md`: verification results and deployment limits.

Add projects as another list item in `.project-grid`; the grid wraps
automatically. Use an anchor only when a project has a real destination. Use a
noninteractive article for upcoming initiatives. Each item has a logo, name,
description, and optional status. No scripting is needed.

The archive showcase is noninteractive with an "In development · Coming soon"
status while the project prepares for public announcement. It contains no link,
button role, or tab stop. The community links connect to official Instagram and
LinkedIn destinations. No contact email was supplied, so none is shown. Update
the copyright year in the HTML when needed.

## Brand provenance

The root lockups, parent symbol, and project SVGs are supplied attachments,
preserved byte for byte.

Archive uses the approved `#982F22` mark on `#E9EDE3`. The complete square SVG
is displayed directly as standalone artwork, including its approved background.
The logo image has no reconstructed paths, clipping contours, masks, filters,
color changes, opacity changes, or perspective distortion. CSS rounds only the
background surface corners and adds a restrained perimeter highlight and
shallow shadow. Name, description, and status sit beneath the artwork, outside
its surface.

The header uses `root-barlow-lockup-dark-transparent.svg`; the featured project
uses `root-archive.svg`; the favicon uses `root.svg`. SHA-256 fingerprints of
these approved files are recorded in the browser check.

Manrope is the Latin variable WOFF2 subset from
`@fontsource-variable/manrope@5.3.0`, distributed under the included SIL Open
Font License. System fonts cover other scripts and font-loading failures.

The social image composites the original wordmark with Manrope text. To
regenerate it on a machine with Pillow and Inkscape, run
`python3 scripts/render-social.py`. Those tools are not needed to serve or
deploy the site.

## Browser verification

The homepage remains buildless. Optional development tools can be installed
outside the repository to run its browser checks:

```sh
npm install --prefix /tmp/root-browser-qa --no-package-lock playwright@1.62.1 pngjs@7.0.0 axe-core@4.14.0
NODE_PATH=/tmp/root-browser-qa/node_modules node scripts/check-browser.cjs
```

The check uses `/usr/bin/chromium` by default; set `CHROMIUM_PATH` for another
Chromium executable. It starts and closes an isolated localhost server, applies
the site's security headers, tests five viewport sizes, and saves the requested
1440 × 900, 1366 × 768, and 390 × 844 screenshots. It checks actual foreground
and background pixels in the rendered logos, rather than treating a successful
image load as proof that the artwork is visible. It also checks keyboard order,
the skip link, focus, reduced motion, noninteractive archive showcase,
the custom 404, and axe WCAG accessibility rules.
