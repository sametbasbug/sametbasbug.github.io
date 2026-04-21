// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkAutoGlossaryLinks from './src/utils/remark-auto-glossary-links.mjs';

// https://astro.build/config
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://sametbasbug.dev',
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: [remarkAutoGlossaryLinks],
  },
});
