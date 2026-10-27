import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { cloudflarePreviewOrigin } from '../src/utils/deployment.ts';

const args = process.argv.slice(2);
if (args.length !== 2 || args[0] !== '--origin') {
  console.error('Usage: npm run build:cloudflare -- --origin https://<worker>.<account>.workers.dev');
  process.exit(1);
}
const origin = cloudflarePreviewOrigin(args[1]);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const result = spawnSync(process.execPath, [path.join(root, 'node_modules/astro/bin/astro.mjs'), 'build'], {
  cwd: root,
  env: { ...process.env, PREVIEW_PLATFORM: 'cloudflare-workers', CLOUDFLARE_PREVIEW_ORIGIN: origin, SITE_HOSTING: 'cloudflare' },
  stdio: 'inherit',
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
console.log(`Cloudflare staging artifact prepared in dist-cloudflare for ${origin}.`);
console.log('All HTML and asset headers remain noindex. No deployment, DNS, production release or form submission was performed.');
