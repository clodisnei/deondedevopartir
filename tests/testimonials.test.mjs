import test from 'node:test';
import assert from 'node:assert/strict';

import {
  canUsePhoto,
  getInitials,
  getPublicTestimonials,
  splitTestimonials,
} from '../src/components/testimonials.js';

function makeTestimonial(id, overrides = {}) {
  return {
    id,
    name: `Leitor ${id}`,
    location: 'Paraná',
    photo: '',
    quote: 'Depoimento real autorizado.',
    approved: true,
    active: true,
    order: Number(id),
    receivedFreeCopy: false,
    photoAuthorized: false,
    demo: false,
    ...overrides,
  };
}

test('produção não mostra seção sem depoimentos reais aprovados e ativos', () => {
  const items = [makeTestimonial('1', { demo: true }), makeTestimonial('2', { approved: false })];
  assert.deepEqual(getPublicTestimonials(items), []);
});

test('demonstrações nunca entram na seleção pública, mesmo ativas e aprovadas', () => {
  const demo = makeTestimonial('1', { demo: true, approved: true, active: true });
  assert.deepEqual(getPublicTestimonials([demo]), []);
});

test('seleciona e ordena 1, 3 e 6 ou mais depoimentos reais', () => {
  const one = [makeTestimonial('1')];
  const three = [makeTestimonial('3'), makeTestimonial('1'), makeTestimonial('2')];
  const six = Array.from({ length: 7 }, (_, index) => makeTestimonial(String(index + 1)));

  assert.equal(getPublicTestimonials(one).length, 1);
  assert.deepEqual(getPublicTestimonials(three).map((item) => item.id), ['1', '2', '3']);
  assert.equal(getPublicTestimonials(six).length, 7);
  assert.deepEqual(splitTestimonials(getPublicTestimonials(six)), {
    primary: six.slice(0, 3),
    secondary: six.slice(3),
  });
});

test('primeiro bloco recebe até três itens e o segundo recebe apenas os demais', () => {
  const items = Array.from({ length: 6 }, (_, index) => makeTestimonial(String(index + 1)));
  const { primary, secondary } = splitTestimonials(items);
  assert.deepEqual(primary.map((item) => item.id), ['1', '2', '3']);
  assert.deepEqual(secondary.map((item) => item.id), ['4', '5', '6']);
});

test('foto só é usada quando existe caminho e há autorização', () => {
  const allowed = makeTestimonial('1', { photo: '/testimonials/leitor.webp', photoAuthorized: true });
  const absent = makeTestimonial('2', { photo: '', photoAuthorized: true });
  const unauthorized = makeTestimonial('3', { photo: '/testimonials/leitor.webp', photoAuthorized: false });

  assert.equal(canUsePhoto(allowed), true);
  assert.equal(canUsePhoto(absent), false);
  assert.equal(canUsePhoto(unauthorized), false);
});

test('avatar produz iniciais consistentes', () => {
  assert.equal(getInitials('Maria Silva'), 'MS');
  assert.equal(getInitials('Ana P.'), 'AP');
  assert.equal(getInitials('Clodisnei'), 'CL');
  assert.equal(getInitials(''), '?');
});
