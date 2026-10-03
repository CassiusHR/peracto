/**
 * Site-wide metadata. Consumed by the root layout (`<head>` tags),
 * `astro.config.ts` (`site`). Indexing stays disabled in the shared layout.
 */
export const siteConfig = {
  name: "Peracto",
  description:
    "Agentic development, Forward Deployed Engineering, Fractional CTO/CPO, and executive advisory. Software and leadership for your next business challenge.",
  url: "https://perac.to",
  ogImage: "/og-image.png",
  locale: "en_US",
  lang: "en",
  keywords: [
    "agentic development",
    "AI agents",
    "forward deployed engineering",
    "fractional CTO",
    "fractional CPO",
    "executive advisory",
  ],
} as const;
