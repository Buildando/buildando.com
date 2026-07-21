import type { APIRoute } from "astro";
import { absoluteUrl } from "../lib/seo";

// robots.txt referencing the sitemap (REQ-015).
export const GET: APIRoute = () =>
  new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl("/sitemap-index.xml")}\n`,
    { headers: { "Content-Type": "text/plain" } },
  );
