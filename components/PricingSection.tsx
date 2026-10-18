import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { useLanguage } from './LanguageContext';
import { AI_PRICING_CONTENT } from './pricing/aiPricingContent';
import { AiPricingPanel, riseIn } from './pricing/AiPricingPanel';
import { Classic3DPanel } from './pricing/Classic3DPanel';
import { FOCUS_RING, PRICING_HASHES, PricingTab, tabFromHash } from './pricing/pricingNav';
import { BRAND, EASE_OUT } from './ui/brand';

const TABS: PricingTab[] = ['ai', '3d'];

// During build-time prerendering both price lists go into the static HTML (the inactive one hidden),
// so crawlers and AI search engines that don't run JavaScript still see every price.
const IS_SERVER = typeof window === 'undefined';

export const PricingSection: React.FC = () => {
  const { language, t } = useLanguage();
  const content = AI_PRICING_CONTENT[language] || AI_PRICING_CONTENT.cs;
  const [activeTab, setActiveTab] = useState<PricingTab>(() => (IS_SERVER ? null : tabFromHash(window.location.hash)) ?? 'ai');
  const tabRefs = useRef<Record<PricingTab, HTMLButtonElement | null>>({ ai: null, '3d': null });

  useEffect(() => {
    const handleHashChange = () => {
      const tab = tabFromHash(window.location.hash);
      if (tab) setActiveTab(tab);
    };
    window.addEventListener('hashchange', handleHashChange);

    // Deep link on first load: the section renders after the browser's own fragment scroll
    if (tabFromHash(window.location.hash)) {
      requestAnimationFrame(() => document.getElementById('pricing')?.scrollIntoView());
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const selectTab = (tab: PricingTab, focus = false) => {
    setActiveTab(tab);
    const { pathname, search } = window.location;
    window.history.replaceState(null, '', `${pathname}${search}${PRICING_HASHES[tab]}`);
    if (focus) tabRefs.current[tab]?.focus();
  };

  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const index = TABS.indexOf(activeTab);
    const next: Record<string, PricingTab> = {
      ArrowRight: TABS[(index + 1) % TABS.length],
      ArrowLeft: TABS[(index - 1 + TABS.length) % TABS.length],
      Home: TABS[0],
      End: TABS[TABS.length - 1],
    };
    if (e.key in next) {
      e.preventDefault();
      selectTab(next[e.key], true);
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <section id="pricing" className="py-28 md:py-36 px-6 bg-background relative overflow-hidden">
        {/* Deep-link targets for #pricing-ai / #pricing-3d */}
        <span id="pricing-ai" className="absolute top-0" aria-hidden />
        <span id="pricing-3d" className="absolute top-0" aria-hidden />

        {/* Drifting plum / orchid glows: the liquid glass needs colour behind it */}
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden>
          <div className="absolute -top-48 -right-40 w-[420px] h-[420px] md:w-[720px] md:h-[720px] rounded-full glow-plum animate-drift-slow" />
          <div className="absolute top-[14%] -left-48 w-[380px] h-[380px] md:w-[620px] md:h-[620px] rounded-full glow-orchid opacity-60 animate-drift-slow [animation-delay:-7s]" />
          <div className="absolute top-[38%] -right-56 w-[400px] h-[400px] md:w-[680px] md:h-[680px] rounded-full glow-plum opacity-90 animate-drift-slow [animation-delay:-13s]" />
          <div className="absolute top-[62%] left-[8%] w-[360px] h-[360px] md:w-[640px] md:h-[640px] rounded-full glow-plum opacity-80 animate-drift-slow [animation-delay:-4s]" />
          <div className="absolute -bottom-40 right-[18%] w-[340px] h-[340px] md:w-[560px] md:h-[560px] rounded-full glow-orchid opacity-50 animate-drift-slow [animation-delay:-17s]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div {...riseIn()} className="text-center mb-12 md:mb-16">
            <span className={BRAND.eyebrow}>{t('pricingSubtitle')}</span>
            <h2 className={BRAND.h2}>
              {language === 'cs' ? (
                <>Ceník <span className="text-gradient">Služeb</span></>
              ) : (
                <>Pricing <span className="text-gradient">Plans</span></>
              )}
            </h2>
            <p className={`${BRAND.lead} max-w-2xl mx-auto mt-6`}>{t('pricingDesc')}</p>

            {/* Segmented tab control */}
            <div
              role="tablist"
              aria-label={t('pricingTitle')}
              className="mt-10 md:mt-12 inline-flex w-full sm:w-auto max-w-md sm:max-w-none p-1.5 glass-pill !shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_20px_60px_rgba(0,0,0,0.45)]"
            >
              {TABS.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    ref={(el) => { tabRefs.current[tab] = el; }}
                    id={`pricing-tab-${tab}`}
                    role="tab"
                    type="button"
                    aria-selected={isActive}
                    aria-controls={isActive ? `pricing-panel-${tab}` : undefined}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => selectTab(tab)}
                    onKeyDown={handleTabKeyDown}
                    className={`relative flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-7 py-3 rounded-full font-display font-medium text-[13px] sm:text-[15px] transition-colors duration-500 ${FOCUS_RING} ${
                      isActive ? 'text-white' : 'text-ink-2 md:hover:text-ink'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="pricing-tab-pill"
                        className="absolute inset-0 rounded-full bg-secondary shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_0_30px_rgba(162,77,184,0.45)]"
                        transition={{ type: 'tween', duration: 0.6, ease: EASE_OUT }}
                      />
                    )}
                    <span className="relative flex items-center gap-2 whitespace-nowrap">
                      {tab === 'ai' ? (
                        <>
                          <span className={isActive ? 'text-orchid-pale' : 'text-orchid-soft'} aria-hidden>✦</span>
                          {content.tabAi}
                          {/* On phones the badge sits on the pill's corner so the label stays on one line */}
                          <span className="absolute -top-4 -right-3 sm:static px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-chip-gradient text-plum-black text-[9px] sm:text-[10px] font-display font-semibold uppercase tracking-[0.14em] leading-none whitespace-nowrap shadow-[0_0_14px_rgba(240,212,244,0.35)]">
                            {content.newBadge}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="sm:hidden">{content.tab3dShort}</span>
                          <span className="hidden sm:inline">{content.tab3d}</span>
                        </>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeTab}
              id={`pricing-panel-${activeTab}`}
              role="tabpanel"
              aria-labelledby={`pricing-tab-${activeTab}`}
              initial={{ opacity: 0, y: 16, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
              exit={{ opacity: 0, y: -8, filter: 'blur(8px)', transition: { duration: 0.3, ease: EASE_OUT } }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
            >
              {activeTab === 'ai' ? (
                <AiPricingPanel content={content} />
              ) : (
                <Classic3DPanel language={language} intro={content.classicIntro} crossLink={content.classicCrossLink} />
              )}
            </motion.div>
          </AnimatePresence>

          {IS_SERVER && (
            <div id="pricing-panel-3d" role="tabpanel" aria-labelledby="pricing-tab-3d" hidden>
              <Classic3DPanel language={language} intro={content.classicIntro} crossLink={content.classicCrossLink} />
            </div>
          )}

          <p className="mt-16 md:mt-20 text-center text-xs md:text-sm text-ink-3 font-light max-w-2xl mx-auto leading-relaxed">
            {t('pricingFootnote')}
          </p>
        </div>
      </section>
    </MotionConfig>
  );
};
