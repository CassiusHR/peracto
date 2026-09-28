/**
 * Feature flags.
 *
 * Toggle template-level capabilities here. Each flag is consumed at the
 * component or layout level; flipping a flag to `false` should fully
 * remove the corresponding behavior (no listeners, no instantiation, no
 * library code paths) so the template degrades cleanly.
 */
export const features = {
  /**
   * Smooth-scroll powered by Lenis. When `false` the page falls back to
   * native CSS `scroll-behavior: smooth` and no Lenis instance is
   * created. Automatically disabled when the user prefers reduced
   * motion regardless of this value.
   */
  smoothScroll: true,
} as const;

/**
 * Site-wide metadata. Consumed by the root layout (`<head>` tags),
 * `astro.config.ts` (`site` + sitemap), and the web manifest.
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
