// Cookie consent helpers — gates analytics/marketing scripts behind explicit consent.

const KEY = "cff_cookie_consent_v1";
const GA_ID = "G-RFYFG9PFYN";
const META_PIXEL_ID = ""; // plug in later

export function getConsent() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "null");
  } catch {
    return null;
  }
}

export function setConsent(partial) {
  const data = {
    essential: true,
    analytics: !!partial.analytics,
    marketing: !!partial.marketing,
    ts: new Date().toISOString(),
  };
  localStorage.setItem(KEY, JSON.stringify(data));
  applyConsent(data);
  return data;
}

export function clearConsent() {
  localStorage.removeItem(KEY);
}

export function applyConsent(consent) {
  if (!consent) return;
  if (consent.analytics) loadGA();
  if (consent.marketing) loadMetaPixel();
}

function loadGA() {
  if (window.__cff_ga_loaded || !GA_ID) return;
  window.__cff_ga_loaded = true;

  const s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID, { anonymize_ip: true });
}

function loadMetaPixel() {
  if (window.__cff_pixel_loaded || !META_PIXEL_ID) return;
  window.__cff_pixel_loaded = true;

  /* eslint-disable */
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  /* eslint-enable */
  window.fbq("init", META_PIXEL_ID);
  window.fbq("track", "PageView");
}

// Apply on first import (only if already consented)
if (typeof window !== "undefined") {
  const existing = getConsent();
  if (existing) applyConsent(existing);
}
