# Verification · October 24, 2026

## Completed

- `npm install`: 185 packages audited, zero reported vulnerabilities at installation.
- `npm run build`: 18 static HTML pages generated successfully, including 16 source canonical routes, thank-you and 404.
- `npm run verify`: 18 pages, 637 internal links/assets and two inactive forms passed checks for required structure, metadata, indexing guards and local targets.
- Independent HTTP review: all 16 source canonical routes and thank-you returned 200. Unknown paths returned 404. Legacy aliases returned 301 and preserved query parameters. All 11 referenced assets loaded, including video.
- Local server binds only to 127.0.0.1. POST, PUT and DELETE requests are rejected with 405. Video byte-range requests return 206.
- Corrected the active navigation state to use the explicit canonical route. Corrected local trailing-slash handling and verified it is specific to the local server.
- Browser layout checks: all 16 canonical pages at a 390px emulated viewport had no horizontal overflow or broken loaded images. Additional 320px and 768px checks covered Home, Contact, Managed IT and a blog article. A 320px header overflow was corrected.
- Desktop homepage sections, contact form, branding, source video poster and responsive navigation were visually inspected. Desktop and mobile proof screenshots are in this folder.
- Mobile menu, service dropdown, navigation/close state and FAQ disclosure were exercised.
- Form keyboard interaction with clearly fake local review values kept the submit control disabled, retained a null action and stayed on Contact. The fields were cleared by reload. No production form test was sent.
- No optional analytics/ad scripts or automatically loaded external embeds/assets were found in the rendered pages. Assets and fonts are local. This is a source/network-boundary review, not a universal claim about all browser or host telemetry.

## Remaining limits

- No public hosting account is connected or selected. No Netlify-host behavior is claimed.
- No production form delivery, spam filtering, comment migration or real notification workflow is implemented.
- This is not a full WCAG certification, assistive-technology audit, load test or live Search Console ranking assessment.
- Media captions/transcript and final provider-specific policy language require review before production.
- The interactive URL is local to the build PC and requires its preview server to be running. GitHub screenshots can be reviewed independently.

## Repeat the checks

```sh
npm run build
npm run verify
npm run preview
```

With the preview running, use a second terminal:

```sh
npm run verify:http
```

Rebuild/reload after changes. Preserve the review safeguards and verify the chosen host separately before any production transition.
