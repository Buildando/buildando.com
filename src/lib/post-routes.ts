// Pure post-routing logic (REQ-032, REQ-033), separated from `astro:content` so
// it is unit-testable without the Astro runtime. `posts.ts` feeds it plain
// descriptors and reattaches the rendered post entry to each planned route.
import { locales, defaultLocale, localeMeta } from "../i18n";
import { absoluteUrl } from "./seo";

export interface PostDescriptor {
  lang: string;
  slug: string;
  translations?: Record<string, string>;
}

export interface PlannedRoute {
  params: { lang: string; slug: string };
  /** `${lang}:${slug}` of the post whose content this route renders. */
  sourceKey: string;
  uiLang: string;
  langSwitch: Record<string, string>;
  alternates: { hreflang: string; href: string }[];
  canonicalPath: string;
}

/**
 * Plan every post-page route. For each post: its canonical route, plus a
 * fallback route for every locale with no real translation (same content,
 * translated chrome). A locale that has a real translation is served by that
 * translation's own canonical, so nothing is emitted for it here.
 *
 * A declared translation counts only if the target post actually exists in the
 * set — a stale link is ignored and degrades to a fallback rather than a 404.
 */
export function planPostRoutes(posts: PostDescriptor[]): PlannedRoute[] {
  const has = new Set(posts.map((p) => `${p.lang}:${p.slug}`));
  const routes: PlannedRoute[] = [];

  for (const post of posts) {
    // Real language versions: itself, plus declared translations that exist.
    const real: Record<string, string> = { [post.lang]: post.slug };
    for (const L of locales) {
      if (L === post.lang) continue;
      const tslug = post.translations?.[L];
      if (tslug && has.has(`${L}:${tslug}`)) real[L] = tslug;
    }

    const langSwitch: Record<string, string> = {};
    for (const L of locales) {
      langSwitch[L] = real[L]
        ? `/${L}/posts/${real[L]}/`
        : `/${L}/posts/${post.slug}/`;
    }

    const alternates = Object.entries(real).map(([L, slug]) => ({
      hreflang: localeMeta(L).htmlLang,
      href: absoluteUrl(`/${L}/posts/${slug}/`),
    }));
    const xLang = real[defaultLocale] ? defaultLocale : post.lang;
    alternates.push({
      hreflang: "x-default",
      href: absoluteUrl(`/${xLang}/posts/${real[xLang]}/`),
    });

    const sourceKey = `${post.lang}:${post.slug}`;
    for (const L of locales) {
      if (L === post.lang) {
        routes.push({
          params: { lang: L, slug: post.slug },
          sourceKey,
          uiLang: L,
          langSwitch,
          alternates,
          canonicalPath: `/${L}/posts/${post.slug}/`,
        });
      } else if (!real[L]) {
        routes.push({
          params: { lang: L, slug: post.slug },
          sourceKey,
          uiLang: L,
          langSwitch,
          alternates,
          canonicalPath: `/${post.lang}/posts/${post.slug}/`,
        });
      }
    }
  }

  return routes;
}
