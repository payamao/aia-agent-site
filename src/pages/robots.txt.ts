import type { APIRoute } from "astro";
import { site } from "@/site";

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(
    `User-agent: *
Allow: /

Sitemap: ${new URL("/sitemap-index.xml", site.url)}
`.trim(),
    {
      headers: {
        "content-type": "text/plain; charset=utf-8",
      },
    },
  );
