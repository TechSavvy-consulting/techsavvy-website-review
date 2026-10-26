# Revision 8 — October 26, 2026

Kyle approved the photo-led sharing concept and completion of revision 8 for the GitHub test arena. This source note alone is not confirmation of deployment; the Pages run and published revision metadata must be verified after pushing.

## Approved scope

Only the first three items of the approved polish plan: homepage search/browser title, form-submit arrows and link-sharing previews. GitHub test arena only. Rollback commit: `c79b56ae978b1ef6b5718925bb3df2eb259c87d0`.

- Homepage title: TechSavvy Consulting | Managed IT & Cybersecurity in Tulsa.
- Form labels remain Request a callback and Send message, without decorative diagonal arrows. Endpoint and submission handling unchanged.
- General-page sharing card uses the approved Tulsa-inspired workspace illustration with a laptop showing security, cloud and automation symbols and a secondary TechSavvy logo. Each of the six articles uses its own existing image in a dedicated JPEG sharing derivative.
- Image metadata includes dimensions, MIME type and descriptive alt text; corresponding large-image card metadata is included. ProfessionalService keeps the branded company image even on article pages.
- No multi-location copy, pricing/service claims, date changes, new pages or layout redesign. Existing visible headlines, photos, noindex, production canonicals and routes remain.

## Sharing artwork

The approved photograph-style concept was created with the built-in image-generation tool using the TechSavvy logo as a branding reference. It is an illustrative scene, not an actual TechSavvy office photo or a verified exact skyline. The original is preserved at `assets/originals/techsavvy-sharing-tulsa-v8-original.png`; the exact prompt is in [revision 8 image prompts](REVISION-8-IMAGE-PROMPTS.json). The unpublished logo-only concept was discarded.

`npm run assets:sharing` optimizes the approved photo to a 1200×630 JPEG and produces six article JPEGs with contain sizing so existing faces and text are not cropped. Assets are committed under `public/images/share/`; normal builds do not depend on image generation. No CLI image-generation fallback or external font download was used.

The shared-link HTML follows the [Open Graph protocol](https://ogp.me/). Metadata and image availability can be verified without posting to social accounts. Actual third-party preview rendering is controlled by each platform and is not guaranteed by local tests.

## Verification plan

Run standard and Pages builds, built-page and sharing-asset checks, form regression tests, carousel regression tests and local HTTP checks. Inspect desktop/mobile form buttons and sharing artwork. After deployment, verify the revision, all routes and metadata-linked images over HTTPS. Do not send additional real inquiries or publish social posts as part of this polish update.

Retain final test results, the deployment commit/run and browser screenshots in the TechSupport output folder `outputs/website-revision-8-2026-10-26/` outside this public repository. The earlier `PENDING-REVIEW.json` is a historical pre-approval snapshot, superseded by the final `verification.json`.

Wix, main-domain DNS, email configuration and Cloudflare hosting remain unchanged.
