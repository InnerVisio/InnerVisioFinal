import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Cookie } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { BRAND, EASE_OUT } from './ui/brand';
import { ConsentPreferences, onOpenCookieSettings, readConsent, saveConsent } from '../analytics';

// Optional categories start switched off: pre-ticked boxes are not valid consent under GDPR
const NO_OPTIONAL: ConsentPreferences = { analytics: false, marketing: false };

// Plum switch: Orchid Plum when on, faint glass when off
function ConsentSwitch({ checked, onToggle, label }: { checked: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onToggle}
      className={`focus-ring relative w-12 h-7 shrink-0 rounded-full border transition-[background-color,border-color,box-shadow] duration-500 ${
        checked
          ? 'bg-secondary border-white/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_0_18px_rgba(162,77,184,0.45)]'
          : 'bg-white/[0.08] border-white/[0.16] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]'
      }`}
    >
      <span
        aria-hidden
        className={`absolute top-[3px] left-[3px] w-5 h-5 rounded-full bg-ink shadow-[0_2px_6px_rgba(0,0,0,0.4)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export function CookieBanner() {
  const { language, t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [preferences, setPreferences] = useState<ConsentPreferences>(NO_OPTIONAL);

  // Show the banner only until the visitor has made a choice. No artificial delay: as the largest
  // text block on a first visit it is the page's LCP element, so every ms of delay counts.
  useEffect(() => {
    if (!readConsent()) setIsVisible(true);
  }, []);

  // Footer "Nastavení cookies" reopens the banner with the current choices
  useEffect(() => onOpenCookieSettings(() => {
    setPreferences(readConsent() ?? NO_OPTIONAL);
    setShowSettings(true);
    setIsVisible(true);
  }), []);

  const commit = (prefs: ConsentPreferences) => {
    setPreferences(prefs);
    saveConsent(prefs);
    setIsVisible(false);
  };

  const handleAcceptAll = () => commit({ analytics: true, marketing: true });
  const handleAcceptSelected = () => commit(preferences);
  const handleDeclineAll = () => commit(NO_OPTIONAL);

  const cs = language === 'cs';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.8, ease: EASE_OUT }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-3 sm:p-4 md:p-6 pointer-events-none"
        >
          <div className="max-w-6xl mx-auto w-full pointer-events-auto">
            <div
              role="region"
              aria-label={cs ? 'Nastavení cookies' : 'Cookie settings'}
              className="relative overflow-hidden rounded-card bg-[rgba(24,12,30,0.86)] backdrop-blur-[28px] backdrop-saturate-150 border-[1.5px] border-white/[0.16] shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_30px_80px_rgba(0,0,0,0.6),0_0_60px_rgba(162,77,184,0.22)] p-5 sm:p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between"
            >
              <div aria-hidden className="absolute inset-0 glass-inner-glow pointer-events-none" />

              <div className="relative flex-1 min-w-0 flex gap-4 md:gap-5">
                <span className={`${BRAND.iconChip} hidden sm:inline-flex`}>
                  <Cookie className="w-5 h-5 icon-gradient" strokeWidth={1.5} />
                </span>

                <div className="flex-1 min-w-0 space-y-3">
                  <h3 className="text-lg md:text-xl font-display font-semibold tracking-tightest text-ink pr-10 md:pr-0">
                    {cs ? 'Ochrana soukromí a soubory cookie' : 'Privacy Protection and Cookies'}
                  </h3>
                  <p className="text-sm md:text-[15px] text-ink-2 max-w-3xl leading-relaxed font-light">
                    {cs
                      ? 'Tento web využívá soubory cookie k zajištění základních funkcí (nezbytné cookies) a k analýze návštěvnosti a vylepšování obsahu (volitelné cookies). Můžete přijmout všechny cookies, nebo si přizpůsobit nastavení.'
                      : 'This website utilizes cookies to enable key foundational features (necessary cookies) and analyze aggregate web metrics and user paths (optional cookies). You can opt to agree to all or refine selections.'}
                  </p>

                  {/* Settings Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setShowSettings(!showSettings)}
                    aria-expanded={showSettings}
                    aria-controls="cookie-settings"
                    className="link-orchid focus-ring rounded inline-flex items-center gap-2 text-sm pt-1 font-display font-medium"
                  >
                    <Settings className="w-4 h-4" strokeWidth={1.75} />
                    {showSettings
                      ? (cs ? 'Skrýt nastavení' : 'Hide settings')
                      : (cs ? 'Přizpůsobit nastavení cookies' : 'Refine cookie settings')}
                  </button>

                  {/* Expanded Settings */}
                  <AnimatePresence initial={false}>
                    {showSettings && (
                      <motion.div
                        id="cookie-settings"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.55, ease: EASE_OUT }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-4 border-t border-white/[0.08] mt-2 pt-4 max-h-[40vh] overflow-y-auto custom-scrollbar pr-1">
                          {/* Necessary */}
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-ink font-medium text-sm">
                                {cs ? 'Nezbytné cookies' : 'Necessary Cookies'}
                              </p>
                              <p className="text-xs text-ink-3 font-light">
                                {cs ? 'Nutné pro správné fungování webu. Nelze je vypnout.' : 'Required for core website mechanics and security. Cannot be switched off.'}
                              </p>
                            </div>
                            <span className="shrink-0 whitespace-nowrap rounded-full px-3 py-1 text-xs font-display font-medium text-orchid-soft bg-secondary/15 border border-secondary/35">
                              {cs ? 'Vždy zapnuto' : 'Always Active'}
                            </span>
                          </div>

                          {/* Analytics */}
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-ink font-medium text-sm">
                                {cs ? 'Analytické cookies' : 'Analytics Cookies'}
                              </p>
                              <p className="text-xs text-ink-3 font-light">
                                {cs ? 'Pomáhají nám vylepšovat web podle toho, jak ho používáte.' : 'Allows us to assess dynamic path metrics to refine web experiences.'}
                              </p>
                            </div>
                            <ConsentSwitch
                              checked={preferences.analytics}
                              onToggle={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}
                              label={cs ? 'Analytické cookies' : 'Analytics Cookies'}
                            />
                          </div>

                          {/* Marketing */}
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-ink font-medium text-sm">
                                {cs ? 'Marketingové cookies' : 'Marketing Cookies'}
                              </p>
                              <p className="text-xs text-ink-3 font-light">
                                {cs ? 'Používají se pro personalizaci reklam a obsahu.' : 'Used to build preference scores or serve personalized content.'}
                              </p>
                            </div>
                            <ConsentSwitch
                              checked={preferences.marketing}
                              onToggle={() => setPreferences(p => ({ ...p, marketing: !p.marketing }))}
                              label={cs ? 'Marketingové cookies' : 'Marketing Cookies'}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="relative flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0 text-sm">
                <button
                  type="button"
                  onClick={handleDeclineAll}
                  className={`${BRAND.btnGlass} px-6 py-3 w-full sm:w-auto`}
                >
                  {cs ? 'Odmítnout volitelné' : 'Decline optional'}
                </button>
                {!showSettings ? (
                  <button
                    type="button"
                    onClick={handleAcceptAll}
                    className={`${BRAND.btnPrimary} px-8 py-3 w-full sm:w-auto`}
                  >
                    {cs ? 'Přijmout vše' : 'Accept all'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleAcceptSelected}
                    className={`${BRAND.btnPrimary} px-7 py-3 w-full sm:w-auto`}
                  >
                    {cs ? 'Potvrdit výběr' : 'Confirm choices'}
                  </button>
                )}
              </div>

              {/* Close Icon (Optional, same as decline) */}
              <button
                type="button"
                onClick={handleDeclineAll}
                className="btn-glass focus-ring absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-ink-2 hover:text-ink md:hidden"
                aria-label={cs ? 'Zavřít' : 'Close'}
              >
                <X className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
