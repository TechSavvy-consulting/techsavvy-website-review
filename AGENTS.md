# TechSavvy website review project

Follow Kyle's latest global instructions and the current chat's approvals.

- This repository is a separate design example, not the live website.
- The production Wix site, production DNS, email and advertising destinations are outside this implementation's write scope.
- Kyle approved a public GitHub Pages example on October 24, 2026. The repository may be public.
- Current authorization (October 26, 2026): configure https://websitenew.techsavvy.consulting/ as the GitHub test arena, including necessary GitHub domain verification, Pages settings, test-subdomain DNS and root-base build changes. This supersedes the former repository-prefixed preview address and custom-domain restriction only for this test subdomain.
- Keep the live Wix site, apex/main website DNS and email unchanged. Do not purchase a plan, deploy to Cloudflare hosting or migrate production under the test-arena authorization.
- Future workflow: make and review changes on the GitHub test arena first; promote the exact approved revision to Cloudflare only after Kyle approves deployment. A later production cutover needs separate approval. GitHub preview changes must never automatically deploy production.
- The GitHub Actions deployment uses Pages settings for the custom domain; do not add a CNAME file to the artifact. See `docs/TEST-ARENA-SETUP.md` for the approved scope and validation checklist.
- Keep preview noindex meta tags, inactive forms, and the visible review notice. GitHub Pages does not serve the custom headers from the local preview server; do not claim those headers protect the public preview.
- Do not add analytics, advertising pixels, external font requests or live form endpoints by default.
- Preserve existing public URL paths, verified business details and original blog publication dates. Substantially refreshed posts may show a separate updated date, as Kyle requested.
- Use the existing public logo and approved Kyle images. Do not invent ratings, testimonials, client results, staffing, certifications, guarantees or prices.
- Keep secrets and patient/client information out of this repository. The source inventory contains public website evidence only.
- Use `npm run build`, `npm run verify`, and the local browser preview to validate meaningful changes. Review mobile and desktop layouts.
- `deployment-examples/` contains reference configuration only. It does not select a provider or authorize deployment.

The local preview server binds to 127.0.0.1 only. Keep it that way unless a broader preview is explicitly requested.
