import { getCollection, type CollectionEntry } from "astro:content";
import { locales, defaultLocale, localeMeta } from "../i18n";
import { absoluteUrl } from "./seo";

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
  const index = new Map<string, Post>();
  for (const p of posts) index.set(`${p.data.lang}:${p.slug}`, p);

  const routes: { params: { lang: string; slug: string }; props: PostRoute }[] =
    [];

  for (const post of posts) {
    // Real language versions of this post: itself, plus declared translations
    // that actually exist as published posts (a stale link is ignored).
    const real: Record<string, string> = { [post.data.lang]: post.slug };
    for (const L of locales) {
      if (L === post.data.lang) continue;
      const tslug = post.data.translations?.[L];
      if (tslug && index.has(`${L}:${tslug}`)) real[L] = tslug;
    }

    // Switcher: every locale gets a URL. Real version if it exists, otherwise a
    // fallback to this very post (kept as-is, page chrome translated).
    const langSwitch: Record<string, string> = {};
    for (const L of locales) {
      langSwitch[L] = real[L]
        ? `/${L}/posts/${real[L]}/`
        : `/${L}/posts/${post.slug}/`;
    }

    // hreflang: only genuine language versions.
    const alternates = Object.entries(real).map(([L, slug]) => ({
      hreflang: localeMeta(L).htmlLang,
      href: absoluteUrl(`/${L}/posts/${slug}/`),
    }));
    const xLang = real[defaultLocale] ? defaultLocale : post.data.lang;
    alternates.push({
      hreflang: "x-default",
      href: absoluteUrl(`/${xLang}/posts/${real[xLang]}/`),
    });

    for (const L of locales) {
      if (L === post.data.lang) {
        routes.push({
          params: { lang: L, slug: post.slug },
          props: {
            post,
            uiLang: L,
            langSwitch,
            alternates,
            canonicalPath: `/${L}/posts/${post.slug}/`,
          },
        });
      } else if (!real[L]) {
        // Fallback page: this post's content, locale L chrome. Its canonical
        // points at the source post so the near-duplicate body is not indexed twice.
        routes.push({
          params: { lang: L, slug: post.slug },
          props: {
            post,
            uiLang: L,
            langSwitch,
            alternates,
            canonicalPath: `/${post.data.lang}/posts/${post.slug}/`,
          },
        });
      }
      // else: a real translation owns `/L/posts/{real[L]}/`; nothing to emit here.
    }
  }

  return routes;
}
