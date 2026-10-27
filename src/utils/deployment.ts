/** Build-time deployment targets. No target in this revision enables indexing. */
export function cloudflarePreviewOrigin(value: string | undefined): string {
  if (!value) throw new Error('A Cloudflare preview origin is required; use --origin https://<worker>.<account>.workers.dev.');
  let url: URL;
  try { url = new URL(value); } catch { throw new Error('Cloudflare preview origin must be an absolute HTTPS workers.dev origin.'); }
  const labels = url.hostname.split('.');
  const validHostname = url.hostname.length <= 253 && labels.length >= 4 && labels.slice(-2).join('.') === 'workers.dev'
    && labels.every(label => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label));
  if (url.protocol !== 'https:' || !validHostname || url.port || url.username || url.password
    || url.pathname !== '/' || url.search || url.hash || ![url.origin, `${url.origin}/`].includes(value)) {
    throw new Error('Cloudflare preview origin must be an HTTPS workers.dev origin without credentials, port, path, query or fragment. Production/custom domains are not accepted by this staging build.');
  }
  return url.origin;
}

export function deploymentConfig(env: Record<string, string | undefined>) {
  const target = env.PREVIEW_PLATFORM || 'local';
  if (target === 'github-pages') return { site: 'https://websitenew.techsavvy.consulting', outDir: './dist-pages', directory: true };
  if (target === 'cloudflare-workers') {
    if (env.SITE_HOSTING !== 'cloudflare') throw new Error('Cloudflare staging must set SITE_HOSTING=cloudflare for accurate provider disclosures.');
    return { site: cloudflarePreviewOrigin(env.CLOUDFLARE_PREVIEW_ORIGIN), outDir: './dist-cloudflare', directory: false };
  }
  if (target === 'local') return { site: 'https://www.techsavvy.consulting', outDir: './dist', directory: false };
  throw new Error(`Unsupported build target: ${target}. Production indexing is not enabled by this revision.`);
}
