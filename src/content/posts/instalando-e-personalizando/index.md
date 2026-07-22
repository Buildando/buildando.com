---
title: "Instalando o Buildando e personalizando"
description: "Do fork ao ar: instale, rode localmente e personalize a identidade, o texto inicial da home e a página Sobre — tudo a partir de um arquivo de configuração."
lang: pt
publishDate: 2026-07-21
category: "Guia"
tags:
  - instalação
  - configuração
  - guia
cover: ./cover.png
coverAlt: "Capa ilustrada: Instalando e personalizando"
---

Você já viu [o que é o Buildando](/pt/posts/o-que-e-o-buildando/). Agora vamos
colocar o seu no ar e deixá-lo com a sua cara.

## 1. Pegue o template

No GitHub, clique em **"Use this template" → Create a new repository** (ou faça um
fork). Depois, no seu computador:

```bash
npm install
npm run dev      # servidor local, com recarga automática
```

Abra `http://localhost:4321` e você já verá o blog rodando. Requer Node 22+.

## 2. A única superfície de configuração

Quase tudo que é "seu" mora em **um arquivo**: `src/config/site.ts`. É lá que você
edita nome, domínio, autor, **cores**, fontes, **redes sociais**, navegação,
idiomas e as integrações (comentários, busca, analytics).

```ts
export const SITE = {
  name: "Meu Blog",
  url: "https://meu-dominio.com",
  author: "Seu Nome",
  // ...
};
```

> Regra de ouro: se `buildando`, o domínio ou o autor aparecerem **fora** desse
> arquivo, é bug. Isso é o que torna o fork tão simples.

Troque também os assets em `public/`: o `favicon.svg` (logo) e o `og-default.svg`
(imagem social padrão).

## 3. O texto inicial da home (antes do feed)

Aquele bloco no topo da home — título e frase de boas-vindas, antes da lista de
posts — é **markdown livre**, um por idioma, em `src/content/home/`:

```text
src/content/home/
  pt.md      ← o hero em português
  en.md      ← o hero em inglês
```

Edite `pt.md` com o que quiser (título, parágrafo, links) — o CSS do site cuida do
visual. Sem esse arquivo, a home cai no nome do site + descrição.

## 4. A página "Sobre o Autor"

A página **Sobre** vive em `src/pages/[lang]/about.astro`. O texto por idioma está
logo no topo do arquivo — troque pelo seu. O link no menu já aponta para ela.

## 5. Ajustes rápidos comuns

- **Tema padrão**: `THEME.default` (`"dark"` ou `"light"`), ou trave com `allowToggle: false`.
- **Idiomas**: adicione/remova em `I18N` e traduza as strings em `src/i18n/ui.ts`.
  Só um idioma? Deixe apenas um locale.
- **Comentários / busca**: escolha o provedor em `INTEGRATIONS`
  (veja `src/integrations/README.md`).
- **Analytics, anúncios, newsletter, compartilhar**: cada um é opt-in num bloco de
  config; vazio = não aparece.

## 6. Publicando

`npm run build` gera a pasta `dist/` estática, que vai para qualquer hospedagem. O
template já inclui um deploy automático para o HostGator via GitHub Actions (veja o
`README`), mas serve em qualquer host estático.

Pronto — o esqueleto é seu. O próximo passo é o que mais importa:
[criar posts](/pt/posts/criando-posts/).
