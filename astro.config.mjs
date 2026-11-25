import { defineConfig } from 'astro/config';

// Static site served from the custom domain (public/CNAME) on GitHub Pages.
export default defineConfig({
  site: 'https://ninoredoble.is-a.dev',
  output: 'static',
  trailingSlash: 'ignore',
  // Inline the small stylesheets (a few KB each) so nothing blocks the first paint.
  build: { format: 'directory', inlineStylesheets: 'always' },
});
