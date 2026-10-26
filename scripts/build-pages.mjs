import { spawnSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const result = spawnSync(process.execPath, [path.join(root, 'node_modules/astro/bin/astro.mjs'), 'build'], {
  cwd: root,
  env: { ...process.env, PREVIEW_PLATFORM: 'github-pages' },
  stdio: 'inherit',
});
if (result.status !== 0) process.exit(result.status ?? 1);
// Astro emits its special 404 route as 404.html even with directory-style pages.
await writeFile(path.join(root, 'dist-pages/.nojekyll'), '');
console.log('GitHub test-arena artifact prepared for https://websitenew.techsavvy.consulting/ at root base /.');
console.log('The custom domain is configured in GitHub Pages settings; this build does not change DNS or deploy production.');
