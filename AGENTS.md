# TechSavvy website review project

Follow Kyle's latest global instructions and the current chat's approvals.

- This repository is a separate design example, not the live website.
- The production Wix site, production DNS, email and advertising destinations are outside this implementation's write scope.
- Kyle approved a public GitHub Pages example on October 24, 2026. The repository may be public.
- Current authorization (October 26, 2026): configure https://websitenew.techsavvy.consulting/ as the GitHub test arena, including necessary GitHub domain verification, Pages settings, test-subdomain DNS and root-base build changes. This supersedes the former repository-prefixed preview address and custom-domain restriction only for this test subdomain.
- Keep the live Wix site, apex/main website DNS and email unchanged. Do not purchase a plan, deploy to Cloudflare hosting or migrate production under the test-arena authorization.
- Future workflow: make and review changes on the GitHub test arena first; promote the exact approved revision to Cloudflare only after Kyle approves deployment. A later production cutover needs separate approval. GitHub preview changes must never automatically deploy production.
- Updated authorization (October 27, 2026): Kyle approved creation of a Cloudflare Workers Static Assets preview in the existing TechSavvyTulsaOK account, with noindex intact and clearly marked synthetic delivery tests for the three website forms. This supersedes the earlier Cloudflare-hosting restriction for this preview only. Do not attach apex/www, change DNS/email/advertisements, enable indexing, buy a plan or cancel Wix until the separate production cutover approval.
- Production authorization (October 27, 2026, after preview acceptance): Kyle requested eight-second testimonials and then going live. This authorizes the production Cloudflare deployment, necessary main-domain/www website DNS cutover, production indexing/canonicals and normal launch verification. Keep email DNS/services, advertisements, optional-tracking decisions and all other content/design unchanged. Preserve the noindex review copy and Wix/DNS rollback. Do not cancel Wix or buy a plan under this launch authorization.
- Cloudflare independence (October 27, 2026): Cloudflare must always host a self-contained copy of the website and assets, independent of GitHub/GitHub Pages availability. No GitHub integration, automatic deployment, runtime asset fetches or redirects to the GitHub test arena. GitHub may remain an optional source-code backup; review hosting is not required to remain there. Deploy approved local artifacts deliberately. This supersedes any earlier implication that future review hosting must be GitHub.
- Kyle approved limited Cloudflare deployment-tool access for hosting compatibility, not changes to the existing video content. Keep deployment access restricted to account/user read and Workers-script editing; protect saved credentials with Windows Credential Manager. No DNS/email permissions were requested.
- The GitHub Actions deployment uses Pages settings for the custom domain; do not add a CNAME file to the artifact. See `docs/TEST-ARENA-SETUP.md` for the approved scope and validation checklist.
- Updated authorization (October 26, 2026): remove visible design/review notices and connect genuine website inquiry forms through Formspree Free, verifying notification delivery. Keep a safe phone/email fallback until the actual Formspree endpoint is verified; never invent one. This does not authorize a paid plan or production cutover.
- Keep preview noindex meta tags until a separate production-launch approval. Permit crawling so search engines can read noindex. GitHub Pages does not serve Cloudflare's _headers file or the local preview server's custom headers; do not claim those headers protect the public preview.
- Do not add analytics, advertising pixels or external font requests. Formspree is the only currently authorized form processor; keep sensitive information and attachments out of inquiry forms.
- Preserve existing public URL paths, verified business details and original blog publication dates. Substantially refreshed posts may show a separate updated date, as Kyle requested.
- Use the existing public logo and approved Kyle images. Do not invent ratings, testimonials, client results, staffing, certifications, guarantees or prices.
- Keep secrets and patient/client information out of this repository. The source inventory contains public website evidence only.
- Use `npm run build`, `npm run verify`, and the local browser preview to validate meaningful changes. Review mobile and desktop layouts.
- `deployment-examples/` contains reference configuration only. It does not select a provider or authorize deployment.

The local preview server binds to 127.0.0.1 only. Keep it that way unless a broader preview is explicitly requested.
