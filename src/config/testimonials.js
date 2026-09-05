/**
 * Cadastro central de depoimentos.
 *
 * Segurança de publicação:
 * - depoimentos reais só aparecem com approved: true e active: true;
 * - itens com demo: true nunca são exibidos em produção.
 */
export const testimonials = [
  {
    id: 'demo-maria-s',
    name: 'Maria S.',
    location: 'Curitiba/PR',
    photo: '',
    quote: '“A parte sobre continuar, começar, reduzir ou encerrar me fez perceber que eu estava tentando acrescentar coisas à minha rotina quando, na verdade, precisava reduzir algumas.”',
    approved: false,
    active: false,
    order: 1,
    receivedFreeCopy: true,
    photoAuthorized: false,
    demo: true,
  },
  {
    id: 'demo-carlos-m',
    name: 'Carlos M.',
    location: 'São Paulo/SP',
    photo: '',
    quote: '“Eu esperava um livro dizendo o que eu deveria fazer. Encontrei perguntas que me fizeram olhar com mais atenção para as minhas próprias escolhas.”',
    approved: false,
    active: false,
    order: 2,
    receivedFreeCopy: true,
    photoAuthorized: false,
    demo: true,
  },
  {
    id: 'demo-ana-p',
    name: 'Ana P.',
    location: 'Maringá/PR',
    photo: '',
    quote: '“Percebi durante a leitura que eu estava tentando resolver várias coisas ao mesmo tempo. Organizar primeiro o meu ponto de partida mudou a maneira como comecei a pensar nos próximos passos.”',
    approved: false,
    active: false,
    order: 3,
    receivedFreeCopy: true,
    photoAuthorized: false,
    demo: true,
  },
  {
    id: 'demo-roberto-a',
    name: 'Roberto A.',
    location: 'Londrina/PR',
    photo: '/testimonials/arquivo-inexistente.webp',
    quote: '“O livro não tenta entregar uma resposta pronta. Ele organiza perguntas e decisões de um jeito que torna mais fácil perceber o que realmente merece atenção agora.”',
    approved: false,
    active: false,
    order: 4,
    receivedFreeCopy: true,
    photoAuthorized: true,
    demo: true,
  },
];
