import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getBlogUrl, sortPosts } from "@/lib/blog";
import { site } from "@/site";

export const prerender = true;

export const GET: APIRoute = async () => {
  const posts = sortPosts(await getCollection("blog"));
  const items = posts
    .map((post) => {
      const url = new URL(getBlogUrl(post), site.url).toString();
      return `
        <item>
          <title>${escapeXml(post.data.title)}</title>
          <description>${escapeXml(post.data.description)}</description>
          <link>${url}</link>
          <guid>${url}</guid>
          <pubDate>${post.data.pubDate.toUTCString()}</pubDate>
        </item>`;
    })
    .join("");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
      <rss version="2.0">
        <channel>
          <title>${escapeXml(site.name)} Blog</title>
          <description>${escapeXml(site.description)}</description>
          <link>${site.url}</link>
          ${items}
        </channel>
      </rss>`.trim(),
    {
      headers: {
        "content-type": "application/rss+xml; charset=utf-8",
      },
    },
  );
};

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
