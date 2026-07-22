import { getCollection, type CollectionEntry } from "astro:content";
import { planPostRoutes } from "./post-routes";

export type Post = CollectionEntry<"posts">;

/**
 * Published posts, newest first. In production, drafts are excluded from every
 * listing, facet, feed, and the sitemap (REQ-007). In `astro dev`,
 * `import.meta.env.PROD` is false, so drafts remain visible. Pass a `lang` to
 * restrict to one locale (REQ-032).
 */
export async function getPublishedPosts(lang?: string): Promise<Post[]> {
  const posts = await getCollection("posts", ({ data }) => {
    const published = import.meta.env.PROD ? data.draft !== true : true;
    return published && (lang ? data.lang === lang : true);
  });
  return posts.sort(
    (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf(),
  );
}

/** Distinct tag → posts for a locale, discovered from published content (REQ-019). */
export async function getTags(lang: string): Promise<Map<string, Post[]>> {
  const posts = await getPublishedPosts(lang);
  const map = new Map<string, Post[]>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      (map.get(tag) ?? map.set(tag, []).get(tag)!).push(post);
    }
  }
  return map;
}

/** Distinct category → posts for a locale, discovered from published content (REQ-019). */
export async function getCategories(lang: string): Promise<Map<string, Post[]>> {
  const posts = await getPublishedPosts(lang);
  const map = new Map<string, Post[]>();
  for (const post of posts) {
    const category = post.data.category;
    if (!category) continue;
    (map.get(category) ?? map.set(category, []).get(category)!).push(post);
  }
  return map;
}

/** Canonical (own-language) URL for a post (REQ-032). */
export function postPath(post: Post): string {
  return `/${post.data.lang}/posts/${post.slug}/`;
}

/**
 * Posts grouped by publication year then month for the archive (REQ-041).
 * Returns `year -> (month -> posts)`, using UTC parts so it matches the ISO date
 * used elsewhere. Callers sort the keys as they render.
 */
export async function getArchive(
  lang: string,
): Promise<Map<number, Map<number, Post[]>>> {
  const posts = await getPublishedPosts(lang); // newest first
  const years = new Map<number, Map<number, Post[]>>();
  for (const post of posts) {
    const d = post.data.publishDate;
    const year = d.getUTCFullYear();
    const month = d.getUTCMonth() + 1; // 1..12
    const months = years.get(year) ?? years.set(year, new Map()).get(year)!;
    (months.get(month) ?? months.set(month, []).get(month)!).push(post);
  }
  return years;
}

export interface PostRoute {
  post: Post;
  /** Page/UI locale — may differ from the post's content language on a fallback page. */
  uiLang: string;
  /** Header language switcher targets: every locale → best URL for this post (REQ-033). */
  langSwitch: Record<string, string>;
  /** hreflang alternates — only real language versions, not fallback pages. */
  alternates: { hreflang: string; href: string }[];
  /** URL this page's canonical points to (self, or the source post for fallbacks). */
  canonicalPath: string;
}

/**
 * Every post-page route (REQ-032, REQ-033). For each post we emit:
 *  - its canonical route `/{postLang}/posts/{slug}/`;
 *  - a fallback route `/{L}/posts/{slug}/` for every locale L that has NO real
 *    translation of this post — same content, but the whole page chrome in L.
 * A locale that has a real translation is served by that translation's own
 * canonical instead, so switching language there lands on the translated post.
 */
export async function getPostRoutes(): Promise<
  { params: { lang: string; slug: string }; props: PostRoute }[]
> {
  const posts = await getPublishedPosts();
  const byKey = new Map<string, Post>();
  for (const p of posts) byKey.set(`${p.data.lang}:${p.slug}`, p);

  const plans = planPostRoutes(
    posts.map((p) => ({
      lang: p.data.lang,
      slug: p.slug,
      translations: p.data.translations,
    })),
  );

  return plans.map((r) => ({
    params: r.params,
    props: {
      post: byKey.get(r.sourceKey)!,
      uiLang: r.uiLang,
      langSwitch: r.langSwitch,
      alternates: r.alternates,
      canonicalPath: r.canonicalPath,
    },
  }));
}
