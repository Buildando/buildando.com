---
title: "Welcome to Buildando"
description: "An example post that exercises the whole platform: frontmatter, a colocated image, tags, category, cover, SEO, and the GitHub Discussions comment box."
lang: en
translations:
  pt: exemplo-bem-vindo-ao-buildando
publishDate: 2026-07-20
updatedDate: 2026-07-20
category: "Meta"
tags:
  - example
  - markdown
  - astro
cover: ./cover.png
coverAlt: "Example cover with a gradient"
keywords:
  - static blog
  - astro
  - markdown
draft: false
---

This is the **example post** that ships with the platform. It exists to prove the
whole structure works end to end and to serve as a _template_ for your first real
post.

## Writing a post

A post is **one folder**. To publish, add a directory under
`src/content/posts/` with an `index.md` inside. Nothing else in the project changes.

```text
src/content/posts/
  my-first-post/
    index.md      ← this file
    cover.png     ← images live next to the markdown
```

The folder name becomes the post's URL (its _slug_). Declare the post's language
with the `lang` field, and link its translations with `translations`.

## Frontmatter

The block at the top is the _frontmatter_. Three fields are required — `title`,
`description`, and `publishDate` — and the build fails naming the post and field
if any is missing. Every other field has a safe default.

## Comments

At the end of every post you get the comment box, which is **GitHub Discussions**
embedded via giscus. You configure the repository once in `src/config/site.ts`.

Delete this post, copy the folder as a starting point, and start writing.
