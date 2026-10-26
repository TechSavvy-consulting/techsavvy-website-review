# Revision 3 — October 26, 2026

Kyle authorized these changes and publication to the existing GitHub Pages example: https://techsavvy-consulting.github.io/techsavvy-website-review/ . The production Wix site and its DNS are not part of this deployment.

## Included

- Removed the homepage's green status dot and "Clear direction. Personal care. Room to grow." line, plus "Less juggling. More working together."
- Added Google Workspace to the cloud/business-device card.
- Added one-at-a-time testimonials from Taryn Schell, Robert Hoffman, Dr. Terry Tatum and Chris Moles, with transparent official logos. The existing dark-blue section and layout are retained.
- Testimonial controls include previous/next, pause/play and a slide count. Automatic rotation is every 12 seconds while the section is visible; it pauses on pointer hover, keyboard focus, manual navigation or a hidden tab. Reduced-motion preference starts it paused. Only the active quote is available to assistive technology.
- Both managed plans explicitly include Proactive IT; mobile devices are included in the everyday-support copy.
- Proactive IT now explains monitoring, maintenance, in-house update testing, security and backup oversight. Kyle's individual Fortinet credential is attributed accurately.
- Co-Managed IT presents the Remote Managed IT relationship, with TechSavvy handling remote support/system care and a local technician handling onsite tasks.
- Why TechSavvy emphasizes understanding the business, relationships, clear answers, care and growth; its menu/footer labels match.
- Kyle's About biography uses his public founder background and does not promise he will be the first person a prospect meets. Faith and Tulsa-community content remain.
- New business-email security article for Microsoft 365/Google Workspace, with an original illustration. The two managed-IT articles were substantially refreshed to roughly three-minute reads. Updated dates are October 26, 2026; original publication dates remain visible. The earlier Windows article remains at its existing address as an archive.
- The introduction video remains the original version; the optional faster-opening candidate is not deployed.

## Verification

- Default and GitHub Pages builds: 19 pages, 689 local link/asset references, two disabled forms; validation passed.
- HTTP checks: existing routes, noindex headers for the local server, redirects, 404, rejected writes, video ranges and navigation passed. Public GitHub Pages uses HTML noindex metadata, not the local server's custom headers.
- Browser checks: all 17 linked content pages at a 360-pixel viewport had one H1, no horizontal overflow and no failed loaded images. This is responsive browser testing, not physical-phone testing.
- Testimonial autoplay was observed advancing; all four manual slides and wraparound worked, with one visible/accessible quote, correct attribution and loaded logos. Pause/play controls were exercised.
- Official logo and quote sources are documented in `ASSET-SOURCES.md`. Blog references are linked within the articles.

## Recovery

The pre-revision Git commit and restore-tested source/history backup remain available. Restore tag: `review-v1-before-revision-2026-10-26`. This release will be recorded as a new source commit so future changes can be compared or reverted without overwriting the previous version.

The example remains noindex with inactive forms and no optional tracking. The eventual production host and migration remain separate decisions.
