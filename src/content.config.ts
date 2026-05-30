import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.string().default("ประกันสุขภาพ"),
    readingTime: z.string().default("อ่าน 5 นาที"),
    coverLabel: z.string(),
    coverTone: z.enum(["navy", "red", "teal"]).default("navy"),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog };
