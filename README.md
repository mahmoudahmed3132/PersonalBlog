# Mahmoud Halim Portfolio

Minimal personal portfolio and MDX blog for a cybersecurity engineer. The site is built with Next.js App Router, TypeScript, Tailwind CSS, and repository-managed content.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Useful commands:

```bash
npm run lint
npm run build
npm run build:github
npm run preview:static
npm run import:content
```

`npm run preview:static` serves the exported `out/` folder after a build.

## Edit Personal Data

Most profile and site data lives in:

```text
src/lib/site-config.ts
```

Edit that file to update:

- Site name, title, description, URL, location, and email
- Social links
- Header, footer, and command palette links
- Experience entries
- Project entries
- Development and personal page links

Set the deployed URL in `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Add a Blog Post

Create a new `.mdx` file in `content/blog`:

```text
content/blog/my-new-post.mdx
```

Use this frontmatter:

```mdx
---
title: "My New Post"
description: "A short description for lists, RSS, and SEO."
publishedAt: "2026-04-27"
updatedAt: "2026-04-28"
tags:
  - Detection Engineering
  - DFIR
draft: false
---

Write the post here.
```

Draft posts are hidden in production builds when `draft: true`.

## Import Medium Posts

Medium is integrated through the public RSS feed:

```bash
npm run import:medium
```

This creates local MDX entries in `content/blog` with the title, summary, dates, tags, canonical URL, and a link back to the full Medium article. The default import keeps Medium as the canonical source instead of duplicating long lab walkthroughs.

## Import GitHub Projects

Public repositories are imported from:

```text
https://github.com/mahmoudahmed3132
```

Refresh them with:

```bash
npm run import:github
```

The generated project data is written to `src/lib/generated-projects.ts`.

## Content Workflow

There is no external CMS. GitHub is the content backend:

1. Add or edit MDX files under `content/blog`.
2. Commit the changes.
3. Push to GitHub.
4. Vercel or GitHub Pages rebuilds and publishes the updated static pages.

## Project Structure

```text
content/blog              Blog posts in MDX
public                    Static assets
src/app                   App Router pages and route handlers
src/components            Shared UI and interactive components
src/lib                   Site config and blog loading logic
```

## Deploy to Vercel

1. Push the repository to GitHub.
2. Import the repository in Vercel.
3. Add `NEXT_PUBLIC_SITE_URL` with your production URL.
4. Deploy.

Vercel is the primary target and requires no special static export setup.

## GitHub Pages Notes

GitHub Pages hosting is already configured through:

```text
.github/workflows/deploy-github-pages.yml
```

The site is exported as static files to `out/` during `npm run build`, then GitHub Actions deploys that folder to Pages.

Recommended setup:

1. Create a GitHub repository.
   - For a root site at `https://mahmoudahmed3132.github.io`, name it `mahmoudahmed3132.github.io`.
   - For a project site, any repo name works, for example `portfolio`.
2. Push this project to that repository.
3. In GitHub, open the repository settings.
4. Go to **Settings → Pages**.
5. Under **Build and deployment**, set **Source** to **GitHub Actions**.
6. Push to `main` or `master`; the workflow will deploy automatically.

For a project repo, the workflow automatically sets the correct base path, for example:

```text
https://mahmoudahmed3132.github.io/portfolio
```

For a custom domain or unusual repo setup, add repository variables:

```text
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_BASE_PATH=/your-repo-name
```

Leave `NEXT_PUBLIC_BASE_PATH` empty for `mahmoudahmed3132.github.io` or a custom root domain.

## Replace Placeholders

- Update email in `src/lib/site-config.ts`.
- Refresh imported Medium posts and GitHub projects with `npm run import:content`.
