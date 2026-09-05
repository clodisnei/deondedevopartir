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

## Depoimentos de leitores

Os depoimentos são mantidos em `src/config/testimonials.js`. A página exibe somente itens reais com `approved: true`, `active: true` e `demo` diferente de `true`.

Para adicionar um depoimento:

1. Otimize a foto preferencialmente em WebP, com enquadramento quadrado, e salve em `public/testimonials/`.
2. Use um nome de arquivo simples, em minúsculas e sem espaços, como `maria-silva.webp`.
3. Adicione um novo objeto ao array de `src/config/testimonials.js`, preenchendo todos os campos.
4. Defina `approved: true` somente depois de conferir e aprovar o texto recebido.
5. Use `active: true` para publicar e `active: false` para ocultar temporariamente.
6. Controle a posição com `order`: números menores aparecem primeiro. Os três primeiros são mostrados após os cinco movimentos; os demais aparecem próximos da oferta final.
7. Para publicar sem foto, deixe `photo: ''` ou use `photoAuthorized: false`. O site exibirá automaticamente as iniciais do nome.
8. Para remover um depoimento da página sem apagar seu registro, mude `active` para `false`. Para removê-lo definitivamente, exclua o objeto e a foto correspondente.

Exemplo de depoimento real:

```js
{
  id: 'leitor-001',
  name: 'Nome do leitor',
  location: 'Curitiba/PR',
  photo: '/testimonials/nome-do-leitor.webp',
  quote: 'Texto autorizado do depoimento.',
  approved: true,
  active: true,
  order: 1,
  receivedFreeCopy: true,
  photoAuthorized: true,
  demo: false,
}
```

Se `receivedFreeCopy` for `true`, a página mostra a informação de transparência sobre a cópia gratuita. Se a foto não existir, não estiver autorizada ou falhar ao carregar, o avatar de iniciais será usado sem exibir imagem quebrada.

Os registros `demo: true` servem exclusivamente para conferir o componente no desenvolvimento. Mesmo que `approved` ou `active` sejam alterados por engano, eles nunca entram na seleção pública. Para visualizar as demonstrações durante o desenvolvimento, abra `/?previewTestimonials=demo` com o servidor local.
