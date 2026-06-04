import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

import { siteConfig } from "./src/lib/config";

// https://astro.build/config
export default defineConfig({
  site: siteConfig.url,
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
