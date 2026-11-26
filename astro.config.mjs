import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// Static site served from the custom domain (public/CNAME) on GitHub Pages.
export default defineConfig({
  site: 'https://ninoredoble.is-a.dev',
  output: 'static',
  // React only for the small interactive islands (dock, scroll reveal, paper notes). They load
  // after the hero, so the first paint never waits on them.
  integrations: [react()],
  trailingSlash: 'ignore',
  // Inline the small stylesheets (a few KB each) so nothing blocks the first paint.
  build: { format: 'directory', inlineStylesheets: 'always' },
});
