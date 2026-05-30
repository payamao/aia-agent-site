import { defineConfig } from "tinacms";

const branch =
  process.env.TINA_PUBLIC_BRANCH ||
  process.env.NEXT_PUBLIC_TINA_BRANCH ||
  process.env.TINA_BRANCH ||
  process.env.CF_PAGES_BRANCH ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,
  clientId:
    process.env.TINA_PUBLIC_CLIENT_ID ||
    process.env.NEXT_PUBLIC_TINA_CLIENT_ID ||
    process.env.TINA_CLIENT_ID ||
    "",
  token: process.env.TINA_TOKEN || "",
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "blog",
        label: "บทความ",
        path: "src/content/blog",
        format: "md",
        defaultItem: () => ({
          title: "บทความใหม่",
          description: "สรุปบทความสำหรับ SEO",
          pubDate: new Date().toISOString(),
          category: "ประกันสุขภาพ",
          readingTime: "อ่าน 5 นาที",
          coverLabel: "ประกันสุขภาพ",
          coverTone: "navy",
          featured: false,
        }),
        fields: [
          {
            type: "string",
            name: "title",
            label: "หัวข้อบทความ",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "คำอธิบาย SEO",
            required: true,
            ui: {
              component: "textarea",
            },
          },
          {
            type: "datetime",
            name: "pubDate",
            label: "วันที่เผยแพร่",
            required: true,
          },
          {
            type: "datetime",
            name: "updatedDate",
            label: "วันที่แก้ไขล่าสุด",
            required: false,
          },
          {
            type: "string",
            name: "category",
            label: "หมวดหมู่",
            required: true,
            options: ["ประกันสุขภาพ", "ประกันชีวิต", "วางแผนการเงิน", "ภาษี"],
          },
          {
            type: "string",
            name: "readingTime",
            label: "เวลาอ่าน",
            required: true,
          },
          {
            type: "string",
            name: "coverLabel",
            label: "ข้อความบนภาพการ์ด",
            required: true,
          },
          {
            type: "string",
            name: "coverTone",
            label: "โทนสีการ์ด",
            required: true,
            options: [
              { label: "กรมท่า", value: "navy" },
              { label: "แดง", value: "red" },
              { label: "เขียวอมฟ้า", value: "teal" },
            ],
          },
          {
            type: "boolean",
            name: "featured",
            label: "แนะนำบนหน้าแรก",
          },
          {
            type: "rich-text",
            name: "body",
            label: "เนื้อหาบทความ",
            isBody: true,
          },
        ],
      },
    ],
  },
});
