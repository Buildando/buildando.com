---
name: astro-seo-metadata
description: Use when emitting per-page SEO for a static Astro site — title, description, canonical, Open Graph, Twitter Card, JSON-LD structured data, sitemap, robots.txt, and RSS, with absolute URLs derived from one configured origin.
---

# Astro SEO Metadata

Technique for making SEO a build output, emitted for every page automatically.

## One origin, absolute URLs

Set `site` in `astro.config` from the single config surface, and derive every
absolute URL from it so the domain is never duplicated:

```ts
export function absoluteUrl(path: string) { return new URL(path, SITE.url).toString(); }
```

Canonical, `og:url`, `og:image`, sitemap, and RSS links must all be absolute.

## Head component

A `BaseHead.astro` takes `title`, `description`, `path`, `image`, `type`, dates,
and emits:

- `<title>`, `<meta name="description">`, `<link rel="canonical">`
- Open Graph: `og:type` (`article` for posts), `og:title/description/url/image/site_name/locale`
- Twitter Card: `summary_large_image` + title/description/image
- `<link rel="alternate" type="application/rss+xml">` for feed autodiscovery
- JSON-LD via `<script type="application/ld+json" set:html={JSON.stringify(data)}>`
  — `BlogPosting` for posts, `WebSite` for the site.

Resolve the social image: colocated `cover`/`ogImage` → its `.src` (already
hashed absolute); a string override → pass through; else a site default.

## Sitemap and robots

- `@astrojs/sitemap` integration auto-generates `sitemap-index.xml` from built
  pages. Drafts never become pages, so they are excluded for free.
- `robots.txt` as a route (`src/pages/robots.txt.ts`) returning `User-agent` +
  `Sitemap: <absolute sitemap-index.xml>`.

## RSS

`@astrojs/rss` in `src/pages/rss.xml.js`: pass `context.site`, map published
posts to items with absolute-resolvable `link`, `pubDate`, `description`. On an
i18n site the feed is **per locale** (`/pt/rss.xml`, `/en/rss.xml`) — one route
per language, each listing only that language's posts — so there is no root
`/rss.xml`; point autodiscovery and any tests at the localized paths.

## Performance is SEO

Ship zero client JS on content pages (Astro's default). Load anything interactive
(search, comments) as an island so Core Web Vitals stay green. Fast pages rank.

## Verify from built HTML

Grep `dist/**/index.html` for the tags; assert `og:image` and canonical are
absolute under the configured domain; assert `sitemap`, `robots.txt`, `rss.xml`
exist and list only published posts.
