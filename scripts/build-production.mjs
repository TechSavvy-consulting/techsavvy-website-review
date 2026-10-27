import { spawnSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { noindexProductionPaths, productionOrigin } from '../src/utils/deployment.ts';

if (process.argv.length !== 2) throw new Error('Usage: npm run build:production (fixed, approved www.techsavvy.consulting target only).');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const result = spawnSync(process.execPath, [path.join(root, 'node_modules/astro/bin/astro.mjs'), 'build'], {
  cwd: root,
  env: { ...process.env, PREVIEW_PLATFORM: 'cloudflare-production', SITE_HOSTING: 'cloudflare' },
  stdio: 'inherit',
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

// Modify the separate generated artifact, never public/ or any review artifact.
const previewHeaders = await readFile(path.join(root, 'public/_headers'), 'utf8');
const securityHeaders = previewHeaders.split(/\r?\n/).filter(line => /^\s{2}\S/.test(line) && !/^\s+X-Robots-Tag:/i.test(line));
if (securityHeaders.length !== 3) throw new Error('Review the security header inventory before producing this release.');
const exclusions = noindexProductionPaths.flatMap(route => [route, `${route}/`, `${route}.html`]);
const headers = '# Production security headers. Review artifacts remain noindex.\n/*\n' + securityHeaders.join('\n') + '\n\n'
  + exclusions.map(route => `${route}\n  X-Robots-Tag: noindex, nofollow, noarchive\n`).join('\n');
await writeFile(path.join(root, 'dist-production/_headers'), headers);
await writeFile(path.join(root, 'dist-production/robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${productionOrigin}/sitemap.xml\n`);
console.log(`Production artifact prepared in dist-production for ${productionOrigin}.`);
console.log('Normal production pages permit indexing; 404, thank-you and retired stubs remain noindex. Preview files are unchanged.');
console.log('Build only: no deployment, DNS, email, tracking, advertisements or form submissions were changed.');
