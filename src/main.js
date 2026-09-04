import './styles.css';

const CHECKOUT_URL = 'https://pay.hotmart.com/W107472687X?checkoutMode=10';
const ATTRIBUTION_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'fbclid',
];

export function buildCheckoutUrl(pageUrl = window.location.href) {
  const checkout = new URL(CHECKOUT_URL);
  const incoming = new URL(pageUrl).searchParams;

  for (const key of ATTRIBUTION_PARAMS) {
    const value = incoming.get(key);
    if (value && value.trim()) checkout.searchParams.set(key, value.trim());
  }

  return checkout.toString();
}

const metaPixelId = (import.meta.env.VITE_META_PIXEL_ID || '').trim();
const gaMeasurementId = (import.meta.env.VITE_GA_MEASUREMENT_ID || '').trim();

function loadScript(src) {
  const script = document.createElement('script');
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

function initializeAnalytics() {
  if (/^G-[A-Z0-9]+$/i.test(gaMeasurementId)) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', gaMeasurementId, { send_page_view: false });
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaMeasurementId)}`);
  }

  if (/^\d{5,20}$/.test(metaPixelId)) {
    const fbq = function fbq() {
      if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments);
      else fbq.queue.push(arguments);
    };
    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = '2.0';
    window.fbq = fbq;
    window._fbq = fbq;
    fbq('init', metaPixelId);
    loadScript('https://connect.facebook.net/pt_BR/fbevents.js');
  }
}

function trackEvent(name, parameters = {}) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, parameters);
  }

  if (typeof window.fbq === 'function') {
    const metaStandardEvents = {
      page_view: 'PageView',
      initiate_checkout: 'InitiateCheckout',
    };
    const standardName = metaStandardEvents[name];
    if (standardName) window.fbq('track', standardName, parameters);
    else window.fbq('trackCustom', name, parameters);
  }

  window.dispatchEvent(new CustomEvent('landing:analytics', { detail: { name, parameters } }));
}

function setupCheckoutLinks() {
  const checkoutUrl = buildCheckoutUrl();
  document.querySelectorAll('[data-checkout]').forEach((link) => {
    link.href = checkoutUrl;
    link.addEventListener('click', () => {
      const location = link.dataset.ctaLocation || 'unknown';
      trackEvent('cta_click', { cta_location: location, destination: 'hotmart' });
      trackEvent('initiate_checkout', {
        cta_location: location,
        currency: 'BRL',
        value: 19.9,
        content_name: 'De Onde Devo Partir?',
        content_type: 'product',
      });
    });
  });
}

function setupScrollTracking() {
  let tracked = false;
  const onScroll = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return;
    const percentage = Math.round((window.scrollY / maxScroll) * 100);
    if (!tracked && percentage >= 50) {
      tracked = true;
      trackEvent('scroll_relevant', { percent_scrolled: 50 });
      window.removeEventListener('scroll', onScroll);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

initializeAnalytics();
setupCheckoutLinks();
setupScrollTracking();
trackEvent('page_view', {
  page_title: document.title,
  page_location: window.location.href,
  content_name: 'De Onde Devo Partir?',
});
