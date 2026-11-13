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
- `docs/validation.md`: verification results and remaining deployment checks.

Add projects as another list item in `.project-grid`; the grid wraps
automatically. Use an anchor only when a project has a real destination. Use a
noninteractive article for upcoming initiatives. Each item has a logo, name,
description, and optional status. No scripting is needed.

The archive link intentionally points to `https://archive.rootamman.com` while
its label says “Preparing for public launch.” Competitions is an article with
no link, button role, or tab stop. The only social link is the supplied LinkedIn
page. No contact email was supplied, so none is shown. Update the copyright
year in the HTML when needed.

## Brand provenance

The five main root SVGs and the two project SVGs are the supplied attachments,
preserved byte for byte. Only archive and competitions appear in the launcher.

Archive uses the approved `#982F22` mark on `#E9EDE3`; competitions uses
`#E2E4E8` on `#25272B`. For the freestanding launcher, CSS clips the original
images to their exact hash-and-underscore geometry, removing only the surrounding
rectangular background. The original paths, foreground colors, aspect ratios,
and SVG files remain intact. CSS drop shadows create a thin edge and quiet
depth; there is no perspective distortion or generated artwork. The upcoming
mark is deliberately subdued through opacity.

Manrope is the Latin variable WOFF2 subset from
`@fontsource-variable/manrope@5.3.0`, distributed under the included SIL Open
Font License. System fonts cover other scripts and font-loading failures.

The social image composites the original wordmark with Manrope text. To
regenerate it on a machine with Pillow and Inkscape, run
`python3 scripts/render-social.py`. Those tools are not needed to serve or
deploy the site.
