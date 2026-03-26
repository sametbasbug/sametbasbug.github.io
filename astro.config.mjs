// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkAutoGlossaryLinks from './src/utils/remark-auto-glossary-links.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://sametbasbug.dev',
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: [remarkAutoGlossaryLinks],
  },
});
