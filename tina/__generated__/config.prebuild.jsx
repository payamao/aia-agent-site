// tina/config.ts
import { defineConfig } from "tinacms";
var branch = process.env.TINA_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.CF_PAGES_BRANCH || process.env.HEAD || "main";
var config_default = defineConfig({
  branch,
  clientId: process.env.TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public"
    }
  },
  schema: {
    collections: [
      {
        name: "blog",
        label: "\u0E1A\u0E17\u0E04\u0E27\u0E32\u0E21",
        path: "src/content/blog",
        format: "md",
        defaultItem: () => ({
          title: "\u0E1A\u0E17\u0E04\u0E27\u0E32\u0E21\u0E43\u0E2B\u0E21\u0E48",
          description: "\u0E2A\u0E23\u0E38\u0E1B\u0E1A\u0E17\u0E04\u0E27\u0E32\u0E21\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A SEO",
          pubDate: (/* @__PURE__ */ new Date()).toISOString(),
          category: "\u0E1B\u0E23\u0E30\u0E01\u0E31\u0E19\u0E2A\u0E38\u0E02\u0E20\u0E32\u0E1E",
          readingTime: "\u0E2D\u0E48\u0E32\u0E19 5 \u0E19\u0E32\u0E17\u0E35",
          coverLabel: "\u0E1B\u0E23\u0E30\u0E01\u0E31\u0E19\u0E2A\u0E38\u0E02\u0E20\u0E32\u0E1E",
          coverTone: "navy",
          featured: false
        }),
        fields: [
          {
            type: "string",
            name: "title",
            label: "\u0E2B\u0E31\u0E27\u0E02\u0E49\u0E2D\u0E1A\u0E17\u0E04\u0E27\u0E32\u0E21",
            isTitle: true,
            required: true
          },
          {
            type: "string",
            name: "description",
            label: "\u0E04\u0E33\u0E2D\u0E18\u0E34\u0E1A\u0E32\u0E22 SEO",
            required: true,
            ui: {
              component: "textarea"
            }
          },
          {
            type: "datetime",
            name: "pubDate",
            label: "\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E40\u0E1C\u0E22\u0E41\u0E1E\u0E23\u0E48",
            required: true
          },
          {
            type: "datetime",
            name: "updatedDate",
            label: "\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E41\u0E01\u0E49\u0E44\u0E02\u0E25\u0E48\u0E32\u0E2A\u0E38\u0E14",
            required: false
          },
          {
            type: "string",
            name: "category",
            label: "\u0E2B\u0E21\u0E27\u0E14\u0E2B\u0E21\u0E39\u0E48",
            required: true,
            options: ["\u0E1B\u0E23\u0E30\u0E01\u0E31\u0E19\u0E2A\u0E38\u0E02\u0E20\u0E32\u0E1E", "\u0E1B\u0E23\u0E30\u0E01\u0E31\u0E19\u0E0A\u0E35\u0E27\u0E34\u0E15", "\u0E27\u0E32\u0E07\u0E41\u0E1C\u0E19\u0E01\u0E32\u0E23\u0E40\u0E07\u0E34\u0E19", "\u0E20\u0E32\u0E29\u0E35"]
          },
          {
            type: "string",
            name: "readingTime",
            label: "\u0E40\u0E27\u0E25\u0E32\u0E2D\u0E48\u0E32\u0E19",
            required: true
          },
          {
            type: "string",
            name: "coverLabel",
            label: "\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E1A\u0E19\u0E20\u0E32\u0E1E\u0E01\u0E32\u0E23\u0E4C\u0E14",
            required: true
          },
          {
            type: "string",
            name: "coverTone",
            label: "\u0E42\u0E17\u0E19\u0E2A\u0E35\u0E01\u0E32\u0E23\u0E4C\u0E14",
            required: true,
            options: [
              { label: "\u0E01\u0E23\u0E21\u0E17\u0E48\u0E32", value: "navy" },
              { label: "\u0E41\u0E14\u0E07", value: "red" },
              { label: "\u0E40\u0E02\u0E35\u0E22\u0E27\u0E2D\u0E21\u0E1F\u0E49\u0E32", value: "teal" }
            ]
          },
          {
            type: "boolean",
            name: "featured",
            label: "\u0E41\u0E19\u0E30\u0E19\u0E33\u0E1A\u0E19\u0E2B\u0E19\u0E49\u0E32\u0E41\u0E23\u0E01"
          },
          {
            type: "rich-text",
            name: "body",
            label: "\u0E40\u0E19\u0E37\u0E49\u0E2D\u0E2B\u0E32\u0E1A\u0E17\u0E04\u0E27\u0E32\u0E21",
            isBody: true
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
