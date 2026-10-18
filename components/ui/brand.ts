// Shared motion presets for the "Violet Keynote" brand: calm Apple-keynote movement.
// Entrances are "blur-in rise" (blur -> sharp, 20–40 px up, opacity 0 -> 1) with an expo-out curve.
// No bounces, shakes, glitches or fast zooms.

export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_IN_OUT: [number, number, number, number] = [0.37, 0, 0.63, 1];

// A leftover `filter` (even blur(0px)) disables backdrop-filter on glass descendants,
// so every preset clears it once the entrance finishes.
const CLEAR_FILTER = { transitionEnd: { filter: 'none' } };

// For elements entering as the user scrolls
export const blurInRise = (delay = 0, distance = 28) => ({
  initial: { opacity: 0, y: distance, filter: 'blur(12px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)', ...CLEAR_FILTER },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.9, delay, ease: EASE_OUT },
});

// For elements visible on first paint (hero, navbar)
export const blurInOnMount = (delay = 0, distance = 24) => ({
  initial: { opacity: 0, y: distance, filter: 'blur(12px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', ...CLEAR_FILTER },
  transition: { duration: 1, delay, ease: EASE_OUT },
});

// Class recipes built on the utilities defined in index.html
export const BRAND = {
  // Section scaffolding
  section: 'relative py-28 md:py-36 px-6',
  container: 'relative z-10 max-w-7xl mx-auto',
  eyebrow: 'eyebrow block mb-4',
  h2: 'font-display font-bold text-ink text-4xl md:text-6xl tracking-tightest leading-[1.05]',
  lead: 'text-ink-2 text-base md:text-lg font-light leading-relaxed',

  // Surfaces
  card: 'glass rounded-card',
  cardHover: 'transition-shadow duration-500 md:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_30px_80px_rgba(0,0,0,0.55),0_0_60px_rgba(162,77,184,0.35)]',
  featuredCard: 'glass-strong glass-inner-glow rounded-card shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_0_70px_rgba(162,77,184,0.35)]',

  // Controls
  btnPrimary: 'btn-primary focus-ring inline-flex items-center justify-center gap-2 rounded-full font-display font-medium',
  btnGlass: 'btn-glass focus-ring inline-flex items-center justify-center gap-2 rounded-full font-display font-medium',
  btnLight: 'btn-light focus-ring inline-flex items-center justify-center gap-2 rounded-full font-display font-medium',
  pill: 'glass-pill px-4 py-1.5 font-display font-medium text-sm text-ink',
  badge: 'inline-flex items-center px-2.5 py-1 rounded-full bg-secondary text-white font-display font-semibold text-[10px] uppercase tracking-[0.14em] leading-none',
  iconChip: 'icon-chip w-11 h-11 shrink-0',
} as const;
