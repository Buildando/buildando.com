---
name: giscus-discussions
description: Use when embedding GitHub Discussions as a comment box on a static site via giscus — prerequisites, deterministic post-to-thread mapping, lazy loading as an island, and configuring it once.
---

# giscus (GitHub Discussions embed)

Technique for delegating comments to GitHub Discussions with no backend.

## Prerequisites (all required)

- The backing repository is **public**.
- **Discussions** is enabled on it.
- The **giscus GitHub App** is installed on the repo.
- You have `repoId` and `categoryId` from https://giscus.app (they are not the
  human-readable names). Pick a discussions **category** of type Announcement so
  only maintainers open threads.

## Configure once

Keep `repo`, `repoId`, `category`, `categoryId`, `mapping`, `theme`, `lang` in the
single config surface — never per post. Guard the whole section on
`repoId && categoryId` so an unconfigured fork renders nothing — no heading and no
script — rather than a broken widget or a placeholder.

## Deterministic mapping

`data-mapping="pathname"` maps a post to a thread by its URL path — stable across
rebuilds. Offer a per-post override: when frontmatter supplies a term, switch to
`data-mapping="specific"` + `data-term=<term>`. giscus creates the thread on first
visit, so new posts need no pre-existing discussion.

## Load lazily (island)

Do not load `giscus.app/client.js` on page load — it defeats the zero-JS default.
Inject the script only when the comment section scrolls into view:

```js
const io = new IntersectionObserver((es) => {
  if (es.some(e => e.isIntersecting)) { inject(); io.disconnect(); }
});
io.observe(mount);
```

Build the `<script>` with `data-repo`, `data-repo-id`, `data-category`,
`data-category-id`, `data-mapping`, `data-theme`, `data-lang`, `crossorigin`.

## Trade-offs

- Commenting requires a GitHub account — fine for a dev audience, excluding for a
  general one.
- Comments live in GitHub, not your repo; you own only the embed and the mapping.
