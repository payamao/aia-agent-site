# AIA Agent Site

Astro + Tailwind frontend, SEO blog, Tina Cloud CMS, and a Cloudflare-hosted lead form API.

## Stack

- Frontend: Astro + Tailwind CSS
- Blog: Astro content collections, prerendered for SEO
- CMS: Tina Cloud free tier, admin built to `/admin`
- Hosting: Cloudflare Pages / Workers via `@astrojs/cloudflare`
- Lead form: `/api/lead` sends to LINE Messaging API and/or email via Resend

## Local Development

```bash
npm install
npm run dev
```

Use Tina locally with:

```bash
npm run tina:dev
```

## Environment Variables

Copy `.env.example` to `.env` for local work. In Cloudflare Pages, add the same values under project environment variables/secrets.

Required for Tina Cloud production admin:

```bash
TINA_PUBLIC_CLIENT_ID=...
TINA_TOKEN=...
TINA_PUBLIC_BRANCH=main
```

Required for form notifications:

```bash
LINE_CHANNEL_ACCESS_TOKEN=...
LINE_TO_ID=...
RESEND_API_KEY=...
LEAD_EMAIL_TO=...
LEAD_EMAIL_FROM=AIA Agent <leads@your-domain.com>
```

`LINE Notify` is not used because it ended service on March 31, 2025. This project uses LINE Messaging API push messages instead.

## Cloudflare Deploy

Live URL:

```bash
https://aia-agent-site.pages.dev
```

Cloudflare Pages project:

```bash
aia-agent-site
```

This repo deploys with GitHub Actions using Direct Upload to the existing Cloudflare Pages project. Add these GitHub repository secrets before relying on automatic deploys:

```bash
CLOUDFLARE_API_TOKEN=...
CLOUDFLARE_ACCOUNT_ID=389594342d2a1d5bef76a38515c33950
```

The Cloudflare Pages project already has:

```bash
PUBLIC_SITE_URL=https://aia-agent-site.pages.dev
SESSION KV namespace binding
```

The build script supports two phases:

- Without Tina Cloud credentials, it deploys the public website and `/api/lead`.
- With `TINA_PUBLIC_CLIENT_ID`, `TINA_TOKEN`, and `TINA_PUBLIC_BRANCH`, it also builds the Tina Cloud admin at `/admin`.

Local build without Tina Cloud credentials:

```bash
PUBLIC_SITE_URL=https://your-domain.com npm run build
```

Full production build with Tina Cloud admin:

```bash
npm run build
```

Manual deploy with Wrangler:

```bash
export CLOUDFLARE_API_TOKEN=...
export CLOUDFLARE_ACCOUNT_ID=...
PUBLIC_SITE_URL=https://your-domain.com npm run deploy:cloudflare
```

## GitHub Actions

The workflow at `.github/workflows/deploy-cloudflare.yml` runs on every push to `main`.

Required GitHub secrets:

```bash
CLOUDFLARE_API_TOKEN=...
CLOUDFLARE_ACCOUNT_ID=389594342d2a1d5bef76a38515c33950
```

Optional GitHub secrets for Tina Cloud admin builds:

```bash
TINA_PUBLIC_CLIENT_ID=...
TINA_TOKEN=...
```

## Content

Blog posts live in `src/content/blog/*.md`. Tina Cloud edits these files through Git, so connect the repository and branch in Tina Cloud, then set the matching branch in `TINA_PUBLIC_BRANCH`.

## Deploy Checklist

1. Repository is pushed to GitHub: `https://github.com/payamao/aia-agent-site`.
2. Cloudflare Pages project is live: `https://aia-agent-site.pages.dev`.
3. Add GitHub Actions secrets for automatic deploys.
4. Connect the repo in Tina Cloud free tier and add Tina env vars when ready.
5. Add LINE/Resend secrets if lead notifications should go live immediately.

### Required Cloudflare Bindings

In Cloudflare Pages project settings:

- KV namespace binding: `SESSION`
- Environment variable: `PUBLIC_SITE_URL`
- Optional lead notification secrets: `LINE_CHANNEL_ACCESS_TOKEN`, `LINE_TO_ID`, `RESEND_API_KEY`, `LEAD_EMAIL_TO`, `LEAD_EMAIL_FROM`
