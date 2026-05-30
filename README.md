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

Cloudflare build settings:

```bash
Build command: npm run build
Build output directory: dist
Node version: 22 or newer
```

For the Astro Cloudflare adapter, create a KV namespace named for sessions and bind it as `SESSION` in Cloudflare Pages project settings. The site does not use sessions directly, but the current adapter config expects this binding.

The build script supports two phases:

- Without Tina Cloud credentials, it deploys the public website and `/api/lead`.
- With `TINA_PUBLIC_CLIENT_ID` and `TINA_TOKEN`, it also builds the Tina Cloud admin at `/admin`.

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

## Content

Blog posts live in `src/content/blog/*.md`. Tina Cloud edits these files through Git, so connect the repository and branch in Tina Cloud, then set the matching branch in `TINA_PUBLIC_BRANCH`.

## Deploy Checklist

1. Push this repository to GitHub.
2. Create a Cloudflare Pages project from the repo.
3. Set `PUBLIC_SITE_URL` to the production URL before the first production build.
4. Create a Cloudflare KV namespace and bind it as `SESSION`.
5. Add LINE/Resend secrets if lead notifications should go live immediately.
6. Connect the repo in Tina Cloud free tier and add Tina env vars when ready.

### Recommended Dashboard Flow

Because this project directory is not a Git repository yet, the cleanest deploy path is:

```bash
git init
git add .
git commit -m "Initial AIA agent site"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

Then create a Cloudflare Pages project from that GitHub repo. Cloudflare will run `npm run build` on every push.

### Required Cloudflare Bindings

In Cloudflare Pages project settings, add:

- KV namespace binding: `SESSION`
- Environment variable: `PUBLIC_SITE_URL`
- Optional lead notification secrets: `LINE_CHANNEL_ACCESS_TOKEN`, `LINE_TO_ID`, `RESEND_API_KEY`, `LEAD_EMAIL_TO`, `LEAD_EMAIL_FROM`
- Tina Cloud vars when ready: `TINA_PUBLIC_CLIENT_ID`, `TINA_TOKEN`, `TINA_PUBLIC_BRANCH`
