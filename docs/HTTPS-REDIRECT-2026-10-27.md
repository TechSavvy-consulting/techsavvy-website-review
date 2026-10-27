# Approved www HTTPS redirect — October 27, 2026

Kyle approved the previously specified, narrowly scoped Cloudflare rule. Applied through the existing TechSavvyTulsaOK signed-in dashboard; no new permissions, tokens, DNS changes or site deployment.

## Persisted rule

- Name: `TechSavvy www HTTP to HTTPS`
- Rule ID: `b7acbb1a2d9f42309963d32d21237ac0`
- Zone: `techsavvy.consulting`
- Enabled, order 2, after the unchanged `TechSavvy apex to canonical www` rule.
- Wildcard request: `http://www.techsavvy.consulting/*`
- Destination: `https://www.techsavvy.consulting/${1}`
- Status: **301 Permanent Redirect**
- **Preserve query string: enabled**
- Reopened saved rule and verified all fields. No zone-wide Always Use HTTPS or HSTS setting was changed.

## Verification

Before: HTTP www homepage, Contact, ad landing and encoded-query test returned 200 without Location.

After: independent 15/15 checks passed: 11 direct HEAD cases and four followed redirect chains. HTTP www `/`, `/contact`, `/managed-it-tulsa` and `/contact?source=https-test&term=managed%20IT%26AI` return 301 to the exact HTTPS equivalent; all four reach 200 with exactly one redirect. Encoded `%20` and `%26` retained byte-for-byte. HTTPS www remains 200. HTTP/HTTPS apex retain their existing query-preserving 301 behavior; HTTP websitenew still redirects to its own HTTPS, which returns 200.

Added eight explicit HTTP-www path/query checks to `scripts/verify-production-online.mjs` so future release checks cannot omit this hostname. Full production gate passed 106 read-only GET/HEAD checks; production pages/assets match the previous release byte-for-byte. No form submissions occurred.

## Unchanged and rollback

No website copy/design, Worker code/version, DNS/email records, advertisements, tracking, Formspree settings, other subdomains or existing apex rule changed. GitHub main/test arena was not deployed. The only service mutation is the new Single Redirect.

To reverse this change under appropriate approval, disable only `TechSavvy www HTTP to HTTPS` in the zone's Redirect Rules list. Code deployment rollback does not alter dashboard-managed redirect rules.

Proof: `outputs/https-redirect-2026-10-27/deployed-rule.png`. Task-created Cloudflare tab closed after verification; pre-existing user tabs preserved.
