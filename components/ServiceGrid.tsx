import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AI_BEFORE_AFTER, SERVICES } from '../constants';
import { ArrowRight, X, ArrowUpRight } from 'lucide-react';
import { ServiceItem } from '../types';
import { useLanguage, Language } from './LanguageContext';
import { blurInRise, EASE_OUT } from './ui/brand';

type ServiceCopy = { title: string; description: string; detailedDescription: string; features: string[] };

// `description` is the one-line card text; `detailedDescription` is shown in the detail modal.
const SERVICE_TRANSLATIONS: Record<Language, Record<string, ServiceCopy>> = {
  cs: {
    '1': {
       title: 'Vizualizace Exteriéru',
       description: 'Fotorealistické domy a budovy se světlem, materiály i okolím.',
       detailedDescription: 'Nabízíme špičkové fotorealistické vizualizace exteriérů pro developerské projekty i rodinné domy. Soustředíme se na dokonalou hru světel, stínů a zasazení rodinného domu do reálného terénu či okolní zástavby.',
       features: ['Realistické materiály a textury', 'Denní a noční scenérie', 'Zakomponování do fotografie', 'Úprava okolí podle architektonické studie'],
    },
    '2': {
       title: 'Vizualizace Interiéru',
       description: 'Atmosféra, materiály a světlo místností ještě před realizací.',
       detailedDescription: 'Tvorba 3D návrhů interiérů, které klade důraz na atmosféru, správné osvětlení a rozvržení prostoru. Vaši klienti si díky tomu dokáží živě představit domov či kancelář dříve, než se položí první cihla.',
       features: ['Precizní nasvícení scény', 'Atmosférické záběry', 'Realistické modely nábytku', 'Vyladěné textury vybavení'],
    },
    '3': {
       title: '3D půdorysy',
       description: 'Dispozice z nadhledu, srozumitelná i pro laiky.',
       detailedDescription: 'Klasické 2D půdorysy jsou často pro laiky nečitelné. Pomocí 3D půdorysu nabízíme prostorový náhled objektu z nadhledu, což zajišťuje perfektní představu o celkovém uspořádání a provozu domácnosti.',
       features: ['Trojrozměrná vizualizace příček a oken', 'Základní nebo detailní vybavení nábytkem', 'Skvělé pro inzerci na realitních portálech', 'Zvýšení důvěry a zájmu klientů'],
    },
    '4': {
       title: '2D půdorysy',
       description: 'Přehledná schémata podlaží pro prodej a pronájem.',
       detailedDescription: 'Prezentujeme technické nákresy ve srozumitelné a esteticky laděné podobě. Ideální doplněk pro prodej bytů a pronájmy kancelářských ploch.',
       features: ['Barevné kódování a materiály (např. dekor dřeva)', 'Doplnění výměr jednotlivých místností', 'Možnost přidání vašeho loga', 'Jasné vyznačení dispozice s kótami'],
    },
    '5': {
       title: 'Virtuální prohlídky',
       description: 'Interaktivní 360° prohlídka, kterou sdílíte odkazem.',
       detailedDescription: 'Nabízíme revoluční možnost, jak se projít domem ještě před jeho dokončením. Klient se může libovolně rozhlížet a procházet jednotlivými místnostmi v úhlu 360 stupňů.',
       features: ['Pohyb ve scéně pomocí hotspotů', 'Napojení pro brýle s virtuální realitou', 'Zapracování informačních bodů', 'Snadné sdílení formou odkazu'],
    },
    '6': {
       title: 'Web s konfigurátorem',
       description: 'Prezentační web projektu s interaktivním výběrem bytů.',
       detailedDescription: 'Developerům a realitním kancelářím tvoříme ucelené prezentační webové stránky pro konkrétní stavební projekty s interaktivním výběrem bytů a integrací vizuálního materiálu. Toto je fiktivní projekt pro ukázku funkčnosti, pokud máte zájem o plnohodnotnou stránku s těmito funkcemi, ozvěte se nám.',
       features: ['Interaktivní 2D/3D navigace (klikací budova)', 'Filtrování volných/obsazených bytů', 'Moderní animace a uživatelský UX/UI design', 'SEO optimalizace pro vyhledávače'],
    },
    '7': {
       title: 'AI vizualizace',
       description: 'Fotorealistická vizualizace z fotky, skici nebo půdorysu do 24 hodin.',
       detailedDescription: 'Z fotky z mobilu, skici nebo půdorysu vytvoříme fotorealistickou vizualizaci interiéru či exteriéru do 24 hodin. AI je pro nás nástroj, nápad, materiály a funkčnost dodává člověk. Každý snímek ručně kontrolujeme, aby seděla geometrie, proporce i světlo.',
       features: ['Hotovo do 24 hodin', '3 stylové varianty v ceně', 'Zachovaná geometrie a proporce prostoru', 'Transparentní označení dle EU AI Act'],
    },
    '8': {
       title: 'Video tvorba',
       description: 'Natočené videoprohlídky nemovitostí, i z dronu, pro inzerát, web a sociální sítě.',
       detailedDescription: 'Nemovitost natočíme na místě a postavíme z ní videoprohlídku, která prodává. Stabilizované záběry interiéru, u domů i dron z výšky, střih, hudba, titulky a logo vaší kanceláře. Video dodáme ve formátu 16:9 pro web a inzerci i 9:16 pro Reels a Stories.',
       features: ['Natáčení nemovitosti přímo na místě', 'Záběry z dronu pro exteriér a okolí', 'Střih, hudba, titulky a logo', 'Formát 16:9 i 9:16 pro Reels'],
    }
  },
  en: {
    '1': {
       title: 'Exterior Rendering',
       description: 'Photorealistic buildings with true light, materials and surroundings.',
       detailedDescription: 'We build high-end photorealistic architectural exterior representations for builders, developers, and private home renovators. We study physical lighting conditions to craft seamless real-world compositions.',
       features: ['Realistic physical textures', 'Multi-time atmosphere (Day/Sunset/Night)', 'Existing environment photomontages', 'Surrounding terrain studies'],
    },
    '2': {
       title: 'Interior Rendering',
       description: 'The atmosphere, materials and light of a room before it is built.',
       detailedDescription: 'Creating 3D internal room concepts focusing on warm atmosphere, custom furniture schemes, material tactile sensations and lighting. Let your prospective buyers explore rooms long before building.',
       features: ['Detailed color temperature setups', 'Atmospheric mood-settings', 'High-poly furniture modeling', 'Premium materials & textures'],
    },
    '3': {
       title: '3D Floor Plans',
       description: 'Top-down layouts that anyone can read at a glance.',
       detailedDescription: 'Standard flat drafts are often tough to comprehend for buyers. Our 3D plans deliver an instant clear spatial top-down overview of walls, rooms, sizing, and modern interior flows.',
       features: ['Precision 3D walls & openings modeling', 'Modern custom lifestyle furniture', 'Tailored for property portal listings', 'Significantly higher client engagement'],
    },
    '4': {
       title: '2D Floor Plans',
       description: 'Clean floor plan diagrams for sales and leasing.',
       detailedDescription: 'We translate raw builder layouts into legible, beautiful, and aesthetic sales pamphlets. Essential addition for project listings, brochures, and leasing websites.',
       features: ['Color matching & flooring textures', 'Interactive overall room statistics', 'Optional company logo watermarks', 'Clear metric scale listings'],
    },
    '5': {
       title: 'Virtual Tours (360°)',
       description: 'Interactive 360° walkthroughs you share with a link.',
       detailedDescription: 'Let clients walk through room projects from the web before groundbreaking! Users can pan around 360-degrees on any device or slide into VR headsets for maximum presence of scale.',
       features: ['Interactive hotspot node navigation', 'Mobile & VR headset responsive', 'Integrated smart info tags', 'Fast link-to-share web hosting'],
    },
    '6': {
       title: 'Developer Configurator',
       description: 'A project website with an interactive flat selector.',
       detailedDescription: 'Custom, high-converting property portfolio web development. Features interactive building floor selection tools, unit availability tables, interactive location map tags and responsive forms. This is a fictional project for demonstration purposes; if you are interested in a full-fledged website with these features, please contact us.',
       features: ['Interactive clicks on building floor layouts', 'Live real-time flat filter systems', 'Ultra-fast loading times & SEO', 'Simplified custom admin dashboard'],
    },
    '7': {
       title: 'AI Visualization',
       description: 'A photorealistic visualization from a photo, sketch or plan within 24 hours.',
       detailedDescription: 'From a phone photo, sketch or floor plan we create a photorealistic interior or exterior visualization within 24 hours. AI is our tool; the idea, materials and function come from people. We check every image by hand so geometry, proportions and light stay right.',
       features: ['Ready within 24 hours', '3 style variants included', 'Geometry and proportions preserved', 'Transparent labelling under the EU AI Act'],
    },
    '8': {
       title: 'Video Production',
       description: 'Filmed property video tours, drone included, for listings, web and social media.',
       detailedDescription: 'We film the property on site and build a video tour that sells. Stabilised interior footage, drone shots from above for houses, editing, music, titles and your agency logo. Delivered in 16:9 for web and listings and 9:16 for Reels and Stories.',
       features: ['Filmed on site at the property', 'Drone footage of the exterior and surroundings', 'Editing, music, titles and logo', '16:9 and 9:16 formats for Reels'],
    }
  }
};

// Price hints mirror the pricing section (Classic3DPanel PRICING_TRANSLATIONS / aiPricingContent)
const PRICE_HINTS: Record<Language, Record<string, string>> = {
  cs: {
    '1': 'od 6 000 Kč', '2': 'od 3 000 Kč', '3': 'od 720 Kč', '4': 'od 480 Kč',
    '5': 'od 3 600 Kč', '6': 'Cena individuálně', '7': 'od 290 Kč', '8': 'od 3 900 Kč',
  },
  en: {
    '1': 'from €240', '2': 'from €120', '3': 'from €30', '4': 'from €20',
    '5': 'from €145', '6': 'Custom pricing', '7': 'from €12', '8': 'from €160',
  },
};

// Video production offers, same prices as the classic pricing tab
const VIDEO_OFFERS: Record<Language, { name: string; price: string }[]> = {
  cs: [
    { name: 'Videoprohlídka interiéru', price: 'od 3 900 Kč' },
    { name: 'Videoprohlídka s dronem', price: 'od 5 900 Kč' },
  ],
  en: [
    { name: 'Interior video tour', price: 'from €160' },
    { name: 'Video tour with drone', price: 'from €240' },
  ],
};

// The three AI offers, same prices as the AI pricing tab
const AI_OFFERS: Record<Language, { name: string; price: string }[]> = {
  cs: [
    { name: 'AI Home staging', price: 'od 290 Kč / fotka' },
    { name: 'AI vizualizace', price: 'od 2 900 Kč / 4 snímky' },
    { name: 'AI video', price: 'od 1 990 Kč / klip' },
  ],
  en: [
    { name: 'AI Home staging', price: 'from €12 / photo' },
    { name: 'AI visualization', price: 'from €116 / 4 images' },
    { name: 'AI video', price: 'from €80 / clip' },
  ],
};

const COPY = {
  cs: {
    heading: 'Vizualizace pro každý projekt',
    lead: 'Klasické 3D vizualizace přesně podle projektu a AI vizualizace do 24 hodin. Pro architekty, developery, makléře i majitele domů z Prahy, Ostravy i celé ČR.',
    aiTitle: 'AI vizualizace',
    aiTail: 'rychle, do 24 hodin',
    classicTitle: 'Klasické 3D vizualizace',
    classicTail: 'přesně podle projektu',
    videoTitle: 'Video tvorba',
    videoTail: 'nemovitost v pohybu',
    learnMore: 'Zjistit více',
    aiPricing: 'Zobrazit ceník',
    aiFrom: 'od zadání po dodání',
    priceLabel: 'Cena',
    eyebrowModal: 'Služby Studia',
    request: 'Poptat tuto službu',
    interested: 'Mám zájem',
    demo: 'Chci vidět ukázku',
    aiPricingFull: 'Zobrazit ceník AI vizualizací',
    imageN: (n: number) => `Zobrazit obrázek ${n}`,
    groupAria: 'Služby',
  },
  en: {
    heading: 'Visualization for every project',
    lead: 'Classic 3D visualization true to your project, and AI visualization within 24 hours. For architects, developers, agents and home owners in Prague, Ostrava and across the Czech Republic.',
    aiTitle: 'AI visualization',
    aiTail: 'fast, within 24 hours',
    classicTitle: 'Classic 3D visualization',
    classicTail: 'true to your project',
    videoTitle: 'Video production',
    videoTail: 'property in motion',
    learnMore: 'Learn more',
    aiPricing: 'View pricing',
    aiFrom: 'from brief to delivery',
    priceLabel: 'Price',
    eyebrowModal: 'Studio Services',
    request: 'Request service',
    interested: 'I am interested',
    demo: 'View demo',
    aiPricingFull: 'See AI visualization pricing',
    imageN: (n: number) => `View image ${n}`,
    groupAria: 'Services',
  },
} as const;

// Headline with exactly one gradient word (the last one), per brand typography rules
const GradientHeadline: React.FC<{ text: string }> = ({ text }) => {
  const idx = text.lastIndexOf(' ');
  if (idx === -1) return <span className="text-gradient">{text}</span>;
  return (
    <>
      {text.slice(0, idx)} <span className="text-gradient">{text.slice(idx + 1)}</span>
    </>
  );
};

// Branded stand-in for services that have no photo yet (used in the detail modal)
const ServicePlaceholder: React.FC<{ icon: ServiceItem['icon'] }> = ({ icon: Icon }) => (
  <div className="absolute inset-0 bg-[radial-gradient(90%_80%_at_70%_20%,rgba(196,139,224,0.32)_0%,rgba(91,39,105,0.55)_42%,#1F0F29_100%)] flex items-center justify-center">
    <div className="absolute w-48 h-48 rounded-full glow-orchid opacity-70" aria-hidden />
    <Icon className="relative w-16 h-16 icon-gradient" strokeWidth={1} aria-hidden />
  </div>
);

// Group sub-heading: "Title – tail" with a hairline running to the edge
const GroupHeading: React.FC<{ title: string; tail: string; id: string }> = ({ title, tail, id }) => (
  <motion.div {...blurInRise(0, 20)} className="flex items-center gap-5 mb-6 md:mb-8">
    <h3 id={id} className="font-display text-xl md:text-2xl tracking-tightest leading-snug text-ink font-semibold">
      {title}
      <span className="font-normal text-ink-2"> – {tail}</span>
    </h3>
    <span className="hidden md:block h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" aria-hidden />
  </motion.div>
);

interface CardProps {
  service: ServiceItem;
  index: number;
  price: string;
  learnMore: string;
  onOpen: (service: ServiceItem, trigger: HTMLElement | null) => void;
}

// Compact card: image + text row on phones, vertical card from sm up. The "learn more" button is
// stretched over the whole card, so the card is one real interactive element.
const ServiceCard: React.FC<CardProps> = ({ service, index, price, learnMore, onOpen }) => (
  <motion.li {...blurInRise((index % 3) * 0.08, 24)} className="group relative">
    <article className="relative h-full flex sm:flex-col gap-4 sm:gap-0 p-2 rounded-card border border-white/10 bg-white/[0.035] transition-[border-color,box-shadow,background-color] duration-500 hover:border-white/25 hover:bg-white/[0.055] hover:shadow-[0_24px_60px_rgba(0,0,0,0.45),0_0_50px_rgba(162,77,184,0.22)] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-[3px] has-[:focus-visible]:outline-orchid-soft">
      {/* Photo */}
      <div className="relative shrink-0 w-[104px] min-[400px]:w-[120px] sm:w-full self-stretch sm:self-auto sm:aspect-[16/10] overflow-hidden rounded-[20px] sm:rounded-[22px] bg-plum-black">
        {service.imageUrl && (
          <img
            loading="lazy"
            src={service.imageUrl}
            alt={`${service.title} – InnerVisio`}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2400ms] ease-out md:group-hover:scale-[1.04]"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0612]/70 via-transparent to-transparent pointer-events-none" aria-hidden />
      </div>

      {/* Text */}
      <div className="flex flex-col flex-1 min-w-0 py-1.5 pr-2 sm:px-4 sm:pt-5 sm:pb-3">
        <h4 className="font-display font-semibold text-ink text-[17px] sm:text-xl tracking-tightest leading-tight mb-1.5 sm:mb-2">
          {service.title}
        </h4>
        <p className="text-ink-2 text-sm leading-relaxed font-light line-clamp-3 sm:line-clamp-none mb-3 sm:mb-5">
          {service.description}
        </p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <span className="font-display text-sm font-medium text-ink">{price}</span>
          <button
            type="button"
            onClick={(e) => onOpen(service, e.currentTarget)}
            className="focus-ring focus-visible:outline-transparent inline-flex items-center gap-1.5 font-display font-medium text-sm text-orchid-soft transition-colors duration-300 group-hover:text-orchid-pink after:absolute after:inset-0 after:rounded-card after:content-['']"
          >
            {learnMore}
            <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-0.5" aria-hidden />
          </button>
        </div>
      </div>
    </article>
  </motion.li>
);

export const ServiceGrid: React.FC = () => {
  const { language, t } = useLanguage();
  const copy = COPY[language] ?? COPY.cs;
  const [selectedServiceModal, setSelectedServiceModal] = useState<ServiceItem | null>(null);
  const [selectedServiceImageIndex, setSelectedServiceImageIndex] = useState(0);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);

  const getLocalizedService = (raw: ServiceItem): ServiceItem => {
    const local = SERVICE_TRANSLATIONS[language]?.[raw.id];
    return {
      ...raw,
      title: local?.title || raw.title,
      description: local?.description || raw.description,
      detailedDescription: local?.detailedDescription || raw.detailedDescription,
      features: local?.features || raw.features,
    };
  };
  const priceOf = (id: string) => PRICE_HINTS[language]?.[id] ?? '';

  const aiService = SERVICES.find((s) => s.id === '7');
  const videoService = SERVICES.find((s) => s.id === '8');
  const classicServices = SERVICES.filter((s) => s.id !== '7' && s.id !== '8');

  const handleOpenModal = (service: ServiceItem, trigger: HTMLElement | null) => {
    lastFocusRef.current = trigger ?? (document.activeElement as HTMLElement | null);
    setSelectedServiceModal(service);
    setSelectedServiceImageIndex(0);
  };

  const closeModal = () => {
    setSelectedServiceModal(null);
    lastFocusRef.current?.focus?.();
  };

  // Escape closes the modal; focus moves into the dialog when it opens; page does not scroll behind it
  useEffect(() => {
    if (!selectedServiceModal) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKey);
    const id = window.setTimeout(() => closeBtnRef.current?.focus(), 50);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(id);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedServiceModal]);

  const aiLocal = aiService ? getLocalizedService(aiService) : null;
  const videoLocal = videoService ? getLocalizedService(videoService) : null;

  return (
    <section id="services" className="relative z-10 py-24 md:py-36">
      {/* Soft plum glows so the glass has something to refract */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="glow-plum rounded-full absolute -left-40 top-[18%] w-[640px] h-[640px] animate-drift-slow" />
        <div className="glow-orchid rounded-full absolute right-[-12%] top-[55%] w-[520px] h-[520px] opacity-70" />
        <div className="glow-plum rounded-full absolute left-1/2 -translate-x-1/2 bottom-[-220px] w-[900px] h-[420px] opacity-60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Section Header */}
        <motion.div {...blurInRise(0)} className="max-w-3xl mb-12 md:mb-16">
          <span className="eyebrow block mb-4">{t('servicesSubtitle')}</span>
          <h2 className="font-display font-bold text-ink text-4xl md:text-6xl tracking-tightest leading-[1.05] mb-6">
            <GradientHeadline text={copy.heading} />
          </h2>
          <p className="text-ink-2 text-base md:text-lg font-light leading-relaxed max-w-2xl">
            {copy.lead}
          </p>
        </motion.div>

        {/* Group 1: AI visualization (the new highlight) */}
        {aiService && aiLocal && (
          <div role="group" aria-labelledby="services-ai-title">
            <GroupHeading id="services-ai-title" title={copy.aiTitle} tail={copy.aiTail} />

            <motion.article
              {...blurInRise(0.05, 24)}
              className="glass-strong glass-inner-glow relative overflow-hidden rounded-card md:rounded-card-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_0_70px_rgba(162,77,184,0.28)] grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-2 lg:gap-4 p-2 md:p-3"
            >
              {/* Real AI example: the finished result with the 24 h promise as plain type (no label boxes) */}
              <div className="relative overflow-hidden rounded-[22px] md:rounded-[28px] min-h-[220px] md:min-h-[300px] lg:min-h-[380px] bg-plum-black border border-white/10">
                <img
                  src={AI_BEFORE_AFTER.afterSmall}
                  alt={language === 'cs' ? 'AI vizualizace rekonstruovaného domu' : 'AI visualization of a renovated house'}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,3,8,0.25)_0%,rgba(5,3,8,0)_35%,rgba(5,3,8,0.75)_100%)]" aria-hidden />
                <p className="absolute left-4 bottom-4 md:left-6 md:bottom-6 flex items-baseline gap-3 drop-shadow-[0_2px_14px_rgba(5,3,8,0.7)]">
                  <span className="font-display font-bold text-ink text-4xl md:text-5xl tracking-tightest leading-none">24 h</span>
                  <span className="font-display text-sm text-ink-2">{copy.aiFrom}</span>
                </p>
              </div>
              {/* Text */}
              <div className="relative flex flex-col p-4 pb-5 md:p-8 lg:p-10">
                <h4 className="font-display font-bold text-ink text-3xl md:text-4xl tracking-tightest leading-[1.08] mb-3">
                  {aiLocal.title}
                </h4>
                <p className="text-ink-2 text-base leading-relaxed font-light max-w-xl mb-6">
                  {aiLocal.description}
                </p>

                <ul className="mb-7 md:mb-8 border-t border-white/10">
                  {AI_OFFERS[language].map((offer) => (
                    <li key={offer.name} className="flex items-baseline justify-between gap-4 py-3 border-b border-white/10">
                      <span className="font-display font-medium text-sm md:text-base text-ink">{offer.name}</span>
                      <span className="font-display text-sm md:text-base text-orchid-soft text-right">{offer.price}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={(e) => handleOpenModal(aiService, e.currentTarget)}
                    className="btn-primary focus-ring group inline-flex items-center justify-center gap-2 min-h-[48px] rounded-full px-7 py-3 font-display font-medium text-sm md:text-base whitespace-nowrap"
                  >
                    {copy.learnMore}
                    <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-0.5" aria-hidden />
                  </button>
                  <a
                    href="#pricing-ai"
                    className="btn-glass focus-ring group inline-flex items-center justify-center gap-2 min-h-[48px] rounded-full px-7 py-3 font-display font-medium text-sm md:text-base whitespace-nowrap"
                  >
                    {copy.aiPricing}
                    <ArrowRight className="w-4 h-4 text-orchid-soft transition-transform duration-500 group-hover:translate-x-0.5" aria-hidden />
                  </a>
                </div>
              </div>
            </motion.article>
          </div>
        )}

        {/* Group 2: Classic 3D visualization */}
        <div role="group" aria-labelledby="services-classic-title" className="mt-16 md:mt-24">
          <GroupHeading id="services-classic-title" title={copy.classicTitle} tail={copy.classicTail} />
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5 lg:gap-6">
            {classicServices.map((raw, index) => (
              <ServiceCard
                key={raw.id}
                service={getLocalizedService(raw)}
                index={index}
                price={priceOf(raw.id)}
                learnMore={copy.learnMore}
                onOpen={handleOpenModal}
              />
            ))}
          </ul>
        </div>

        {/* Group 3: Video production (image right on wide screens, a quiet hairline card, not glass) */}
        {videoService && videoLocal && (
          <div role="group" aria-labelledby="services-video-title" className="mt-16 md:mt-24">
            <GroupHeading id="services-video-title" title={copy.videoTitle} tail={copy.videoTail} />

            <motion.article
              {...blurInRise(0.05, 24)}
              className="relative overflow-hidden rounded-card md:rounded-card-lg border border-white/10 bg-white/[0.03] grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-2 lg:gap-4 p-2 md:p-3"
            >
              <div className="relative flex flex-col p-4 pb-5 md:p-8 lg:p-10 order-2 lg:order-1">
                <h4 className="font-display font-bold text-ink text-3xl md:text-4xl tracking-tightest leading-[1.08] mb-3">
                  {videoLocal.title}
                </h4>
                <p className="text-ink-2 text-base leading-relaxed font-light max-w-xl mb-6">
                  {videoLocal.description}
                </p>

                <ul className="mb-7 md:mb-8 border-t border-white/10">
                  {VIDEO_OFFERS[language].map((offer) => (
                    <li key={offer.name} className="flex items-baseline justify-between gap-4 py-3 border-b border-white/10">
                      <span className="font-display font-medium text-sm md:text-base text-ink">{offer.name}</span>
                      <span className="font-display text-sm md:text-base text-orchid-soft text-right whitespace-nowrap">{offer.price}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={(e) => handleOpenModal(videoService, e.currentTarget)}
                    className="btn-primary focus-ring group inline-flex items-center justify-center gap-2 min-h-[48px] rounded-full px-7 py-3 font-display font-medium text-sm md:text-base whitespace-nowrap"
                  >
                    {copy.learnMore}
                    <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-0.5" aria-hidden />
                  </button>
                  <a
                    href="#pricing-3d"
                    className="btn-glass focus-ring group inline-flex items-center justify-center gap-2 min-h-[48px] rounded-full px-7 py-3 font-display font-medium text-sm md:text-base whitespace-nowrap"
                  >
                    {copy.aiPricing}
                    <ArrowRight className="w-4 h-4 text-orchid-soft transition-transform duration-500 group-hover:translate-x-0.5" aria-hidden />
                  </a>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[22px] md:rounded-[28px] min-h-[220px] md:min-h-[300px] lg:min-h-[360px] bg-plum-black border border-white/10 order-1 lg:order-2">
                {videoService.imageUrl && (
                  <img
                    src={videoService.imageUrl}
                    alt={language === 'cs' ? 'Dronový záběr domu z vizualizace' : 'Drone view of a house from a visualization'}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0612]/60 via-transparent to-transparent pointer-events-none" aria-hidden />
              </div>
            </motion.article>
          </div>
        )}

      </div>

      {/* Service Modal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedServiceModal && (() => {
            const service = getLocalizedService(selectedServiceModal);
            const modalImage = service.galleryUrls?.[selectedServiceImageIndex] || service.imageUrl;
            const modalPrice = priceOf(service.id);
            return (
              <div className="fixed inset-0 z-[100] flex items-center justify-center md:p-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                  onClick={closeModal}
                  className="absolute inset-0 bg-[#050308]/80 backdrop-blur-md"
                  aria-hidden
                />
                {/* Plum glow behind the dialog */}
                <div className="hidden md:block absolute w-[70vw] h-[60vh] glow-plum rounded-full pointer-events-none" aria-hidden />
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="service-modal-title"
                  initial={{ opacity: 0, y: 28, filter: 'blur(12px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
                  transition={{ duration: 0.7, ease: EASE_OUT }}
                  className="relative w-full h-full md:h-auto md:max-w-6xl md:max-h-[86vh] z-10 flex flex-col md:flex-row overflow-hidden md:rounded-card-lg bg-[linear-gradient(160deg,rgba(67,32,79,0.72)_0%,rgba(20,10,26,0.94)_55%,rgba(10,5,14,0.96)_100%)] backdrop-blur-[28px] md:border-[1.5px] md:border-white/[0.18] shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_30px_80px_rgba(0,0,0,0.6),0_0_90px_rgba(162,77,184,0.22)]"
                >
                  <button
                    ref={closeBtnRef}
                    type="button"
                    onClick={closeModal}
                    aria-label={t('portfolioCloseBtn')}
                    className="border border-white/20 bg-[rgba(12,6,18,0.5)] backdrop-blur-xl backdrop-saturate-150 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] text-ink transition-colors duration-300 hover:bg-[rgba(162,77,184,0.5)] focus-ring absolute top-3 right-3 md:top-5 md:right-5 w-11 h-11 rounded-full flex items-center justify-center z-[110] select-none"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <X className="w-5 h-5" aria-hidden />
                  </button>

                  {/* Left: Image & Thumbnails */}
                  <div className="w-full md:w-[50%] lg:w-[58%] flex flex-col shrink-0 relative md:p-3">
                    <div className="relative flex-grow min-h-[34vh] sm:min-h-[38vh] md:min-h-[520px] overflow-hidden md:rounded-[26px] bg-plum-black">
                      {modalImage ? (
                        <motion.img
                          key={selectedServiceImageIndex}
                          loading="lazy"
                          initial={{ opacity: 0, filter: 'blur(8px)' }}
                          animate={{ opacity: 1, filter: 'blur(0px)' }}
                          transition={{ duration: 0.6, ease: EASE_OUT }}
                          src={modalImage}
                          alt={`${service.title} – InnerVisio`}
                          className="absolute inset-0 w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <ServicePlaceholder icon={service.icon} />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a050e]/85 via-transparent to-transparent pointer-events-none" />

                      {service.galleryUrls && service.galleryUrls.length > 1 && (
                        <div className="absolute bottom-4 md:bottom-5 left-0 w-full flex justify-center z-20 px-4">
                          <div className="border border-white/20 bg-[rgba(12,6,18,0.42)] backdrop-blur-xl backdrop-saturate-150 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] rounded-full flex gap-2 p-1.5 max-w-full overflow-x-auto no-scrollbar">
                            {service.galleryUrls.map((url, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedServiceImageIndex(idx);
                                }}
                                aria-label={copy.imageN(idx + 1)}
                                aria-current={selectedServiceImageIndex === idx}
                                className={`focus-ring relative shrink-0 w-12 h-9 md:w-16 md:h-11 rounded-full overflow-hidden transition-all duration-500 ${
                                  selectedServiceImageIndex === idx
                                    ? 'ring-2 ring-orchid-soft shadow-[0_0_14px_rgba(196,139,224,0.6)] opacity-100'
                                    : 'opacity-50 hover:opacity-100'
                                }`}
                              >
                                <img
                                  loading="lazy"
                                  src={url}
                                  alt=""
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Text Content */}
                  <div className="relative w-full md:w-[50%] lg:w-[42%] flex-1 md:flex-none p-6 md:p-10 lg:p-12 flex flex-col overflow-y-auto no-scrollbar">
                    <div className="absolute inset-0 glass-inner-glow opacity-70 pointer-events-none" aria-hidden />
                    <div className="relative flex flex-col flex-grow">
                      <span className="eyebrow block mb-3 md:mb-5">{copy.eyebrowModal}</span>

                      <h3 id="service-modal-title" className="font-display font-bold text-ink text-3xl md:text-[44px] tracking-tightest leading-[1.08] mb-4 md:mb-6 pr-12 md:pr-0">
                        {service.title}
                      </h3>

                      <div className="h-px w-14 bg-gradient-to-r from-orchid-soft to-transparent mb-5 md:mb-7" aria-hidden />

                      <p className="text-ink-2 leading-relaxed text-sm md:text-base mb-6 md:mb-8 font-light">
                        {service.detailedDescription || service.description}
                      </p>

                      {service.features && (
                        <ul className="mb-7 md:mb-9 space-y-2.5 md:space-y-3">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-orchid-soft shrink-0 shadow-[0_0_10px_rgba(196,139,224,0.9)]" aria-hidden />
                              <span className="text-ink text-sm md:text-[15px] font-light leading-relaxed">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {modalPrice && (
                        <p className="mb-6 flex items-baseline gap-3">
                          <span className="eyebrow">{copy.priceLabel}</span>
                          <span className="font-display font-semibold text-ink text-lg">{modalPrice}</span>
                        </p>
                      )}

                      {/* Call to action */}
                      <div className="pt-5 md:pt-6 border-t border-white/10 mt-auto">
                        <p className="eyebrow block mb-3 md:mb-4">{copy.request}</p>
                        <div className="flex flex-col gap-2.5">
                          <a
                            href="#contact"
                            onClick={closeModal}
                            className="btn-primary focus-ring group flex items-center justify-between w-full px-6 py-3.5 md:py-4 rounded-full font-display font-medium text-sm md:text-base"
                          >
                            {copy.interested}
                            <ArrowUpRight className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                          </a>

                          {service.id === '6' && (
                            <a
                              href="https://granviaresidence.cz"
                              target="_blank"
                              rel="noreferrer"
                              className="btn-glass focus-ring group flex items-center justify-between w-full px-6 py-3.5 md:py-4 rounded-full font-display font-medium text-sm md:text-base"
                            >
                              {copy.demo}
                              <ArrowUpRight className="w-5 h-5 text-orchid-soft transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                            </a>
                          )}

                          {service.id === '7' && (
                            <a
                              href="#pricing-ai"
                              onClick={closeModal}
                              className="btn-glass focus-ring group flex items-center justify-between w-full px-6 py-3.5 md:py-4 rounded-full font-display font-medium text-sm md:text-base"
                            >
                              {copy.aiPricingFull}
                              <ArrowRight className="w-5 h-5 text-orchid-soft transition-transform duration-500 group-hover:translate-x-0.5" aria-hidden />
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={closeModal}
                            className="focus-ring w-full py-2.5 min-h-[44px] rounded-full font-display text-sm text-ink-3 hover:text-ink transition-colors duration-300"
                          >
                            {t('portfolioCloseBtn')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })()}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
};
