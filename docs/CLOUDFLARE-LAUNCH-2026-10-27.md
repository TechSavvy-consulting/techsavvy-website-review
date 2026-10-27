# Cloudflare production launch — October 27, 2026

## Authorized scope

Kyle accepted the Cloudflare preview and requested eight-second testimonials, no hover pause, and the next step of going live. No other visible content/design changes, advertising changes, optional tracking, email changes, paid upgrades or Wix cancellation are included.

## Rollback baseline recorded before cutover

- Full Cloudflare BIND export: `outputs/cloudflare-launch-2026-10-27/dns-before.txt` in the parent TechSupport workspace (outside this public repository).
- Apex `techsavvy.consulting`: A `185.230.63.107`, DNS only, Auto TTL.
- `www.techsavvy.consulting`: CNAME `pointing.wixdns.net`, DNS only, Auto TTL.
- Existing MX: priority 0, `techsavvy-consulting.mail.protection.outlook.com`.
- Preserve all other DNS records, existing services, domain verifications and the GitHub review subdomain.
- Keep the Wix site and subscription available; do not cancel it during launch.

## Build and deployment

- Preview: `techsavvy-website-preview`; eight-second version `082ae03c-76fa-4fa7-a662-f47beb2e66a7`.
- Production: `techsavvy-website-production`; uploaded version `f70d1c37-455f-4fca-8b05-607bb430e2cc`.
- Separate local artifacts: `dist-cloudflare` and `dist-production`.
- No GitHub connection or runtime dependency. Production workers.dev and version-preview URLs disabled.
- Production differs from the refreshed preview only in intended origin/indexing metadata and generated headers/robots. All 24 page bodies and 37 assets match byte-for-byte.
- Homepage-only visible behavior change: eight-second testimonial rotation; pointer hover/focus does not pause; manual controls and keyboard/reduced-motion safeguards remain.

## Completed domain cutover and retained rollback

1. Bound `www.techsavvy.consulting` to the production Worker, replacing only its Wix website record. HTTPS is working.
2. Enabled the Single Redirect **TechSavvy apex to canonical www**, matching only `(http.host eq "techsavvy.consulting")`, with a 301 destination `concat("https://www.techsavvy.consulting", http.request.uri.path)` and query preservation enabled. Apex A is `192.0.2.1`, proxied, Auto TTL.
3. If rollback is needed: disable only the new apex redirect, detach the production www custom domain, inspect generated DNS removal, then restore the exact two original records above. Do not change any mail/service records. A Worker code rollback does not revert DNS or rules.

The after-cutover BIND export is retained beside the before export as `dns-after.txt`. Comparison found only the expected apex/www website changes and the SOA serial; email and other service records were unchanged. The Worker-managed www domain was verified separately in its custom-domain settings. Public authoritative, Cloudflare, Google and local DNS checks resolved the Cloudflare website addresses. Wix remains available for rollback.

## Exact page-by-page change list

| Page or scope | Change in this launch |
| --- | --- |
| Homepage `/` | Testimonial interval changed from six to eight seconds. Removed mouseover/pointer-focus pausing. Pause/Play accurately reflects intentional keyboard/manual pause. Quotes, logos, layout, headings, form and video content are unchanged. |
| Paid landing page `/managed-it-tulsa` | Production robots metadata permits indexing and sharing URLs resolve to the production origin. Its approved message, design, form and advertising destination are unchanged. |
| Other 18 normal content pages | Production indexing and production-origin sharing metadata only. Visible content and design match the approved preview. |
| `/404`, `/thank-you`, two retired redirect stubs | Remain noindex. Retired paths retain their approved permanent redirects. |
| Site-wide infrastructure | Self-contained Cloudflare production hosting, HTTPS/canonical-www redirect, production robots/security headers and retained sitemap/redirects. No GitHub dependency or optional tracking. |

No new visible wording, image, service claim, page design or policy-text changes were made in this launch. Existing approved Cloudflare privacy/accessibility wording is retained.

## Verification status

- PASS: offline production content/metadata/asset checks, 847 local links/assets, three forms, 51 shared video cases and nine production wrapper cases.
- PASS: eight-second testimonial unit tests, including hover and truthful manual/keyboard pause.
- PASS: preview online gate, 80 read-only requests including exact HTML, redirects, real 404s and five video byte ranges.
- PASS: production online gate — 90 read-only GET/HEAD requests; 21 clean page URLs matched the artifact; 37 assets totaling 19,204,769 bytes matched, including the full unchanged video; 12 approved legacy redirects and six apex redirects preserved paths/queries; four clean-URL normalizations and three real custom 404s passed; video HEAD/ranges/errors/cache checks passed.
- PASS: 20 normal production routes permit indexing; four excluded outputs remain noindex; canonical URLs use production www. Unknown URLs return real 404s with noindex HTML (an X-Robots-Tag header is not claimed for all static fallback paths).
- PASS: live Chrome homepage/carousel review. Testimonials advanced with the pointer over the carousel while its Pause control remained visible. Existing preview mobile checks at 320/390px are supported by identical production body/CSS assets; no additional physical-device/Safari test is claimed.
- PASS: Search Console's existing verified domain property retained access. Resubmitted the existing `https://www.techsavvy.consulting/sitemap.xml`; UI confirmed **Sitemap submitted successfully**, submitted October 27, 2026. This does not claim Google has recrawled or indexed the replacement yet.
- PASS WITH FILTERING NOTE: form routing remains `sales@techsavvy.consulting`. All three earlier preview tests arrived there. The final production contact test `CF-PROD-20261027-CONTACT` was accepted at 14:49 UTC and found in Formspree's spam queue. Marked only that verified synthetic record **Not Spam**, then confirmed the matching notification arrived at `sales@techsavvy.consulting` at **14:58:26 UTC**. This verifies production capture and notification delivery after recovery, not automatic unfiltered delivery for this particular test. No spam-protection settings were changed. Synthetic records must not be counted as leads; check Formspree's spam queue when a notification is unexpectedly absent.
- Known follow-up: accurate captions/transcript for the unchanged introduction video; not completed by this launch.

## Proof and maintenance

- Local proof screenshots: `outputs/cloudflare-launch-2026-10-27/homepage-live.jpg` and `testimonials-live.jpg` in the TechSupport workspace.
- Future deliberate uploads use `wrangler.production.jsonc` and approved local `dist-production` artifacts. Keep both `route` and `routes` omitted and `workers_dev: false`; the dashboard-managed www Custom Domain remains in place. Do not run `triggers deploy` or connect GitHub automation.
- Preserve the preview's noindex configuration. Do not cancel Wix until Kyle accepts the production replacement and authorizes cancellation.

## Vendor references

- https://developers.cloudflare.com/workers/configuration/routing/custom-domains/
- https://developers.cloudflare.com/fundamentals/manage-domains/redirect-domain/
