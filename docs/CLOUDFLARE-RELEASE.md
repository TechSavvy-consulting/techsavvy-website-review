# Cloudflare release checklist

Updated October 27, 2026. This is preparation, not a deployment or DNS authorization.

## Current arrangement

- GitHub `main` deploys only to https://websitenew.techsavvy.consulting/.
- Production remains Wix. Do not change root/www, MX, SPF, DKIM, DMARC or other email records.
- The project is static Astro: Node 24, `npm ci`, `npm run build`, output `dist`. No server adapter, database or paid backend is needed for current features.
- Formspree supplies form processing. The public form ID may remain in source; no account password/API key belongs in the repository.
- Cloudflare `_headers` and `_redirects` are prepared in public/. GitHub Pages ignores those settings. Noindex remains hardcoded in HTML and in the future Cloudflare preview header. Robots permits crawling so noindex can be read.

## When Kyle approves Cloudflare preview

1. Record the exact approved Git commit and prior rollback commit. Build from that revision, not an unreviewed moving branch.
2. Choose manual Direct Upload, or disable automatic production deployments if using Cloudflare Git integration. Direct Upload and Git-integrated projects have different migration constraints; confirm the method before creating a project.
3. Set Astro's `site` to the actual Cloudflare preview origin for correct sharing images/URLs. Keep production canonicals and noindex during preview. Set `SITE_HOSTING=cloudflare` only for an artifact that will actually be hosted on Cloudflare. This selects the prepared current-host policy wording; GitHub review builds must leave it unset and describe Cloudflare as planned. Review provider disclosures against the actual configuration.
4. Build and run route, link, form and responsive checks. Upload the approved artifact only after deployment approval. Do not connect the main domain yet.
5. Verify HTTPS, retained paths, redirect query strings, real 404 status, assets/video range, emergency-support asterisk-to-FAQ link, keyboard/mobile interactions and all three form workflows. Separately approve delivery tests, then send clearly identified synthetic inquiries and verify receipt at sales@techsavvy.consulting. Never count internal tests as leads.

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
- The October 26 account check showed 50 submissions/month shared across the Free account's forms. Check current usage and allowance before advertising; do not silently upgrade or alter other forms.
- Keep Formshield enabled. The new form was created with CAPTCHA disabled by default; no protection was disabled for this integration. Review abuse before choosing any additional protection.
- Submissions contain only ordinary business inquiry fields. No uploads, passwords, payment information or PHI. Visitors are warned accordingly.
- Native HTML POST is a no-JavaScript fallback. AJAX shows in-page success/errors, preserves fields on uncertain failures, and never automatically retries.
- Level installers are vendor-hosted generic downloads. Customer-specific enrollment keys/commands must be delivered privately, never committed.

## References

- https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/
- https://developers.cloudflare.com/pages/configuration/redirects/
- https://developers.cloudflare.com/pages/configuration/headers/
- https://developers.cloudflare.com/pages/get-started/direct-upload/
- https://developers.cloudflare.com/pages/configuration/branch-build-controls/
- https://developers.google.com/search/docs/crawling-indexing/block-indexing
