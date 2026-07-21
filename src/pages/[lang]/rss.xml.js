import rss from "@astrojs/rss";
import { SITE } from "../../config/site";
import { getPublishedPosts, postPath } from "../../lib/posts";
import { locales, localeMeta, siteDescription } from "../../i18n";

// One RSS feed per locale (REQ-016, REQ-032). Drafts excluded via getPublishedPosts.
export function getStaticPaths() {
  return locales.map((lang) => ({ params: { lang } }));
}

export async function GET(context) {
  const lang = context.params.lang;
  const posts = await getPublishedPosts(lang);
  return rss({
    title: SITE.name,
    description: siteDescription(lang),
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishDate,
      link: postPath(post),
      categories: post.data.tags,
    })),
    customData: `<language>${localeMeta(lang).htmlLang}</language>`,
  });
}
