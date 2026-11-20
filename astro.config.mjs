// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: "https://ar1tra.com",
  // Astro 7 defaults to 'jsx', which strips whitespace between inline elements
  compressHTML: true,
  // Content-Security-Policy as a <meta> tag on every page. Astro adds hashes for each
  // script/style it renders, so only our own bundled and inline code can run.
  // frame-ancestors can't go in a <meta> CSP; X-Frame-Options in public/_headers and
  // src/middleware.ts covers framing.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "connect-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()]
  },

  adapter: cloudflare({ imageService: 'compile' })
});