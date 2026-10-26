# Revision 6 — October 26, 2026

## Approved scope

Update the GitHub test arena only. No Wix edits, main-domain DNS changes, email-setting changes or Cloudflare deployment. Preserve existing URLs and noindex. Prior rollback revision: `d13c4a3e414c055ab8ec4b9ac6926caa38c9ff0b`.

## Changes

- Testimonial auto-browsing every seven seconds, with all reading and accessibility controls retained. Chris's supplied quote now uses TechSavvy as one word.
- Homepage project-price qualifier removed from Improve your business; separate AI-project pricing remains clear on the AI page.
- Blog index lists all six articles, sorted by original publication date. Homepage automatically shows the newest three. No invented older publication dates.
- Two new three-minute articles: practical AI workflows (558 words) and business-growth IT planning (554 words), with original people-focused illustrations and primary-source references.
- Footer after-hours/download strip removed. Top Client support link retained; support asterisk links to the existing support-hours FAQ answer.
- Distinct question introductions for each service page; approved AI introduction retained.
- AI illustration emphasizes assistance and connected tools. Supporting copy emphasizes useful workflows, with access/data safeguards retained without repeated human-review positioning.
- About copy condensed; Mentor Technologies corrected; 35+ states used. IT director-level guidance standardized across current page copy and metadata; source inventory remains historical evidence.
- About portrait uses neutral gray with a faint slate-blue edge accent. Plain-gray option and original portrait preserved.
- Privacy and accessibility pages expanded against the current Wix policies, with hosting-neutral wording and accurate Formspree disclosure. No unverified WCAG-conformance, training/testing or response-deadline promises.

## Validation and launch notes

Run `npm run build`, `npm run verify`, `npm run verify:forms`, `npm run verify:testimonials`, `npm run verify:http`, `npm run build:pages`, `npm run verify:pages`, then responsive browser review. Run `npm run verify:online` after GitHub deployment. These checks cover 23 generated pages, newest-three/all-six article selection, current copy, form endpoint/handling, support-download URLs, noindex, internal links and new-tab references.

Local browser review at 1440px desktop, 390px phone and 320px narrow-phone widths found no horizontal page overflow on the sampled changed pages. About, blog cards, AI diagram, new article images and the longest service FAQ introduction were visually inspected. Mobile navigation and testimonial manual controls were exercised. The actual carousel script also passes simulated-timer tests for seven-second scheduling, pause/play, arrows, wrapping, focus/hover, offscreen/hidden-tab handling and reduced motion.

Form delivery settings remain unchanged from revision 5's verified tests. Revision 6 form tests are local simulations and do not send more emails or consume form submissions.

The introduction video still needs a separate captions track or full transcript before launch; the accessibility statement discloses that limitation. Provider-neutral privacy language is not legal compliance certification and should be checked against actual launch configuration and business practices.

## Rationale and sources

- Seven seconds is a deliberate faster browsing compromise, not a guarantee that a full long quote can be read before rotation. Pause/manual controls remain essential. [Baymard carousel research](https://baymard.com/research-articles/homepage-carousel) discusses 5–7 seconds for light slides and more time for longer content; [W3C carousel guidance](https://www.w3.org/WAI/tutorials/carousels/animations/) supports pause and hover/focus controls.
- IT director better communicates the requested mix of operating support, vendor coordination and planning. Virtual CIO is common for strategic advisory work, but no single regulated industry label is required. Compared [Robert Half IT director responsibilities](https://www.roberthalf.com/us/en/job-details/it-director) with [Kaseya vCIO guidance](https://helpdesk.kaseya.com/hc/en-gb/articles/4438166120849--PDF-Virtual-CIO-vCIO-Standards-Training-Manual).
- Compared current [Wix privacy](https://www.techsavvy.consulting/english-privacy-policy) and [Wix accessibility](https://www.techsavvy.consulting/accessibility-statement) with [Formspree privacy](https://formspree.io/legal/privacy-policy/) and [W3C statement guidance](https://www.w3.org/WAI/planning/statements/).
- Article sources are linked under Further reading in each post. Full generated-asset provenance and prompt set are in [asset sources](ASSET-SOURCES.md).
