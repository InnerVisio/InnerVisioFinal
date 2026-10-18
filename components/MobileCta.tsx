import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Phone } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { BRAND, EASE_OUT } from './ui/brand';
import { track } from '../analytics';

// Phones only: keeps "inquire" one tap away once the visitor scrolls past the hero.
// Hidden while the contact form or footer is on screen, where it would just duplicate them.
export const MobileCta: React.FC = () => {
  const { language } = useLanguage();
  const [pastHero, setPastHero] = useState(false);
  const [contactInView, setContactInView] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const targets = [document.getElementById('contact'), document.querySelector('footer')].filter(Boolean) as Element[];
    const visible = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => (entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target)));
      setContactInView(visible.size > 0);
    });
    targets.forEach((t) => observer.observe(t));

    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, []);

  const show = pastHero && !contactInView;
  const cs = language === 'cs';

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          className="lg:hidden fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pointer-events-none"
        >
          <div className="glass-strong rounded-full p-1.5 flex items-center gap-1.5 max-w-md mx-auto pointer-events-auto">
            <a
              href="#contact"
              onClick={() => track('cta_click', { location: 'mobile_sticky' })}
              className={`${BRAND.btnPrimary} flex-1 h-12 px-5 text-sm`}
            >
              {cs ? 'Nezávazná poptávka' : 'Free quote'}
              <ArrowRight className="w-4 h-4" strokeWidth={1.75} aria-hidden />
            </a>
            <a
              href="tel:+420604445240"
              aria-label={cs ? 'Zavolat +420 604 445 240' : 'Call +420 604 445 240'}
              className={`${BRAND.btnGlass} w-12 h-12 shrink-0`}
            >
              <Phone className="w-[18px] h-[18px] icon-gradient" strokeWidth={1.75} aria-hidden />
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
