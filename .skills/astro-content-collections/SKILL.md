---
name: astro-content-collections
description: Use when modeling markdown content in Astro as a typed collection — per-post folder with colocated images, a Zod frontmatter schema validated at build, draft filtering, and generating pages/facets from content.
---

# Astro Content Collections

Technique for turning a directory of markdown into typed, validated content.

## Collection and schema

Declare the collection and its frontmatter schema in `src/content/config.ts`. Use
the `image()` helper (from the schema context) for colocated images so they enter
the asset pipeline and get optimized:

```ts
import { defineCollection, z } from "astro:content";
const posts = defineCollection({
  type: "content",
  schema: ({ image }) => z.object({
    title: z.string(),
    publishDate: z.coerce.date(),   // coerce parses YAML dates/strings
    cover: image().optional(),      // colocated image → ImageMetadata
    draft: z.boolean().default(false),
  }),
});
export const collections = { posts };
```

- A missing required field or wrong type **fails the build** and names the entry.
- `z.coerce.date()` accepts `2026-07-20` in frontmatter.
- Give every optional field a `.default(...)` or `.optional()` so the fallback is explicit.

## Per-post folder

One directory per entry: `src/content/posts/<slug>/index.md` plus colocated images.
The directory name is the `slug` and the URL segment. Reference images relatively
(`cover: ./cover.png`); the schema's `image()` resolves and optimizes them.

## Querying

```ts
const posts = await getCollection("posts", ({ data }) =>
  import.meta.env.PROD ? !data.draft : true   // drafts only in dev
);
```

`import.meta.env.PROD` is the clean draft gate: excluded from prod, visible in `astro dev`.

## Rendering and pages

- Page per post: `getStaticPaths()` maps entries to `{ params: { slug }, props: { post } }`,
  then `const { Content } = await post.render()` renders the body.
- Facets (tags/categories): build a `Map<value, posts[]>` from the collection and
  emit one `getStaticPaths` route per distinct value. Facet values are discovered
  from content, not from a registry.

## Gotchas

- Colocated images used with `<Image widths={[...]}>` must be raster (PNG/JPG);
  SVG is passed through unprocessed, so `widths` has nothing to resample.
- Import content utilities from `astro:content`, images from `astro:assets`.
- `slug` comes from the folder name; renaming the folder changes the URL.
