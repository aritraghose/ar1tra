// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: "https://ar1tra.com",
  // Astro 7 defaults to 'jsx', which strips whitespace between inline elements
  compressHTML: true,
  vite: {
    plugins: [tailwindcss()]
  },

  adapter: cloudflare({ imageService: 'compile' })
});