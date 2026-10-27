# Cloudflare staging copy - October 27, 2026

Later same-day status: preview accepted; production launched separately under Kyle's explicit approval. See `CLOUDFLARE-LAUNCH-2026-10-27.md`. This document preserves the initial preview verification record below; its former pending-production gate is superseded. Preview now uses eight-second testimonials without hover pause, version `082ae03c-76fa-4fa7-a662-f47beb2e66a7`, and remains noindex.

## Scope and deployment

- User approved creating and copying the existing approved website to Cloudflare for testing, not a production cutover.
- Baseline approved website source: `bfc5d5fea9e9ac4883d84bea3bb1275fdcabc3bd`.
- Temporary URL: https://techsavvy-website-preview.techsavvytulsaok.workers.dev/
- Project: `techsavvy-website-preview`, existing TechSavvyTulsaOK Cloudflare account.
- Initial deployment `1aaa5e48` was manually uploaded through the signed-in Cloudflare dashboard. The subsequent video-fix deployment `0c18bca1-0915-4f7a-a47a-31ebf2115681` added the narrowly scoped video-delivery handler through Wrangler; static page content was identical. The later eight-second carousel deployment is recorded above.
- No custom domains or routes attached. No Git integration, automatic deployment, paid plan, visitor analytics or advertising pixels added. A small Worker handles byte-range requests for the existing introduction video; ordinary matching page/assets traffic remains static.
- Cloudflare is independent of GitHub hosting. All website assets are uploaded to Cloudflare, the Worker uses only the internal ASSETS binding, and the artifact checker rejects GitHub/GitHub Pages/test-arena references. GitHub is optional source backup only.
- 63 files uploaded from `dist-cloudflare/`, including 24 HTML pages. Largest asset is the existing 16,880,189-byte introduction video.
- Routing uses `auto-trailing-slash` and `404-page`. Flat HTML files resolve to the approved extensionless URLs.
- All preview HTML and asset responses retain noindex safeguards. Production canonicals are retained, but no sitemap was submitted and no indexing changed.

## Visible changes by page

- `/english-privacy-policy`: the existing prepared hosting statement now reads, “Cloudflare provides website hosting and delivery for this website.”
- `/accessibility-statement`: the existing prepared statement now reads, “The website is hosted on Cloudflare.” The accessibility limitation disclosure is unchanged.
- All other pages: no content, design, heading, form-field, image or video edits in this hosting copy. The approved October 27 backup/proactive/AI updates remain intact.
- Technical metadata: sharing URLs/images use this Cloudflare preview host; production canonical URLs remain unchanged.
- Homepage technical delivery only: video seeking now uses correct partial responses. The MP4, audio, poster, player and page design were not edited; source and uploaded-artifact video bytes match exactly.

## Validation so far

- Local, GitHub and Cloudflare builds passed; Cloudflare artifact verifier passed 24 pages, 847 local link/asset references and three Formspree forms.
- Form handling and testimonial-script unit checks passed. No optional visitor tracking scripts found.
- Online audit: 21 non-redirect normal pages match their local HTML byte-for-byte; all 37 public assets have the expected status/content type; six approved redirect rules preserve query strings; three nonexistent paths return the custom page with genuine HTTP 404.
- Video issue resolved: the original static uploader returned HTTP 200 for range requests. The deployed handler passes five byte-exact beginning/middle/end/suffix/invalid range checks, including HTTP 206 and 416. All online checks pass (80 read-only requests). 51 offline handler cases and native local Workers-runtime checks also passed.
- Desktop Chrome playback advanced normally; the seekable range changed from 0–0 to the full 0–82.154 seconds, and keyboard seeking while paused works. Real iPhone/Safari playback remains a user-device check; it has not been claimed tested. Free-runtime CPU consumption was not directly measured; late-range requests succeeded online without errors. No paid plan was enabled.
- The empty homepage form correctly displays required-field validation. Three approved synthetic inquiries submitted successfully and were received at sales@techsavvy.consulting:
  - `CF-20261027-HOME`, homepage callback, received 13:47:49 UTC.
  - `CF-20261027-CONTACT`, contact form at 390px, optional qualification fields left blank, received 13:48:49 UTC.
  - `CF-20261027-ADS`, paid landing form at 390px, optional telephone left blank, received 13:52:30 UTC.
  - These are internal tests, not leads. No additional source question, tracking or form settings were added. Network-error behavior is unit-tested, not deliberately induced in the live browser.
- Responsive checks: 320px homepage and eleven principal service/support/policy routes showed no horizontal overflow or broken loaded images; 390px About caption sits below the portrait with a 12px gap. Contact/paid forms were exercised at 390px. Mobile navigation and Services submenu work by keyboard. Desktop homepage at 1440px is visually unchanged. Physical-device testing is still Kyle's review step.
- Formspree is owned by Kyle, sales@techsavvy.consulting is verified, the TechSavvy form workflow sends there, and Formshield remains enabled. The account showed 2/50 monthly submissions before these tests. No account settings changed.

## Protected live services

Read-only DNS baseline: apex A `185.230.63.107`; www CNAME `pointing.wixdns.net`; MX `techsavvy-consulting.mail.protection.outlook.com` priority 0; nameservers `dan.ns.cloudflare.com` and `cloe.ns.cloudflare.com`.

No DNS record, nameserver, Wix site, email service or advertising campaign was changed. Existing GitHub review hosting is separate. Keep Wix available for rollback until the later production migration is accepted.

## Next gate

Kyle reviews the Cloudflare copy, including video playback/seeking on his phone. Obtain final production-cutover approval before connecting root/www, changing indexing, or retiring Wix. Accurate video captions/transcript remain a separate documented pre-launch accessibility item; the existing limitation disclosure remains truthful.

Rebuild/verify instructions and rollback boundaries are in `CLOUDFLARE-RELEASE.md`. Kyle approved limited CLI deployment access for hosting compatibility. Account/user read and Workers-script write are the only requested scopes (plus required saved/background access); no DNS/email scopes. Credentials are encrypted with a key stored in Windows Credential Manager, outside the repository. The official keyring helper `@napi-rs/keyring@1.3.0` was installed to support protected storage. No credentials were copied into project files.
