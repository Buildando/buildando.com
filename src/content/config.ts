import { defineCollection, z } from "astro:content";
import { I18N } from "../config/site";

const localeCodes = I18N.locales.map((l) => l.code) as [string, ...string[]];

/**
 * Frontmatter schema (REQ-003, REQ-004). Validated at build; a missing required
 * field or a wrong type fails the build and names the post and field.
 *
 * Required: title, description, publishDate.
 * Everything else has a defined fallback (see the spec's Domain Rules).
 */
const posts = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      // Post language (REQ-032); must be one of the configured locales.
      lang: z.enum(localeCodes).default(I18N.defaultLocale),
      /** Slug of the same post in other locales, for hreflang links. */
      translations: z.record(z.string(), z.string()).optional(),
      publishDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      category: z.string().optional(),
      // Colocated cover image, processed and optimized at build (REQ-006).
      cover: image().optional(),
      coverAlt: z.string().optional(),
      author: z.string().optional(),
      draft: z.boolean().default(false),
      keywords: z.array(z.string()).default([]),
      // Social image override: a colocated image or an absolute path string.
      ogImage: z.union([image(), z.string()]).optional(),
      canonicalURL: z.string().url().optional(),
      // Per-post giscus mapping override (REQ-024).
      discussion: z.string().optional(),
    }),
});

// Home hero (REQ-034): one markdown entry per locale, named `<locale>.md`, whose
// body is rendered into the top of the home page. `title`/`description` here
// override the site defaults for the home page's SEO only.
const home = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const collections = { posts, home };
