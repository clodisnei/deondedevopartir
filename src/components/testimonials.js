import { testimonials } from '../config/testimonials.js';

const PRIMARY_LIMIT = 3;

export function getInitials(name = '') {
  const words = name.match(/\p{L}+/gu) || [];
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

export function canUsePhoto(testimonial) {
  return testimonial.photoAuthorized === true
    && typeof testimonial.photo === 'string'
    && testimonial.photo.trim().length > 0;
}

export function getPublicTestimonials(items = testimonials) {
  return items
    .filter((item) => item.demo !== true && item.approved === true && item.active === true)
    .sort((a, b) => {
      const orderA = Number.isFinite(a.order) ? a.order : Number.MAX_SAFE_INTEGER;
      const orderB = Number.isFinite(b.order) ? b.order : Number.MAX_SAFE_INTEGER;
      return orderA - orderB || a.name.localeCompare(b.name, 'pt-BR');
    });
}

export function splitTestimonials(items, primaryLimit = PRIMARY_LIMIT) {
  return {
    primary: items.slice(0, primaryLimit),
    secondary: items.slice(primaryLimit),
  };
}

function getDevelopmentPreviewTestimonials() {
  const isDevelopment = Boolean(import.meta.env?.DEV);
  const showDemo = new URLSearchParams(window.location.search).get('previewTestimonials') === 'demo';
  if (!isDevelopment || !showDemo) return null;

  return testimonials
    .filter((item) => item.demo === true)
    .sort((a, b) => a.order - b.order);
}

function createAvatar(name) {
  const avatar = document.createElement('span');
  avatar.className = 'testimonial-avatar';
  avatar.setAttribute('role', 'img');
  avatar.setAttribute('aria-label', `Avatar de ${name}`);
  avatar.textContent = getInitials(name);
  return avatar;
}

function createMedia(testimonial) {
  const media = document.createElement('div');
  media.className = 'testimonial-card__media';

  const avatar = createAvatar(testimonial.name);
  media.appendChild(avatar);

  if (!canUsePhoto(testimonial)) return media;

  const image = document.createElement('img');
  image.className = 'testimonial-card__photo';
  image.width = 112;
  image.height = 112;
  image.loading = 'lazy';
  image.decoding = 'async';
  image.alt = `Foto de ${testimonial.name}`;
  image.hidden = true;

  image.addEventListener('load', () => {
    image.hidden = false;
    avatar.hidden = true;
  });
  image.addEventListener('error', () => image.remove());
  image.src = testimonial.photo.trim();
  media.appendChild(image);

  return media;
}

function createCard(testimonial) {
  const card = document.createElement('article');
  card.className = 'testimonial-card';
  card.dataset.testimonialId = testimonial.id;

  const quote = document.createElement('blockquote');
  quote.className = 'testimonial-card__quote';
  quote.textContent = testimonial.quote;

  const person = document.createElement('div');
  person.className = 'testimonial-card__person';
  person.appendChild(createMedia(testimonial));

  const identity = document.createElement('div');
  identity.className = 'testimonial-card__identity';

  const label = document.createElement('span');
  label.className = 'testimonial-card__label';
  label.textContent = 'Leitor(a)';

  const name = document.createElement('strong');
  name.textContent = testimonial.name;

  identity.append(label, name);

  if (testimonial.location) {
    const location = document.createElement('span');
    location.className = 'testimonial-card__location';
    location.textContent = testimonial.location;
    identity.appendChild(location);
  }

  person.appendChild(identity);
  card.append(quote, person);
  return card;
}

function createSection(items, variant) {
  const section = document.createElement('section');
  const titleId = `depoimentos-${variant}-title`;
  section.className = `section testimonials testimonials--${variant}`;
  section.setAttribute('aria-labelledby', titleId);

  const container = document.createElement('div');
  container.className = 'container';

  const heading = document.createElement('div');
  heading.className = 'section-heading testimonials__heading';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'eyebrow';
  eyebrow.textContent = 'EXPERIÊNCIAS DE LEITURA';

  const title = document.createElement('h2');
  title.id = titleId;
  title.textContent = variant === 'primary'
    ? 'O que leitores estão dizendo sobre De Onde Devo Partir?'
    : 'Mais leitores compartilham suas impressões';

  heading.append(eyebrow, title);

  const grid = document.createElement('div');
  grid.className = 'testimonials__grid';
  items.forEach((item) => grid.appendChild(createCard(item)));

  container.append(heading, grid);

  if (items.some((item) => item.receivedFreeCopy === true)) {
    const disclosure = document.createElement('p');
    disclosure.className = 'testimonials__disclosure';
    disclosure.textContent = 'Alguns leitores receberam uma cópia gratuita da obra para leitura e avaliação.';
    container.appendChild(disclosure);
  }

  section.appendChild(container);
  return section;
}

export function renderTestimonials() {
  const previewItems = getDevelopmentPreviewTestimonials();
  const publicItems = getPublicTestimonials();
  const visibleItems = previewItems || publicItems;
  const { primary, secondary } = splitTestimonials(visibleItems);

  const primaryMount = document.querySelector('[data-testimonials-mount="primary"]');
  const secondaryMount = document.querySelector('[data-testimonials-mount="secondary"]');

  if (primaryMount && primary.length > 0) {
    primaryMount.replaceWith(createSection(primary, 'primary'));
  }

  if (secondaryMount && secondary.length > 0) {
    secondaryMount.replaceWith(createSection(secondary, 'secondary'));
  }
}
