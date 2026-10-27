// Staging-only compatibility handler. Configure run_worker_first for this exact
// path, not the entire site. No external fetches, storage services or tracking.
const VIDEO_PATH = '/videos/techsavvy-introduction.mp4';
// ASSETS.fetch omits Content-Length internally. This is the approved artifact's
// byte length, verified against public/videos by verify-video-worker.mjs. Update
// this value and rerun that check whenever this exact video file is replaced.
const VIDEO_BYTES = 16880189;
const PREVIEW_HEADERS = {
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

function safeHeaders(original) {
  const headers = new Headers(original);
  for (const [name, value] of Object.entries(PREVIEW_HEADERS)) headers.set(name, value);
  return headers;
}
function protect(response) {
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers: safeHeaders(response.headers) });
}
function empty(status, original, length) {
  const headers = safeHeaders(original);
  headers.delete('Content-Length');
  headers.delete('Content-Range');
  if (status === 416) headers.set('Content-Range', `bytes */${length}`);
  if (status !== 304) headers.set('Content-Length', '0');
  return new Response(null, { status, headers });
}
function unavailable() {
  return new Response('Video temporarily unavailable.', { status: 503, headers: { ...PREVIEW_HEADERS, 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } });
}
function tags(value) {
  return value.match(/(?:W\/)?"[^"\r\n]*"/g) || [];
}
function etagMatches(value, etag, weak) {
  if (value.trim() === '*') return true;
  if (!etag) return false;
  const normalize = tag => weak ? tag.replace(/^W\//, '') : tag;
  return tags(value).some(tag => (weak || (!tag.startsWith('W/') && !etag.startsWith('W/'))) && normalize(tag) === normalize(etag));
}
function dateValue(value) {
  if (!value) return null;
  const number = Date.parse(value);
  return Number.isFinite(number) ? number : null;
}
function preconditionStatus(request, headers) {
  const etag = headers.get('ETag');
  const modified = dateValue(headers.get('Last-Modified'));
  const match = request.headers.get('If-Match');
  if (match !== null) {
    if (!etagMatches(match, etag, false)) return 412;
  } else {
    const unmodified = dateValue(request.headers.get('If-Unmodified-Since'));
    if (modified !== null && unmodified !== null && modified > unmodified) return 412;
  }
  const noneMatch = request.headers.get('If-None-Match');
  if (noneMatch !== null) {
    if (etagMatches(noneMatch, etag, true)) return 304;
  } else {
    const since = dateValue(request.headers.get('If-Modified-Since'));
    if (modified !== null && since !== null && modified <= since) return 304;
  }
  return null;
}
function ifRangeMatches(value, headers) {
  if (value === null) return true;
  if (value.startsWith('"') || value.startsWith('W/')) {
    const etag = headers.get('ETag');
    return !value.startsWith('W/') && !!etag && !etag.startsWith('W/') && value === etag;
  }
  // Date-form If-Range requires the exact Last-Modified validator, not <=.
  const date = dateValue(value);
  const modified = dateValue(headers.get('Last-Modified'));
  return date !== null && modified !== null && date === modified;
}

// null means ignore malformed/unsupported/multipart Range and serve ordinary 200.
// false means a syntactically valid but unsatisfiable byte range (416).
function parseRange(value, size) {
  const match = /^bytes=(\d*)-(\d*)$/i.exec(value.trim());
  if (!match || (!match[1] && !match[2])) return null;
  const total = BigInt(size);
  if (!match[1]) {
    const suffix = BigInt(match[2]);
    if (suffix === 0n || total === 0n) return false;
    return { start: Number(suffix >= total ? 0n : total - suffix), end: size - 1 };
  }
  const start = BigInt(match[1]);
  const end = match[2] ? BigInt(match[2]) : total - 1n;
  if (match[2] && end < start) return null;
  if (start >= total) return false;
  return { start: Number(start), end: Number(end >= total ? total - 1n : end) };
}

function assetRequest(request, method) {
  // Ask only the existing static-assets binding for the unencoded representation.
  // Preconditions are evaluated here against the same representation's metadata.
  return new Request(request.url, { method, headers: { 'Accept-Encoding': 'identity' }, redirect: 'manual' });
}
async function cancel(response) {
  try { await response.body?.cancel(); } catch { /* A canceled source needs no retry. */ }
}
function rangeBody(source, range, context) {
  // Workers derives Content-Length from FixedLengthStream, not a manually set
  // header on an arbitrary stream. Reads/writes respect backpressure; no full
  // movie buffer or cache warm-up is required, even for the first request.
  const fixed = new FixedLengthStream(range.end - range.start + 1);
  const reader = source.getReader();
  const writer = fixed.writable.getWriter();
  const pump = (async () => {
    let offset = 0;
    try {
      while (offset <= range.end) {
        const { value, done } = await reader.read();
        if (done) throw new Error('Asset ended before its advertised range.');
        const next = offset + value.byteLength;
        if (next > range.start) {
          const from = Math.max(0, range.start - offset);
          const to = Math.min(value.byteLength, range.end + 1 - offset);
          if (to > from) await writer.write(value.subarray(from, to));
        }
        offset = next;
      }
      await writer.close();
    } catch (error) {
      try { await writer.abort(error); } catch { /* Client may already have disconnected. */ }
    } finally {
      try { await reader.cancel(); } catch { /* Source may already have errored. */ }
      reader.releaseLock();
      writer.releaseLock();
    }
  })();
  context?.waitUntil(pump);
  return fixed.readable;
}

export default {
  async fetch(request, env, context) {
    if (new URL(request.url).pathname !== VIDEO_PATH || !['GET', 'HEAD'].includes(request.method)) {
      return protect(await env.ASSETS.fetch(request));
    }
    try {
      const metadata = await env.ASSETS.fetch(assetRequest(request, 'HEAD'));
      if (metadata.status !== 200) return protect(request.method === 'HEAD' ? metadata : await env.ASSETS.fetch(request));
      const lengthHeader = metadata.headers.get('Content-Length') ?? String(VIDEO_BYTES);
      const length = lengthHeader !== null && /^\d+$/.test(lengthHeader) ? Number(lengthHeader) : NaN;
      if (!Number.isSafeInteger(length) || length < 0 || (metadata.headers.get('Content-Encoding') || 'identity') !== 'identity') return unavailable();
      const headers = safeHeaders(metadata.headers);
      headers.set('Accept-Ranges', 'bytes');
      headers.set('Content-Length', String(length));
      const conditional = preconditionStatus(request, headers);
      if (conditional) return empty(conditional, headers);
      // HTTP Range applies only to GET; HEAD reports full representation metadata.
      if (request.method === 'HEAD') return new Response(null, { status: 200, headers });
      const requested = request.headers.get('Range');
      const range = requested !== null && ifRangeMatches(request.headers.get('If-Range'), headers) ? parseRange(requested, length) : null;
      if (range === false) return empty(416, headers, length);
      const asset = await env.ASSETS.fetch(assetRequest(request, 'GET'));
      if (asset.status !== 200) return protect(asset);
      if (asset.headers.get('ETag') !== metadata.headers.get('ETag') || (asset.headers.get('Content-Length') !== null && asset.headers.get('Content-Length') !== lengthHeader) || (asset.headers.get('Content-Encoding') || 'identity') !== 'identity') {
        await cancel(asset);
        return unavailable();
      }
      if (!range) {
        const fullHeaders = safeHeaders(asset.headers);
        fullHeaders.set('Accept-Ranges', 'bytes');
        return new Response(asset.body, { status: 200, headers: fullHeaders });
      }
      if (!asset.body) return unavailable();
      headers.set('Content-Range', `bytes ${range.start}-${range.end}/${length}`);
      headers.set('Content-Length', String(range.end - range.start + 1));
      return new Response(rangeBody(asset.body, range, context), { status: 206, headers });
    } catch {
      // Do not disclose internal errors or claim a successful partial response.
      return unavailable();
    }
  },
};
