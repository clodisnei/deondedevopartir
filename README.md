# De Onde Devo Partir?

Landing page independente para o eBook **De Onde Devo Partir?**, de Clodisnei C. Peres.

## Desenvolvimento

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Os arquivos estáticos são gerados em `dist/`.

## Analytics opcional

Copie `.env.example` para `.env.local` e informe somente os IDs existentes:

- `VITE_META_PIXEL_ID`
- `VITE_GA_MEASUREMENT_ID`

A página funciona normalmente quando essas variáveis não estão configuradas.

## Cloudflare

O projeto está preparado para Cloudflare Workers Static Assets:

```bash
npm run build
npx wrangler deploy
```

Checkout oficial: `https://pay.hotmart.com/W107472687X?checkoutMode=10`.
