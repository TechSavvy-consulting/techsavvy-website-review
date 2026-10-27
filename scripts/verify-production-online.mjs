import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { noindexProductionPaths, productionOrigin, robotsForRoute } from '../src/utils/deployment.ts';

// Read-only release gate. Fixed production hosts, GET/HEAD only, no redirects
// followed, no form submissions or external/provider URLs requested.
const args = process.argv.slice(2);
assert.ok(args.length === 0 || (args.length === 1 && args[0] === '--check-artifact-only'), 'Usage: npm run verify:production:online [-- --check-artifact-only]');
const artifactOnly = args.includes('--check-artifact-only');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist-production');
const origin = productionOrigin;
const productionEnv = { PREVIEW_PLATFORM: 'cloudflare-production', SITE_HOSTING: 'cloudflare' };
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
assert.ok(pageFiles.includes('index.html') && pageFiles.includes('404.html'), 'Production artifact contains homepage and custom 404');
const routeFor = file => file === 'index.html' ? '/' : `/${file.replace(/\.html$/, '')}`;
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
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
const directives = value => String(value || '').toLowerCase().split(/\s*,\s*/);
const assertNoindex = (value, label) => {
  for (const directive of ['noindex', 'nofollow', 'noarchive']) assert.ok(directives(value).includes(directive), `${label}: ${directive}`);
};
const assertIndexable = (value, label) => {
  assert.doesNotMatch(String(value || ''), /(?:^|[,\s:])(?:noindex|none)(?:$|[,\s])/i, `${label}: no blocking indexing directive`);
};
const assertMetadata = (html, route, expected) => {
  const actual = metadata(html);
  assert.equal(actual.robots, robotsForRoute(route, productionEnv), `${route}: production HTML indexing`);
  assert.equal(new URL(actual.canonical).origin, origin, `${route}: www production canonical`);
  assert.equal(actual.canonical, expected.canonical, `${route}: exact artifact canonical`);
  for (const key of ['og:url', 'og:image', 'twitter:image']) {
    assert.ok(actual[key], `${route}: ${key} exists`);
    assert.equal(new URL(actual[key]).origin, origin, `${route}: ${key} uses production hosting`);
    assert.equal(actual[key], expected[key], `${route}: ${key} matches artifact`);
  }
  assert.equal(new URL(actual['og:url']).pathname, route, `${route}: social page path`);
  assert.equal(actual['techsavvy-revision'], expected['techsavvy-revision'], `${route}: artifact revision`);
  assert.equal((html.match(/<h1[\s>]/gi) || []).length, 1, `${route}: one H1`);
  assert.doesNotMatch(html, /github\.io|githubusercontent\.com|websitenew\.techsavvy\.consulting|workers\.dev|wixstatic\.com|filesusr\.com/i, `${route}: self-contained production hosting`);
  assert.doesNotMatch(html, /<(?:script|iframe)[^>]+(?:googletagmanager|google-analytics|doubleclick|facebook\.net|cloudflareinsights|data-cf-beacon|youtube\.com\/embed)/i, `${route}: no optional tracking or video embed in this response; live browser check also required`);
};

const redirectText = await readFile(path.join(dist, '_redirects'), 'utf8');
assert.equal(redirectText, await readFile(path.join(root, 'public/_redirects'), 'utf8'), 'Approved redirect rules retained');
const redirects = redirectText.split(/\r?\n/).map(line => line.replace(/\s+#.*$/, '').trim()).filter(line => line && !line.startsWith('#')).map(line => {
  const fields = line.split(/\s+/);
  assert.equal(fields.length, 3, `Exact redirect rule: ${line}`);
  const [from, to, code] = fields;
  assert.ok(from.startsWith('/') && to.startsWith('/') && !from.startsWith('//') && !to.startsWith('//'));
  assert.doesNotMatch(from + to, /[?*:#]/, 'Only approved plain-path redirects');
  assert.equal(code, '301');
  return { from, to };
});
const redirectSources = new Set(redirects.map(rule => rule.from));
const artifacts = new Map();
for (const file of pageFiles) {
  const html = await readFile(path.join(dist, file), 'utf8');
  const route = routeFor(file);
  const meta = metadata(html);
  assertMetadata(html, route, meta); // Fail before network access for the wrong artifact.
  artifacts.set(route, { file, html, meta });
}
const localPaths = new Set([...assetFiles.map(file => `/${file}`), ...artifacts.keys(), ...redirectSources]);
let formCount = 0;
for (const [route, artifact] of artifacts) {
  for (const match of artifact.html.matchAll(/\b(?:href|src|poster)\s*=\s*(["'])(.*?)\1/gi)) {
    const value = decodeHtml(match[2]);
    if (!value.startsWith('/') || value.startsWith('//')) continue;
    const target = new URL(value, origin);
    assert.equal(target.origin, origin);
    assert.ok(localPaths.has(decodeURIComponent(target.pathname)), `${route}: artifact contains ${target.pathname}`);
  }
  for (const match of artifact.html.matchAll(/<form\b([^>]*)>([\s\S]*?)<\/form>/gi)) {
    formCount++;
    assert.match(match[1], /action="https:\/\/formspree\.io\/f\/mvkkkwyn"/);
    assert.match(match[1], /method="POST"/i);
    assert.match(match[2], /name="form-location" value="[^"]+"/);
  }
}
assert.equal(formCount, 3, 'Three unchanged inquiry workflows; no submission tests in this script');
const home = artifacts.get('/').html;
assert.match(home, /setTimeout\([\s\S]{0,120}(?:8e3|8000)\)/, 'Generated homepage has eight-second testimonials');
assert.doesNotMatch(home, /mouseenter|mouseleave|\bfocusPaused\b|\bhovered\b/, 'No hidden hover pause in generated homepage');
const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]).sort();
assert.deepEqual(sitemapUrls, [...artifacts.keys()].filter(route => !noindexProductionPaths.includes(route)).map(route => new URL(route, origin).href).sort(), 'Sitemap exactly matches indexable routes');
assert.equal(await readFile(path.join(dist, 'robots.txt'), 'utf8'), `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`, 'Production robots permits crawl and names www sitemap');
console.log(`Artifact preflight: ${pageFiles.length} HTML files, ${assetFiles.length} assets, ${redirects.length} approved redirects and ${formCount} forms.`);
if (artifactOnly) {
  console.log('PASS: production artifact preflight only. No HTTP requests were made; run the normal command only after cutover.');
  process.exit(0);
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
const allowedOrigins = new Set([origin, 'https://techsavvy.consulting', 'http://techsavvy.consulting']);
let requests = 0;
async function request(target, options = {}) {
  const url = new URL(target, origin);
  assert.ok(allowedOrigins.has(url.origin), 'Only approved production origins may be requested');
  const method = options.method || 'GET';
  assert.ok(['GET', 'HEAD'].includes(method), 'Read-only HTTP methods only');
  requests++;
  return fetch(url, { ...options, method, redirect: 'manual', signal: AbortSignal.timeout(30_000) });
}
const assertHeaders = (response, label, noindex = false) => {
  if (noindex) assertNoindex(response.headers.get('x-robots-tag'), `${label}: excluded response indexing`);
  else assertIndexable(response.headers.get('x-robots-tag'), `${label}: production HTTP indexing`);
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff', `${label}: nosniff`);
  assert.equal(response.headers.get('referrer-policy'), 'strict-origin-when-cross-origin', `${label}: referrer policy`);
  assert.equal(response.headers.get('permissions-policy'), 'camera=(), microphone=(), geolocation=()', `${label}: permissions policy`);
};
const assertExactRedirect = (response, from, to, code = 301) => {
  assert.equal(response.status, code, `${from}: permanent redirect status`);
  assert.ok(response.headers.get('location'), `${from}: Location present`);
  assert.equal(new URL(response.headers.get('location'), origin).href, new URL(to, origin).href, `${from}: exact destination/query`);
};

console.log(`Checking ${origin}. GET/HEAD only; no forms, external URLs, DNS writes or advertisement changes.`);
let pages = 0;
for (const [route, artifact] of artifacts) {
  if (route === '/404' || redirectSources.has(route)) continue;
  const response = await request(route);
  assert.equal(response.status, 200, `${route}: clean URL directly available`);
  assert.equal(contentType(response), 'text/html');
  assertHeaders(response, route, noindexProductionPaths.includes(route));
  const html = await response.text();
  assertMetadata(html, route, artifact.meta);
  assert.equal(hash(html), hash(artifact.html), `${route}: exact generated HTML is deployed`);
  pages++;
}
console.log(`PASS: ${pages} clean-URL pages match the artifact byte-for-byte; production www metadata, indexing, eight-second carousel and form markup are current.`);

let assetBytes = 0;
for (const file of assetFiles) {
  const route = `/${file}`;
  const types = mediaTypes[path.extname(file).toLowerCase()];
  assert.ok(types, `${file}: known asset MIME type`);
  const response = await request(route);
  assert.equal(response.status, 200, `${route}: asset directly available`);
  assert.ok(types.includes(contentType(response)), `${route}: expected ${types.join(' or ')}, got ${contentType(response)}`);
  assertHeaders(response, route);
  const digest = createHash('sha256');
  let length = 0;
  for await (const chunk of response.body) { digest.update(chunk); length += chunk.byteLength; }
  const expected = await readFile(path.join(dist, file));
  assert.equal(length, (await stat(path.join(dist, file))).size, `${route}: exact asset length`);
  assert.equal(digest.digest('hex'), hash(expected), `${route}: exact asset bytes`);
  assetBytes += length;
}
console.log(`PASS: all ${assetFiles.length} assets (${assetBytes} bytes), including full video, robots and sitemap, match the production artifact exactly.`);

const query = '?verification=techsavvy-production&value=a%20b%2Bc';
let redirectChecks = 0;
for (const { from, to } of redirects) for (const suffix of ['', query]) {
  const response = await request(from + suffix, { method: 'HEAD' });
  assertExactRedirect(response, from + suffix, to + suffix);
  redirectChecks++;
}
let apexChecks = 0;
for (const protocol of ['http:', 'https:']) for (const route of ['/', `/managed-it-tulsa${query}`, `/post/managed-it-service-switching${query}`]) {
  const from = `${protocol}//techsavvy.consulting${route}`;
  const response = await request(from, { method: 'HEAD' });
  assertExactRedirect(response, from, origin + route);
  apexChecks++;
}
console.log(`PASS: ${redirectChecks} approved path/query redirects and ${apexChecks} HTTP/HTTPS apex-to-www 301 checks. DNS provider record shapes are not assumed.`);

// The artifact uses flat .html files, but Workers canonicalizes requests such as
// /contact.html and /contact/ to /contact. These generated redirects are routing
// behavior, not missing/modified artifact HTML or extra entries in _redirects.
// Their platform-selected status is reported separately from approved 301s.
const generatedStatuses = [];
for (const [from, to] of [['/index.html', '/'], ['/contact.html', '/contact'], ['/contact/', '/contact'], ['/post/managed-it-service-switching.html', '/post/managed-it-service-switching']]) {
  const response = await request(from + query, { method: 'HEAD' });
  assert.ok([301, 302, 307, 308].includes(response.status), `${from}: expected platform-generated clean-URL redirect`);
  assert.equal(new URL(response.headers.get('location'), origin).href, new URL(to + query, origin).href, `${from}: generated canonical destination/query`);
  generatedStatuses.push(`${from} → ${to} (${response.status})`);
}
console.log(`PASS: generated HTML routing: ${generatedStatuses.join('; ')}. Artifact equality is checked at clean URLs, not against these redirect responses.`);

const notFound = artifacts.get('/404');
for (const route of ['/__techsavvy_production_verification_missing__', '/__techsavvy_production_verification_missing__/nested', '/__techsavvy_production_verification_missing__.png']) {
  assert.ok(!localPaths.has(route), 'Missing-path probe absent from artifact');
  const response = await request(route);
  assert.equal(response.status, 404, `${route}: true 404, not a homepage fallback`);
  assert.equal(contentType(response), 'text/html');
  // Static-asset fallback keeps the originally requested URL. Therefore the
  // explicit /404 header rule need not match this unknown path; the real 404
  // status and exact custom page's HTML noindex are the indexing safeguards.
  // If Cloudflare supplies an X-Robots-Tag here, it must also retain noindex.
  if (response.headers.has('x-robots-tag')) assertNoindex(response.headers.get('x-robots-tag'), `${route}: optional error-page header`);
  assertHeaders(response, route, response.headers.has('x-robots-tag'));
  const html = await response.text();
  assertMetadata(html, '/404', notFound.meta);
  assert.equal(hash(html), hash(notFound.html), `${route}: exact custom404 body`);
}
console.log('PASS: three genuine custom 404s, excluded from indexing.');

const videos = assetFiles.filter(file => file.endsWith('.mp4'));
assert.equal(videos.length, 1, 'One approved introduction video');
let videoChecks = 0;
for (const file of videos) {
  const expected = await readFile(path.join(dist, file));
  const size = expected.length;
  const middle = Math.floor(size / 2);
  const head = await request(`/${file}`, { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.equal(Number(head.headers.get('content-length')), size);
  assertHeaders(head, file);
  for (const [range, start, end] of [['bytes=0-31', 0, 31], [`bytes=${middle}-${middle + 31}`, middle, middle + 31], [`bytes=${size - 32}-`, size - 32, size - 1], ['bytes=-32', size - 32, size - 1]]) {
    const response = await request(`/${file}`, { headers: { Range: range } });
    if (response.status !== 206) await response.body?.cancel();
    assert.equal(response.status, 206, `${file}: byte-range seeking`);
    assert.equal(contentType(response), 'video/mp4');
    assertHeaders(response, file);
    assert.equal(response.headers.get('content-range'), `bytes ${start}-${end}/${size}`);
    assert.equal(response.headers.get('accept-ranges'), 'bytes');
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), expected.subarray(start, end + 1), `${file}: requested exact video bytes`);
    videoChecks++;
  }
  const invalid = await request(`/${file}`, { headers: { Range: `bytes=${size}-` } });
  assert.equal(invalid.status, 416);
  assert.equal(invalid.headers.get('content-range'), `bytes */${size}`);
  assertHeaders(invalid, file, true);
  assert.equal((await invalid.arrayBuffer()).byteLength, 0);
  videoChecks++;
  const validator = head.headers.get('etag');
  assert.ok(validator, 'Video validator available');
  const conditional = await request(`/${file}`, { headers: { 'If-None-Match': validator } });
  assert.equal(conditional.status, 304, 'Video cache validator respected');
  assertHeaders(conditional, file);
  videoChecks++;
}
console.log(`PASS: video HEAD, ${videoChecks} range/error/cache checks; ${requests} read-only requests completed.`);
console.log('This gate does not submit forms, verify email receipt, visually inspect browsers, change Search Console, alter DNS, or modify advertising.');
