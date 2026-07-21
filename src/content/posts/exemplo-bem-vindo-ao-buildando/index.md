---
title: "Bem-vindo ao Buildando"
description: "Um post de exemplo que demonstra toda a estrutura da plataforma: frontmatter, imagem colocada, tags, categoria, capa, SEO e a caixa de comentários do GitHub Discussions."
lang: pt
translations:
  en: welcome-to-buildando
publishDate: 2026-07-20
updatedDate: 2026-07-20
category: "Meta"
tags:
  - exemplo
  - markdown
  - astro
cover: ./cover.png
coverAlt: "Capa de exemplo com gradiente"
keywords:
  - blog estático
  - astro
  - markdown
draft: false
---

Este é o **post de exemplo** que acompanha a plataforma. Ele existe para dois
propósitos: provar que toda a estrutura funciona de ponta a ponta e servir de
_template_ para você escrever o seu primeiro post de verdade.

## Como criar um post

Um post é **uma pasta**. Para publicar, você adiciona um diretório em
`src/content/posts/` com um `index.md` dentro. Nada mais no projeto muda.

```text
src/content/posts/
  meu-primeiro-post/
    index.md      ← este arquivo
    cover.png     ← imagens ficam ao lado do markdown
```

O nome da pasta vira o endereço do post (o _slug_).

## Frontmatter

O bloco no topo deste arquivo é o _frontmatter_. Três campos são obrigatórios —
`title`, `description` e `publishDate` — e o build falha avisando qual post e
qual campo, caso falte algum. Todos os outros têm padrão seguro.

## Imagens

A capa acima é uma imagem colocada na própria pasta do post e referenciada por
caminho relativo. No build ela é otimizada e servida em tamanhos responsivos,
sem você configurar nada. Imagens no meio do texto funcionam igual:

> Dica: escreva como você pensa. O CSS do blog já cuida da tipografia — títulos,
> listas, tabelas, citações e blocos de código herdam o estilo do site.

## Comentários

No fim de cada post aparece a caixa de comentários, que é o **GitHub Discussions**
embutido via giscus. Você configura o repositório uma única vez em
`src/config/site.ts`.

Pronto: apague este post, copie a pasta como base e comece a escrever.
