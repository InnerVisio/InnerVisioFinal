import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useLanguage } from './LanguageContext';

const LOCALIZED_NAV_ITEMS = [
  { labelKey: 'servicesLabel', href: '#services' },
  { labelKey: 'workLabel', href: '#work' },
  { labelKey: 'pricingLabel', href: '#pricing' },
  { labelKey: 'faqLabel', href: '#faq' },
];

const navContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const navItemVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 }
  },
};

export const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);

          // Simple scroll spy logic
          const sections = LOCALIZED_NAV_ITEMS.map(item => item.href.substring(1));
          let current = '';
          for (const section of sections) {
            const element = document.getElementById(section);
            if (element) {
              const rect = element.getBoundingClientRect();
              // Check if the top of the section is near the top of the viewport
              if (rect.top <= 150 && rect.bottom >= 150) {
                current = section;
              }
            }
          }
          setActiveSection(current);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 animate-fade-in">
      {/* Optimized Background Layer */}
      <div 
        className={`absolute inset-0 bg-[#050205]/95 backdrop-blur-lg border-b border-white/5 shadow-2xl transition-opacity duration-300 pointer-events-none ${
          isScrolled ? 'opacity-100' : 'opacity-0'
        }`}
      />
      
      <div className={`relative max-w-7xl mx-auto px-4 md:px-8 transition-all duration-300 ${isScrolled ? 'py-3' : 'py-5 md:py-8'}`}>
        <div className="flex items-center justify-between w-full">
          {/* Logo & Greeting Style Container */}
          <a href="#root" aria-label="Home" className="flex items-center gap-3 group/logo shrink-0 z-50">
            <div className="w-12 md:w-14 h-12 md:h-14 flex items-center justify-center group-hover/logo:scale-105 transition-transform duration-300">
              <img 
                src="/FavIcon.png" 
                alt="InnerVisio Logo" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-display font-medium text-white leading-tight">
                {t('footerTitle')}
              </span>
              <span className="text-xs text-gray-400 font-medium leading-tight">
                {t('logoSub')}
              </span>
            </div>
          </a>

          {/* Desktop Nav - Pill Style */}
          <motion.div 
            className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2"
            variants={navContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {LOCALIZED_NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.href.substring(1);
              return (
                <motion.a
                  key={item.labelKey}
                  href={item.href}
                  variants={navItemVariants}
                  className={`px-5 py-2.5 rounded-full text-sm transition-all duration-300 font-medium ${
                    isActive 
                      ? 'bg-primary text-white shadow-[0_0_15px_rgba(56,24,63,0.6)]' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {t(item.labelKey)}
                </motion.a>
              );
            })}
          </motion.div>

          {/* Desktop Call to Action & Language selector */}
          <div className="hidden md:flex items-center gap-5 shrink-0">
            {/* Language switcher capsule */}
            <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-0.5">
              <button 
                onClick={() => setLanguage('cs')} 
                aria-label="Language: Čeština"
                className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  language === 'cs' 
                    ? 'bg-secondary text-white shadow-[0_2px_10px_rgba(101,36,111,0.4)] scale-105' 
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Čeština"
              >
                CS
              </button>
              <button 
                onClick={() => setLanguage('en')} 
                aria-label="Language: English"
                className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  language === 'en' 
                    ? 'bg-secondary text-white shadow-[0_2px_10px_rgba(101,36,111,0.4)] scale-105' 
                    : 'text-gray-400 hover:text-white'
                }`}
                title="English"
              >
                EN
              </button>
            </div>

            <motion.a 
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-gray-200 transition-colors shadow-lg"
            >
              {t('startProject')}
            </motion.a>
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-3 md:hidden relative z-50">
            {/* Minimal Mobile Lang Select */}
            <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-0.5">
              <button 
                onClick={() => setLanguage(language === 'cs' ? 'en' : 'cs')}
                aria-label="Switch language"
                className="px-2.5 py-1 rounded-full text-xs font-bold uppercase text-white bg-secondary/80 transition-all hover:bg-secondary"
              >
                {language === 'cs' ? 'CS' : 'EN'}
              </button>
            </div>

            <button 
              className="text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Content */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="md:hidden absolute top-full left-0 right-0 bg-[#050205] border-b border-white/10 shadow-2xl p-5 flex flex-col gap-2"
            >
              {LOCALIZED_NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.href.substring(1);
                return (
                  <a
                    key={item.labelKey}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-lg font-display px-4 py-3 rounded-xl transition-colors ${
                      isActive 
                        ? 'bg-primary/20 text-white' 
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {t(item.labelKey)}
                  </a>
                );
              })}

              <div className="h-px bg-white/5 my-2" />

              {/* Mobile Language buttons */}
              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-xs text-gray-400 font-medium">Language / Jazyk</span>
                <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-0.5">
                  <button 
                    onClick={() => setLanguage('cs')} 
                    className={`px-3 py-1 rounded-md text-xs font-semibold ${
                      language === 'cs' ? 'bg-secondary text-white' : 'text-gray-400'
                    }`}
                  >
                    Čeština
                  </button>
                  <button 
                    onClick={() => setLanguage('en')} 
                    className={`px-3 py-1 rounded-md text-xs font-semibold ${
                      language === 'en' ? 'bg-secondary text-white' : 'text-gray-400'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>

              <a 
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-4 px-6 py-3.5 rounded-xl bg-white text-black font-semibold text-center hover:bg-gray-200 transition-colors"
              >
                {t('startProject')}
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};