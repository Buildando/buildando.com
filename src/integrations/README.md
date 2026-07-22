# Integrations (ports & adapters)

Third-party integrations live behind a **port**: a small component the app imports
instead of any specific provider. The provider is chosen by name in
`src/config/site.ts` under `INTEGRATIONS`, and each provider is an **adapter** in
its own folder. Swapping a provider is a one-word config change; adding one is a
new folder plus one line in the port.

This is what makes the template generic — and easy to contribute to: bring your
own comments/analytics/search tech as an adapter without touching the rest.

## Layout

```text
src/integrations/
  Comments.astro            # PORT: renders the adapter named by INTEGRATIONS.comments
  comments/
    giscus/Giscus.astro     # adapter
    utterances/Utterances.astro
```

## Contributing a comments adapter

1. Create `src/integrations/comments/<name>/<Name>.astro`. It receives
   `{ term?, lang }` and should be **self-contained**: render the whole comments
   section (heading + widget) — or **nothing** when its own config is empty, so an
   unconfigured fork shows no comments UI (keeps the zero-JS default). Load the
   widget lazily on scroll, like the existing adapters.
2. Add its config to `src/config/site.ts` (a block like `GISCUS`/`UTTERANCES`);
   read only your own block.
3. Register it in `src/integrations/Comments.astro`: import it and add a
   `{provider === "<name>" && <Name ... />}` branch. Add `"<name>"` to the
   `INTEGRATIONS.comments` doc comment.

Only the selected adapter renders, so unused ones ship nothing to the browser.

## The other integrations

Some integrations are build-time (not render-time components) and are each a
single, isolated seam — swap them there:

| Integration | Where to swap |
| --- | --- |
| Search index | the `build` script in `package.json` (Pagefind) + the search UI components |
| RSS | `src/pages/[lang]/rss.xml.js` |
| Sitemap | `astro.config.ts` (integration) |
| OG images | `src/pages/og/[...route].ts` |
| Deploy | `.github/workflows/deploy.yml` |

Analytics/consent, newsletter, and share already read a provider-agnostic config
(`ANALYTICS`/`CONSENT`, `NEWSLETTER.actionUrl`, `SHARE`); comments is the first to
move fully behind a port, and the same pattern extends to the others.
