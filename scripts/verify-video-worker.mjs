import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import worker from '../cloudflare/video-worker.mjs';
const VIDEO_PATH = '/videos/techsavvy-introduction.mp4';
const args = process.argv.slice(2);
let localOrigin;
if (args.length) {
  assert.equal(args.length, 2, 'Usage: node scripts/verify-video-worker.mjs [--local-origin http://127.0.0.1:PORT]');
  assert.equal(args[0], '--local-origin');
  const url = new URL(args[1]);
  assert.ok(url.protocol === 'http:' && url.hostname === '127.0.0.1' && url.pathname === '/' && !url.username && !url.password && !url.search && !url.hash, 'Native runtime tests are restricted to a local loopback server');
  localOrigin = url.origin;
}

// Offline tests only. No network requests, form submissions, account access or
// persistent storage. This mock enforces the fixed stream's byte-count contract;
// deployment must also be tested in the real Workers runtime before release.
const source = await readFile(new URL('../cloudflare/video-worker.mjs', import.meta.url), 'utf8');
const videoBytes = Number(source.match(/const VIDEO_BYTES = (\d+);/)?.[1]);
assert.equal(videoBytes, (await stat(new URL('../public/videos/techsavvy-introduction.mp4', import.meta.url))).size, 'Known video length matches the current source; refresh the constant when replacing this file');
const restrictedSource = source.replaceAll('env.ASSETS.fetch(', 'assetRequestCall(').replace('async fetch(request, env, context)', 'handler()');
assert.equal(/\.arrayBuffer\(|\.blob\(|caches\.|\bfetch\(/i.test(restrictedSource), false, 'No full-file buffering, cache dependency or external network fetch');
const publicHeaders = await readFile(new URL('../public/_headers', import.meta.url), 'utf8');
const PREVIEW_HEADERS = Object.fromEntries([...publicHeaders.matchAll(/^\s{2}([^:]+): (.+)$/gm)].map(match => [match[1], match[2].trim()]));

globalThis.FixedLengthStream = class {
  constructor(length) {
    let written = 0;
    const stream = new TransformStream({
      transform(chunk, controller) {
        written += chunk.byteLength;
        if (written > length) throw new Error('Too many bytes');
        controller.enqueue(chunk);
      },
      flush() { if (written !== length) throw new Error('Too few bytes'); },
    });
    this.readable = stream.readable;
    this.writable = stream.writable;
  }
};

const bytes = Uint8Array.from({ length: 10_003 }, (_, index) => index % 251);
const etag = '"video-version-1"';
const modified = 'Mon, 26 Oct 2026 12:00:00 GMT';
let assertions = 0;
function fixture(options = {}) {
  const calls = [];
  const stats = { bytesRead: 0, canceled: 0 };
  const pending = [];
  const headers = { 'Content-Type': 'video/mp4', 'Content-Length': String(bytes.length), ETag: etag, 'Last-Modified': modified, ...options.headers };
  const env = { ASSETS: { async fetch(request) {
    calls.push(request);
    if (new URL(request.url).pathname !== VIDEO_PATH || !['GET', 'HEAD'].includes(request.method)) return new Response('delegate', { status: options.delegateStatus || 200 });
    if (request.method === 'HEAD') return new Response(null, { status: options.metadataStatus || 200, headers });
    let offset = 0;
    const payload = options.truncated ? bytes.subarray(0, 35) : bytes;
    return new Response(new ReadableStream({
      pull(controller) {
        if (offset >= payload.length) return controller.close();
        const next = Math.min(payload.length, offset + 97);
        controller.enqueue(payload.subarray(offset, next));
        stats.bytesRead += next - offset;
        offset = next;
      },
      cancel() { stats.canceled++; },
    }, { highWaterMark: 0 }), { headers: { ...headers, ...options.getHeaders } });
  } } };
  return { env, calls, stats, pending, context: { waitUntil(promise) { pending.push(promise); } } };
}
function safeguards(response) {
  for (const [name, value] of Object.entries(PREVIEW_HEADERS)) assert.equal(response.headers.get(name), value, name);
}
async function check({ method = 'GET', headers = {}, route = VIDEO_PATH, status = 200, expected = bytes, range, options = {}, getCount, sourceReadLimit } = {}) {
  const test = fixture(options);
  const request = new Request(`https://preview.example.workers.dev${route}`, { method, headers });
  const response = await worker.fetch(request, test.env, test.context);
  assert.equal(response.status, status, `${method} ${JSON.stringify(headers)}: status`);
  safeguards(response);
  if (range) assert.equal(response.headers.get('Content-Range'), range);
  else assert.equal(response.headers.has('Content-Range'), false);
  const actual = new Uint8Array(await response.arrayBuffer());
  assert.deepEqual(actual, expected, `${method} ${JSON.stringify(headers)}: exact body`);
  await Promise.all(test.pending);
  if (status === 206) {
    assert.equal(Number(response.headers.get('Content-Length')), actual.byteLength);
    assert.equal(response.headers.get('Accept-Ranges'), 'bytes');
    assert.equal(test.stats.canceled, 1, 'Range cancels unused source bytes');
  }
  if (getCount !== undefined) assert.equal(test.calls.filter(call => call.method === 'GET').length, getCount, 'Expected source GET count');
  if (sourceReadLimit !== undefined) assert.ok(test.stats.bytesRead <= sourceReadLimit, 'Early range does not consume the full file');
  if (route === VIDEO_PATH && ['GET', 'HEAD'].includes(method)) {
    for (const call of test.calls) {
      assert.equal(call.headers.get('Range'), null, 'Asset binding is not asked for unsupported ranges');
      assert.equal(call.headers.get('If-None-Match'), null, 'Conditional evaluation is local');
      assert.equal(call.headers.get('Accept-Encoding'), 'identity');
    }
  }
  assertions++;
  return { response, test, request };
}

await check();
await check({ method: 'HEAD', expected: new Uint8Array(), getCount: 0 });
await check({ method: 'HEAD', headers: { Range: 'bytes=0-31' }, expected: new Uint8Array(), getCount: 0 });
for (const [value, start, end] of [
  ['bytes=0-31', 0, 31], ['bytes=96-194', 96, 194], ['bytes=10002-', 10002, 10002],
  ['bytes=9999-', 9999, 10002], ['bytes=-31', 9972, 10002], ['bytes=-99999', 0, 10002],
  ['bytes=0-9999999999999999999999', 0, 10002], ['BYTES=0-0', 0, 0],
]) await check({ headers: { Range: value }, status: 206, expected: bytes.slice(start, end + 1), range: `bytes ${start}-${end}/${bytes.length}` });
await check({ headers: { Range: 'bytes=0-31' }, status: 206, expected: bytes.slice(0, 32), range: `bytes 0-31/${bytes.length}`, sourceReadLimit: 97 });
for (const value of ['bytes=10003-', 'bytes=9999999999999999999999-', 'bytes=-0']) {
  await check({ headers: { Range: value }, status: 416, expected: new Uint8Array(), range: `bytes */${bytes.length}`, getCount: 0 });
}
for (const value of ['bytes=', 'bytes=-', 'bytes=4-2', 'bytes=abc', 'items=0-1', 'bytes=0-1,3-4', 'bytes=+1-4']) await check({ headers: { Range: value } });
for (const value of ['bytes=0-', 'bytes=-1']) await check({ headers: { Range: value }, options: { headers: { 'Content-Length': '0' } }, status: 416, expected: new Uint8Array(), range: 'bytes */0', getCount: 0 });

for (const headers of [
  { 'If-None-Match': etag }, { 'If-None-Match': `W/${etag}` }, { 'If-None-Match': `"other", W/${etag}`, Range: 'bytes=0-31' },
  { 'If-None-Match': '*' }, { 'If-Modified-Since': modified }, { 'If-Modified-Since': 'Tue, 27 Oct 2026 12:00:00 GMT' },
]) await check({ headers, status: 304, expected: new Uint8Array(), getCount: 0 });
await check({ method: 'HEAD', headers: { 'If-None-Match': etag }, status: 304, expected: new Uint8Array(), getCount: 0 });
for (const headers of [
  { 'If-Match': '"other"' }, { 'If-Match': `W/${etag}` }, { 'If-Unmodified-Since': 'Sun, 25 Oct 2026 12:00:00 GMT' },
]) await check({ headers, status: 412, expected: new Uint8Array(), getCount: 0 });
await check({ headers: { 'If-Match': etag, 'If-Unmodified-Since': 'Sun, 25 Oct 2026 12:00:00 GMT' } });
await check({ headers: { 'If-Match': '*' } });
await check({ headers: { 'If-None-Match': '"other"', 'If-Modified-Since': 'Tue, 27 Oct 2026 12:00:00 GMT' } });
await check({ headers: { 'If-Modified-Since': 'invalid' } });
for (const validator of [etag, modified]) await check({ headers: { Range: 'bytes=0-31', 'If-Range': validator }, status: 206, expected: bytes.slice(0, 32), range: `bytes 0-31/${bytes.length}` });
for (const validator of ['"other"', `W/${etag}`, 'Sun, 25 Oct 2026 12:00:00 GMT', 'invalid']) await check({ headers: { Range: 'bytes=0-31', 'If-Range': validator } });

for (const options of [{ headers: { 'Content-Length': 'invalid' } }, { headers: { 'Content-Encoding': 'gzip' } }, { getHeaders: { ETag: '"changed"' } }]) {
  await check({ options, status: 503, expected: new TextEncoder().encode('Video temporarily unavailable.') });
}
for (const route of ['/contact', '/videos/another.mp4', '/videos/techsavvy-introduction.mp4/']) {
  const result = await check({ route, expected: new TextEncoder().encode('delegate') });
  assert.equal(result.test.calls[0], result.request, 'Unrelated request delegated unchanged');
}
const post = await check({ method: 'POST', options: { delegateStatus: 405 }, status: 405, expected: new TextEncoder().encode('delegate') });
assert.equal(post.test.calls[0], post.request, 'Unsupported method delegated unchanged');

const canceled = fixture();
const canceledResponse = await worker.fetch(new Request(`https://local${VIDEO_PATH}`, { headers: { Range: 'bytes=0-1000' } }), canceled.env, canceled.context);
await canceledResponse.body.cancel();
await Promise.all(canceled.pending);
assert.equal(canceled.stats.canceled, 1, 'Client cancellation stops source streaming');
assert.ok(canceled.stats.bytesRead <= 97, 'Client cancellation does not drain movie');
const truncated = fixture({ truncated: true });
const shortResponse = await worker.fetch(new Request(`https://local${VIDEO_PATH}`, { headers: { Range: 'bytes=0-1000' } }), truncated.env, truncated.context);
await assert.rejects(shortResponse.arrayBuffer(), /Asset ended/);
await Promise.all(truncated.pending);
console.log(`PASS: ${assertions} offline response cases, range parsing, conditional precedence, exact byte streams, staging safeguards, bounded early reads, cancellation and truncated-source errors.`);
console.log('Known video byte length matches the source. Deployed browser/Safari seeking and actual Free-tier CPU limits require separate verification.');

if (localOrigin) {
  const video = await readFile(new URL('../public/videos/techsavvy-introduction.mp4', import.meta.url));
  const endpoint = localOrigin + VIDEO_PATH;
  const fetchLocal = (url, options = {}) => fetch(url, { ...options, redirect: 'manual', signal: AbortSignal.timeout(20_000) });
  const head = await fetchLocal(endpoint, { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.equal(Number(head.headers.get('Content-Length')), video.length);
  assert.equal((await head.arrayBuffer()).byteLength, 0);
  safeguards(head);
  const validator = head.headers.get('ETag');
  assert.ok(validator);
  const cases = [
    [{ Range: 'bytes=0-31' }, 206, video.subarray(0, 32)],
    [{ Range: 'bytes=500000-500099' }, 206, video.subarray(500000, 500100)],
    [{ Range: `bytes=${video.length - 32}-` }, 206, video.subarray(-32)],
    [{ Range: 'bytes=-32' }, 206, video.subarray(-32)],
    [{ Range: `bytes=${video.length}-` }, 416, Buffer.alloc(0)],
    [{ Range: 'bytes=-0' }, 416, Buffer.alloc(0)],
    [{ Range: 'bytes=10-3' }, 200, video],
    [{ Range: 'items=0-31' }, 200, video],
    [{ Range: 'bytes=0-1,3-4' }, 200, video],
    [{ 'If-None-Match': validator, Range: 'bytes=0-31' }, 304, Buffer.alloc(0)],
    [{ 'If-None-Match': `W/${validator}` }, 304, Buffer.alloc(0)],
    [{ 'If-Match': '"different"', Range: 'bytes=0-31' }, 412, Buffer.alloc(0)],
    [{ 'If-Range': validator, Range: 'bytes=0-31' }, 206, video.subarray(0, 32)],
    [{ 'If-Range': '"different"', Range: 'bytes=0-31' }, 200, video],
  ];
  for (const [headers, status, expected] of cases) {
    const response = await fetchLocal(endpoint, { headers });
    assert.equal(response.status, status, `Native runtime ${JSON.stringify(headers)}`);
    safeguards(response);
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), expected, 'Native runtime exact video bytes');
    if (status === 206 || status === 200) assert.equal(Number(response.headers.get('Content-Length')), expected.length, 'Native runtime Content-Length');
  }
  for (const route of ['/', '/contact', '/about-it-support']) {
    const response = await fetchLocal(localOrigin + route);
    assert.equal(response.status, 200);
    const file = route === '/' ? 'index.html' : `${route.slice(1)}.html`;
    assert.equal(await response.text(), await readFile(new URL(`../dist-cloudflare/${file}`, import.meta.url), 'utf8'), `${route}: page unchanged`);
  }
  const redirect = await fetchLocal(`${localOrigin}/it-collaboration?review=1`);
  assert.equal(redirect.status, 301);
  assert.equal(new URL(redirect.headers.get('Location'), localOrigin).href, `${localOrigin}/outsourced-managed-it?review=1`);
  assert.equal((await fetchLocal(`${localOrigin}/this-page-does-not-exist`)).status, 404);
  console.log(`PASS: native local Workers runtime HEAD + ${cases.length} byte-exact video/conditional cases, three unchanged pages, redirect/query preservation and custom404. Only loopback GET/HEAD requests were made.`);
} else {
  console.log('Offline mode: no network requests were made. Use --local-origin with a local Wrangler server for native FixedLengthStream verification.');
}
