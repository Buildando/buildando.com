---
title: "Um post só em português"
description: "Exemplo de post que existe em apenas um idioma, para demonstrar o comportamento de fallback do seletor de idioma."
lang: pt
publishDate: 2026-07-19
category: "Meta"
tags:
  - exemplo
  - i18n
draft: false
---

Este post existe **apenas em português** (não tem entrada em `translations`).

Ele serve para demonstrar o comportamento pedido: se você estiver lendo este
post e trocar o idioma para English, **não há uma tradução**, então o post
permanece o mesmo — mas **toda a interface da página** (menu, rodapé, título da
seção de comentários, formato de data) passa para o idioma selecionado.

Quando um post _tem_ tradução, o seletor leva direto para a versão traduzida.
