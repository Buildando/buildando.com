/**
 * THE configuration surface (REQ-009, REQ-030).
 *
 * This is the ONLY file a forker must edit, plus the logo/favicon assets it
 * points at. Every identity-bearing value — name, domain, author, colors,
 * social links, navigation, and the giscus/analytics integration ids — lives
 * here. Nothing outside this file may hardcode any of these values.
 *
 * Fork checklist:
 *   1. Edit the values in this file.
 *   2. Replace public/favicon.svg and the logo asset.
 *   3. Fill GISCUS from https://giscus.app after enabling Discussions.
 *   4. Set the GitHub Actions deploy secrets (see .github/workflows/deploy.yml).
 */

export const SITE = {
  /** Brand name, shown in the header and used across SEO output. */
  name: "Buildando",
  /** Used as the <title> suffix and the site-level SEO title. */
  title: "Buildando — por Fernando Teixeira",
  /** Default meta description when a page provides none. */
  description:
    "Boas práticas de desenvolvimento de software, orientação a objetos e o ofício de escrever bom código.",
  /** Canonical origin. Every absolute SEO URL derives from this (REQ-018). No trailing slash. */
  url: "https://buildando.com",
  /** Default author, used when a post omits `author`. */
  author: "Fernando Teixeira",
  /** Fallback BCP-47 tag. Per-page language comes from I18N below. */
  locale: "pt-BR",
  ogLocale: "pt_BR",
  /** Fallback social preview image (absolute path under /). Used when a post has no cover. */
  defaultOgImage: "/og-default.svg",
  /** Logo asset served from /public. */
  logo: "/favicon.svg",
} as const;

/**
 * Design tokens. Injected as CSS custom properties by BaseLayout (REQ-009).
 * Two palettes: `light` is the base, `dark` overrides under
 * prefers-color-scheme: dark. No toggle, no JS — the OS preference decides.
 * Fonts are self-hosted (Fontsource), so there is no external request.
 */
export const BRAND = {
  colors: {
    light: {
      bg: "#ffffff",
      surface: "#f6f7f9",
      text: "#141821",
      muted: "#5b6472",
      accent: "#2f6df6",
      accentContrast: "#ffffff",
      border: "#e6e9ef",
    },
    dark: {
      bg: "#0d0f14",
      surface: "#161a22",
      text: "#e7eaf0",
      muted: "#98a1b3",
      accent: "#6ea0ff",
      accentContrast: "#0d0f14",
      border: "#232936",
    },
  },
  fonts: {
    body: '"Inter Variable", system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
    heading:
      '"Space Grotesk Variable", "Inter Variable", system-ui, sans-serif',
    mono: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
  },
  /** Max content width for the reading column. */
  contentWidth: "46rem",
} as const;

/** Social profile links, rendered in the footer. Remove or add freely. */
export const SOCIAL = [
  { label: "GitHub", href: "https://github.com/Buildando" },
  { label: "Instagram", href: "https://www.instagram.com/buildando" },
  { label: "Threads", href: "https://www.threads.net/@buildando" },
  { label: "X", href: "https://x.com/buildando" },
  { label: "TikTok", href: "https://www.tiktok.com/@buildando" },
  { label: "Facebook", href: "https://www.facebook.com/buildando" },
] as const;

/**
 * Header navigation. `key` is a translation key (see src/i18n/ui.ts); `path` is
 * locale-agnostic and gets prefixed with the active locale at render.
 */
export const NAV = [
  { key: "nav.home", path: "/" },
  { key: "nav.search", path: "/search" },
  { key: "nav.about", path: "/about" },
] as const;

/**
 * giscus / GitHub Discussions (REQ-022–REQ-024).
 * Get repoId and categoryId from https://giscus.app after:
 *   - making the repo public,
 *   - enabling Discussions,
 *   - installing the giscus GitHub App.
 * Leave `repoId` empty to disable the embed until configured.
 */
export const GISCUS = {
  repo: "Buildando/buildando.com",
  repoId: "",
  category: "Comentários",
  categoryId: "",
  /** Deterministic post→thread mapping (REQ-024). "pathname" maps by URL path. */
  mapping: "pathname",
  reactionsEnabled: "1",
  theme: "preferred_color_scheme",
  lang: "pt",
} as const;

/**
 * Optional newsletter signup (REQ-039). Delegated to an email provider — no
 * backend. Empty `actionUrl` disables the form (nothing is rendered).
 *
 * Buttondown: set `actionUrl` to
 *   https://buttondown.com/api/emails/embed-subscribe/<your-username>
 * and, in the Buttondown dashboard, enable RSS-to-email pointing at your public
 * feed (e.g. https://your-domain/pt/rss.xml) so new posts are emailed automatically.
 * Other providers work too — paste their form endpoint and set `emailField` to the
 * field name they expect (Buttondown: "email", Mailchimp: "EMAIL").
 */
export const NEWSLETTER = {
  actionUrl: "",
  emailField: "email",
} as const;

/**
 * Optional analytics and ads (REQ-038). Every field is disabled by default: an
 * empty value emits no script and makes no third-party request, so the template
 * ships analytics- and ads-free. Enabling Google Analytics or AdSense brings
 * cookie and consent obligations that are the blog owner's responsibility.
 */
export const ANALYTICS = {
  /** Privacy-friendly analytics domain (Plausible). Empty disables it. */
  plausible: "",
  /** Google Analytics 4 Measurement ID, e.g. "G-XXXXXXXXXX". Empty disables it. */
  googleAnalytics: "",
  /** Google AdSense publisher id, e.g. "ca-pub-0000000000000000". Empty disables it. */
  adsense: "",
} as const;

/**
 * Color theme (REQ-031). `default` is the theme a first-time visitor sees; the
 * reader can switch with the header toggle and the choice is remembered. Set
 * `allowToggle: false` to lock the site to `default` and hide the toggle.
 */
export const THEME = {
  default: "dark" as "dark" | "light",
  allowToggle: true,
} as const;

/**
 * Posts per listing page — home, tag, and category (REQ-037).
 * `0` shows every post on one page, which keeps the home facet filter (REQ-035)
 * available — the right default for small and medium blogs. A positive number
 * splits listings into pre-rendered, crawlable numbered pages with prev/next
 * navigation; at that scale faceted browsing moves to the per-facet pages and
 * search, and the home filter is shown only when a listing fits on one page.
 */
export const POSTS_PER_PAGE = 0;

/**
 * Internationalization (REQ-032). Add or remove locales here — the routes, the
 * language switcher, and hreflang follow. UI strings live in `src/i18n/ui.ts`;
 * a post declares its language with the `lang` frontmatter field.
 */
export const I18N = {
  defaultLocale: "pt",
  locales: [
    { code: "pt", label: "Português", htmlLang: "pt-BR", ogLocale: "pt_BR" },
    { code: "en", label: "English", htmlLang: "en", ogLocale: "en_US" },
  ],
} as const;

export type LocaleCode = (typeof I18N.locales)[number]["code"];
