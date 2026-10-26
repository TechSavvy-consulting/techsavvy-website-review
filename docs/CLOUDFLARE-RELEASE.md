# Cloudflare release checklist

Prepared October 26, 2026. This is preparation, not a deployment or DNS authorization.

## Current arrangement

- GitHub `main` deploys only to https://websitenew.techsavvy.consulting/.
- Production remains Wix. Do not change root/www, MX, SPF, DKIM, DMARC or other email records.
- The project is static Astro: Node 24, `npm ci`, `npm run build`, output `dist`. No server adapter, database or paid backend is needed for current features.
- Formspree supplies form processing. The public form ID may remain in source; no account password/API key belongs in the repository.
- Cloudflare `_headers` and `_redirects` are prepared in public/. GitHub Pages ignores those settings. Noindex remains hardcoded in HTML and in the future Cloudflare preview header. Robots permits crawling so noindex can be read.

## When Kyle approves Cloudflare preview

1. Record the exact approved Git commit and prior rollback commit. Build from that revision, not an unreviewed moving branch.
2. Choose manual Direct Upload, or disable automatic production deployments if using Cloudflare Git integration. Direct Upload and Git-integrated projects have different migration constraints; confirm the method before creating a project.
3. Set Astro's `site` to the actual Cloudflare preview origin for correct sharing images/URLs. Keep production canonicals and noindex during preview. Review the hosting-neutral privacy disclosure against the actual Cloudflare configuration and add provider details where appropriate; do not claim a migration before it occurs.
4. Build and run route, link, form and responsive checks. Upload the approved artifact only after deployment approval. Do not connect the main domain yet.
5. Verify HTTPS, all legacy paths, redirect query strings, real 404 status, assets/video range, emergency-support asterisk-to-FAQ link, keyboard/mobile interactions and both real form workflows. Send clearly identified synthetic inquiries and verify receipt at sales@techsavvy.consulting.

## Separate production cutover

- Obtain approval for exact domain/DNS targets and cutover timing. Preserve email records.
- Resolve www/apex canonical behavior, preserve existing URLs and apply permanent redirects for retired URLs. No catch-all homepage redirect.
- Deliberately remove HTML/header noindex from production only. Keep the GitHub arena noindex. Add a production canonical sitemap and review robots/Search Console submission.
- Review privacy/provider disclosures and any consent requirements for future analytics or marketing scripts. No such scripts are currently installed.
- Add and verify accurate captions or a transcript for the introduction video. Revision 6's accessibility statement discloses the current limitation; update it when addressed. Do not claim full WCAG conformance without an appropriate audit.
- Verify domain SSL, form delivery and old URLs after cutover. Keep the Wix site and prior DNS/artifact rollback available until accepted.

## Form operations

- Both forms use `https://formspree.io/f/mvkkkwyn`, “TechSavvy Website Inquiries.” Notifications are configured to sales@techsavvy.consulting.
- Free account currently permits 50 submissions/month shared with its other forms. Check usage before advertising; do not silently upgrade or alter other forms.
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
