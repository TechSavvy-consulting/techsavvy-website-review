# Cloudflare staging copy - October 27, 2026

## Scope and deployment

- User approved creating and copying the existing approved website to Cloudflare for testing, not a production cutover.
- Baseline approved website source: `bfc5d5fea9e9ac4883d84bea3bb1275fdcabc3bd`.
- Temporary URL: https://techsavvy-website-preview.techsavvytulsaok.workers.dev/
- Project: `techsavvy-website-preview`, existing TechSavvyTulsaOK Cloudflare account.
- Deployment `1aaa5e48` was manually uploaded through the signed-in Cloudflare dashboard; dashboard reports Ready, 100%, static assets only.
- No custom domains or routes attached. No Git integration, automatic deployment, paid plan, Worker runtime, visitor analytics or advertising pixels added.
- 63 files uploaded from `dist-cloudflare/`, including 24 HTML pages. Largest asset is the existing 16,880,189-byte introduction video.
- Routing uses `auto-trailing-slash` and `404-page`. Flat HTML files resolve to the approved extensionless URLs.
- All preview HTML and asset responses retain noindex safeguards. Production canonicals are retained, but no sitemap was submitted and no indexing changed.

## Visible changes by page

- `/english-privacy-policy`: the existing prepared hosting statement now reads, “Cloudflare provides website hosting and delivery for this website.”
- `/accessibility-statement`: the existing prepared statement now reads, “The website is hosted on Cloudflare.” The accessibility limitation disclosure is unchanged.
- All other pages: no content, design, heading, form-field, image or video edits in this hosting copy. The approved October 27 backup/proactive/AI updates remain intact.
- Technical metadata: sharing URLs/images use this Cloudflare preview host; production canonical URLs remain unchanged.

## Validation so far

- Local, GitHub and Cloudflare builds passed; Cloudflare artifact verifier passed 24 pages, 847 local link/asset references and three Formspree forms.
- Form handling and testimonial-script unit checks passed. No optional visitor tracking scripts found.
- Online audit: 21 non-redirect normal pages match their local HTML byte-for-byte; all 37 public assets have the expected status/content type; six approved redirect rules preserve query strings; three nonexistent paths return the custom page with genuine HTTP 404.
- Online audit found an unresolved video-range issue: valid byte-range GETs returned a complete HTTP 200 response rather than partial HTTP 206. Do not treat video compatibility or the entire launch gate as passed until resolved and retested.
- The empty homepage form correctly displays required-field validation. Full browser/mobile and three live form-delivery tests are still in progress.
- Formspree is owned by Kyle, sales@techsavvy.consulting is verified, the TechSavvy form workflow sends there, and Formshield remains enabled. The account showed 2/50 monthly submissions before these tests. No account settings changed.

## Protected live services

Read-only DNS baseline: apex A `185.230.63.107`; www CNAME `pointing.wixdns.net`; MX `techsavvy-consulting.mail.protection.outlook.com` priority 0; nameservers `dan.ns.cloudflare.com` and `cloe.ns.cloudflare.com`.

No DNS record, nameserver, Wix site, email service or advertising campaign was changed. Existing GitHub review hosting is separate. Keep Wix available for rollback until the later production migration is accepted.

## Next gate

Complete browser tests and the three clearly labeled internal form tests; resolve the video-range compatibility issue. Kyle reviews the Cloudflare copy. Obtain final production-cutover approval before connecting root/www, changing indexing, or retiring Wix.

Rebuild/verify instructions and rollback boundaries are in `CLOUDFLARE-RELEASE.md`. The optional Wrangler configuration was dry-run validated only; CLI authentication or deployment was not performed.
