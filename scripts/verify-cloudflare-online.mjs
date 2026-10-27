import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { cloudflarePreviewOrigin } from '../src/utils/deployment.ts';

// Read-only: GET/HEAD requests to one explicitly supplied staging origin only.
// Form actions and external links are never requested, and redirects are never followed.
const args = process.argv.slice(2);
if (args.length !== 2 || args[0] !== '--origin') {
  console.error('Usage: node scripts/verify-cloudflare-online.mjs --origin https://<worker>.<account>.workers.dev');
  process.exit(1);
}
const origin = cloudflarePreviewOrigin(args[1]);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist-cloudflare');
const productionOrigin = 'https://www.techsavvy.consulting';
const files = [];
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(full);
    else files.push(path.relative(dist, full).replaceAll('\\', '/'));
  }
}
await walk(dist);
files.sort();
const pageFiles = files.filter(file => file.endsWith('.html'));
const assetFiles = files.filter(file => !file.endsWith('.html') && !['_headers', '_redirects'].includes(file));
assert.ok(pageFiles.includes('index.html') && pageFiles.includes('404.html'), 'Artifact contains the homepage and custom 404');
const routeFor = file => file === 'index.html' ? '/' : `/${file.replace(/\.html$/, '').replace(/\/index$/, '/')}`;
const decodeHtml = value => value.replace(/&(?:amp|quot|apos|lt|gt|#\d+|#x[\da-f]+);/gi, entity => {
  const named = { '&amp;': '&', '&quot;': '"', '&apos;': "'", '&lt;': '<', '&gt;': '>' };
  return named[entity.toLowerCase()] ?? String.fromCodePoint(entity[2].toLowerCase() === 'x' ? parseInt(entity.slice(3, -1), 16) : parseInt(entity.slice(2, -1), 10));
});
const attributes = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(["'])(.*?)\2/g)].map(match => [match[1].toLowerCase(), decodeHtml(match[3])]));
const metadata = html => {
  const values = {};
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attrs = attributes(match[0]);
    values[attrs.name || attrs.property] = attrs.content;
  }
  const canonical = [...html.matchAll(/<link\b[^>]*>/gi)].map(match => attributes(match[0])).filter(attrs => attrs.rel === 'canonical');
  assert.equal(canonical.length, 1, 'Exactly one canonical URL');
  return { ...values, canonical: canonical[0].href };
};
const assertNoindex = (value, label) => {
  const directives = String(value || '').toLowerCase().split(/\s*,\s*/);
  for (const directive of ['noindex', 'nofollow', 'noarchive']) assert.ok(directives.includes(directive), `${label}: ${directive}`);
};
const assertMetadata = (html, route, expected) => {
  const actual = metadata(html);
  assertNoindex(actual.robots, `${route}: HTML indexing safeguards`);
  assert.equal(new URL(actual.canonical).origin, productionOrigin, `${route}: production canonical origin`);
  assert.equal(actual.canonical, expected.canonical, `${route}: exact artifact canonical`);
  for (const key of ['og:url', 'og:image', 'twitter:image']) {
    assert.ok(actual[key], `${route}: ${key} exists`);
    assert.equal(new URL(actual[key]).origin, origin, `${route}: ${key} staging origin`);
    assert.equal(actual[key], expected[key], `${route}: ${key} matches artifact`);
  }
  assert.equal(new URL(actual['og:url']).pathname, route, `${route}: social page path`);
  assert.equal(actual['techsavvy-revision'], expected['techsavvy-revision'], `${route}: current artifact revision`);
  assert.equal((html.match(/<h1[\s>]/gi) || []).length, 1, `${route}: one main heading`);
};

const redirectText = await readFile(path.join(dist, '_redirects'), 'utf8');
assert.equal(redirectText, await readFile(path.join(root, 'public/_redirects'), 'utf8'), 'Artifact uses the approved source redirects');
const redirects = redirectText.split(/\r?\n/).map(line => line.replace(/\s+#.*$/, '').trim()).filter(line => line && !line.startsWith('#')).map(line => {
  const fields = line.split(/\s+/);
  assert.equal(fields.length, 3, `Supported exact-path redirect: ${line}`);
  const [from, to, code] = fields;
  assert.ok(from.startsWith('/') && to.startsWith('/') && !from.startsWith('//') && !to.startsWith('//'), 'Redirects remain on the staging host');
  assert.doesNotMatch(from + to, /[?*:#]/, 'Only approved plain-path redirects are expected');
  assert.equal(code, '301', `${from}: permanent redirect`);
  return { from, to };
});
const redirectSources = new Set(redirects.map(rule => rule.from));
const artifacts = new Map();
for (const file of pageFiles) {
  const html = await readFile(path.join(dist, file), 'utf8');
  const route = routeFor(file);
  const meta = metadata(html);
  assertMetadata(html, route, meta); // Fail before network access if the artifact belongs to another origin.
  artifacts.set(route, { file, html, meta });
}
const localPaths = new Set([...assetFiles.map(file => `/${file}`), ...artifacts.keys(), ...redirectSources]);
for (const [route, artifact] of artifacts) {
  for (const match of artifact.html.matchAll(/\b(?:href|src|poster)\s*=\s*(["'])(.*?)\1/gi)) {
    const value = decodeHtml(match[2]);
    if (!value.startsWith('/') || value.startsWith('//')) continue;
    const target = new URL(value, origin);
    assert.equal(target.origin, origin, `${route}: local reference stays on staging`);
    assert.ok(localPaths.has(decodeURIComponent(target.pathname)), `${route}: artifact contains ${target.pathname}`);
  }
}

const mediaTypes = {
  '.css': ['text/css'], '.js': ['text/javascript', 'application/javascript'],
  '.jpg': ['image/jpeg'], '.jpeg': ['image/jpeg'], '.png': ['image/png'],
  '.webp': ['image/webp'], '.avif': ['image/avif'], '.svg': ['image/svg+xml'],
  '.mp4': ['video/mp4'], '.txt': ['text/plain'], '.xml': ['application/xml', 'text/xml'],
  '.json': ['application/json'], '.ico': ['image/x-icon', 'image/vnd.microsoft.icon'],
  '.woff2': ['font/woff2'], '.woff': ['font/woff'], '.vtt': ['text/vtt'],
};
const contentType = response => (response.headers.get('content-type') || '').split(';', 1)[0].trim().toLowerCase();
let requests = 0;
async function request(route, options = {}) {
  const url = new URL(route, origin);
  assert.equal(url.origin, origin, 'Requests are restricted to the explicitly selected staging origin');
  const method = options.method || 'GET';
  assert.ok(['GET', 'HEAD'].includes(method), 'Read-only HTTP methods only');
  requests++;
  return fetch(url, { ...options, method, redirect: 'manual', signal: AbortSignal.timeout(20_000) });
}
const assertHeaders = (response, label) => {
  assertNoindex(response.headers.get('x-robots-tag'), `${label}: HTTP indexing safeguards`);
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff', `${label}: nosniff header`);
};

console.log(`Checking ${origin}: ${pageFiles.length} generated HTML files, ${assetFiles.length} assets and ${redirects.length} approved redirect rules. GET/HEAD only; no form submissions.`);
let pages = 0;
for (const [route, artifact] of artifacts) {
  if (route === '/404' || redirectSources.has(route)) continue;
  const response = await request(route);
  assert.equal(response.status, 200, `${route}: clean URL responds directly with 200`);
  assert.equal(contentType(response), 'text/html', `${route}: HTML content type`);
  assertHeaders(response, route);
  const html = await response.text();
  assertMetadata(html, route, artifact.meta);
  assert.equal(html, artifact.html, `${route}: exact generated HTML is deployed`);
  pages++;
}
console.log(`PASS: ${pages} clean-URL pages, exact HTML, production canonicals and staging social metadata.`);

for (const file of assetFiles) {
  const route = `/${file}`;
  const allowedTypes = mediaTypes[path.extname(file).toLowerCase()];
  assert.ok(allowedTypes, `${file}: explicitly known asset content type`);
  const response = await request(route, { method: 'HEAD' });
  assert.equal(response.status, 200, `${route}: asset available without redirects`);
  assert.ok(allowedTypes.includes(contentType(response)), `${route}: expected ${allowedTypes.join(' or ')}, got ${contentType(response)}`);
  assertHeaders(response, route);
  const length = response.headers.get('content-length');
  if (length !== null && !response.headers.get('content-encoding')) assert.equal(Number(length), (await stat(path.join(dist, file))).size, `${route}: correct uncompressed asset length`);
}
for (const file of ['robots.txt', 'sitemap.xml']) {
  const response = await request(`/${file}`);
  assert.equal(response.status, 200, `${file}: readable`);
  assert.equal(await response.text(), await readFile(path.join(dist, file), 'utf8'), `${file}: exact generated policy/inventory`);
}
console.log(`PASS: ${assetFiles.length} assets have expected content types and indexing headers; robots/sitemap match the artifact.`);

let redirectChecks = 0;
for (const { from, to } of redirects) {
  for (const query of ['', '?review=cloudflare&source=verification&value=a%20b%2Bc']) {
    const response = await request(from + query, { method: 'HEAD' });
    assert.equal(response.status, 301, `${from}${query}: permanent redirect`);
    const location = response.headers.get('location');
    assert.ok(location, `${from}: Location header`);
    assert.equal(new URL(location, origin).href, new URL(to + query, origin).href, `${from}: exact destination and retained query string`);
    redirectChecks++;
  }
}
const notFound = artifacts.get('/404');
for (const route of ['/__techsavvy_staging_verification_missing__', '/__techsavvy_staging_verification_missing__/nested', '/__techsavvy_staging_verification_missing__.png']) {
  assert.ok(!localPaths.has(route), '404 test path is absent from the artifact');
  const response = await request(route);
  assert.equal(response.status, 404, `${route}: genuine 404, not SPA/homepage fallback`);
  assert.equal(contentType(response), 'text/html', `${route}: custom HTML error page`);
  assertHeaders(response, route);
  const html = await response.text();
  assertMetadata(html, '/404', notFound.meta);
  assert.equal(html, notFound.html, `${route}: exact custom 404 content`);
}
console.log(`PASS: ${redirectChecks} redirect/query checks and three genuine custom 404 responses.`);

const videos = assetFiles.filter(file => file.endsWith('.mp4'));
assert.ok(videos.length, 'At least one video exists to verify range playback');
let videoChecks = 0;
for (const file of videos) {
  const expected = await readFile(path.join(dist, file));
  const size = expected.length;
  const middle = Math.floor(size / 2);
  for (const [range, start, end] of [['bytes=0-31', 0, 31], [`bytes=${middle}-${middle + 31}`, middle, middle + 31], [`bytes=${size - 32}-`, size - 32, size - 1], ['bytes=-32', size - 32, size - 1]]) {
    const response = await request(`/${file}`, { headers: { Range: range } });
    if (response.status !== 206) await response.body?.cancel(); // Do not download the full movie on a failed range check.
    assert.equal(response.status, 206, `${file}: partial-content response for video seeking`);
    assert.equal(contentType(response), 'video/mp4', `${file}: video MIME type`);
    assertHeaders(response, file);
    assert.equal(response.headers.get('content-range'), `bytes ${start}-${end}/${size}`, `${file}: correct content range`);
    assert.equal(response.headers.get('accept-ranges'), 'bytes', `${file}: advertised range support`);
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(bytes.length, 32, `${file}: exactly 32 requested bytes`);
    assert.deepEqual(bytes, expected.subarray(start, end + 1), `${file}: video bytes match artifact`);
    videoChecks++;
  }
  const invalid = await request(`/${file}`, { headers: { Range: `bytes=${size}-` } });
  assert.equal(invalid.status, 416, `${file}: out-of-bounds range rejected`);
  assert.equal(invalid.headers.get('content-range'), `bytes */${size}`, `${file}: correct unsatisfied range`);
  assertHeaders(invalid, file);
  assert.equal((await invalid.arrayBuffer()).byteLength, 0, `${file}: empty unsatisfied-range response`);
  videoChecks++;
}
console.log(`PASS: ${videoChecks} beginning/middle/end/suffix/invalid video range checks. ${requests} read-only requests completed. Forms, external destinations, browser appearance and email delivery were not tested.`);
