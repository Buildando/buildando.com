# Buildando — plataforma de blog estático

Um blog estático, rápido e **forkável**, construído com [Astro](https://astro.build).
Conteúdo em markdown, **sem backend**, SEO forte por construção, busca no cliente
e comentários via **GitHub Discussions**. Publica em qualquer hospedagem estática
— aqui, HostGator.

Este repositório é ao mesmo tempo o blog [buildando.com](https://buildando.com) e
um _template_: faça fork, edite **um** arquivo de configuração, troque o logo e o
blog é seu.

> A especificação completa (SDD) que rege este projeto está em
> [`.specs/2026-07-20-static-blog-platform.md`](.specs/2026-07-20-static-blog-platform.md).
> Cada requisito `REQ-xxx` é rastreável até o código.

## O que vem pronto

- **Escrever = criar uma pasta.** Um post é um diretório em `src/content/posts/`
  com um `index.md` e as imagens ao lado. Nada mais no projeto muda.
- **Frontmatter validado no build.** Campo obrigatório faltando quebra o build
  apontando o post e o campo.
- **SEO automático** em toda página: `<title>`, description, canonical, Open
  Graph, Twitter Card, JSON-LD, `sitemap.xml`, `robots.txt` e feed RSS.
- **Facetas** por tag e por categoria, geradas a partir do conteúdo.
- **Busca full-text no cliente** ([Pagefind](https://pagefind.app)), sem servidor.
- **Comentários** via [giscus](https://giscus.app) (GitHub Discussions), carregados
  sob demanda.
- **Tema claro/escuro** com botão no header, preferência lembrada e sem flash na carga.
- **Multi-idiomas (i18n)**: rotas por locale (`/pt/`, `/en/`), interface traduzida,
  seletor de idioma, `hreflang` e feed por idioma.
- **Deploy automático** para HostGator via GitHub Actions (rsync/SSH).

## Rodando localmente

```bash
npm install
npm run dev      # servidor de desenvolvimento (rascunhos visíveis)
npm run build    # gera dist/ (astro build + índice de busca) — rascunhos excluídos
npm run preview  # serve o dist/ gerado
```

Requer Node 22+ (veja `.nvmrc`).

## Escrevendo um post

Crie uma pasta em `src/content/posts/` e um `index.md`:

```markdown
---
title: "Título do post"
description: "Resumo em uma frase — vira snippet de busca e preview social."
publishDate: 2026-07-20
category: "Boas Práticas"
tags: [oo, testes]
cover: ./capa.png        # imagem colocada na mesma pasta (opcional)
coverAlt: "Descrição da capa"
draft: false             # true esconde da produção
---

Seu conteúdo em **markdown** aqui.
```

Obrigatórios: `title`, `description`, `publishDate`. Todo o resto tem padrão.
Veja `src/content/config.ts` para o schema completo.

## Fazendo fork (personalizar tudo)

1. **Edite `src/config/site.ts`** — é a única superfície de configuração: nome,
   domínio, autor, cores, fontes, links sociais, navegação, giscus, analytics,
   `THEME` (tema padrão / travar tema) e `I18N` (idiomas).
2. **Troque** `public/favicon.svg` e `public/og-default.svg`.
3. **Configure os comentários**: torne o repositório público, ative _Discussions_,
   instale o [app giscus](https://github.com/apps/giscus), pegue `repoId` e
   `categoryId` em [giscus.app](https://giscus.app) e preencha `GISCUS` no config.
4. **Idiomas**: adicione/remova locales em `I18N` e traduza as strings em
   `src/i18n/ui.ts`. Cada post declara seu idioma com `lang:` e liga traduções com
   `translations:`. Um só idioma? Deixe apenas um locale em `I18N`.
5. **Tema**: mude `THEME.default` para `"light"` ou `"dark"`, ou
   `THEME.allowToggle: false` para travar e esconder o botão.
6. **Topo da home**: edite `src/content/home/<locale>.md` (ex.: `pt.md`, `en.md`) —
   é markdown livre, renderizado com o CSS do site. Sem esse arquivo, a home cai
   no nome do site + descrição.

Nenhum outro arquivo carrega identidade — se `buildando`, o domínio ou o autor
aparecerem fora do config, é bug (é o que o `REQ-030` garante).

## Deploy no HostGator

O HostGator **não tem CLI oficial**. O deploy é automatizado pelo GitHub Actions
em `.github/workflows/deploy.yml`.

### Caminho principal: rsync sobre SSH (porta 2222)

1. Peça ao suporte do HostGator para **habilitar SSH** (fica na porta `2222`,
   desligado por padrão em planos compartilhados).
2. Gere um par de chaves e coloque a pública em `~/.ssh/authorized_keys` no servidor.
3. Configure os _secrets_ do repositório (Settings → Secrets → Actions):
   `HOSTGATOR_SSH_HOST`, `HOSTGATOR_SSH_USER`, `HOSTGATOR_SSH_KEY`,
   `HOSTGATOR_TARGET_DIR` (ex.: `/home/USUARIO/public_html`).
4. `git push` na branch `main` dispara build + deploy.

### Fallback: FTP

Se o plano não liberar SSH, troque o passo de deploy por uma ação de FTP (ex.:
`SamKirkland/FTP-Deploy-Action`) usando secrets `FTP_SERVER`, `FTP_USERNAME`,
`FTP_PASSWORD` e `server-dir: public_html/`. O build é o mesmo; só muda o transporte.

Nenhuma credencial vai para o repositório — todas vivem nos secrets do Actions.

## Estrutura

```text
src/
  config/site.ts        # ← a única superfície de configuração (fork começa aqui)
  content/
    config.ts           # schema do frontmatter (validado no build)
    posts/<slug>/        # um diretório por post
  layouts/               # estrutura estática das páginas
  components/            # header, footer, SEO, giscus, busca, card
  pages/                 # rotas: home, post, tag, categoria, busca, rss, robots
  styles/global.css      # tipografia e tokens de tema
public/                  # logo, og default, .htaccess (passa direto pro dist/)
.github/workflows/       # deploy
.specs/                  # especificação SDD
.skills/                 # técnicas usadas (Astro, SEO, giscus, Pagefind, deploy)
```

## Licença

Defina a licença ao fazer fork (sugestão: MIT).
