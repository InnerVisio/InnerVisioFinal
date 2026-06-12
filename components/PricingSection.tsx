import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { PRICING } from '../constants';
import { useLanguage, Language } from './LanguageContext';

const PRICING_TRANSLATIONS: Record<Language, Record<string, { title: string; price: string; unit: string; features: string[] }>> = {
  cs: {
    '1': {
      title: 'Vizualizace Exteriéru',
      price: 'od 5 000',
      unit: 'Kč',
      features: ['4 snímky vizualizací', '4 snímky zákresy do dronu', 'Fotorealistické vizualizace']
    },
    '2': {
      title: 'Vizualizace Interiéru',
      price: 'od 2 500',
      unit: 'Kč / celá nemovitost',
      features: ['Detailní textury', 'Designový nábytek', 'Osvětlení na míru', '2 revize']
    },
    '3': {
      title: '3D půdorysy',
      price: 'od 600',
      unit: 'Kč',
      features: ['Včetně vybavení', 'Materiálové řešení', 'Vysoké rozlišení', 'Popis místností']
    },
    '4': {
      title: '2D půdorysy',
      price: 'od 400',
      unit: 'Kč',
      features: ['Marketingový styl', 'Barevné schéma', 'Kótování', 'Logo studia']
    },
    '5': {
      title: 'Virtuální prohlídky',
      price: 'od 3 000',
      unit: 'Kč',
      features: ['Matterport', 'Interaktivní body', 'Vr kompatibilita']
    },
    '6': {
      title: 'Web s konfigurátorem',
      price: 'Ceněno individuálně',
      unit: '',
      features: ['Moderní design', 'Integrace konfigurátoru', 'SEO optimalizace', 'CMS systém']
    }
  },
  en: {
    '1': {
      title: 'Exterior Rendering',
      price: 'from €200',
      unit: '',
      features: ['4 high-res renders', '4 drone photo montages', 'Photorealistic quality']
    },
    '2': {
      title: 'Interior Rendering',
      price: 'from €100',
      unit: ' / entire property',
      features: ['Detailed textures', 'Designer furniture', 'Custom lighting setup', '2 revision rounds']
    },
    '3': {
      title: '3D Floor Plans',
      price: 'from €25',
      unit: '',
      features: ['Fully furnished', 'Material specs', 'High-res output', 'Room tagging']
    },
    '4': {
      title: '2D Floor Plans',
      price: 'from €15',
      unit: '',
      features: ['Marketing style', 'Color schemes', 'Dimensions included', 'Custom studio logo']
    },
    '5': {
      title: 'Virtual Tours',
      price: 'from €120',
      unit: '',
      features: ['Matterport support', 'Interactive hotspots', 'VR headset compatible']
    },
    '6': {
      title: 'Web Configurator',
      price: 'Custom Pricing',
      unit: '',
      features: ['Modern UX/UI design', 'Interactive flat selector', 'SEO optimization', 'Custom admin CMS']
    }
  }
};

export const PricingSection: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <section id="pricing" className="py-32 px-6 bg-background relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 blur-[120px] rounded-full z-0 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 animate-fade-in"
        >
          <span className="text-secondary font-medium tracking-widest uppercase text-xs md:text-sm mb-2 block font-display">
            {t('pricingSubtitle')}
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tighter">
            {language === 'cs' ? (
              <>Ceník <span className="text-gray-600">Služeb</span></>
            ) : (
              <>Pricing <span className="text-gray-600">Plans</span></>
            )}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mt-6 text-sm md:text-lg leading-relaxed font-light">
            {t('pricingDesc')}
          </p>
        </motion.div>

        <div className="lg:hidden mb-2 flex items-center justify-center gap-2 text-gray-400 animate-pulse">
          <div className="w-8 h-px bg-gray-600" />
          <span className="text-xs uppercase tracking-[0.2em] font-bold">{language === 'cs' ? 'přetáhněte doprava' : 'swipe right'}</span>
          <div className="w-8 h-px bg-gray-600" />
        </div>
        <div className="lg:hidden -mx-6 px-6 pt-6 overflow-x-auto overflow-y-hidden snap-x snap-mandatory no-scrollbar pb-8">
          <div className="flex gap-6 w-max">
            {PRICING.map((item, index) => {
              const local = PRICING_TRANSLATIONS[language]?.[item.id] || PRICING_TRANSLATIONS['cs'][item.id];
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative p-8 rounded-3xl border transition-all duration-500 group w-[85vw] snap-center ${
                    item.isPopular 
                      ? 'bg-secondary/5 border-secondary/30 shadow-[0_0_40px_rgba(101,36,111,0.1)]' 
                      : 'bg-white/5 border-white/10 md:hover:border-white/20'
                  }`}
                >
                  {item.isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-secondary text-white text-xs font-bold rounded-full uppercase tracking-widest font-display">
                      {language === 'cs' ? 'Doporučujeme' : 'Popular'}
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-white mb-2">{local.title}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-3xl font-display font-bold text-white">{local.price}</span>
                    <span className="text-gray-500 text-sm">{local.unit}</span>
                  </div>

                  <div className="h-px w-full bg-white/10 mb-6" />

                  <ul className="space-y-4 mb-8">
                    {local.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-gray-400 text-sm font-light">
                        <Check className="w-4 h-4 text-secondary shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <a 
                    href="#contact" 
                    className={`block w-full py-4 rounded-xl text-center font-semibold transition-all ${
                      item.isPopular
                        ? 'bg-secondary text-white shadow-[0_0_20px_rgba(101,36,111,0.3)] md:hover:shadow-[0_0_30px_rgba(101,36,111,0.5)]'
                        : 'bg-white/10 text-white md:hover:bg-white/20'
                    }`}
                  >
                    {language === 'cs' ? 'Poptat službu' : 'Inquire layout'}
                  </a>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="hidden lg:grid grid-cols-3 gap-8 pt-6">
          {PRICING.map((item, index) => {
            const local = PRICING_TRANSLATIONS[language]?.[item.id] || PRICING_TRANSLATIONS['cs'][item.id];
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative p-8 rounded-3xl border transition-all duration-500 group ${
                  item.isPopular 
                    ? 'bg-secondary/5 border-secondary/30 shadow-[0_0_40px_rgba(101,36,111,0.1)]' 
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                {item.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-secondary text-white text-xs font-bold rounded-full uppercase tracking-widest font-display">
                    {language === 'cs' ? 'Doporučujeme' : 'Popular'}
                  </div>
                )}

                <h3 className="text-xl font-bold text-white mb-2">{local.title}</h3>
                <div className="flex items-baseline gap-1 mb-6 font-display">
                  <span className="text-3xl font-bold text-white">{local.price}</span>
                  <span className="text-gray-500 text-sm ">{local.unit}</span>
                </div>

                <div className="h-px w-full bg-white/10 mb-6" />

                <ul className="space-y-4 mb-8">
                  {local.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-400 text-sm font-light">
                      <Check className="w-4 h-4 text-secondary shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <a 
                  href="#contact" 
                  className={`block w-full py-4 rounded-xl text-center font-semibold transition-all ${
                    item.isPopular
                      ? 'bg-secondary text-white shadow-[0_0_20px_rgba(101,36,111,0.3)] hover:shadow-[0_0_30px_rgba(101,36,111,0.5)]'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {language === 'cs' ? 'Poptat službu' : 'Request offer'}
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
