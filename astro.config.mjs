import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare";

const FALLBACK_SITE_URL = "https://example.com";
const site = process.env.PUBLIC_SITE_URL || FALLBACK_SITE_URL;

// Fail loudly on a production build that forgot PUBLIC_SITE_URL, otherwise every
// canonical URL, OG tag, sitemap and robots.txt silently ships pointing at
// example.com — an SEO regression that is hard to notice after the fact.
if (process.env.NODE_ENV === "production" && site === FALLBACK_SITE_URL) {
  throw new Error(
    "PUBLIC_SITE_URL is not set. Set it to your real domain (e.g. https://your-domain.com) before building for production.",
  );
}

export default defineConfig({
  site,
  output: "server",
  adapter: cloudflare(),
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
