/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  readonly TINA_PUBLIC_CLIENT_ID?: string;
  readonly TINA_PUBLIC_BRANCH?: string;
  readonly LINE_CHANNEL_ACCESS_TOKEN?: string;
  readonly LINE_TO_ID?: string;
  readonly RESEND_API_KEY?: string;
  readonly LEAD_EMAIL_TO?: string;
  readonly LEAD_EMAIL_FROM?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

type CloudflareEnv = {
  LINE_CHANNEL_ACCESS_TOKEN?: string;
  LINE_TO_ID?: string;
  RESEND_API_KEY?: string;
  LEAD_EMAIL_TO?: string;
  LEAD_EMAIL_FROM?: string;
};

type Runtime = import("@astrojs/cloudflare").Runtime<CloudflareEnv>;

declare namespace App {
  interface Locals extends Runtime {}
}
