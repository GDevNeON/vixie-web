// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import mdx from '@astrojs/mdx';

import vercel from '@astrojs/vercel';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'http://localhost:4321',
  output: 'static',
  trailingSlash: 'ignore',
  adapter: vercel(),

  integrations: [react(), mdx()],

  vite: {
    plugins: [tailwindcss()]
  }
});