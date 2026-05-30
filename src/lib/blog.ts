import type { CollectionEntry } from "astro:content";

export type BlogPost = CollectionEntry<"blog">;

export function getBlogSlug(post: BlogPost) {
  return post.id.replace(/\.(md|mdx)$/, "");
}

export function getBlogUrl(post: BlogPost) {
  return `/blog/${getBlogSlug(post)}/`;
}

export function sortPosts(posts: BlogPost[]) {
  return posts.sort(
    (a, b) =>
      new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime(),
  );
}

export function formatThaiDate(date: Date) {
  return new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
