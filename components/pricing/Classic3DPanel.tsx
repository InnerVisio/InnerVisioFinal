import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Box, Building2, Check, Globe, LucideIcon, Rotate3d, Ruler, Sofa, Sparkles } from 'lucide-react';
import { PRICING } from '../../constants';
import { BRAND } from '../ui/brand';
import { Language } from '../LanguageContext';
import { IconTile, PRICING_UI, riseIn } from './AiPricingPanel';
import { PRICING_HASHES, ServiceOptionId, requestService } from './pricingNav';

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

const CONTACT_OPTION_BY_PRICING_ID: Record<string, ServiceOptionId> = {
  '1': 'exterior',
  '2': 'interior',
  '3': 'floor-3d',
  '4': 'floor-2d',
  '5': 'tour',
  '6': 'web',
};

// Same icon treatment as the AI plans so both services read as equally premium
const ICON_BY_PRICING_ID: Record<string, LucideIcon> = {
  '1': Building2,
  '2': Sofa,
  '3': Box,
  '4': Ruler,
  '5': Rotate3d,
  '6': Globe,
};

interface Classic3DPanelProps {
  language: Language;
  intro: string;
  crossLink: string;
}

export const Classic3DPanel: React.FC<Classic3DPanelProps> = ({ language, intro, crossLink }) => {
  return (
    <div>
      <motion.p {...riseIn()} className="text-center text-ink-2 font-light text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-10 md:mb-12">
        {intro}
      </motion.p>

      <div className="lg:hidden mb-2 flex items-center justify-center gap-3 text-ink-3" aria-hidden>
        <div className="w-8 h-px bg-gradient-to-r from-transparent to-white/25" />
        <span className="font-display font-medium text-[11px] uppercase tracking-[0.2em]">{language === 'cs' ? 'přetáhněte doprava' : 'swipe right'}</span>
        <div className="w-8 h-px bg-gradient-to-l from-transparent to-white/25" />
      </div>

      <div className="-mx-6 px-6 pt-6 pb-10 flex gap-5 overflow-x-auto overflow-y-hidden snap-x snap-mandatory no-scrollbar lg:mx-0 lg:px-0 lg:pb-0 lg:grid lg:grid-cols-3 lg:gap-7 lg:overflow-visible">
        {PRICING.map((item, index) => {
          const local = PRICING_TRANSLATIONS[language]?.[item.id] || PRICING_TRANSLATIONS['cs'][item.id];
          const Icon = ICON_BY_PRICING_ID[item.id] ?? Box;
          return (
            <motion.article
              key={item.id}
              {...riseIn(index * 0.06)}
              className={`relative isolate flex flex-col p-8 md:p-9 w-[85vw] sm:w-[60vw] shrink-0 snap-center lg:w-auto ${
                item.isPopular ? PRICING_UI.featuredCard : PRICING_UI.card
              }`}
            >
              {item.isPopular && (
                <>
                  <div className={PRICING_UI.featuredHalo} aria-hidden />
                  <div className={PRICING_UI.badge}>{language === 'cs' ? 'Doporučujeme' : 'Popular'}</div>
                </>
              )}

              <IconTile icon={Icon} />

              <h3 className={`mt-6 mb-3 ${PRICING_UI.cardTitle}`}>{local.title}</h3>
              <div className="flex items-baseline gap-2 flex-wrap mb-7">
                {/* Text-only prices ("Ceněno individuálně") use a smaller size so they stay on one line */}
                <span className={/\d/.test(local.price) ? PRICING_UI.price : 'font-display font-bold text-ink text-[1.75rem] tracking-tightest leading-[1.15]'}>
                  {local.price}
                </span>
                {local.unit && <span className="font-display text-sm text-ink-2">{local.unit}</span>}
              </div>

              <div className={`${PRICING_UI.divider} mb-7`} />

              <ul className="space-y-3.5 mb-9">
                {local.features.map((feature) => (
                  <li key={feature} className={PRICING_UI.feature}>
                    <Check className={PRICING_UI.tick} strokeWidth={2} aria-hidden />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                onClick={() => requestService(CONTACT_OPTION_BY_PRICING_ID[item.id])}
                className={`${item.isPopular ? BRAND.btnPrimary : BRAND.btnGlass} ${PRICING_UI.cta}`}
              >
                {language === 'cs' ? 'Poptat službu' : 'Request offer'}
              </a>
            </motion.article>
          );
        })}
      </div>

      <motion.div {...riseIn()} className="mt-8 lg:mt-14 text-center">
        <a href={PRICING_HASHES.ai} className={`group ${BRAND.btnGlass} min-h-[48px] py-3 px-6 text-center text-sm md:text-base`}>
          <Sparkles className="w-4 h-4 icon-gradient" strokeWidth={1.75} aria-hidden />
          {crossLink}
          <ArrowRight className="w-4 h-4 text-orchid-soft transition-transform duration-500 md:group-hover:translate-x-1" aria-hidden />
        </a>
      </motion.div>
    </div>
  );
};
