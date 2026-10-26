# TechSavvy Consulting · Website review

A modern, host-independent design example for TechSavvy Consulting. The production Wix website remains at **www.techsavvy.consulting**.

**Status:** public GitHub Pages test arena. Kyle approved the dedicated test address on October 26, 2026. Cloudflare is the planned future production host, but no Cloudflare deployment or production cutover is authorized by this setup. Forms are inactive and optional tracking is absent. The live Wix site, main website DNS, email and advertising destinations remain unchanged.

**Current revision, October 26:** revision 4 adds Kyle's approved AI/software/growth and service-focused wording, fuller descriptions of Full and Remote Managed IT, a Google-verified Chris Moles excerpt, and new-tab Further reading links. Page layout, review safeguards and existing assets are preserved. Revision 3 introduced four rotating client testimonials, transparent client logos and three current featured articles; see [revision 3 release notes](docs/REVISION-3-RELEASE.md).

**Test-address setup:** the build now targets the approved root-domain test address below. [Test-arena setup](docs/TEST-ARENA-SETUP.md) describes the settings, scope and verification requirements; a local build alone does not confirm DNS or HTTPS is active.

## Preview the design

**GitHub test arena:** https://websitenew.techsavvy.consulting/

The online preview is deployed from `main` by the [GitHub Pages workflow](.github/workflows/pages.yml). Future source changes can be committed here, verified, and deployed to this same test address. The custom domain is managed in GitHub Pages settings. Every page retains noindex metadata and a review notice; forms cannot submit. This is a public preview, not an access-controlled site.

The optional local preview is **http://127.0.0.1:4321/**. It works only on the build computer while the preview server is running.

The screenshots below document the initial design. Use the online example above for the current revision:

![Desktop homepage review](docs/preview-desktop.png)

- [Mobile homepage](docs/preview-mobile.png)
- [Desktop support/founder sections](docs/preview-desktop-sections.png)
- [Desktop callback form](docs/preview-desktop-contact.png)

## What is included

- All existing main-page and blog addresses, plus one new business-email security article.
- A responsive homepage, service cards, four client testimonials, local video and clear contact actions.
- Five detailed service/approach pages, About, Contact, FAQs, Blog and the existing policy texts for reference.
- A separate thank-you screen and proper 404 screen.
- Review-mode forms with no endpoint, storage or submission delivery.
- Local assets and system fonts; no optional analytics, advertising tags or automatically loaded third-party embeds.
- Existing canonical addresses retained as migration metadata. Every page is marked noindex.
- `/search-lp` → `/contact` and `/home-1` → `/` redirects in the local preview, with example hosting configuration kept separately.

## Run it

Use Node.js 24 and npm. No API keys or hosting account are required.

```sh
npm ci
npm run build
npm run verify
npm run preview
```

Open **http://127.0.0.1:4321/**. Press Ctrl+C in the terminal to stop the preview. If port 4321 is occupied, set the `PORT` environment variable before starting.

For source editing with hot reload, use `npm run dev`. Use `npm run preview` to verify the built example, including headers, redirects and 404 behavior.

## GitHub preview build

```sh
npm run build:pages
npm run verify:pages
```

This generates `dist-pages/` for `https://websitenew.techsavvy.consulting/` with root-relative links, directory-style page addresses and a GitHub-compatible custom 404. There is no `/techsavvy-website-review/` URL prefix. The workflow uploads only this generated artifact. The separate default `npm run build` stays host-independent, and production canonical addresses remain unchanged.

Run `npm run verify:online` after a successful deployment and HTTPS activation. It checks the test address, routes, assets, noindex, inactive forms and custom 404. GitHub Pages does not apply the local server's custom response headers or legacy redirects; HTML noindex is the public indexing safeguard. The Actions deployment does not need a `CNAME` file. Do not point production DNS here or enable forms as part of a routine preview update.

## Editing guide

| Area | File |
| --- | --- |
| Homepage | `src/pages/index.astro` |
| Shared header, footer, metadata | `src/layouts/BaseLayout.astro` |
| Design and responsive layout | `src/styles/global.css` |
| Service content | `src/data/services.ts` |
| About, Contact, FAQs | `src/components/StandardPages.astro` |
| Blog content | `src/data/blog.ts` |
| Customer quotes and carousel | `src/data/testimonials.ts`, `src/components/Testimonials.astro` |
| Blog article layout | `src/components/BlogArticle.astro` |
| Form layout and review safeguards | `src/components/ContactForm.astro` |
| Original public-site inventory | `src/data/source-inventory.json` |

Image originals are in `assets/originals/`; optimized WebP files are in `public/images/`. Run `npm run assets` to regenerate those derivatives. Video is served locally from `public/videos/`.

## Before considering production

See [test-arena setup](docs/TEST-ARENA-SETUP.md), [review notes](docs/REVIEW-NOTES.md), [asset provenance](docs/ASSET-SOURCES.md) and [verification](docs/VERIFICATION.md). Earlier dated documents describe historical review stages; the current test-arena setup and chat approvals govern hosting scope. After website approval, obtain approval to deploy that exact GitHub revision to a separate Cloudflare preview, implement and test Formspree delivery, update provider-specific policies and verify SEO/redirect details. Obtain separate production-transition approval before replacing Wix.

The noindex safeguards are intentionally hardcoded. A future production release requires a deliberate review of them; there is no automatic production switch.

GitHub remains the source of truth and test arena. Future Cloudflare releases must promote an explicitly approved commit, preserve a rollback revision and never automatically follow every change to the GitHub preview.
