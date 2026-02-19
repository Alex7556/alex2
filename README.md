# Prata Express

Loja estática para venda de acessórios de prata com:
- catálogo dinâmico
- resumo de pedido
- geração de mensagem para WhatsApp
- recebimento via Pix

## Rodar localmente

```bash
python3 -m http.server 4173
```

Acesse: `http://localhost:4173`

## Publicar (lançar) no GitHub Pages

Este repositório já inclui workflow de deploy automático em `.github/workflows/deploy-pages.yml`.

### Passo único inicial no GitHub
1. Vá em **Settings > Pages** do seu repositório.
2. Em **Source**, selecione **GitHub Actions**.

### Depois disso
- cada push na branch `main`, `master` ou `work` publica automaticamente.
- você também pode publicar manualmente em **Actions > Deploy static site to GitHub Pages > Run workflow**.

## Configuração comercial (dentro do site)
No topo do site, use “Configuração rápida” para definir:
- sua chave Pix
- seu WhatsApp de vendas (com DDI)

Esses dados ficam salvos no navegador via `localStorage`.
