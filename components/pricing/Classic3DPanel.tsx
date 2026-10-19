import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { PRICING } from '../../constants';
import { BRAND } from '../ui/brand';
import { Language } from '../LanguageContext';
import { Price, PRICING_UI, riseIn } from './AiPricingPanel';
import { PRICING_HASHES, ServiceOptionId, requestService } from './pricingNav';

const PRICING_TRANSLATIONS: Record<Language, Record<string, { title: string; price: string; unit: string; features: string[]; note?: string }>> = {
  cs: {
    '1': {
      title: 'Vizualizace Exteriéru',
      price: 'od 6 000',
      unit: 'Kč',
      features: ['4 snímky vizualizací', '4 snímky zákresy do dronu', 'Fotorealistické vizualizace']
    },
    '2': {
      title: 'Vizualizace Interiéru',
      price: 'od 3 000',
      unit: 'Kč / celá nemovitost',
      features: ['Detailní textury', 'Designový nábytek', 'Osvětlení na míru', '2 revize']
    },
    '3': {
      title: '3D půdorysy',
      price: 'od 720',
      unit: 'Kč',
      features: ['Včetně vybavení', 'Materiálové řešení', 'Vysoké rozlišení', 'Popis místností']
    },
    '4': {
      title: '2D půdorysy',
      price: 'od 480',
      unit: 'Kč',
      features: ['Marketingový styl', 'Barevné schéma', 'Kótování', 'Logo studia']
    },
    '5': {
      title: 'Virtuální prohlídky',
      price: 'od 3 600',
      unit: 'Kč',
      features: ['Matterport', 'Interaktivní body', 'Vr kompatibilita']
    },
    '6': {
      title: 'Web s konfigurátorem',
      price: 'Ceněno individuálně',
      unit: '',
      features: ['Moderní design', 'Integrace konfigurátoru', 'SEO optimalizace', 'CMS systém']
    },
    '7': {
      title: 'Video tvorba',
      price: 'od 3 900',
      unit: 'Kč',
      note: 'Natočené videoprohlídky nemovitostí pro inzerát, web a sociální sítě. Natáčíme na místě, střih a hudba v ceně.',
      features: ['Videoprohlídka interiéru od 3 900 Kč', 'Videoprohlídka s dronem od 5 900 Kč', 'Střih, hudba, titulky a logo', 'Formát 16:9 i 9:16 pro Reels']
    }
  },
  en: {
    '1': {
      title: 'Exterior Rendering',
      price: 'from €240',
      unit: '',
      features: ['4 high-res renders', '4 drone photo montages', 'Photorealistic quality']
    },
    '2': {
      title: 'Interior Rendering',
      price: 'from €120',
      unit: ' / entire property',
      features: ['Detailed textures', 'Designer furniture', 'Custom lighting setup', '2 revision rounds']
    },
    '3': {
      title: '3D Floor Plans',
      price: 'from €30',
      unit: '',
      features: ['Fully furnished', 'Material specs', 'High-res output', 'Room tagging']
    },
    '4': {
      title: '2D Floor Plans',
      price: 'from €20',
      unit: '',
      features: ['Marketing style', 'Color schemes', 'Dimensions included', 'Custom studio logo']
    },
    '5': {
      title: 'Virtual Tours',
      price: 'from €145',
      unit: '',
      features: ['Matterport support', 'Interactive hotspots', 'VR headset compatible']
    },
    '6': {
      title: 'Web Configurator',
      price: 'Custom Pricing',
      unit: '',
      features: ['Modern UX/UI design', 'Interactive flat selector', 'SEO optimization', 'Custom admin CMS']
    },
    '7': {
      title: 'Video Production',
      price: 'from €160',
      unit: '',
      note: 'Filmed property video tours for listings, web and social media. Shot on site, editing and music included.',
      features: ['Interior video tour from €160', 'Video tour with drone from €240', 'Editing, music, titles and logo', '16:9 and 9:16 formats for Reels']
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
  '7': 'video',
};

// Below lg the cell is a plain grid whose features row takes the free height (so the buttons sit on one baseline in the 2-column layout)
const ROWS: Record<number, string> = {
  3: 'grid-rows-[auto_1fr_auto]',
  4: 'grid-rows-[auto_auto_1fr_auto]',
  5: 'grid-rows-[auto_auto_auto_1fr_auto]',
};

// "od 6 000" / "from €240" -> small prefix + amount; the unit may start with the currency ("Kč / celá nemovitost")
const parsePrice = (price: string, unit: string) => {
  const m = price.match(/^(od|from)\s+(.*)$/i);
  const prefix = m ? m[1] : '';
  const amount = m ? m[2] : price;
  const u = unit.trim();
  const cur = u.match(/^Kč\s*(.*)$/);
  return cur
    ? { prefix, amount: `${amount} Kč`, suffix: cur[1] }
    : { prefix, amount, suffix: u };
};

interface Classic3DPanelProps {
  language: Language;
  intro: string;
  crossLink: string;
}

export const Classic3DPanel: React.FC<Classic3DPanelProps> = ({ language, intro, crossLink }) => {
  const cta = language === 'cs' ? 'Poptat službu' : 'Request offer';

  return (
    <div>
      <motion.p {...riseIn()} className="text-center text-ink-2 font-light text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-10 md:mb-14">
        {intro}
      </motion.p>

      {/* A price list, not a card wall: six cells sharing hairline dividers (1px gaps over a hairline-coloured backdrop) */}
      <motion.div
        {...riseIn(0.05)}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[repeat(10,auto)] gap-px rounded-card overflow-hidden border border-white/10 bg-white/10"
      >
        {PRICING.map((item) => {
          const local = PRICING_TRANSLATIONS[language]?.[item.id] || PRICING_TRANSLATIONS['cs'][item.id];
          const featured = !!item.isPopular;
          const numeric = /\d/.test(local.price);
          const { prefix, amount, suffix } = parsePrice(local.price, local.unit);

          // The video offer is a wide row under the price list: name + price | what's included | request
          if (item.id === '7') {
            return (
              <article
                key={item.id}
                className="group grid gap-6 p-5 md:p-8 md:col-span-2 lg:col-span-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)_auto] lg:items-center lg:gap-12 lg:px-9 bg-[#09060c] transition-colors duration-500 md:hover:bg-[#0e0912]"
              >
                <div>
                  <h3 className="font-display font-semibold text-ink text-lg md:text-xl tracking-tightest leading-snug">{local.title}</h3>
                  {local.note && <p className="mt-2 text-sm text-ink-2 font-light leading-relaxed max-w-sm">{local.note}</p>}
                  <div className="mt-4">
                    <Price from={prefix} price={amount} unit={suffix} size="md" />
                  </div>
                </div>
                <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5 lg:border-l lg:border-white/10 lg:pl-12">
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
                  className={`${PRICING_UI.btnOutline} h-12 md:h-[52px] px-7 text-sm lg:w-auto`}
                >
                  {cta}
                  <ArrowRight className="w-4 h-4 text-orchid-soft transition-transform duration-500 md:group-hover:translate-x-1" aria-hidden />
                </a>
              </article>
            );
          }

          // Long prices (text, or with a unit like "/ celá nemovitost") get their own line on phones instead of sharing the title row
          const stacked = !numeric || suffix.length > 6;
          return (
            <article
              key={item.id}
              className={`group grid grid-cols-[minmax(0,1fr)_auto] ${ROWS[(stacked ? 1 : 0) + 3]} p-5 md:p-8 lg:grid-cols-1 lg:grid-rows-subgrid lg:row-span-5 lg:px-9 ${
                featured
                  ? 'bg-[radial-gradient(90%_60%_at_0%_0%,rgba(162,77,184,0.30)_0%,transparent_70%),linear-gradient(180deg,#24102d_0%,#12081a_100%)]'
                  : 'bg-[#09060c] transition-colors duration-500 md:hover:bg-[#0e0912]'
              }`}
            >
              {/* Row 1: empty spacer so the cell keeps its five shared desktop rows (no label boxes; the tinted cell marks the recommended service) */}
              <div className="hidden lg:block" aria-hidden />

              {/* Rows 2 and 3: name + price. Side by side on phones/tablets (compact), stacked on desktop */}
              <h3 className="font-display font-semibold text-ink text-lg md:text-xl tracking-tightest leading-snug self-center lg:self-start">
                {local.title}
              </h3>
              <div className={`lg:mt-4 ${stacked ? 'col-span-2 lg:col-span-1 mt-1.5' : 'text-right lg:text-left'}`}>
                {numeric ? (
                  <Price from={prefix} price={amount} unit={suffix} size="md" className={stacked ? '' : 'justify-end lg:justify-start'} />
                ) : (
                  <Price price={local.price} size="md" />
                )}
              </div>

              {/* Row 4: features */}
              <ul className="col-span-2 lg:col-span-1 mt-4 pt-4 lg:mt-6 lg:pt-6 border-t border-white/10 grid grid-cols-2 md:grid-cols-1 gap-x-4 gap-y-2 md:gap-y-2.5 lg:self-start">
                {local.features.map((feature) => (
                  <li key={feature} className={PRICING_UI.feature}>
                    <Check className={PRICING_UI.tick} strokeWidth={2} aria-hidden />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Row 5: request */}
              <a
                href="#contact"
                onClick={() => requestService(CONTACT_OPTION_BY_PRICING_ID[item.id])}
                className={`col-span-2 lg:col-span-1 mt-5 lg:mt-7 lg:self-end ${
                  featured
                    ? `${BRAND.btnPrimary} h-12 md:h-[52px] w-full text-sm`
                    : `focus-ring flex items-center justify-between h-12 border-t border-white/10 font-display font-medium text-sm text-ink transition-colors duration-300 md:hover:text-orchid-pale`
                }`}
              >
                {cta}
                {!featured && <ArrowRight className="w-4 h-4 text-orchid-soft transition-transform duration-500 md:group-hover:translate-x-1" aria-hidden />}
              </a>
            </article>
          );
        })}
      </motion.div>

      <motion.div {...riseIn()} className="mt-10 lg:mt-14 text-center">
        <a href={PRICING_HASHES.ai} className={`group ${PRICING_UI.btnOutline} min-h-[48px] py-3 px-6 text-center text-sm md:text-base`}>
          <Sparkles className="w-4 h-4 icon-gradient" strokeWidth={1.75} aria-hidden />
          {crossLink}
          <ArrowRight className="w-4 h-4 text-orchid-soft transition-transform duration-500 md:group-hover:translate-x-1" aria-hidden />
        </a>
      </motion.div>
    </div>
  );
};
