import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { HERO_SLIDES } from '../constants';
import { blurInOnMount } from './ui/brand';

interface HeroProps {
  currentSlide: number;
  setCurrentSlide: (index: number) => void;
}

const LOCALIZED_STATS = [
  { value: '150+', labelKey: 'statsProjects' },
  { value: '50+', labelKey: 'statsSatisfied' },
  { value: '24h', labelKey: 'statsResponse' }
];

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

const INFO_ITEMS = [
  { key: 'infoNewProjects', dot: 'bg-magenta shadow-[0_0_12px_rgba(224,85,240,0.9)]', halo: true },
  { key: 'infoFastDelivery', dot: 'bg-orchid-soft shadow-[0_0_10px_rgba(196,139,224,0.7)]' },
  { key: 'infoModernPres', dot: 'bg-orchid-plum shadow-[0_0_10px_rgba(162,77,184,0.7)]' },
];

export const Hero: React.FC<HeroProps> = ({ currentSlide, setCurrentSlide }) => {
  const { t } = useLanguage();

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-14 md:pt-32 md:pb-16">

      {/* Main Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-5 sm:px-6 w-full flex flex-col justify-center">

        <div className="max-w-4xl">
          <motion.a
            href="#pricing-ai"
            {...enter(0.1)}
            className="glass-pill focus-ring group inline-flex items-center gap-2 mb-7 md:mb-9 px-4 py-2 font-display text-xs sm:text-sm font-medium text-ink transition-[background-color,box-shadow] duration-500 md:hover:bg-white/[0.16] md:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_0_28px_rgba(162,77,184,0.4)]"
          >
            <span className="text-orchid-soft" aria-hidden>✦</span>
            {t('heroAiChip')}
            <ArrowRight className="w-3.5 h-3.5 text-orchid-soft transition-transform duration-500 md:group-hover:translate-x-0.5" strokeWidth={1.8} aria-hidden />
          </motion.a>

          <h1 className="font-display font-extrabold text-ink tracking-tightest leading-[1.04] text-[clamp(2.25rem,10vw,6.5rem)]">
            {/* Descriptive kicker: gives the H1 the words people actually search for */}
            <motion.span {...enter(0.12, 16)} className="eyebrow block mb-4 md:mb-5 leading-relaxed">
              {t('heroKicker')}
            </motion.span>
            <motion.span {...enter(0.2, 32)} className="block">
              {t('heroTitle1')}
            </motion.span>
            <motion.span {...enter(0.32, 32)} className="block text-gradient pb-[0.08em]">
              {t('heroTitle2')}
            </motion.span>
          </h1>

          <motion.p
            {...enter(0.45)}
            className="font-sans text-base md:text-lg text-ink-2 max-w-md font-light leading-relaxed mt-6 md:mt-7"
          >
            {t('heroSub')}
          </motion.p>

          <motion.div
            {...enter(0.58)}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-9 md:mt-10"
          >
            <a
              href="#work"
              aria-label={t('heroExploreBtn')}
              className="btn-primary focus-ring group inline-flex items-center justify-center gap-3 rounded-full font-display font-medium px-7 py-4"
            >
              <span>{t('heroExploreBtn')}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-500 md:group-hover:translate-x-1" strokeWidth={1.8} aria-hidden />
            </a>

            <a
              href="#contact"
              aria-label={t('heroContactBtn')}
              className="btn-glass focus-ring inline-flex items-center justify-center gap-3 rounded-full font-display font-medium px-7 py-4"
            >
              {t('heroContactBtn')}
            </a>
          </motion.div>

          {/* Info card: in the flow on phones/tablets, floating bottom-right on desktop */}
          <motion.div
            {...enter(0.85)}
            className="mt-10 lg:mt-0 lg:absolute lg:bottom-14 lg:right-20 xl:right-24 lg:z-30 w-full sm:max-w-sm lg:w-auto"
          >
            <div className="glass glass-inner-glow rounded-card p-5 md:p-6 lg:min-w-[300px]">
              <ul className="flex flex-col">
                {INFO_ITEMS.map((item, idx) => (
                  <li
                    key={item.key}
                    className={`flex items-center gap-3 py-3 first:pt-0 last:pb-0 ${idx > 0 ? 'border-t border-white/[0.08]' : ''}`}
                  >
                    <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
                      {item.halo && (
                        <span className="absolute -inset-1.5 rounded-full bg-magenta/30 blur-[4px] animate-pulse-slow" />
                      )}
                      <span className={`relative inline-flex h-2 w-2 rounded-full ${item.dot}`} />
                    </span>
                    <span className="text-sm md:text-[15px] font-medium text-ink">{t(item.key)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            {...enter(0.7)}
            className="grid grid-cols-2 sm:grid-cols-3 gap-6 md:gap-10 pt-8 border-t border-white/[0.1] mt-10 md:mt-14 max-w-xl"
          >
            {LOCALIZED_STATS.map((stat, idx) => (
              <div key={stat.labelKey} className={idx === 2 ? 'col-span-2 sm:col-span-1' : ''}>
                <div className="font-display font-bold text-2xl md:text-4xl text-ink tracking-tightest mb-1.5">{stat.value}</div>
                <p className="text-[11px] md:text-xs text-ink-3 font-medium uppercase tracking-[0.14em] leading-snug">{t(stat.labelKey)}</p>
              </div>
            ))}
          </motion.div>
        </div>

      </div>

      {/* Slide indicators: thin vertical lines, orchid when active (hidden on small phones) */}
      <div className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-30 hidden sm:flex flex-col items-center gap-1">
        {HERO_SLIDES.map((_, index) => {
          const isActive = currentSlide === index;
          return (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className="focus-ring group flex items-center justify-center w-6 py-1.5 rounded-full"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={isActive ? 'true' : undefined}
            >
              <span
                className={`block w-[3px] rounded-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isActive
                    ? 'h-9 bg-orchid-soft shadow-[0_0_12px_rgba(196,139,224,0.8)]'
                    : 'h-4 bg-white/30 md:group-hover:bg-white/60'
                }`}
              />
            </button>
          );
        })}
      </div>

    </section>
  );
};
