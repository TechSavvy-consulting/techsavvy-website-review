# GitHub test arena — October 26, 2026

## Approved boundary

Kyle approved `https://websitenew.techsavvy.consulting/` as the public GitHub test arena. The source remains in `TechSavvy-consulting/techsavvy-website-review`, and the existing GitHub Actions workflow deploys `main` to GitHub Pages.

Only the test-subdomain DNS, necessary GitHub domain verification, GitHub Pages custom-domain settings and matching build configuration are in scope. Do not change the live Wix site, apex or `www` website routing, email records or advertising destinations. Cloudflare hosting is planned, not authorized by this test-address setup.

## Configuration

- GitHub Pages custom domain: `websitenew.techsavvy.consulting`.
- Test DNS target: CNAME `websitenew` to `techsavvy-consulting.github.io`, DNS-only for direct GitHub Pages certificate validation and serving.
- Verify domain ownership in the GitHub account before attaching the subdomain; use the exact GitHub-issued TXT name/value, never a wildcard DNS record.
- GitHub Pages build: origin `https://websitenew.techsavvy.consulting`, base `/`, directory-style HTML and root `404.html`.
- The Actions artifact does not contain a `CNAME` file; GitHub Pages settings own the domain association.
- Preserve noindex metadata, the visible review notice, disabled forms and production canonical URLs. Noindex does not make the preview private.
- The default `npm run build` remains host-independent; no production deployment is introduced.

## Verification and completion

Run sequentially:

```sh
npm run build
npm run verify
npm run build:pages
npm run verify:pages
```

After the GitHub deployment and DNS/HTTPS setup, run `npm run verify:online` and visually inspect the public test address. Confirm internal links and assets use the root base without the former repository prefix; verify the certificate, custom 404, review notice, noindex and disabled forms. Compare the live Wix/main website and email DNS records with the read-only pre-change snapshot. Local build success alone does not establish external setup completion.

Local validation completed October 26, 2026: both builds generated 19 pages; both verifiers passed 689 local link/asset references and two disabled forms, expected build origin/root base, unchanged production canonical URLs, no stale repository-prefixed URLs and no optional tracking scripts. External DNS, certificate and deployment checks are separate completion requirements.

## Future release flow

1. Make changes in GitHub and review them at the test-arena address.
2. After Kyle approves a specific revision and Cloudflare deployment, deploy that exact commit to a separate Cloudflare preview and test it there.
3. Only after separate production-cutover approval, route the main website from Wix to Cloudflare. Preserve email records and a tested Wix rollback plan.
4. For later updates, repeat review and explicit promotion. GitHub preview changes must never automatically deploy production.

Keep previous Git commits available for source rollback. A test-domain rollback must restore only the test DNS/GitHub Pages settings and their matching build configuration; do not touch production or email records.
