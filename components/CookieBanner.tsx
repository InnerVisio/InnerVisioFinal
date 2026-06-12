import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export function CookieBanner() {
  const { language, t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Simple state for preferences (in a real app, integrate with a consent manager)
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent-choice');
    if (!consent) {
      // Delay showing banner slightly for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    setPreferences({ necessary: true, analytics: true, marketing: true });
    saveConsent('all');
  };

  const handleAcceptSelected = () => {
    saveConsent('selected');
  };

  const handleDeclineAll = () => {
    setPreferences({ necessary: true, analytics: false, marketing: false });
    saveConsent('necessary-only');
  };

  const saveConsent = (type: string) => {
    localStorage.setItem('cookie-consent-choice', type);
    localStorage.setItem('cookie-consent-preferences', JSON.stringify(preferences));
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 pointer-events-none"
        >
          <div className="max-w-6xl mx-auto w-full pointer-events-auto">
            <div className="bg-[#0a050a]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              
              <div className="flex-1 space-y-3">
                <h3 className="text-xl font-display font-semibold text-white">
                  {language === 'cs' ? 'Ochrana soukromí a soubory cookie' : 'Privacy Protection and Cookies'}
                </h3>
                <p className="text-sm md:text-base text-gray-400 max-w-3xl leading-relaxed font-light">
                  {language === 'cs' 
                    ? 'Tento web využívá soubory cookie k zajištění základních funkcí (nezbytné cookies) a k analýze návštěvnosti a vylepšování obsahu (volitelné cookies). Můžete přijmout všechny cookies, nebo si přizpůsobit nastavení.'
                    : 'This website utilizes cookies to enable key foundational features (necessary cookies) and analyze aggregate web metrics and user paths (optional cookies). You can opt to agree to all or refine selections.'}
                </p>
                
                {/* Settings Toggle Button */}
                <button 
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center gap-2 text-sm text-primary hover:text-white transition-colors pt-2 font-medium"
                >
                  <Settings className="w-4 h-4" />
                  {showSettings 
                    ? (language === 'cs' ? 'Skrýt nastavení' : 'Hide settings') 
                    : (language === 'cs' ? 'Přizpůsobit nastavení cookies' : 'Refine cookie settings')}
                </button>

                {/* Expanded Settings */}
                <AnimatePresence>
                  {showSettings && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pt-4"
                    >
                      <div className="space-y-4 border-t border-white/5 pt-4">
                        {/* Necessary */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium text-sm">
                              {language === 'cs' ? 'Nezbytné cookies' : 'Necessary Cookies'}
                            </p>
                            <p className="text-xs text-gray-500 font-light">
                              {language === 'cs' ? 'Nutné pro správné fungování webu. Nelze je vypnout.' : 'Required for core website mechanics and security. Cannot be switched off.'}
                            </p>
                          </div>
                          <div className="bg-primary/20 text-primary p-1 rounded-full px-3 text-xs border border-primary/30 font-display">
                            {language === 'cs' ? 'Vždy zapnuto' : 'Always Active'}
                          </div>
                        </div>
                        
                        {/* Analytics */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium text-sm">
                              {language === 'cs' ? 'Analytické cookies' : 'Analytics Cookies'}
                            </p>
                            <p className="text-xs text-gray-500 font-light">
                              {language === 'cs' ? 'Pomáhají nám vylepšovat web podle toho, jak ho používáte.' : 'Allows us to assess dynamic path metrics to refine web experiences.'}
                            </p>
                          </div>
                          <button 
                            onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}
                            className={`w-12 h-6 rounded-full transition-colors relative ${preferences.analytics ? 'bg-primary' : 'bg-white/10'}`}
                          >
                            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${preferences.analytics ? 'left-7' : 'left-1'}`} />
                          </button>
                        </div>

                        {/* Marketing */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium text-sm">
                              {language === 'cs' ? 'Marketingové cookies' : 'Marketing Cookies'}
                            </p>
                            <p className="text-xs text-gray-500 font-light">
                              {language === 'cs' ? 'Používají se pro personalizaci reklam a obsahu.' : 'Used to build preference scores or serve personalized content.'}
                            </p>
                          </div>
                          <button 
                            onClick={() => setPreferences(p => ({ ...p, marketing: !p.marketing }))}
                            className={`w-12 h-6 rounded-full transition-colors relative ${preferences.marketing ? 'bg-primary' : 'bg-white/10'}`}
                          >
                            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${preferences.marketing ? 'left-7' : 'left-1'}`} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0 mt-4 md:mt-0 font-display text-sm font-semibold">
                {!showSettings ? (
                  <>
                    <button 
                      onClick={handleDeclineAll}
                      className="px-6 py-3 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors w-full sm:w-auto text-center"
                    >
                      {language === 'cs' ? 'Odmítnout volitelné' : 'Decline optional'}
                    </button>
                    <button 
                      onClick={handleAcceptAll}
                      className="px-8 py-3 rounded-lg bg-primary hover:bg-secondary text-white transition-colors shadow-[0_0_15px_rgba(56,24,63,0.5)] w-full sm:w-auto text-center"
                    >
                      {language === 'cs' ? 'Přijmout vše' : 'Accept all'}
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={handleDeclineAll}
                      className="px-4 py-3 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors w-full sm:w-auto text-center"
                    >
                      {language === 'cs' ? 'Odmítnout volitelné' : 'Decline optional'}
                    </button>
                    <button 
                      onClick={handleAcceptSelected}
                      className="px-6 py-3 rounded-lg bg-primary hover:bg-secondary text-white transition-colors shadow-[0_0_15px_rgba(56,24,63,0.5)] w-full sm:w-auto text-center"
                    >
                      {language === 'cs' ? 'Potvrdit výběr' : 'Confirm choices'}
                    </button>
                  </>
                )}
              </div>
              
              {/* Close Icon (Optional, same as decline) */}
              <button 
                onClick={handleDeclineAll}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors md:hidden"
                aria-label={language === 'cs' ? 'Zavřít' : 'Close'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
