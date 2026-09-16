import { defineConfig } from 'astro/config';

// Static site served from the custom domain (public/CNAME) on GitHub Pages.
export default defineConfig({
  site: 'https://ninoredoble.is-a.dev',
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
