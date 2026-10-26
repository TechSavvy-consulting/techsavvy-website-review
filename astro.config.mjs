import { defineConfig } from 'astro/config';

const githubPreview = process.env.PREVIEW_PLATFORM === 'github-pages';

export default defineConfig({
  site: githubPreview ? 'https://websitenew.techsavvy.consulting' : 'https://www.techsavvy.consulting',
  base: '/',
  outDir: githubPreview ? './dist-pages' : './dist',
  output: 'static',
  trailingSlash: githubPreview ? 'always' : 'never',
  build: { format: githubPreview ? 'directory' : 'file' },
  server: { host: '127.0.0.1', port: 4321 },
  devToolbar: { enabled: false },
});
