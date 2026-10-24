# TechSavvy website review project

Follow Kyle's latest global instructions and the current chat's approvals.

- This repository is a separate design example, not the live website.
- The production Wix site, production DNS, email and advertising destinations are outside this implementation's write scope.
- Kyle approved a public GitHub Pages example on October 24, 2026. Publish review builds only at https://techsavvy-consulting.github.io/techsavvy-website-review/ from this repository. The repository may be public. The eventual production host remains undecided.
- Do not purchase a plan, connect a custom domain, add CNAME, or alter production DNS/Wix. Separate approval is required for production migration or a different host.
- Keep preview noindex meta tags, inactive forms, and the visible review notice. GitHub Pages does not serve the custom headers from the local preview server; do not claim those headers protect the public preview.
- Do not add analytics, advertising pixels, external font requests or live form endpoints by default.
- Preserve existing public URL paths, verified business details and original blog dates.
- Use the existing public logo and approved Kyle images. Do not invent ratings, testimonials, client results, staffing, certifications, guarantees or prices.
- Keep secrets and patient/client information out of this repository. The source inventory contains public website evidence only.
- Use `npm run build`, `npm run verify`, and the local browser preview to validate meaningful changes. Review mobile and desktop layouts.
- `deployment-examples/` contains reference configuration only. It does not select a provider or authorize deployment.

The local preview server binds to 127.0.0.1 only. Keep it that way unless a broader preview is explicitly requested.
