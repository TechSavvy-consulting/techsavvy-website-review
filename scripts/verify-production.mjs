import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFile, readdir, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { deploymentConfig, noindexProductionPaths, productionOrigin, robotsForRoute } from '../src/utils/deployment.ts';
import productionWorker from '../cloudflare/production-worker.mjs';

if (process.argv.length !== 2) throw new Error('Usage: npm run verify:production (requires fresh dist-production and dist-cloudflare artifacts).');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist-production');
const preview = path.join(root, 'dist-cloudflare');
const productionEnv = { PREVIEW_PLATFORM: 'cloudflare-production', SITE_HOSTING: 'cloudflare' };

assert.deepEqual(deploymentConfig(productionEnv), { site: productionOrigin, outDir: './dist-production', directory: false });
assert.throws(() => deploymentConfig({ PREVIEW_PLATFORM: 'cloudflare-production' }), /SITE_HOSTING/);
for (const target of [undefined, 'local', 'github-pages', 'cloudflare-workers']) {
  assert.equal(robotsForRoute('/', { PREVIEW_PLATFORM: target, SITE_HOSTING: 'cloudflare' }), 'noindex,nofollow,noarchive', `${target}: review remains protected`);
}
assert.equal(robotsForRoute('/', { PREVIEW_PLATFORM: 'cloudflare-production' }), 'noindex,nofollow,noarchive', 'Missing provider guard fails closed');
for (const route of noindexProductionPaths) {
  assert.equal(robotsForRoute(route, productionEnv), 'noindex,nofollow,noarchive');
  assert.equal(robotsForRoute(`${route}/`, productionEnv), 'noindex,nofollow,noarchive');
}
assert.equal(robotsForRoute('/managed-it-tulsa', productionEnv), 'index,follow', 'Paid landing is indexable at its retained URL');

for (const [script, args, env] of [
  ['scripts/verify-build.mjs', ['--production'], { ...process.env, SITE_HOSTING: 'cloudflare' }],
  ['scripts/verify-video-worker.mjs', [], process.env],
]) {
  const result = spawnSync(process.execPath, [path.join(root, script), ...args], { cwd: root, env, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

async function listFiles(directory, base = directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await listFiles(full, base));
    else files.push(path.relative(base, full).split(path.sep).join('/'));
  }
  return files.sort();
}
const files = await listFiles(dist);
assert.deepEqual(files, await listFiles(preview), 'Production has exactly the same paths and assets as the freshly built approved Cloudflare preview');
assert.ok(files.length <= 20_000, 'Free static asset count');
const bodyOf = html => html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1];
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
let bodyCount = 0;
let immutableCount = 0;
const indexableRoutes = [];
for (const file of files) {
  assert.ok((await stat(path.join(dist, file))).size <= 25 * 1024 * 1024, `${file}: Free asset size limit`);
  const bytes = await readFile(path.join(dist, file));
  const previewBytes = await readFile(path.join(preview, file));
  if (file.endsWith('.html')) {
    const html = bytes.toString('utf8');
    const prior = previewBytes.toString('utf8');
    const route = file === 'index.html' ? '/' : `/${file.slice(0, -5)}`;
    assert.ok(bodyOf(html), `${file}: body available`);
    assert.equal(hash(bodyOf(html)), hash(bodyOf(prior)), `${file}: visible content, forms, links, markup and scripts must match the freshly rebuilt Cloudflare preview byte-for-byte`);
    assert.match(prior, /<meta name="robots" content="noindex,nofollow,noarchive"/, `${file}: preview remains noindex`);
    assert.equal(html.match(/<meta name="robots" content="([^"]+)"/)?.[1], robotsForRoute(route, productionEnv), `${file}: correct production indexing`);
    const previewOrigin = new URL(prior.match(/<meta property="og:url" content="([^"]+)"/)?.[1]).origin;
    const permittedChanges = prior.replaceAll(previewOrigin, productionOrigin)
      .replace('<meta name="robots" content="noindex,nofollow,noarchive">', `<meta name="robots" content="${robotsForRoute(route, productionEnv)}">`);
    assert.equal(hash(html), hash(permittedChanges), `${file}: only approved metadata origin/indexing differences from preview`);
    if (!noindexProductionPaths.includes(route)) indexableRoutes.push(route);
    bodyCount++;
  } else if (!['_headers', 'robots.txt'].includes(file)) {
    assert.equal(hash(bytes), hash(previewBytes), `${file}: immutable approved asset`);
    immutableCount++;
  }
  if (/\.(?:html|css|js|mjs|svg|xml|txt|json)$/i.test(file)) {
    assert.doesNotMatch(bytes.toString('utf8'), /(?:github\.com|github\.io|githubusercontent\.com|websitenew\.techsavvy\.consulting|workers\.dev)/i, `${file}: production has no review-hosting or GitHub dependency`);
  }
}
assert.equal(hash(await readFile(path.join(dist, 'videos/techsavvy-introduction.mp4'))), hash(await readFile(path.join(root, 'public/videos/techsavvy-introduction.mp4'))), 'The approved video is not edited or transcoded');
assert.equal(await readFile(path.join(dist, '_redirects'), 'utf8'), await readFile(path.join(root, 'public/_redirects'), 'utf8'), 'All approved redirect rules and paths retained');

const headers = await readFile(path.join(dist, '_headers'), 'utf8');
const headerRules = new Map();
let rule;
for (const line of headers.split(/\r?\n/)) {
  if (line.startsWith('/')) { rule = line; headerRules.set(rule, []); }
  else if (/^\s{2}\S/.test(line)) headerRules.get(rule).push(line.trim());
}
assert.deepEqual(headerRules.get('/*'), [
  'X-Content-Type-Options: nosniff',
  'Referrer-Policy: strict-origin-when-cross-origin',
  'Permissions-Policy: camera=(), microphone=(), geolocation=()',
], 'Production wildcard has only security headers, not noindex');
for (const route of noindexProductionPaths) for (const variant of [route, `${route}/`, `${route}.html`]) {
  assert.deepEqual(headerRules.get(variant), ['X-Robots-Tag: noindex, nofollow, noarchive'], `${variant}: explicit noindex header`);
}
assert.equal(headerRules.size, 1 + noindexProductionPaths.length * 3, 'No unexpected header rules');
assert.equal(await readFile(path.join(dist, 'robots.txt'), 'utf8'), `User-agent: *\nAllow: /\n\nSitemap: ${productionOrigin}/sitemap.xml\n`, 'Production robots permits crawling and names the production sitemap');
const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]).sort();
assert.deepEqual(sitemapUrls, indexableRoutes.map(route => new URL(route, productionOrigin).href).sort(), 'Sitemap exactly matches production indexable pages');
assert.match(await readFile(path.join(preview, '_headers'), 'utf8'), /\/\*\r?\n\s+X-Robots-Tag:\s*noindex/, 'Production build did not remove preview-wide noindex');

// Config-only checks: no deployment or custom-domain attachment happens here.
const configSource = await readFile(path.join(root, 'wrangler.production.jsonc'), 'utf8');
const config = JSON.parse(configSource.replace(/^\s*\/\/.*$/gm, ''));
assert.equal(config.name, 'techsavvy-website-production');
assert.equal(config.account_id, 'a8cd243a690a05d7b1b7055272fa06a2');
assert.equal(config.main, './cloudflare/production-worker.mjs');
assert.equal(config.workers_dev, false);
assert.equal(config.preview_urls, false);
assert.equal(config.assets.directory, './dist-production');
assert.equal(config.assets.binding, 'ASSETS');
assert.deepEqual(config.assets.run_worker_first, ['/videos/techsavvy-introduction.mp4']);
assert.equal(config.assets.html_handling, 'auto-trailing-slash');
assert.equal(config.assets.not_found_handling, '404-page');
assert.equal(config.routes, undefined, 'Domain attachment is a separate approved operational step');

// Offline wrapper checks complement the shared byte-range handler's full tests.
const originalFixedLengthStream = globalThis.FixedLengthStream;
globalThis.FixedLengthStream = class {
  constructor(length) {
    let written = 0;
    const stream = new TransformStream({
      transform(chunk, controller) { written += chunk.byteLength; assert.ok(written <= length); controller.enqueue(chunk); },
      flush() { assert.equal(written, length); },
    });
    this.readable = stream.readable;
    this.writable = stream.writable;
  }
};
const sample = new TextEncoder().encode('0123456789');
const pending = [];
const env = { ASSETS: { async fetch(request) {
  const pathname = new URL(request.url).pathname;
  if (pathname === '/videos/techsavvy-introduction.mp4') return new Response(request.method === 'HEAD' ? null : sample, { headers: { 'Content-Type': 'video/mp4', 'Content-Length': String(sample.length), ETag: '"approved-video"' } });
  if (pathname === '/missing') return new Response('404', { status: 404 });
  if (pathname === '/thank-you') return new Response('Thanks', { headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' } });
  return new Response('unchanged page');
} } };
const context = { waitUntil(promise) { pending.push(promise); } };
try {
  for (const test of [
    { route: '/', status: 200, body: 'unchanged page', noindex: false },
    { route: '/missing', status: 404, body: '404', noindex: true },
    { route: '/thank-you', status: 200, body: 'Thanks', noindex: true },
    { route: '/videos/techsavvy-introduction.mp4', status: 200, body: '0123456789', noindex: false },
    { route: '/videos/techsavvy-introduction.mp4', method: 'HEAD', status: 200, body: '', noindex: false },
    { route: '/videos/techsavvy-introduction.mp4', headers: { Range: 'bytes=2-5' }, status: 206, body: '2345', noindex: false, range: 'bytes 2-5/10' },
    { route: '/videos/techsavvy-introduction.mp4', headers: { Range: 'bytes=-2' }, status: 206, body: '89', noindex: false, range: 'bytes 8-9/10' },
    { route: '/videos/techsavvy-introduction.mp4', headers: { 'If-None-Match': '"approved-video"' }, status: 304, body: '', noindex: false },
    { route: '/videos/techsavvy-introduction.mp4', headers: { Range: 'bytes=20-' }, status: 416, body: '', noindex: true, range: 'bytes */10' },
  ]) {
    const response = await productionWorker.fetch(new Request(productionOrigin + test.route, { method: test.method || 'GET', headers: test.headers }), env, context);
    assert.equal(response.status, test.status, `Production wrapper ${test.route}: status`);
    assert.equal(await response.text(), test.body, 'Production wrapper preserves exact bytes');
    assert.equal(response.headers.has('X-Robots-Tag'), test.noindex, 'Production wrapper indexing');
    assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff');
    assert.equal(response.headers.get('Referrer-Policy'), 'strict-origin-when-cross-origin');
    assert.equal(response.headers.get('Permissions-Policy'), 'camera=(), microphone=(), geolocation=()');
    if (test.range) assert.equal(response.headers.get('Content-Range'), test.range);
  }
  await Promise.all(pending);
} finally {
  if (originalFixedLengthStream === undefined) delete globalThis.FixedLengthStream;
  else globalThis.FixedLengthStream = originalFixedLengthStream;
}
console.log(`PASS: ${bodyCount} page bodies and ${immutableCount} other assets match the refreshed approved Cloudflare preview byte-for-byte.`);
console.log(`PASS: ${indexableRoutes.length} indexable production routes; excluded pages, sitemap, robots, security headers, preserved redirects and isolated deployment config.`);
console.log('PASS: production video wrapper preserves byte ranges/conditionals, removes preview-only noindex from successful video, and retains noindex on errors.');
console.log('Offline only: no deployment, account access, external network calls, DNS changes or form submissions were performed.');
