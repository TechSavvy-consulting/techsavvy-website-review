# TechSavvy Consulting · Website review

A modern, host-independent design example for TechSavvy Consulting. The production Wix website remains at **www.techsavvy.consulting**.

**Status:** public GitHub Pages test arena. Cloudflare is the planned future production host, but no Cloudflare deployment or production cutover is authorized yet. On October 26, 2026 Kyle approved real Formspree inquiries and removal of visible preview notices. Optional tracking remains absent; noindex remains enabled. The live Wix site, main website DNS, email settings and advertising destinations remain unchanged.

**Revision 8, October 26:** approved update for the GitHub test arena: new homepage search/browser title, plain inquiry-form submit buttons, the approved Tulsa-inspired photographic sharing image and article-specific blog sharing images. Visible page headlines, photos and layout remain unchanged. See [revision 8 release notes](docs/REVISION-8-RELEASE.md). A local build or this source note does not itself confirm deployment; verify the GitHub Pages run and published revision metadata.

**Test-address setup:** the build now targets the approved root-domain test address below. [Test-arena setup](docs/TEST-ARENA-SETUP.md) describes the settings, scope and verification requirements; a local build alone does not confirm DNS or HTTPS is active.

## Preview the design

**GitHub test arena:** https://websitenew.techsavvy.consulting/

The online preview is deployed from `main` by the [GitHub Pages workflow](.github/workflows/pages.yml). Future source changes can be committed here, verified, and deployed to this same test address. The custom domain is managed in GitHub Pages settings. Every page retains noindex metadata, while visible preview notices are removed and inquiry forms can submit. This is a public test site, not an access-controlled site.

The optional local preview is **http://127.0.0.1:4321/**. It works only on the build computer while the preview server is running.

The screenshots below document the initial design. Use the online example above for the current revision:

![Desktop homepage review](docs/preview-desktop.png)

- [Mobile homepage](docs/preview-mobile.png)
- [Desktop support/founder sections](docs/preview-desktop-sections.png)
- [Desktop callback form](docs/preview-desktop-contact.png)

## What is included

- All existing main-page and blog addresses, plus new business-email security, AI-workflow and IT-growth-planning articles.
- A responsive homepage, service cards, four client testimonials, local video and clear contact actions.
- Detailed service/approach pages, separate AI Services, client support downloads, About, Contact, FAQs, Blog and hosting-neutral privacy/accessibility information that discloses Formspree.
- A separate thank-you screen and proper 404 screen.
- Home callback and Contact forms delivered through Formspree Free to the verified sales@techsavvy.consulting address. See src/data/contact-form.ts; the public form ID is not a secret.
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

Run `npm run verify:online` after a successful deployment. It checks the test address, routes, assets, noindex, configured form actions and custom 404. GitHub Pages does not apply Cloudflare _headers/_redirects; HTML noindex is the public indexing safeguard. Crawling is permitted so search engines can read noindex. The Actions deployment does not need a CNAME file. Do not point production DNS here.

## Editing guide

| Area | File |
| --- | --- |
| Homepage | `src/pages/index.astro` |
| Shared header, footer, metadata | `src/layouts/BaseLayout.astro` |
| Design and responsive layout | `src/styles/global.css` |
| Service content | `src/data/services.ts` |
| About, Contact, FAQs | `src/components/StandardPages.astro` |
| Blog content | `src/data/blog.ts` |
| Privacy and accessibility content | `src/components/PolicyContent.astro` |
| Customer quotes and carousel | `src/data/testimonials.ts`, `src/components/Testimonials.astro` |
| Blog article layout | `src/components/BlogArticle.astro` |
| Form layout, delivery and feedback | `src/components/ContactForm.astro`, `src/data/contact-form.ts` |
| Original public-site inventory | `src/data/source-inventory.json` |

Image originals are in `assets/originals/`; optimized WebP files are in `public/images/`. Run `npm run assets` to regenerate those derivatives. Video is served locally from `public/videos/`.

## Before considering production

See [Cloudflare release checklist](docs/CLOUDFLARE-RELEASE.md), [revision 8 notes](docs/REVISION-8-RELEASE.md) and [asset provenance](docs/ASSET-SOURCES.md). Earlier dated documents describe historical stages; latest chat approvals and AGENTS.md govern scope. After website approval, deploy the exact approved GitHub revision to a separate Cloudflare preview, review provider disclosures and verify forms/SEO/redirects there. Obtain separate production-transition approval before replacing Wix.

The noindex safeguards are intentionally hardcoded. A future production release requires a deliberate review of them; there is no automatic production switch.

GitHub remains the source of truth and test arena. Future Cloudflare releases must promote an explicitly approved commit, preserve a rollback revision and never automatically follow every change to the GitHub preview.
