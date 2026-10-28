/**
 * Site-wide metadata. Consumed by the root layout (`<head>` tags),
 * `astro.config.ts` (`site`). Indexing stays disabled in the shared layout.
 */
export const siteConfig = {
  name: "Peracto",
  url: "https://perac.to",
  ogImage: "/og-image.png",
  keywords: [
    "agentic development",
    "AI agents",
    "forward deployed engineering",
    "fractional CTO",
    "fractional CPO",
    "executive advisory",
  ],
} as const;
