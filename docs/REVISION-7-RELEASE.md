# Revision 7 — October 26, 2026

## Scope and rollback

GitHub test arena only. Wix, main website DNS, email settings, and Cloudflare hosting remain outside write scope. Rollback commit: `55b3d092a3ecd7182253f9e3284839d9ce67453f`.

## Requested changes

- AI hero graphic and accessible description: Your existing tools.
- Testimonial browsing interval: three seconds (previously seven). Pause/play, hover, focus, manual arrows, offscreen/hidden-tab handling and reduced-motion controls remain available for reading longer reviews.
- Growth-planning article: different fictional people in a brick-walled showroom. AI workflow article keeps its current image. Generated originals and prior versions retained for rollback.
- Co-managed IT removed from advertised services and all current page links/references. Remote Managed IT remains. The legacy `/it-collaboration` URL redirects to Managed IT, with a static GitHub fallback and future Cloudflare 301 entries.
- Certificates show month and year only; validity/expiry wording removed from displayed cards.
- Privacy Contact TechSavvy retains phone/email, removes postal contact/address. Footer address remains.
- Shared inquiry form removes the Formspree processing sentence and puts Privacy policy at the far right of the direct-contact row, with narrow-screen wrapping. Processor information remains in Privacy Policy. Form endpoint and submission handling unchanged.

## Verification

Run both standard and GitHub builds, built-page/internal-link checks, simulated form and carousel tests, local HTTP checks and responsive browser review before deployment. Verify online pages/assets and inspect the public contact layout after deployment. No test inquiries are sent by these local regression tests.

Pre-deployment checks passed: both builds and both 23-page/839-link verifiers; two form configurations; actual carousel-script timer/control tests; 22 locally served routes, HTTP behavior and video range support. Desktop 1440px, phone 390px and narrow-phone 320px previews showed the intended contact footer/AI graphic wrapping; sampled changed pages had no horizontal overflow or broken loaded images. The retired route correctly forwarded its query string and fragment to Managed IT. Blog cards were visually compared side by side.

Prompt and asset paths are recorded in [revision 7 image prompts](REVISION-7-IMAGE-PROMPTS.json); the built-in image-generation tool was used, then Sharp produced the web-optimized WebP.
