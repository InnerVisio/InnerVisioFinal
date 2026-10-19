import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { HERO_SLIDES } from '../constants';
import { blurInOnMount } from './ui/brand';

interface HeroProps {
  currentSlide: number;
  setCurrentSlide: (index: number) => void;
}

// Hero copy lives here (not in the translation dictionary) so the hero can be rewritten in one place.
const COPY: Record<
  'cs' | 'en',
  {
    kicker: string;
    line1: string;
    gradient: string;
    sub: string;
    ctaPrimary: string;
    ctaSecondary: string;
    availability: string;
    stats: { value: string; label: string }[];
    slideNav: string;
    slideGoTo: string;
    slides: { title: string; location: string }[];
  }
> = {
  cs: {
    kicker: '3D a AI vizualizace interiérů a exteriérů',
    line1: 'Vizualizace, které',
    gradient: 'prodávají.',
    sub: 'Klasické 3D vizualizace s přesností do detailu. AI vizualizace do 24 hodin. Pro makléře, developery, architekty i majitele domů.',
    ctaPrimary: 'Ceník AI vizualizací',
    ctaSecondary: 'Naše realizace',
    availability: 'Máme volné kapacity pro nové zakázky',
    stats: [
      { value: '150+', label: 'Dokončených projektů' },
      { value: '50+', label: 'Spokojených klientů' },
      { value: '24h', label: 'Rychlost odezvy' },
    ],
    slideNav: 'Výběr z realizací',
    slideGoTo: 'Zobrazit snímek',
    slides: [
      { title: 'Prezentační weby s vizualizací', location: 'Komplexní řešení' },
      { title: 'Developerské projekty', location: 'Praha, ČR' },
      { title: 'Moderní rodinné domy', location: 'ČR' },
      { title: 'Nadčasová architektura', location: 'ČR' },
    ],
  },
  en: {
    kicker: '3D & AI interior and exterior visualization',
    line1: 'Visualizations',
    gradient: 'that sell.',
    sub: 'Classic 3D visualizations, precise to the last detail. AI visualizations in 24 hours. For real-estate agents, developers, architects and home owners.',
    ctaPrimary: 'AI visualization pricing',
    ctaSecondary: 'See our work',
    availability: 'Open for new commissions',
    stats: [
      { value: '150+', label: 'Completed projects' },
      { value: '50+', label: 'Satisfied clients' },
      { value: '24h', label: 'Response time' },
    ],
    slideNav: 'Selected work',
    slideGoTo: 'Show slide',
    slides: [
      { title: 'Presentation websites with visuals', location: 'Complete solution' },
      { title: 'Developer projects', location: 'Prague, CZ' },
      { title: 'Modern family houses', location: 'CZ' },
      { title: 'Timeless architecture', location: 'CZ' },
    ],
  },
};

const SLIDE_INTERVAL_S = 10; // must match the interval in App.tsx

// blurInOnMount, but the filter is cleared once the entrance ends.
// A lingering `filter: blur(0px)` would turn the element into a backdrop root and
// switch off the backdrop blur of any liquid-glass element inside it.
// The hero starts half-visible (soft focus) instead of fully transparent: the prerendered HTML then
// shows the headline before JavaScript loads, which is what Largest Contentful Paint measures.
const enter = (delay = 0, distance?: number) => {
  const preset = blurInOnMount(delay, distance);
  return {
    ...preset,
    initial: { ...preset.initial, opacity: 0.5 },
    animate: { ...preset.animate, transitionEnd: { filter: 'none' } },
  };
};

const pad = (n: number) => String(n).padStart(2, '0');

export const Hero: React.FC<HeroProps> = ({ currentSlide, setCurrentSlide }) => {
  const { language } = useLanguage();
  const copy = COPY[language === 'en' ? 'en' : 'cs'];
  const slide = HERO_SLIDES[currentSlide];
  const caption = copy.slides[currentSlide] ?? { title: slide.title, location: slide.location };

  return (
    <section className="relative min-h-[100svh] flex flex-col pt-24 sm:pt-28">

      {/* Headline block: vertically centred in the space between navbar and proof bar */}
      <div className="relative z-20 flex-1 flex items-center w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 w-full py-6 md:py-6">
          <div className="max-w-5xl">

            <h1 className="font-display font-extrabold text-ink tracking-tightest leading-[1.04]">
              {/* Descriptive kicker: gives the H1 the words people actually search for */}
              <motion.span
                {...enter(0.1, 16)}
                className="eyebrow flex items-center gap-4 mb-5 md:mb-7 leading-relaxed"
              >
                <span aria-hidden className="h-px w-8 md:w-12 shrink-0 bg-gradient-to-r from-orchid-soft to-transparent" />
                <span>{copy.kicker}</span>
              </motion.span>
              <span className="sr-only">. </span>
              <motion.span
                {...enter(0.2, 32)}
                className="block text-[clamp(2.15rem,min(9.6vw,11svh),6.5rem)] [text-wrap:balance]"
              >
                {copy.line1}
              </motion.span>{' '}
              <motion.span
                {...enter(0.32, 32)}
                className="block text-gradient pb-[0.1em] text-[clamp(2.7rem,min(13.5vw,14svh),8.75rem)] leading-[1.02]"
              >
                {copy.gradient}
              </motion.span>
            </h1>

            <motion.p
              {...enter(0.45)}
              className="font-sans text-base md:text-lg text-ink-2 max-w-[34rem] font-light leading-relaxed mt-5 md:mt-7"
            >
              {copy.sub}
            </motion.p>

            <motion.div
              {...enter(0.58)}
              className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-x-4 gap-y-3 mt-8 md:mt-10"
            >
              <a
                href="#pricing-ai"
                className="btn-primary focus-ring group inline-flex items-center justify-center gap-3 rounded-full font-display font-medium px-7 py-3.5 sm:py-4"
              >
                <span>{copy.ctaPrimary}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-500 md:group-hover:translate-x-1" strokeWidth={1.8} aria-hidden />
              </a>
              <a
                href="#work"
                className="btn-glass focus-ring inline-flex items-center justify-center gap-3 rounded-full font-display font-medium px-7 py-3.5 sm:py-4"
              >
                {copy.ctaSecondary}
              </a>
              {/* Availability: small magenta dot + text (below the buttons, inline from lg) */}
              <p className="flex items-center gap-3 mt-2 sm:basis-full lg:basis-auto lg:mt-0 lg:ml-4 text-sm text-ink-2">
                <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
                  <span className="absolute -inset-1.5 rounded-full bg-magenta/30 blur-[4px] animate-pulse-slow" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-magenta shadow-[0_0_12px_rgba(224,85,240,0.9)]" />
                </span>
                {copy.availability}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom rail: proof bar (left) + slide index (right) */}
      <div className="relative z-20 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-4 pb-5 md:pb-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 lg:gap-12">

            {/* Slide index: thin segments with progress, caption names the visible project */}
            <motion.div
              {...enter(0.85, 12)}
              className="order-1 lg:order-2 w-full lg:w-[20rem] xl:w-[26rem] min-w-0 flex items-center gap-4 sm:block lg:-mb-[21px]"
              role="group"
              aria-label={copy.slideNav}
            >
              <div className="flex items-baseline justify-between gap-4 font-display shrink-0 sm:shrink">
                <span className="text-sm font-medium text-ink tabular-nums tracking-[0.08em] whitespace-nowrap">
                  {pad(currentSlide + 1)}
                  <span className="text-ink-3"> / {pad(HERO_SLIDES.length)}</span>
                </span>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="hidden sm:block text-xs text-ink-2 text-right truncate"
                  >
                    {caption.title}
                    <span className="text-ink-3"> · {caption.location}</span>
                  </motion.span>
                </AnimatePresence>
              </div>
              <div className="flex gap-2 flex-1 sm:mt-1">
                {HERO_SLIDES.map((_, index) => {
                  const isActive = currentSlide === index;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentSlide(index)}
                      className="focus-ring group relative flex-1 h-11 flex items-center rounded-full"
                      aria-label={`${copy.slideGoTo} ${index + 1}`}
                      aria-current={isActive ? 'true' : undefined}
                    >
                      <span className="relative block w-full h-px bg-white/20 transition-colors duration-500 md:group-hover:bg-white/45">
                        {isActive && (
                          <motion.span
                            key={`p-${currentSlide}`}
                            className="absolute inset-y-[-0.5px] left-0 h-[2px] bg-orchid-soft shadow-[0_0_10px_rgba(196,139,224,0.8)]"
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: SLIDE_INTERVAL_S, ease: 'linear' }}
                          />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Proof bar */}
            <motion.div
              {...enter(0.8, 16)}
              className="order-2 lg:order-1 w-full lg:w-auto"
            >
              <dl className="glass glass-inner-glow rounded-card grid grid-cols-3 divide-x divide-white/[0.1] lg:min-w-[32rem] xl:min-w-[36rem]">
                {copy.stats.map((stat) => (
                  <div key={stat.label} className="px-3.5 sm:px-6 py-3.5 sm:py-5 flex flex-col-reverse justify-end gap-1.5">
                    <dt className="text-[10px] sm:text-[11px] text-ink-3 font-medium uppercase tracking-[0.12em] sm:tracking-[0.14em] leading-snug">
                      {stat.label}
                    </dt>
                    <dd className="font-display font-bold text-2xl sm:text-3xl text-ink tracking-tightest leading-none">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </motion.div>

          </div>
        </div>
      </div>

    </section>
  );
};
