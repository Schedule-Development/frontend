Como adicionar um novo item ao changelog

1. Crie um novo arquivo Markdown dentro de `content/4.changelog/` com um nome descritivo, por exemplo `2.1.0.md` ou `2026-02-25-performance.md`.

2. Use o frontmatter (YAML) no topo do arquivo com os campos mínimos:

---
title: "vX.Y.Z — Título curto"
description: "Resumo curto do release"
date: "2026-02-25"
image: "https://..." # opcional
---

3. Escreva o corpo em Markdown com seções como **Highlights**, **Fixes**, **Improvements** e **Notes**.

4. O site processa arquivos da pasta `4.changelog` como a coleção `versions`, ordenada por `date` (DESC). Garanta que o campo `date` esteja correto para aparecer na ordem desejada.

5. Se desejar reutilizar o template, copie `NEW_RELEASE.md` e atualize os campos.

Exemplo mínimo:

---
title: "v1.0.1 — Bugfix release"
description: "Corrige problema na importação de dados"
date: "2026-02-25"
---

- Corrigido: Validação no upload de CSV
- Melhorado: Mensagens de erro mais claras

Se precisar, eu posso criar um script simples para gerar arquivos de changelog com frontmatter já preenchido (pergunte se quiser).