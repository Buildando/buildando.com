import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { SITE, I18N } from "./src/config/site";

const locales = I18N.locales.map((l) => l.code);

// `site` is read from THE configuration surface so the domain is not duplicated
// anywhere else (REQ-018, REQ-030). Sitemap and RSS derive absolute URLs from it.
export default defineConfig({
  site: SITE.url,
  trailingSlash: "ignore",
  // Every locale is prefixed (/pt/, /en/); the root redirects to the default (REQ-032).
  i18n: {
    defaultLocale: I18N.defaultLocale,
    locales,
    routing: { prefixDefaultLocale: true },
  },
  redirects: {
    "/": `/${I18N.defaultLocale}/`,
  },
  integrations: [
    // Auto-generated sitemap.xml, drafts excluded because they never become pages (REQ-014).
    sitemap({
      i18n: {
        defaultLocale: I18N.defaultLocale,
        locales: Object.fromEntries(
          I18N.locales.map((l) => [l.code, l.htmlLang]),
        ),
      },
    }),
  ],
  build: {
    // Emit /posts/slug/index.html — clean URLs that Apache/HostGator serves directly.
    format: "directory",
  },
  markdown: {
    // Dual Shiki themes: light + dark; the active one is chosen in global.css by
    // the [data-theme] attribute the toggle sets (REQ-031).
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark-dimmed" },
      wrap: false,
    },
  },
});
