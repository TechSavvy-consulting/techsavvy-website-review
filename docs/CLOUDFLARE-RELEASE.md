# Cloudflare release checklist

Updated October 27, 2026. Kyle approved production after accepting the Cloudflare preview. Production is now hosted independently on Cloudflare; see `CLOUDFLARE-LAUNCH-2026-10-27.md` for deployment, verification and rollback records. Preview instructions below apply only to the isolated review copy.

## Current arrangement

- GitHub `main` deploys only to https://websitenew.techsavvy.consulting/.
- Production is `https://www.techsavvy.consulting/` on `techsavvy-website-production`. Apex redirects to www. Wix is retained for rollback, not canceled. MX, SPF, DKIM, DMARC and all other email/service records are unchanged.
- The project is static Astro on Cloudflare Workers Static Assets Free. The introduction video additionally uses a small byte-range Worker because the basic static uploader did not supply partial responses. No server adapter, database or paid backend was added. The video is unchanged. Only video-first requests (and fallback requests without matching assets) may invoke runtime code and use Workers Free limits; ordinary matching page/assets traffic remains static.
- Cloudflare must remain independent of GitHub: upload complete local artifacts deliberately; do not configure Git integration, automatic deployment, remote GitHub asset loading or redirects back to the test arena. GitHub is optional source backup, not a hosting dependency. Review hosting may move away from GitHub later.
- Formspree supplies form processing. The public form ID may remain in source; no account password/API key belongs in the repository.
- Cloudflare `_headers` and `_redirects` are prepared in public/. GitHub Pages ignores those settings. Review targets remain noindex. The separate explicit production build enables indexing for normal pages and generates production headers/robots; 404, thank-you and retired stubs remain noindex.

## Production release gates

Use `npm run build:production`, `npm run verify:production`, and, after an approved upload, `npm run verify:production:online`. Deploy complete local artifacts with the existing scoped login and `wrangler.production.jsonc`; never connect GitHub. Keep `dist-production` separate from `dist-cloudflare`.

Production custom domains are dashboard-managed. Keep both `route` and `routes` omitted and `workers_dev: false` so future normal deployments preserve that domain attachment. This follows [Wrangler source-of-truth guidance](https://developers.cloudflare.com/workers/wrangler/configuration/#source-of-truth). Do not add empty routes, broaden saved permissions, or change DNS for routine content updates. Code rollback does not restore DNS/redirect rules.

## Approved Cloudflare preview workflow

1. Record the exact approved Git commit and prior rollback commit. Build from that revision, not an unreviewed moving branch.
2. Use the approved `wrangler.preview.jsonc` and the existing limited-scope deployment login. Do not connect a Git repository or automatic deployment pipeline. The basic dashboard uploader was used for the first copy but does not deploy the required video handler. Worker code stays outside the public assets directory. Do not broaden authentication scopes for unrelated features.
3. Set Astro's `site` to the actual Cloudflare preview origin for correct sharing images/URLs. Keep production canonicals and noindex during preview. Set `SITE_HOSTING=cloudflare` only for an artifact that will actually be hosted on Cloudflare. This selects the prepared current-host policy wording; GitHub review builds must leave it unset and describe Cloudflare as planned. Review provider disclosures against the actual configuration.
4. Build and run route, link, form and responsive checks. Upload the approved artifact only after deployment approval. Do not connect the main domain yet.
5. Verify HTTPS, retained paths, redirect query strings, real 404 status, assets/video range, emergency-support asterisk-to-FAQ link, keyboard/mobile interactions and all three form workflows. Delivery tests are approved for this preview: send clearly identified synthetic inquiries and verify receipt at sales@techsavvy.consulting. Never count internal tests as leads.

Build the preview explicitly (Node 24; dependencies already locked):

```powershell
npm ci
npm run build:cloudflare -- --origin https://techsavvy-website-preview.techsavvytulsaok.workers.dev
npm run verify:cloudflare -- --origin https://techsavvy-website-preview.techsavvytulsaok.workers.dev
npm exec --yes --package=wrangler@4.153.0 -- wrangler deploy --config wrangler.preview.jsonc --dry-run
# Only within an approved preview-deployment task:
npm exec --yes --package=wrangler@4.153.0 -- wrangler deploy --config wrangler.preview.jsonc
npm run verify:cloudflare:online -- --origin https://techsavvy-website-preview.techsavvytulsaok.workers.dev
```

Deploy only the configured `dist-cloudflare/` static assets and `cloudflare/video-worker.mjs`, never the repository folder or credentials. Settings: HTML handling `auto-trailing-slash` (the generated `.html` files resolve at extensionless, non-trailing-slash paths), not-found handling `404-page`, and `run_worker_first` restricted to `/videos/techsavvy-introduction.mp4`. The Worker only reads the internal ASSETS binding. Its known video length is guarded by tests; replacing the video requires updating that guard and rechecking all ranges. This preview build rejects custom/production origins and has no indexing-enable mode. Keep any GitHub builds on their separate workflow. Rolling back to initial deployment `1aaa5e48` restores the exact static-only copy but also restores the video-seeking limitation; prefer a known-good tested full deployment.

## Separate production cutover

- Obtain approval for exact domain/DNS targets and cutover timing. Preserve email records.
- Resolve www/apex canonical behavior, preserve existing URLs and apply permanent redirects for retired URLs. No catch-all homepage redirect.
- Deliberately remove HTML/header noindex from production only, including the standalone paid landing page. Keep the GitHub arena noindex. Verify the prepared `/sitemap.xml` inventory and production canonicals, then review robots/Search Console ownership and submission. Do not submit the review sitemap or change indexing before approval.
- Preserve `/managed-it-tulsa`, `/contact`, `/about-it-support` and `/outsourced-managed-it` at their current production paths. Verify every active ad/sitelink after cutover without editing the campaign. See `SEO-REVIEW-2026-10-27.md` for the retained URL inventory and exact review-build changes.
- Review privacy/provider disclosures and any consent requirements for future analytics or marketing scripts. No such scripts are currently installed.
- Add and verify accurate captions or a transcript for the introduction video. Revision 6's accessibility statement discloses the current limitation; update it when addressed. Do not claim full WCAG conformance without an appropriate audit.
- Verify domain SSL, form delivery and old URLs after cutover. Keep the Wix site and prior DNS/artifact rollback available until accepted.

## Form operations

- Homepage, contact and paid-landing forms use `https://formspree.io/f/mvkkkwyn`, “TechSavvy Website Inquiries.” Notifications were verified configured to sales@techsavvy.consulting on October 26; recheck ownership, recipient and delivery before launch.
- The October 27 account check showed 2 of 50 submissions used before Cloudflare tests, shared across the Free account's forms. The signed-in Kyle-owned account has a verified sales@techsavvy.consulting recipient and its TechSavvy Website Inquiries workflow sends to that address. Check current usage before advertising; do not silently upgrade or alter other forms.
- All three October 27 Cloudflare synthetic tests were confirmed delivered to sales@techsavvy.consulting. They consume three submissions and must not be counted as leads. Exact test IDs/times are in `CLOUDFLARE-PREVIEW-2026-10-27.md`.
- The additional production contact test was accepted but filtered into Formspree spam. Only that known synthetic record was marked Not Spam; its matching email arrived at sales@techsavvy.consulting at 14:58:26 UTC. Keep this fourth launch test out of leads. No spam settings changed. See `CLOUDFLARE-LAUNCH-2026-10-27.md` for the qualified delivery evidence, and inspect the spam queue if notifications are unexpectedly absent.
- Keep Formshield enabled. The new form was created with CAPTCHA disabled by default; no protection was disabled for this integration. Review abuse before choosing any additional protection.
- Submissions contain only ordinary business inquiry fields. No uploads, passwords, payment information or PHI. Visitors are warned accordingly.
- Native HTML POST is a no-JavaScript fallback. AJAX shows in-page success/errors, preserves fields on uncertain failures, and never automatically retries.
- Level installers are vendor-hosted generic downloads. Customer-specific enrollment keys/commands must be delivered privately, never committed.

## References

- https://developers.cloudflare.com/pages/
- https://developers.cloudflare.com/workers/static-assets/
- https://developers.cloudflare.com/workers/static-assets/redirects/
- https://developers.cloudflare.com/workers/static-assets/headers/
- https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/
- https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/
- https://developers.google.com/search/docs/crawling-indexing/block-indexing
