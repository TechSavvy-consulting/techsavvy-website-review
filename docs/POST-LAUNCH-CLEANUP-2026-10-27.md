# Approved post-launch cleanup — October 27, 2026

Kyle approved the recommended minimal cleanup, plus a head-only website icon. The approved design, main homepage headline/title, service promises, existing video, testimonial content/timing, URLs, form workflows and advertising remain intact.

## Exact changes by page

### All pages

- Added the existing TechSavvy headset/person logo mark as the favicon, without the company lettering. Supplied a six-resolution ICO (16/32/48/64/128/256), 32px PNG and 180px Apple touch icon. The old SVG URL also contains this same head mark for compatibility. Original artwork is retained in `assets/originals/techsavvy-head-icon-original.png`; no new logo was invented.
- Shared-footer copyright, Privacy policy and Accessibility text increased from about 10px to 12px. The standalone paid landing page keeps its own existing footer styling.
- Shared-footer hours changed from `8:00am–5:00pm Central` to `8am–5pm Central` (same hours).
- Cloudflare optional Real User Measurements (RUM) disabled for the techsavvy.consulting zone. Security/operational processing remains enabled. No GA4, GTM, advertising pixels or new tracking added. Earlier HTTP-only checks missed Cloudflare's browser-injected beacon; fresh real-browser checks are required for this setting.

### Home — `/`

- Cloud & business devices: `mobile-device management` → `mobile device management`.
- Added a selectable English captions track to the existing introduction video (22 cues).
- Added a collapsed `Read video transcript` disclosure immediately beneath the existing video caption. It includes a brief on-screen description and the spoken text. The video/audio file itself is byte-for-byte unchanged.
- No other content/layout change. Testimonials remain eight seconds and do not stop on mouseover.

### Proactive IT — `/proactive-it`

- Daily monitoring and follow-through: `Watch for device, server and backup issues...` → `We watch for device, server and backup issues...`.
- Backups with recovery in mind: `Check backup results and test restores.` → `We check backup results and test restores.`
- Rest of both descriptions unchanged.

### Managed IT — `/outsourced-managed-it`

- Help-desk benefit and availability FAQ now explicitly say `8am–5pm Central`.
- `onsite` → `on-site` in Full Managed IT description and plan-selection FAQ.
- No change to coverage, responsibilities or emergency-support terms.

### Paid landing page — `/managed-it-tulsa`

- Headline capitalization only: `Keep Your Tech / Working For You.` → `Keep your tech / working for you.`
- Home-page button: `Visit Our Home Page` → `Visit our home page`.
- Form label: `Telephone (optional)` → `Phone (optional)`.
- Submit button: `Send Message` → `Send message`.
- Hours formatting: `8 AM–5 PM Central` → `8am–5pm Central`.
- Added the same head-only icons. Ad destination, field names, requiredness, processor, form-location identifier and all advertising settings unchanged.

### Contact — `/contact`

- Business hours formatting: `Monday–Friday, 8 AM–5 PM Central Time` → `Monday–Friday, 8am–5pm Central`.
- Form and field requirements unchanged.

### Common questions — `/tulsa-it-faq`

- Same hours-format change within `When is support available?`. Emergency-support terms unchanged.

### Articles

- All six article sidebars: visible phone `918.400.2424` → `(918) 400-2424`; same clickable telephone destination.
- `/post/managed-it-service-switching`: three `onsite` occurrences → `on-site` (two relationship paragraphs and one question bullet).
- `/post/choose-managed-it-provider-ok`: two `onsite` occurrences → `on-site` in the support/reachability paragraph.
- No article topics, dates or other editorial text changed.

### Privacy — `/english-privacy-policy`

- `We have not added optional analytics, advertising pixels or marketing cookies to this website.` → `We do not use optional visitor analytics, advertising pixels or marketing cookies on this website.`
- Present-tense wording reflects the disabled Cloudflare RUM setting. Existing operational-data and provider disclosures remain; no claim of universal cookie/legal compliance.

### Accessibility — `/accessibility-statement`

- Added `English captions and a text transcript for the homepage introduction video.` to features.
- Removed the obsolete statement that the video has no separate captions or transcript.
- Retained third-party/browser limitations and the explicit statement that full WCAG conformance is not certified.

### Pages with no page-specific editorial change

About, Why TechSavvy, AI Services, Backup & Recovery, Blog index, Client Support, thank-you and 404: only applicable shared icons/footer changes. Retired redirect stubs still redirect. No new page or new advertising destination.

## Verification and deployment

- Local build: 24 pages, 897 local links/assets and three configured forms passed.
- Form parser/endpoint/error tests passed without submitting forms.
- Eight-second carousel behavior and reduced-motion/visibility guards passed scripted tests.
- Caption timing, word-for-word transcript agreement, line lengths and all six ICO frames checked. Captions were corroborated against two local speech-recognition passes and original burned-in captions; timings are machine-derived, not a claim of a complete human listening review.
- Chrome local visual review: captions rendered at 21 seconds with all 22 cues loaded; transcript expanded/collapsed; 390px mobile page and 320px footer had no horizontal overflow. Footer measured 12px.
- Production and Cloudflare review builds have identical page bodies/assets, differing only in approved metadata/indexing configuration. Video SHA256 remains `26510D3BEDC051E8561972CBEB1F1059DE72785D402695659C79AE078D293E15`.
- Cloudflare review version: `90c994ca-575e-42e5-aa14-fddc828e6344`. Online review gate passed 85 GET/HEAD requests: 21 clean URLs, 42 assets, 12 redirect/query checks, three 404 responses and five video range checks. An initial check started before deployment completed and observed the old artifact; the completed deployment passed.
- Production version: `66af79c3-595b-4817-9a98-70486788de31`, deployed to the existing www custom domain without DNS/route edits.
- Production online gate passed 95 GET/HEAD requests: 21 clean-URL pages match exact generated HTML; 42 assets (19,305,055 bytes, including full video) match SHA256; 12 path/query redirects, six HTTP/HTTPS apex redirects, HTML canonicalization, three real 404s and video HEAD/range/cache checks passed.
- Fresh production Chrome pages `/`, `/managed-it-tulsa` and `/english-privacy-policy` contained no Cloudflare Insights/Google Analytics/GTM/Facebook scripts. Cloudflare zone RUM showed disabled after a dashboard reload. This is a point-in-time check; future host-setting changes must be checked again.
- Production video played to 8.46 seconds with readyState 4 and all 22 English cues loaded. Seeking to 21 seconds displayed the matching caption. This is browser playback/render verification, not a full human listening or Safari/device audit.
- Live privacy text, paid form submit text and 12px shared footer verified. All public icon/caption files matched the local artifact. No new form submissions were made.
- Proof images: `outputs/website-cleanup-2026-10-27/live-video-captions.png` and `cloudflare-rum-disabled.png` in the TechSupport workspace.

## Rollback and boundaries

- Previous source revision: `6b6d55a`; previous production version: `f70d1c37-455f-4fca-8b05-607bb430e2cc`.
- Previous preview version: `082ae03c-76fa-4fa7-a662-f47beb2e66a7`.
- Cloudflare hosting remains self-contained; no GitHub runtime dependency or automatic deployment. Main/test-arena branch not changed by this cleanup.
- No DNS, email, advertisement, tracking-account, Formspree protection or form-delivery settings changed. No new synthetic leads submitted. Wix retained.
- Reverting code does not change the account-level RUM setting. Leave RUM disabled to preserve the essential-only decision.
