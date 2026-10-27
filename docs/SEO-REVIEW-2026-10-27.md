# TechSavvy approved SEO review changes

October 27, 2026. Implements approved groups A and B on the GitHub review site only. Production migration, DNS, indexing, advertising and form-delivery tests remain separate approvals. The previous review revision is `d365d8dfac88c35cd60673a1eac9f2e3eb4c5275`.

## Visible changes to review

| Location | Exact change |
| --- | --- |
| Homepage inquiry form and `/contact` | Label is now **Number of users (optional)**. Field name, choices, optional status, form-location identifier, styling and other fields are unchanged. This supersedes the proposed computer/device wording. |
| `/managed-it-tulsa` | Added the missing paid-search destination using the approved October 24 landing copy, layout, hero image and compact header/footer. Replaced the Wix iframe/form dependency with a native Formspree form: Name*, Email*, Telephone, Company and Message*, with **Send Message**. Added persistent labels, privacy/sensitive-information notice and phone/email fallbacks. No new qualification questions. |
| `/english-privacy-policy` | Added Cloudflare as the selected production hosting/delivery provider, linked its privacy notice and dated the update October 27. Kept “number of users” in the information description and existing Formspree disclosures. No Wix/GitHub names in the policy body. |
| `/accessibility-statement` | Added planned Cloudflare hosting wording, clarified that hosting does not certify accessibility and dated the update October 27. Existing video-caption limitation remains accurately disclosed. No Wix/GitHub names in the statement body. |

The review policy text says Cloudflare is **planned**, not already hosting this review. The future approved Cloudflare build can set `SITE_HOSTING=cloudflare` to use the prepared current-host wording. No hosting migration has occurred.

## Search and sharing metadata only

These do not change the visible page headings, introductions, service copy, graphics or layout. They update page titles, descriptions and corresponding social-card text; sharing images are unchanged.

| Page | Title | Description |
| --- | --- | --- |
| `/outsourced-managed-it` | Managed IT Services in Tulsa \| TechSavvy Consulting | Managed IT for Tulsa-area organizations with 10–100 computer/device users. Local support, cybersecurity, backup oversight and practical IT guidance. |
| `/proactive-it` | Proactive IT Maintenance & Monitoring in Tulsa \| TechSavvy Consulting | Proactive IT care for Tulsa businesses, including monitoring, tested updates, security checks and backup oversight as part of managed support. |
| `/offsite-backup-recovery` | Business Backup & Recovery in Tulsa \| TechSavvy Consulting | Business backup and recovery planning for Tulsa organizations, with local and offsite options, monitoring and restore testing around your priorities. |
| `/ai-services` | AI Consulting & Business Automation in Tulsa \| TechSavvy Consulting | Practical AI guidance, workflow automation and custom software for Tulsa businesses. Project-based help built around your people and existing tools. |
| `/it-support-business-tulsa` | Why TechSavvy \| Tulsa IT Support & Consulting | Meet a Tulsa IT partner invested in your business: friendly support, practical guidance, vendor coordination and relationships built for long-term growth. |

The approved homepage title and “Your IT department. Your growth partner.” headline remain unchanged. Kyle Erik Hearn was already applied in the prior revision and remains unchanged.

## Technical preparation

- Replaced the deprecated `ProfessionalService` business type with `LocalBusiness`; one business object per page uses the stable ID `https://www.techsavvy.consulting/#organization`. Blog publisher references point to that same entity. Existing business details remain unchanged; no coordinates, ratings schema or new claims were added.
- Added `/sitemap.xml` with 20 retained content URLs using the intended production origin. It has not been submitted to Search Console. Preview HTML and future Cloudflare preview headers remain noindex; robots settings are unchanged.
- Kept the paid landing page self-canonical at `/managed-it-tulsa` and the organic managed-service page self-canonical at `/outsourced-managed-it`. Both stay noindex on the review site. No ad destinations or campaign settings changed.
- Expanded build, route and online checks to cover the new page, form label, schema identity, policy disclosures and sitemap. Local preview now recognizes XML and AVIF content types.

## URL inventory for migration

| Existing destination | Replacement disposition |
| --- | --- |
| `/managed-it-tulsa` | Newly recreated at the same path; preserve the approved ad destination. |
| `/`, `/contact`, `/about-it-support`, `/outsourced-managed-it`, `/proactive-it`, `/offsite-backup-recovery`, `/it-support-business-tulsa`, `/tulsa-it-faq`, `/blog`, `/english-privacy-policy`, `/accessibility-statement` | Already present; keep the same paths. Contact, About and Managed IT sitelinks remain valid. |
| `/post/managed-it-service-switching`, `/post/choose-managed-it-provider-ok`, `/post/windows11-upgrade-essential` | Already retained at their existing paths and linked from the blog archive. No recreation or URL change. |
| `/it-collaboration`, `/it-support-for-small-business-tulsa` | Do not restore retired content. Existing redirect stubs remain; prepared Cloudflare 301 rules point to `/outsourced-managed-it`. |
| `/home-1`, `/search-lp` | Do not restore duplicate content. Existing prepared Cloudflare rules redirect to `/` and `/contact`, respectively. |
| Other unlinked and unused Wix pages | Not copied into this build. Any newly identified active marketing dependency needs review before retirement. |

The new-site `/ai-services`, `/client-support` and three newer blog articles remain intact. Sitemap excludes redirects, `/thank-you` and 404. Cloudflare redirect execution, Search Console ownership, video captions/transcript, current Formspree allowance/ownership/recipient, synthetic delivery tests and rollback verification remain launch checklist items; see [Cloudflare release checklist](CLOUDFLARE-RELEASE.md).

## Verification

- Local and GitHub-format builds: 24 HTML pages; 847 internal links/assets; 3 Formspree forms; 14 further-reading links; no optional tracking.
- Form response and testimonial-control unit tests passed without network submissions.
- Local HTTP checks passed for routes, noindex headers, redirect query strings, 404, blocked writes and video byte ranges.
- Source review confirmed all 58 approved paid-landing content elements match the saved approved source; hero/logo hashes match the originals. A fresh public Wix fetch encountered a browser-verification screen, so that fetch was not treated as a copy comparison.
- Landing-page visual checks passed at 1440px desktop and 390px mobile. A 320px DOM geometry check found no horizontal overflow. The CTA reached the inquiry section, and the form retained all five visible labels. No form was submitted.
- Both planned-host and future Cloudflare-host policy variants passed local build verification; the review artifact uses the planned-host variant.
- After deployment, run `npm run verify:online` against the GitHub review domain. Production form-delivery tests remain pending separate approval.
