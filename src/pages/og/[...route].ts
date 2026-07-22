// Dynamic Open Graph images (REQ-012). Generates a branded social card per post
// at build time — no backend. Only posts WITHOUT a `cover` get one; posts with a
// cover use the cover image. Output: /og/<slug>.png.
import { OGImageRoute } from "astro-og-canvas";
import { BRAND, SITE } from "../../config/site";
import { getPublishedPosts } from "../../lib/posts";

const hex = (h: string): [number, number, number] => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
];
const c = BRAND.colors.dark;

// getPublishedPosts excludes drafts in production (REQ-007), so no card leaks.
const posts = await getPublishedPosts();
const pages = Object.fromEntries(
  posts.filter((p) => !p.data.cover).map((p) => [p.slug, p.data]),
);

export const { getStaticPaths, GET } = await OGImageRoute({
  param: "route",
  pages,
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.category ? `${SITE.name} · ${page.category}` : SITE.name,
    bgGradient: [hex(c.bg), hex(c.surface)],
    border: { color: hex(c.accent), width: 12, side: "inline-start" },
    padding: 60,
    font: {
      title: { color: hex(c.text), weight: "Bold", size: 64 },
      description: { color: hex(c.muted), size: 30 },
    },
  }),
});
