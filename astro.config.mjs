import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.techsavvy.consulting',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  server: { host: '127.0.0.1', port: 4321 },
  devToolbar: { enabled: false },
});
