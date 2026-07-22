# Integrations (ports & adapters)

Third-party integrations sit behind a **port**: a small component the app imports
instead of any specific provider. Each provider is an **adapter** in its own
folder, and only the selected/enabled adapter's output ships. This is what keeps
the template generic — and easy to contribute to: bring your own tech as an
adapter without touching the rest.

Ported so far: **comments**, **search**, **analytics**.

```text
src/config/site.ts          # INTEGRATIONS names the providers
src/integrations/
  Comments.astro            # PORT (pick one: giscus | utterances | none)
  comments/giscus/…
  comments/utterances/…
  Search.astro              # PORT (pick one: pagefind | none)
  search/pagefind/…
  Analytics.astro           # PORT (multi-enable: any of plausible/GA/AdSense)
  analytics/plausible/…
  analytics/google-analytics/…
  analytics/adsense/…
  analytics/ConsentBanner.astro   # shared, provider-agnostic consent coordinator
```

## Patterns

- **Pick-one** (comments, search): the port renders the one adapter named in
  `INTEGRATIONS`. Swap = change the name; the adapter folder must exist.
- **Multi-enable** (analytics): the port renders every adapter, each self-guarding
  on its own config, so it emits whatever is set and nothing when nothing is.
  Cookie-setting adapters (GA, AdSense) register a loader on
  `window.__consentLoaders`; the `ConsentBanner` runs the queue after consent (or
  immediately when consent is not required) — so consent is provider-agnostic.

## Contributing an adapter

1. Create `src/integrations/<kind>/<name>/<Name>.astro`. Make it **self-contained**
   and render **nothing** when its own config is empty (keeps the zero-JS default).
   Read only your own config block. For UI widgets, load lazily.
2. Add a config block in `src/config/site.ts` (like `GISCUS`, `UTTERANCES`,
   `ANALYTICS`) and, for pick-one kinds, extend the `INTEGRATIONS` doc comment.
3. Register it in the port (`Comments.astro` / `Search.astro` / `Analytics.astro`):
   import it and add a branch/line. For a new cookie-setting analytics provider,
   register a `__consentLoaders` loader and include it in the port's `gated` check.

## Build-time integrations (single-file seams)

Not render-time components — swap each where it lives:

| Integration | Where to swap |
| --- | --- |
| Search **index** | the `build` script in `package.json` (Pagefind CLI) |
| RSS | `src/pages/[lang]/rss.xml.js` |
| Sitemap | `astro.config.ts` |
| OG images | `src/pages/og/[...route].ts` |
| Deploy | `.github/workflows/deploy.yml` |

Newsletter and share already read a provider-agnostic config (`NEWSLETTER.actionUrl`,
`SHARE`), so they need no port.
