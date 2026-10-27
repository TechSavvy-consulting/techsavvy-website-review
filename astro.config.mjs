import { defineConfig } from 'astro/config';
import { deploymentConfig } from './src/utils/deployment.ts';

const deployment = deploymentConfig(process.env);

export default defineConfig({
  site: deployment.site,
  base: '/',
  outDir: deployment.outDir,
  output: 'static',
  trailingSlash: deployment.directory ? 'always' : 'never',
  build: { format: deployment.directory ? 'directory' : 'file' },
  server: { host: '127.0.0.1', port: 4321 },
  devToolbar: { enabled: false },
});
