// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import vercel from '@astrojs/vercel';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://guardiansleeves.com',

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: vercel(),
  integrations: [sitemap({
    filter: (page) => !page.includes('/404'),
  })]
});
