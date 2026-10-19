import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { EASE_OUT } from './ui/brand';

interface NavItem {
  id: string;
  labelKey?: string;
  label?: Record<'cs' | 'en', string>;
  href: string;
  isNew?: boolean;
  isPage?: boolean;
}

// isNew items deep-link into a tab of another section, so the scroll spy skips them.
// isPage items are separate pages (not in-page anchors): no homePrefix, no scroll spy.
const LOCALIZED_NAV_ITEMS: NavItem[] = [
  { id: 'services', labelKey: 'servicesLabel', href: '#services' },
  { id: 'work', labelKey: 'workLabel', href: '#work' },
  { id: 'pricing-ai', labelKey: 'aiVizLabel', href: '#pricing-ai', isNew: true },
  { id: 'pricing', labelKey: 'pricingLabel', href: '#pricing' },
  { id: 'faq', labelKey: 'faqLabel', href: '#faq' },
  { id: 'socials', label: { cs: 'Socials', en: 'Socials' }, href: '/socials', isPage: true },
];

// Sporadic magenta accent (brand: tiny dots only)
const NewDot: React.FC = () => (
  <span className="w-1.5 h-1.5 rounded-full bg-magenta shadow-[0_0_10px_rgba(224,85,240,0.85)]" aria-hidden />
);

// Calm entrance: opacity + small rise, no blur on containers that hold glass (filter breaks backdrop-filter)
const navContainerVariants: Variants = {
  hidden: { opacity: 0, y: -8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE_OUT, staggerChildren: 0.06, delayChildren: 0.15 },
  },
};

const navItemVariants: Variants = {
  hidden: { opacity: 0, y: -6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT } },
};

const desktopLangBtn = (active: boolean) =>
  // design-rule-ok: these are the language-switch buttons (a real control), not a decorative label
  `focus-ring px-3 py-1.5 rounded-full font-display text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors duration-300 ${
    active
      ? 'bg-[rgba(162,77,184,0.45)] text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_0_16px_rgba(162,77,184,0.45)]'
      : 'text-ink-3 hover:text-ink'
  }`;

interface NavbarProps {
  /** '' on the home page; '/' on sub-pages so in-page anchors become '/#services' */
  homePrefix?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ homePrefix = '' }) => {
  const { language, setLanguage, t } = useLanguage();
  const [onSocials, setOnSocials] = useState(false);
  const hrefFor = (item: NavItem) => (item.isPage ? item.href : `${homePrefix}${item.href}`);
  const labelFor = (item: NavItem) => (item.label ? item.label[language] : t(item.labelKey as string));
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Read from window in an effect so prerendering never touches it
  useEffect(() => {
    setOnSocials(window.location.pathname.startsWith('/socials'));
  }, []);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);

          // Simple scroll spy logic
          const sections = LOCALIZED_NAV_ITEMS.filter(item => !item.isNew && !item.isPage).map(item => item.href.substring(1));
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
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Scrolled state: dark glass bar with a hairline border */}
      <div
        className={`absolute inset-0 bg-[rgba(5,3,8,0.78)] backdrop-blur-2xl backdrop-saturate-150 border-b border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.45)] transition-opacity duration-500 pointer-events-none ${
          isScrolled || mobileMenuOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div
        className={`relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 transition-[padding] duration-500 ${
          isScrolled ? 'py-3' : 'py-4 md:py-6'
        }`}
      >
        <div className="flex items-center justify-between gap-4 w-full lg:grid lg:grid-cols-[1fr_auto_1fr]">
          {/* Logo + wordmark */}
          <a
            href={homePrefix ? '/' : '#root'}
            aria-label="Home"
            className="focus-ring flex items-center gap-3 group/logo shrink-0 justify-self-start rounded-xl z-50"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center transition-transform duration-500 group-hover/logo:scale-[1.03]">
              <img
                src="/FavIcon.png"
                alt="InnerVisio Logo"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="font-display font-semibold text-lg md:text-xl text-ink tracking-tightest leading-tight">
              {t('footerTitle')}
            </span>
          </a>

          {/* Desktop nav: liquid-glass pill bar */}
          <motion.div
            className="hidden lg:flex items-center gap-0.5 p-1 glass-pill"
            variants={navContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {LOCALIZED_NAV_ITEMS.map((item) => {
              const isActive = item.isPage ? onSocials : activeSection === item.href.substring(1);
              return (
                <motion.a
                  key={item.id}
                  href={hrefFor(item)}
                  variants={navItemVariants}
                  aria-current={isActive ? (item.isPage ? 'page' : 'true') : undefined}
                  className={`focus-ring flex items-center gap-2 px-3.5 xl:px-[18px] py-2 rounded-full font-display text-[13px] xl:text-sm font-medium whitespace-nowrap transition-[background-color,color,box-shadow] duration-500 ${
                    isActive
                      ? 'bg-[rgba(162,77,184,0.38)] text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_0_24px_rgba(162,77,184,0.5)]'
                      : 'text-ink-2 hover:text-ink hover:bg-white/[0.07]'
                  }`}
                >
                  {item.isNew && <NewDot />}
                  {labelFor(item)}
                </motion.a>
              );
            })}
          </motion.div>

          {/* Desktop language switch + CTA */}
          <div className="hidden lg:flex items-center gap-3 shrink-0 justify-self-end">
            <div className="glass-pill flex items-center p-0.5" role="group" aria-label="Language">
              <button
                onClick={() => setLanguage('cs')}
                aria-label="Language: Čeština"
                aria-pressed={language === 'cs'}
                className={desktopLangBtn(language === 'cs')}
                title="Čeština"
              >
                CS
              </button>
              <button
                onClick={() => setLanguage('en')}
                aria-label="Language: English"
                aria-pressed={language === 'en'}
                className={desktopLangBtn(language === 'en')}
                title="English"
              >
                EN
              </button>
            </div>

            <a
              href={`${homePrefix}#contact`}
              className="btn-light focus-ring inline-flex items-center justify-center rounded-full font-display font-medium text-sm px-5 py-2.5 whitespace-nowrap"
            >
              {t('startProject')}
            </a>
          </div>

          {/* Mobile: language toggle + menu button */}
          <div className="flex items-center gap-2 lg:hidden relative z-50">
            <button
              onClick={() => setLanguage(language === 'cs' ? 'en' : 'cs')}
              aria-label="Switch language"
              className="glass-pill focus-ring px-3 py-1.5 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-white/[0.16]"
            >
              {language === 'cs' ? 'CS' : 'EN'}
            </button>

            <button
              className="glass-pill focus-ring w-10 h-10 flex items-center justify-center text-ink transition-colors hover:bg-white/[0.16]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} strokeWidth={1.6} /> : <Menu size={20} strokeWidth={1.6} />}
            </button>
          </div>
        </div>

        {/* Mobile menu: dark glass panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: EASE_OUT }}
              className="lg:hidden absolute top-full left-4 right-4 sm:left-6 sm:right-6 mt-2 rounded-card overflow-hidden bg-[rgba(14,8,18,0.9)] backdrop-blur-2xl backdrop-saturate-150 border-[1.5px] border-white/[0.14] shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_30px_80px_rgba(0,0,0,0.6)] p-3 flex flex-col gap-1"
            >
              {/* Soft plum light inside the panel */}
              <div className="absolute inset-0 glass-inner-glow pointer-events-none" aria-hidden />

              {LOCALIZED_NAV_ITEMS.map((item) => {
                const isActive = item.isPage ? onSocials : activeSection === item.href.substring(1);
                return (
                  <a
                    key={item.id}
                    href={hrefFor(item)}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-current={isActive ? (item.isPage ? 'page' : 'true') : undefined}
                    className={`focus-ring relative flex items-center gap-3 font-display text-lg font-medium px-4 py-3 rounded-2xl transition-colors duration-300 ${
                      isActive
                        ? 'bg-[rgba(162,77,184,0.3)] text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]'
                        : 'text-ink-2 hover:bg-white/[0.06] hover:text-ink'
                    }`}
                  >
                    {item.isNew && <NewDot />}
                    {labelFor(item)}
                  </a>
                );
              })}

              <div className="relative h-px bg-white/[0.08] mx-4 my-2" />

              {/* Mobile language buttons */}
              <div className="relative flex items-center justify-between gap-3 px-4 py-2">
                <span className="text-xs text-ink-3 font-medium">Language / Jazyk</span>
                <div className="glass-pill flex items-center p-0.5" role="group" aria-label="Language">
                  <button
                    onClick={() => setLanguage('cs')}
                    aria-pressed={language === 'cs'}
                    className={`focus-ring px-3 py-1 rounded-full text-xs font-display font-medium transition-colors ${
                      language === 'cs' ? 'bg-[rgba(162,77,184,0.45)] text-ink' : 'text-ink-3 hover:text-ink'
                    }`}
                  >
                    Čeština
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    aria-pressed={language === 'en'}
                    className={`focus-ring px-3 py-1 rounded-full text-xs font-display font-medium transition-colors ${
                      language === 'en' ? 'bg-[rgba(162,77,184,0.45)] text-ink' : 'text-ink-3 hover:text-ink'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>

              <a
                href={`${homePrefix}#contact`}
                onClick={() => setMobileMenuOpen(false)}
                className="btn-light focus-ring relative mt-2 px-6 py-3.5 rounded-full font-display font-medium text-center"
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
