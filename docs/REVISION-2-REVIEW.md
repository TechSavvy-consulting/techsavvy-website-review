# Revision 2 — local review, October 26, 2026

Historical review notes. Kyle subsequently reviewed this version and authorized the revision 3 changes and publication to the existing GitHub example. See `REVISION-3-RELEASE.md` and the current `AGENTS.md`; the earlier local-only gate below has been superseded.

Kyle's latest direction is to review this version inside the chat before any upload. The public GitHub example remains revision 1. Do not push source commits, tags or video candidates, or deploy this version until Kyle approves it. The Wix website, production domain, DNS, email and ad destinations remain outside this revision's write scope.

## Positioning

- TechSavvy is the customer's IT department and growth partner, including IT director/virtual CIO guidance and vendor coordination.
- Emphasize care for customers, useful communication, proactive planning and helping their business move forward. Do not make team size the sales message.
- Keep the concise visual style. The homepage's founder section is replaced by a compact faith/service statement; Kyle remains visible on About and in the existing introduction video.
- "Keep your tech working for you" is a social-media campaign line, not the company slogan. Kyle chose to retain it in the blue relationship graphic, not the main page heading. The descriptive main heading is "Your IT department. Your growth partner."
- Focus local copy and service-area metadata on Tulsa County. Typically 10–100 IT users, without treating that as a hard minimum.
- Describe mobile-device management as shaped to the client's needs, not a claim that a particular platform is already deployed.
- Keep vendor management positive and broad; do not advertise a list of excluded phone/camera/access-control implementation services.

## Included locally

- Customer-centered homepage, relationship graphic, growth planning, IT leadership and vendor-management links.
- Removed the redundant TechSavvy/business and Tulsa County labels from the homepage graphic and the crossing decorative curve. Replaced intersecting service-page diagrams with compact support cards; Managed IT now leads with "Managed IT, built around your business."
- Clearer Full/Remote managed-plan descriptions, service details and anchor links. Support hours and emergency availability remain qualified by the service plan.
- Kyle's professional About photo, concise introduction, explicit love for Jesus and care for Tulsa, and accurately attributed individual training credentials.
- Full existing Taryn Schell/Emerge Medical testimonial, without a new rating or invented customer result.
- Clickable phone in the shared header, FAQ navigation, optional user-count/server form questions. All forms remain disabled with no backend.
- Noindex, review notices, existing canonical routes, local assets and essential-only behavior remain in place.

## Video decision still needed

The existing 82.154-second website introduction remains the default, unchanged. Its full Kyle-plus-text framing should be retained. The player now preserves that frame instead of forcing a mobile crop.

Optional A/B excerpts and a full candidate are under ignored `qa/video-review-v2/`. Candidate B runs only source seconds 0–5.2 at 1.10× with pitch-preserving audio and matched video; all remaining narration stays at normal speed. No words, images or narration were added or removed. The full candidate is 81.720 seconds and passed decode/timing checks. Kyle should choose the more natural opening before any replacement/upload. Draft ASR is not approved captions; complete listening and caption verification remain pending.

## Verification completed locally

- Default and GitHub Pages builds: 18 pages and 647 local link/asset targets passed. Both review forms remain disabled; no optional tracking scripts were added.
- HTTP checks passed for served pages, noindex headers, redirects, 404 handling, rejected writes, video range requests and active navigation.
- Browser inspection: homepage, Managed IT and About desktop views; homepage and Managed IT phone-size views. All 16 linked content pages were checked at a 360-pixel viewport with no detected horizontal overflow or failed loaded images. This is browser emulation, not testing on physical phones.
- Corrected an old diagram SVG-sizing rule caught during visual QA. The replacement service-card icons no longer expand into the text or affect the heading's vertical alignment.
- Browser viewport overrides were reset after responsive testing. Public GitHub main remains at the original revision; no upload, Wix edit or DNS change was performed.
- Mobile navigation was opened and closed successfully; its expanded state and accessible label updated correctly. The temporary QA tab was closed; Kyle's existing preview tab and the local preview server remain available.

## Recovery and rollback

The pre-revision source/media ZIP and full-history Git bundle are in `outputs/website-review-backups/2026-10-26-before-revision-2` under the TechSupport workspace. The bundle was restore-tested independently. Local restore tag: `review-v1-before-revision-2026-10-26`.

## Approval boundary

This is not a production launch. Approval of content does not by itself authorize a Wix/DNS migration, live form delivery, new tracking, a paid host, or changes to production email/advertising destinations.
