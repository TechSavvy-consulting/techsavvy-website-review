import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFile, readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { cloudflarePreviewOrigin } from '../src/utils/deployment.ts';

const args = process.argv.slice(2);
if (args.length !== 2 || args[0] !== '--origin') {
  console.error('Usage: npm run verify:cloudflare -- --origin https://<worker>.<account>.workers.dev');
  process.exit(1);
}
const origin = cloudflarePreviewOrigin(args[1]);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist-cloudflare');
const result = spawnSync(process.execPath, [path.join(root, 'scripts/verify-build.mjs'), '--cloudflare'], {
  cwd: root,
  env: { ...process.env, CLOUDFLARE_PREVIEW_ORIGIN: origin, SITE_HOSTING: 'cloudflare' },
  stdio: 'inherit',
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

const files = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else files.push(full);
  }
}
await walk(dist);
assert.ok(files.length <= 20_000, 'Static artifact remains within the Free asset-count limit');
let largest = 0;
for (const file of files) {
  const bytes = (await stat(file)).size;
  largest = Math.max(largest, bytes);
  assert.ok(bytes <= 25 * 1024 * 1024, `${path.relative(dist, file)}: within the 25 MiB asset limit`);
}
const headers = await readFile(path.join(dist, '_headers'), 'utf8');
assert.equal(headers, await readFile(path.join(root, 'public/_headers'), 'utf8'), 'Preview headers are preserved');
assert.match(headers, /X-Robots-Tag:\s*noindex,\s*nofollow,\s*noarchive/i, 'All staging assets retain indexing protection');
assert.match(headers, /X-Content-Type-Options:\s*nosniff/i, 'Security header retained');
assert.equal(await readFile(path.join(dist, '_redirects'), 'utf8'), await readFile(path.join(root, 'public/_redirects'), 'utf8'), 'Approved redirects are preserved');
assert.match(await readFile(path.join(dist, 'robots.txt'), 'utf8'), /Allow:\s*\//, 'Crawlers can read noindex');
assert.ok(files.includes(path.join(dist, '404.html')), 'Root custom 404 exists for 404-page handling');
assert.equal(files.some(file => ['_worker.js', '_routes.json'].includes(path.basename(file))), false, 'No Worker runtime is included');
console.log(`PASS: Cloudflare staging artifact has ${files.length} static files; largest asset ${largest} bytes; noindex headers, redirects and custom 404 retained.`);
console.log('This is an artifact check only. Workers routing, HTTP responses and deployment are verified separately; no network requests or form submissions were made.');
