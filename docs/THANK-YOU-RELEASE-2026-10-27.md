# FAQ and thank-you release — October 27, 2026

## Authorization and exact visible changes

Kyle approved the FAQ, welcoming thank-you page, three confirmed-success redirects, testing and Cloudflare publication. No tracking changes were authorized or made.

- `/tulsa-it-faq`: added **Do you offer hourly or one-time support?** under Working together. Answer: “We provide IT support through ongoing monthly managed agreements rather than hourly or one-time repair calls. This lets us understand your business and provide consistent, proactive care. For existing managed clients, we also offer hourly assistance and separately priced projects—including additional staff support, AI services and other work outside the managed agreement.” Existing answers/design unchanged; now 12 always-visible answer cards.
- `/thank-you`: replaced the old minimal confirmation page with the existing blue/neutral site styling, a subtle checkmark, approved smiling Kyle portrait, caption below the image, homepage button and clickable business number. Heading: “Thanks for reaching out. We’re glad you did.” Supporting copy: “We look forward to learning about your business and how we can help.” Note: “Good IT starts with a conversation. We’re glad to be part of yours.” No response-time promise or new staff photo/claim. Page remains noindex and absent from sitemap/navigation.
- `/`, `/contact`, `/managed-it-tulsa`: redirect to `/thank-you` only after a confirmed successful Formspree JSON response. Fields, requirements, labels, subjects, location identifiers, endpoint and layout unchanged. Errors remain on the form with entries preserved. No automatic retries. Buttons stay locked during navigation and recover on browser Back. A manual confirmation link remains if navigation throws.
- Only the normal JavaScript-enabled flow redirects to our page. Existing no-JavaScript native POST fallback still uses Formspree-hosted confirmation; no paid Formspree feature or plan change.
- The “Your message has been submitted” line appears only after the tab has a fresh successful submission. A five-minute, one-use sessionStorage timestamp is consumed on arrival. No form fields, identity, attribution data or form ID is stored; this functional UI state is never transmitted. Restricted storage does not prevent the redirect. Direct visits/refreshes show generic welcoming copy instead of falsely confirming a submission.

No other page copy, design, video, icons, policies, indexing, advertisements, DNS, email or Formspree configuration changed. Shared generated CSS/script references can change across generated files without visible edits to those pages. No analytics/conversions/pixels/optional RUM enabled. Cloudflare remains independent of GitHub.

## Verification

- `npm run build`, `npm run verify`, `npm run verify:forms`, `npm run verify:form-redirects`, `npm run verify:testimonials`, `git diff --check`: passed.
- New handler tests cover all three actual scripts: confirmed success, malformed/non-JSON/error responses, validation, network errors, timeout, duplicate-submit lock, same-origin destination, unavailable storage, navigation failures, native fallback and BFCache Back restoration. No network calls in these tests.
- Desktop visual review and 390px/320px responsive checks passed. No horizontal overflow; portrait caption stays below image. Direct visit does not display the submitted-message line.
- Cloudflare preview offline gate passed: 24 pages, 918 local links/assets, 3 forms, 51 video response cases. Preview online: 88 GET/HEAD checks passed.
- Production artifact gate: all 24 page bodies and 45 assets match refreshed preview (apart from deliberate origin/indexing metadata). Production online gate: 98 GET/HEAD checks passed, including exact HTML/assets, sitemap/robots, preserved redirects, apex-to-www, genuine 404s and video ranges.
- Real browser tests from Cloudflare preview: all three forms navigated to same-origin `/thank-you` and displayed “Your message has been submitted.” Ad form controls enabled again on Back. Exactly three test submissions; no duplicate submission found.
- Formspree workflow still sends to verified `sales@techsavvy.consulting`; account allowance was 6/50 before and 9/50 after testing. No spam or delivery settings changed. All three emails found in Outlook with recipient-filtered search; these are internal tests, not leads:
  - `CF-THANKYOU-20261027-CONTACT`: received 2026-10-27 16:01:16 UTC.
  - `CF-THANKYOU-20261027-HOME`: received 2026-10-27 16:01:46 UTC.
  - `CF-THANKYOU-20261027-AD`: received 2026-10-27 16:02:08 UTC.
- Live production FAQ and thank-you visually verified; production script/resource inspection showed no optional tracking. Real submissions were performed against the identical preview build, not repeated against production to conserve the shared allowance.
- Introduction MP4 unchanged: SHA256 `26510D3BEDC051E8561972CBEB1F1059DE72785D402695659C79AE078D293E15`.
- Screenshot: `outputs/thank-you-release-2026-10-27/thank-you-live-desktop.png` (local review evidence; not a public asset).

## Deployment and recovery

- Previous source commit: `1016aae08df25a120e7a9aec24b340bc7a842309`.
- Preview version: `7daf921a-434f-4b0b-904d-42833f2fff41` (prior `90c994ca-575e-42e5-aa14-fddc828e6344`).
- Production version: `8e04ca6e-0e43-4518-9239-5ecc47cfc08b` (prior/rollback `66af79c3-595b-4817-9a98-70486788de31`).
- Deliberate local Wrangler artifact uploads; no Git integration, triggers or DNS changes. Production custom-domain attachment preserved with routes omitted and workers_dev false.
- Branch `cloudflare-preview-2026-10-27` is source backup only. GitHub `main`/test arena remain unchanged at `bfc5d5fea9e9ac4883d84bea3bb1275fdcabc3bd`.

## Separate HTTPS recommendation — not applied

Kyle identified HTTP `www` not redirecting. Read-only GET verified `http://www.techsavvy.consulting/contact?https-check=1` returned 200, without Location. Existing apex redirect checks passed; this is specifically the HTTP www hostname.

Recommend one Cloudflare Single Redirect, not a zone-wide setting:
- Request wildcard: `http://www.techsavvy.consulting/*`
- Target: `https://www.techsavvy.consulting/${1}`
- Status 301; Preserve query string enabled.
- Only HTTP www matches; HTTPS, other subdomains, email DNS and existing apex rule remain untouched. Verify root, `/contact`, `/managed-it-tulsa` and an encoded query after separate approval.

Authoritative example: https://developers.cloudflare.com/rules/url-forwarding/examples/redirect-admin-https/
