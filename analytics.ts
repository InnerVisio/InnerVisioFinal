// Consent-aware analytics.
// Google tags (GTM + gtag.js in index.html) run in Consent Mode v2: everything is "denied"
// until the visitor chooses in the cookie banner. The Meta Pixel is not loaded at all
// before marketing consent. index.html reads CONSENT_STORAGE_KEY too, so keep them in sync.

export interface ConsentPreferences {
  analytics: boolean;
  marketing: boolean;
}

export const CONSENT_STORAGE_KEY = 'iv-consent-v2';
const META_PIXEL_ID = '836931002463698';
const OPEN_SETTINGS_EVENT = 'innervisio:open-cookie-settings';

type Gtag = (...args: unknown[]) => void;
type Fbq = ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue?: unknown[]; loaded?: boolean; version?: string; push?: unknown };

declare global {
  interface Window {
    gtag?: Gtag;
    fbq?: Fbq;
    _fbq?: Fbq;
    dataLayer?: unknown[];
  }
}

const isBrowser = typeof window !== 'undefined';

export const readConsent = (): ConsentPreferences | null => {
  if (!isBrowser) return null;
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return { analytics: !!parsed.analytics, marketing: !!parsed.marketing };
  } catch {
    return null;
  }
};

const loadMetaPixel = () => {
  if (!isBrowser || window.fbq) return;
  // Standard Meta Pixel bootstrap, deferred until marketing consent
  const fbq: Fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue!.push(args);
  } as Fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];
  window.fbq = fbq;
  window._fbq = fbq;
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);
  fbq('init', META_PIXEL_ID);
  fbq('track', 'PageView');
};

export const applyConsent = (prefs: ConsentPreferences) => {
  if (!isBrowser) return;
  window.gtag?.('consent', 'update', {
    analytics_storage: prefs.analytics ? 'granted' : 'denied',
    ad_storage: prefs.marketing ? 'granted' : 'denied',
    ad_user_data: prefs.marketing ? 'granted' : 'denied',
    ad_personalization: prefs.marketing ? 'granted' : 'denied',
  });
  if (prefs.marketing) loadMetaPixel();
  else window.fbq?.('consent', 'revoke');
};

export const saveConsent = (prefs: ConsentPreferences) => {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ ...prefs, savedAt: new Date().toISOString() }));
  } catch {
    // Storage blocked: consent still applies for this page view
  }
  applyConsent(prefs);
};

// Lets the footer reopen the banner so consent can be withdrawn as easily as it was given
export const openCookieSettings = () => {
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
};

export const onOpenCookieSettings = (handler: () => void) => {
  window.addEventListener(OPEN_SETTINGS_EVENT, handler);
  return () => window.removeEventListener(OPEN_SETTINGS_EVENT, handler);
};

// Sends a GA4 event; Consent Mode decides whether it is stored with or without cookies
export const track = (event: string, params: Record<string, unknown> = {}) => {
  if (!isBrowser) return;
  window.gtag?.('event', event, params);
};

// A submitted inquiry: the key conversion for ads and reporting
export const trackLead = (service: string) => {
  track('generate_lead', { service, currency: 'CZK' });
  window.fbq?.('track', 'Lead', { content_name: service });
};

export const initAnalytics = () => {
  if (!isBrowser) return;
  const stored = readConsent();
  if (stored?.marketing) loadMetaPixel();

  // Phone and e-mail clicks are leads too
  document.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement | null)?.closest?.('a[href^="tel:"], a[href^="mailto:"]');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    track(href.startsWith('tel:') ? 'click_phone' : 'click_email', { link_url: href });
    window.fbq?.('track', 'Contact');
  });
};
