---
name: pagefind-static-search
description: Use when adding full-text search to a static site with no backend — Pagefind indexes built HTML at build time and runs entirely in the browser against static files.
---

# Pagefind (static full-text search)

Technique for client-side search with no server and no per-search cost.

## How it works

Pagefind runs **after** the site build, over the generated HTML: it produces a
compact static index and a small client under `dist/pagefind/`. The browser
downloads only the index fragments it needs, so it scales to many posts without
shipping the whole index to every visitor.

```json
"scripts": { "build": "astro build && pagefind --site dist" }
```

Install `pagefind` as a devDependency. It indexes `**/*.html` in `dist`.

## Wiring the UI

The Pagefind assets exist only in `dist` after the build, never in `astro dev`.
So the loader must not be bundle-resolved — use an **inline** script and a dynamic
import:

```html
<div id="search"></div>
<link rel="stylesheet" href="/pagefind/pagefind-ui.css" />
<script is:inline>
  (async () => {
    try {
      await import("/pagefind/pagefind-ui.js");
      new PagefindUI({ element: "#search", showSubResults: true });
    } catch { /* index only exists after a production build */ }
  })();
</script>
```

`is:inline` is essential: without it, Vite/Rollup tries to resolve
`/pagefind/pagefind-ui.js` at build time and fails, because it does not exist yet.

## Scoping and drafts

- Add `data-pagefind-body` to the main content element to index only that region;
  otherwise Pagefind indexes each page's whole `<body>`.
- Drafts excluded from the build produce no HTML, so they are never indexed — no
  extra step needed.
- Facet filtering can use `data-pagefind-filter` attributes if you want faceted
  search inside Pagefind, but tag/category **pages** are simpler and work JS-off.

## Verify

After `npm run build`, assert `dist/pagefind/pagefind.js` exists and that a known
term resolves to the expected page via the client index.
