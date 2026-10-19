import { track } from '../../analytics';

export type PricingTab = 'ai' | '3d';

export const PRICING_HASHES: Record<PricingTab, string> = {
  ai: '#pricing-ai',
  '3d': '#pricing-3d',
};

export const tabFromHash = (hash: string): PricingTab | null => {
  if (hash === PRICING_HASHES.ai) return 'ai';
  if (hash === PRICING_HASHES['3d']) return '3d';
  return null;
};

// Inquiry options in the contact form "Poptávám" select, AI services first
export type ServiceOptionId =
  | 'ai-staging'
  | 'ai-viz'
  | 'ai-video'
  | 'ai-package'
  | 'exterior'
  | 'interior'
  | 'floor-3d'
  | 'floor-2d'
  | 'tour'
  | 'web'
  | 'video';

const CONTACT_SERVICE_EVENT = 'innervisio:contact-service';

// Pre-selects a service in the contact form; call from a CTA that links to #contact
export const requestService = (id: ServiceOptionId) => {
  track('select_item', { item_list_name: 'pricing', item_id: id });
  window.dispatchEvent(new CustomEvent<ServiceOptionId>(CONTACT_SERVICE_EVENT, { detail: id }));
};

export const onServiceRequested = (handler: (id: ServiceOptionId) => void) => {
  const listener = (e: Event) => handler((e as CustomEvent<ServiceOptionId>).detail);
  window.addEventListener(CONTACT_SERVICE_EVENT, listener);
  return () => window.removeEventListener(CONTACT_SERVICE_EVENT, listener);
};

// Shared focus ring for interactive elements in the pricing section (brand .focus-ring: Soft Orchid outline)
export const FOCUS_RING = 'focus-ring';
