// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import mdx from '@astrojs/mdx';

import vercel from '@astrojs/vercel';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'http://localhost:4321',
  output: 'static',
  trailingSlash: 'ignore',
  adapter: vercel(),
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'vi'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true,
    },
  },

  integrations: [react(), mdx()],

  vite: {
    plugins: [tailwindcss()]
  }
});