// Same approved video bytes and range handling as the isolated preview. Assets
// live in this deployment; neither this wrapper nor its delegate fetch GitHub.
import videoWorker from './video-worker.mjs';

const VIDEO_PATH = '/videos/techsavvy-introduction.mp4';
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

export default {
  async fetch(request, env, context) {
    const videoRequest = new URL(request.url).pathname === VIDEO_PATH && ['GET', 'HEAD'].includes(request.method);
    const response = videoRequest ? await videoWorker.fetch(request, env, context) : await env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) headers.set(name, value);
    if (videoRequest && [200, 206, 304].includes(response.status)) headers.delete('X-Robots-Tag');
    // Unknown URLs must remain real 404s and never become indexable fallback pages.
    if (response.status >= 400) headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  },
};
