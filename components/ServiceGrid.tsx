import React, { useEffect, useRef, useState, KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SERVICES } from '../constants';
import { ArrowRight, ChevronRight, X, ArrowUpRight } from 'lucide-react';
import { ServiceItem } from '../types';
import { useLanguage, Language } from './LanguageContext';
import { blurInRise, EASE_OUT } from './ui/brand';

const SERVICE_TRANSLATIONS: Record<Language, Record<string, { title: string; description: string; detailedDescription: string; features: string[] }>> = {
  cs: {
    '1': {
       title: 'Vizualizace Exteriéru',
       description: 'Fotorealistické ztvárnění exteriérů budov s důrazem na světlo, materiály a okolní prostředí.',
       detailedDescription: 'Nabízíme špičkové fotorealistické vizualizace exteriérů pro developerské projekty i rodinné domy. Soustředíme se na dokonalou hru světel, stínů a zasazení rodinného domu do reálného terénu či okolní zástavby.',
       features: ['Realistické materiály a textury', 'Denní a noční scenérie', 'Zakomponování do fotografie', 'Úprava okolí podle architektonické studie'],
    },
    '2': {
       title: 'Vizualizace Interiéru',
       description: 'Detailní pohledy do vnitřních prostor, které zachycují atmosféru a designový záměr.',
       detailedDescription: 'Tvorba 3D návrhů interiérů, které klade důraz na atmosféru, správné osvětlení a rozvržení prostoru. Vaši klienti si díky tomu dokáží živě představit domov či kancelář dříve, než se položí první cihla.',
       features: ['Precizní nasvícení scény', 'Atmosférické záběry', 'Realistické modely nábytku', 'Vyladěné textury vybavení'],
    },
    '3': {
       title: '3D půdorysy',
       description: 'Prostorové zobrazení dispozic, které pomáhá lépe pochopit objem a uspořádání interiéru.',
       detailedDescription: 'Klasické 2D půdorysy jsou často pro laiky nečitelné. Pomocí 3D půdorysu nabízíme prostorový náhled objektu z nadhledu, což zajišťuje perfektní představu o celkovém uspořádání a provozu domácnosti.',
       features: ['Trojrozměrná vizualizace příček a oken', 'Základní nebo detailní vybavení nábytkem', 'Skvělé pro inzerci na realitních portálech', 'Zvýšení důvěry a zájmu klientů'],
    },
    '4': {
       title: '2D půdorysy',
       description: 'Přehledná a estetická schémata podlaží pro marketingové účely a prezentace.',
       detailedDescription: 'Prezentujeme technické nákresy ve srozumitelné a esteticky laděné podobě. Ideální doplněk pro prodej bytů a pronájmy kancelářských ploch.',
       features: ['Barevné kódování a materiály (např. dekor dřeva)', 'Doplnění výměr jednotlivých místností', 'Možnost přidání vašeho loga', 'Jasné vyznačení dispozice s kótami'],
    },
    '5': {
       title: 'Virtuální prohlídky',
       description: 'Interaktivní 360° zážitky, které umožňují volný pohyb v budoucím prostoru.',
       detailedDescription: 'Nabízíme revoluční možnost, jak se projít domem ještě před jeho dokončením. Klient se může libovolně rozhlížet a procházet jednotlivými místnostmi v úhlu 360 stupňů.',
       features: ['Pohyb ve scéně pomocí hotspotů', 'Napojení pro brýle s virtuální realitou', 'Zapracování informačních bodů', 'Snadné sdílení formou odkazu'],
    },
    '6': {
       title: 'Web s konfigurátorem',
       description: 'Komplexní digitální prezentace projektů integrující vizuální obsah do moderního webu.',
       detailedDescription: 'Developerům a realitním kancelářím tvoříme ucelené prezentační webové stránky pro konkrétní stavební projekty s interaktivním výběrem bytů a integrací vizuálního materiálu. Toto je fiktivní projekt pro ukázku funkčnosti, pokud máte zájem o plnohodnotnou stránku s těmito funkcemi, ozvěte se nám.',
       features: ['Interaktivní 2D/3D navigace (klikací budova)', 'Filtrování volných/obsazených bytů', 'Moderní animace a uživatelský UX/UI design', 'SEO optimalizace pro vyhledávače'],
    },
    '7': {
       title: 'AI vizualizace',
       description: 'Fotorealistické vizualizace z fotky nebo skici do 24 hodin. Ideální pro inzerci a rekonstrukce.',
       detailedDescription: 'Z fotky z mobilu, skici nebo půdorysu vytvoříme fotorealistickou vizualizaci interiéru či exteriéru do 24 hodin. AI je pro nás nástroj, nápad, materiály a funkčnost dodává člověk. Každý snímek ručně kontrolujeme, aby seděla geometrie, proporce i světlo.',
       features: ['Hotovo do 24 hodin', '3 stylové varianty v ceně', 'Zachovaná geometrie a proporce prostoru', 'Transparentní označení dle EU AI Act'],
    }
  },
  en: {
    '1': {
       title: 'Exterior Rendering',
       description: 'Photorealistic architectural rendering of building exteriors with realistic lighting, textures, and details.',
       detailedDescription: 'We build high-end photorealistic architectural exterior representations for builders, developers, and private home renovators. We study physical lighting conditions to craft seamless real-world compositions.',
       features: ['Realistic physical textures', 'Multi-time atmosphere (Day/Sunset/Night)', 'Existing environment photomontages', 'Surrounding terrain studies'],
    },
    '2': {
       title: 'Interior Rendering',
       description: 'Bespoke indoor visualizations displaying materials, scale, lightning, and overall lifestyle atmosphere.',
       detailedDescription: 'Creating 3D internal room concepts focusing on warm atmosphere, custom furniture schemes, material tactile sensations and lighting. Let your prospective buyers explore rooms long before building.',
       features: ['Detailed color temperature setups', 'Atmospheric mood-settings', 'High-poly furniture modeling', 'Premium materials & textures'],
    },
    '3': {
       title: '3D Floor Plans',
       description: '3D spatial plan diagrams showcasing internal room distributions, furniture setups, and circulation flows.',
       detailedDescription: 'Standard flat drafts are often tough to comprehend for buyers. Our 3D plans deliver an instant clear spatial top-down overview of walls, rooms, sizing, and modern interior flows.',
       features: ['Precision 3D walls & openings modeling', 'Modern custom lifestyle furniture', 'Tailored for property portal listings', 'Significantly higher client engagement'],
    },
    '4': {
       title: '2D Floor Plans',
       description: 'Clean, simplified technical floor schemas customized for sleek real estate portfolios.',
       detailedDescription: 'We translate raw builder layouts into legible, beautiful, and aesthetic sales pamphlets. Essential addition for project listings, brochures, and leasing websites.',
       features: ['Color matching & flooring textures', 'Interactive overall room statistics', 'Optional company logo watermarks', 'Clear metric scale listings'],
    },
    '5': {
       title: 'Virtual Tours (360°)',
       description: 'Immersive online 360-degree panoramas with interactive hotspots to freely explore future properties.',
       detailedDescription: 'Let clients walk through room projects from the web before groundbreaking! Users can pan around 360-degrees on any device or slide into VR headsets for maximum presence of scale.',
       features: ['Interactive hotspot node navigation', 'Mobile & VR headset responsive', 'Integrated smart info tags', 'Fast link-to-share web hosting'],
    },
    '6': {
       title: 'Developer Configurator',
       description: 'Premium standalone web portals combining 2D/3D flat selectors with modern real estate design.',
       detailedDescription: 'Custom, high-converting property portfolio web development. Features interactive building floor selection tools, unit availability tables, interactive location map tags and responsive forms. This is a fictional project for demonstration purposes; if you are interested in a full-fledged website with these features, please contact us.',
       features: ['Interactive clicks on building floor layouts', 'Live real-time flat filter systems', 'Ultra-fast loading times & SEO', 'Simplified custom admin dashboard'],
    },
    '7': {
       title: 'AI Visualization',
       description: 'Photorealistic visualizations from a photo or sketch within 24 hours. Ideal for listings and renovations.',
       detailedDescription: 'From a phone photo, sketch or floor plan we create a photorealistic interior or exterior visualization within 24 hours. AI is our tool; the idea, materials and function come from people. We check every image by hand so geometry, proportions and light stay right.',
       features: ['Ready within 24 hours', '3 style variants included', 'Geometry and proportions preserved', 'Transparent labelling under the EU AI Act'],
    }
  }
};

// Tag labels come from constants in English; show them in the active language
const TAG_TRANSLATIONS: Record<Language, Record<string, string>> = {
  cs: { 'Professional': 'Profesionálně', 'Fast Delivery': 'Rychlé dodání', '3 Styles': '3 styly' },
  en: {},
};
const DEFAULT_TAGS = ['Professional', 'Fast Delivery'];

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

// Branded stand-in for services that have no photo yet
const ServicePlaceholder: React.FC<{ icon: ServiceItem['icon'] }> = ({ icon: Icon }) => (
  <div className="absolute inset-0 bg-[radial-gradient(90%_80%_at_70%_20%,rgba(196,139,224,0.32)_0%,rgba(91,39,105,0.55)_42%,#1F0F29_100%)] flex items-center justify-center">
    <div className="absolute w-48 h-48 rounded-full glow-orchid opacity-70" aria-hidden />
    <Icon className="relative w-16 h-16 icon-gradient" strokeWidth={1} aria-hidden />
  </div>
);

const NewBadge: React.FC<{ label: string }> = ({ label }) => (
  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary text-white font-display font-semibold text-[10px] uppercase tracking-[0.14em] leading-none shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_0_16px_rgba(162,77,184,0.55)]">
    <span className="w-1 h-1 rounded-full bg-magenta shadow-[0_0_6px_#E055F0]" aria-hidden />
    {label}
  </span>
);

const SERVICE_EASE = { duration: 0.7, ease: EASE_OUT };

export const ServiceGrid: React.FC = () => {
  const { language, t } = useLanguage();
  const [activeServiceId, setActiveServiceId] = useState(SERVICES[0].id);
  const [selectedServiceModal, setSelectedServiceModal] = useState<ServiceItem | null>(null);
  const [selectedServiceImageIndex, setSelectedServiceImageIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);

  const activeServiceRaw = SERVICES.find(s => s.id === activeServiceId) || SERVICES[0];

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

  const localizeTag = (tag: string) => TAG_TRANSLATIONS[language]?.[tag] || tag;

  const activeService = getLocalizedService(activeServiceRaw);
  const learnMore = language === 'cs' ? 'Zjistit více' : 'Learn more';

  const handleOpenModal = (service: ServiceItem) => {
    lastFocusRef.current = document.activeElement as HTMLElement | null;
    setSelectedServiceModal(service);
    setSelectedServiceImageIndex(0);
  };

  const closeModal = () => {
    setSelectedServiceModal(null);
    lastFocusRef.current?.focus?.();
  };

  // Escape closes the modal; focus moves into the dialog when it opens
  useEffect(() => {
    if (!selectedServiceModal) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKey);
    const id = window.setTimeout(() => closeBtnRef.current?.focus(), 50);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedServiceModal]);

  // Arrow-key navigation inside the vertical tab list (WAI-ARIA tabs pattern)
  const handleTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = -1;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (index + 1) % SERVICES.length;
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (index - 1 + SERVICES.length) % SERVICES.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = SERVICES.length - 1;
    if (next === -1) return;
    e.preventDefault();
    setActiveServiceId(SERVICES[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="services" className="relative z-10 py-28 md:py-36">
      {/* Soft plum glows so the liquid glass has something to refract */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="glow-plum rounded-full absolute -left-40 top-[22%] w-[640px] h-[640px] animate-drift-slow" />
        <div className="glow-orchid rounded-full absolute right-[-12%] top-[48%] w-[520px] h-[520px] opacity-70" />
        <div className="glow-plum rounded-full absolute left-1/2 -translate-x-1/2 bottom-[-220px] w-[900px] h-[420px] opacity-60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Section Header */}
        <motion.div {...blurInRise(0)} className="max-w-3xl mb-14 md:mb-20">
          <span className="eyebrow block mb-4">{t('servicesSubtitle')}</span>
          <h2 className="font-display font-bold text-ink text-4xl md:text-6xl tracking-tightest leading-[1.05] mb-6">
            <GradientHeadline text={t('ourExpertise')} />
          </h2>
          <p className="text-ink-2 text-base md:text-lg font-light leading-relaxed max-w-2xl">
            {t('ourExpertiseDesc')}
          </p>
        </motion.div>

        {/* Desktop: Tabbed Liquid-Glass Panel */}
        <motion.div {...blurInRise(0.1)} className="hidden lg:block">
          <div className="glass-strong relative overflow-hidden rounded-card-lg">
            {/* Inner plum light so the glass reads as lit from within */}
            <div className="absolute inset-0 glass-inner-glow pointer-events-none" aria-hidden />

            <div className="relative grid grid-cols-[minmax(300px,36%)_1fr]">

              {/* LEFT: tab list */}
              <div
                role="tablist"
                aria-orientation="vertical"
                aria-label={t('servicesSubtitle')}
                className="flex flex-col gap-1.5 p-4 border-r border-white/10"
              >
                {SERVICES.map((rawService, index) => {
                  const service = getLocalizedService(rawService);
                  const isActive = activeServiceId === service.id;
                  return (
                    <button
                      key={service.id}
                      ref={(el) => { tabRefs.current[index] = el; }}
                      id={`service-tab-${service.id}`}
                      role="tab"
                      type="button"
                      aria-selected={isActive}
                      aria-controls="service-panel"
                      tabIndex={isActive ? 0 : -1}
                      onClick={() => setActiveServiceId(service.id)}
                      onKeyDown={(e) => handleTabKeyDown(e, index)}
                      className="focus-ring group relative w-full text-left rounded-2xl px-3.5 py-[15px] flex items-center gap-3.5 transition-colors duration-500"
                    >
                      {isActive && (
                        <motion.span
                          layoutId="service-tab-active"
                          transition={SERVICE_EASE}
                          className="absolute inset-0 rounded-2xl bg-[linear-gradient(100deg,rgba(162,77,184,0.34)_0%,rgba(91,39,105,0.16)_60%,rgba(91,39,105,0.06)_100%)] border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_0_36px_rgba(162,77,184,0.25)]"
                          aria-hidden
                        >
                          {/* Glowing left edge */}
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-7 w-[3px] rounded-full bg-gradient-to-b from-orchid-pale to-orchid-soft shadow-[0_0_12px_rgba(196,139,224,0.9)]" />
                        </motion.span>
                      )}
                      {!isActive && (
                        <span className="absolute inset-0 rounded-2xl bg-white/0 group-hover:bg-white/[0.04] transition-colors duration-500" aria-hidden />
                      )}

                      <span className={`icon-chip relative w-10 h-10 rounded-xl shrink-0 transition-shadow duration-500 ${isActive ? 'shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_0_18px_rgba(196,139,224,0.35)]' : ''}`}>
                        <service.icon className="w-[18px] h-[18px] icon-gradient" strokeWidth={1.5} aria-hidden />
                      </span>
                      <span className={`relative flex-1 min-w-0 font-display font-medium text-[15px] tracking-[-0.01em] transition-colors duration-500 ${isActive ? 'text-ink' : 'text-ink-2 group-hover:text-ink'}`}>
                        {service.title}
                      </span>
                      {service.isNew && <span className="relative"><NewBadge label={t('newBadge')} /></span>}
                      <ChevronRight
                        aria-hidden
                        className={`relative w-4 h-4 shrink-0 transition-all duration-500 ${isActive ? 'text-orchid-soft opacity-100 translate-x-0' : 'text-ink-3 opacity-0 -translate-x-1.5 group-hover:opacity-60'}`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* RIGHT: content */}
              <div
                id="service-panel"
                role="tabpanel"
                aria-labelledby={`service-tab-${activeService.id}`}
                className="relative p-4 min-h-[560px]"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeService.id}
                    initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -8, filter: 'blur(8px)' }}
                    transition={{ duration: 0.55, ease: EASE_OUT }}
                    className="flex flex-col h-full"
                  >
                    {/* Photo */}
                    <div className="relative h-[330px] w-full overflow-hidden rounded-[24px] border border-white/10 shrink-0 bg-plum-black">
                      {activeService.imageUrl ? (
                        <motion.img
                          initial={{ scale: 1.04 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 6, ease: EASE_OUT }}
                          loading="lazy"
                          src={activeService.imageUrl}
                          alt={`Služba: ${activeService.title} - InnerVisio`}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <ServicePlaceholder icon={activeService.icon} />
                      )}
                      {/* Fade into the dark panel */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0612] via-[#0c0612]/25 to-transparent pointer-events-none" />

                      <div className="absolute top-5 left-5 flex items-center gap-2">
                        {activeService.isNew && <NewBadge label={t('newBadge')} />}
                      </div>
                      <div className="absolute top-5 right-5">
                        <span className="border border-white/20 bg-[rgba(12,6,18,0.42)] backdrop-blur-xl backdrop-saturate-150 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] rounded-2xl flex items-center justify-center w-12 h-12">
                          <activeService.icon className="w-5 h-5 icon-gradient" strokeWidth={1.5} aria-hidden />
                        </span>
                      </div>
                    </div>

                    {/* Text */}
                    <div className="px-4 pt-7 pb-3 flex flex-col flex-grow">
                      <h3 className="font-display font-bold text-ink text-3xl tracking-tightest leading-tight mb-3">
                        {activeService.title}
                      </h3>
                      <p className="text-ink-2 text-base leading-relaxed font-light max-w-xl">
                        {activeService.description}
                      </p>

                      <div className="mt-auto pt-6 flex items-center justify-between gap-4">
                        <ul className="flex flex-wrap gap-2" aria-label="Tags">
                          {(activeService.tags ?? DEFAULT_TAGS).map((tag) => (
                            <li key={tag} className="glass-pill px-3.5 py-1.5 font-display font-medium text-xs text-ink-2">
                              {localizeTag(tag)}
                            </li>
                          ))}
                        </ul>

                        <button
                          type="button"
                          onClick={() => handleOpenModal(activeService)}
                          className="btn-glass focus-ring group inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-display font-medium text-sm shrink-0"
                        >
                          {learnMore}
                          <ArrowRight className="w-4 h-4 text-orchid-soft transition-transform duration-500 group-hover:translate-x-0.5" aria-hidden />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </div>
        </motion.div>

        {/* Mobile: Horizontal Swipe Slider */}
        <div className="lg:hidden mb-5 flex items-center gap-3 text-ink-3" aria-hidden>
          <span className="w-8 h-px bg-gradient-to-r from-transparent to-orchid-soft/60" />
          <span className="font-display text-[11px] uppercase tracking-[0.22em] font-medium">{language === 'cs' ? 'přetáhněte doprava' : 'swipe right'}</span>
          <ArrowRight className="w-3.5 h-3.5 text-orchid-soft" />
        </div>
        <div className="lg:hidden -mx-6 px-6 overflow-x-auto overflow-y-hidden snap-x snap-mandatory no-scrollbar pt-2 pb-10 scroll-px-6">
          <ul className="flex gap-4 w-max">
            {SERVICES.map((rawService, index) => {
              const service = getLocalizedService(rawService);
              return (
                <motion.li
                  key={service.id}
                  {...blurInRise(Math.min(index, 3) * 0.08, 24)}
                  className="w-[84vw] max-w-[380px] snap-start"
                >
                  <article className="glass relative h-full overflow-hidden rounded-card flex flex-col">
                    <div className="absolute inset-0 glass-inner-glow pointer-events-none" aria-hidden />
                    <div className="relative p-2">
                      <div className="relative h-48 sm:h-56 w-full overflow-hidden rounded-[22px] bg-plum-black">
                        {service.imageUrl ? (
                          <img
                            loading="lazy"
                            src={service.imageUrl}
                            alt={`Vizualizace: ${service.title}`}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <ServicePlaceholder icon={service.icon} />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0612]/80 via-transparent to-transparent pointer-events-none" />
                        {service.isNew && (
                          <div className="absolute top-3 left-3">
                            <NewBadge label={t('newBadge')} />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="relative px-5 pt-3 pb-5 flex flex-col flex-grow">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="icon-chip w-10 h-10 rounded-xl shrink-0">
                          <service.icon className="w-[18px] h-[18px] icon-gradient" strokeWidth={1.5} aria-hidden />
                        </span>
                        <h3 className="font-display font-bold text-ink text-xl tracking-tightest leading-tight">
                          {service.title}
                        </h3>
                      </div>
                      <p className="text-ink-2 text-sm leading-relaxed font-light mb-5 flex-grow">
                        {service.description}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleOpenModal(service)}
                        className="btn-glass focus-ring self-start inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-display font-medium text-sm"
                      >
                        {learnMore}
                        <ArrowRight className="w-4 h-4 text-orchid-soft" aria-hidden />
                      </button>
                    </div>
                  </article>
                </motion.li>
              );
            })}
          </ul>
        </div>

      </div>

      {/* Service Modal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedServiceModal && (() => {
            const service = getLocalizedService(selectedServiceModal);
            const modalImage = service.galleryUrls?.[selectedServiceImageIndex] || service.imageUrl;
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
                    className="border border-white/20 bg-[rgba(12,6,18,0.42)] backdrop-blur-xl backdrop-saturate-150 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] text-ink transition-colors duration-300 hover:bg-[rgba(162,77,184,0.5)] focus-ring absolute top-3 right-3 md:top-5 md:right-5 w-11 h-11 rounded-full flex items-center justify-center z-[110] select-none"
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
                          alt={`Služba: ${service.title}`}
                          className="absolute inset-0 w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <ServicePlaceholder icon={service.icon} />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a050e]/85 via-transparent to-transparent pointer-events-none" />

                      <div className="absolute top-4 left-4 md:top-5 md:left-5 z-20 flex items-center gap-2">
                        <span className="border border-white/20 bg-[rgba(12,6,18,0.42)] backdrop-blur-xl backdrop-saturate-150 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] rounded-2xl flex items-center justify-center w-11 h-11 md:w-12 md:h-12">
                          <service.icon className="w-5 h-5 icon-gradient" strokeWidth={1.5} aria-hidden />
                        </span>
                        {service.isNew && <NewBadge label={t('newBadge')} />}
                      </div>

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
                                aria-label={language === 'cs' ? `Zobrazit obrázek ${idx + 1}` : `View image ${idx + 1}`}
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
                      <span className="eyebrow block mb-3 md:mb-5">
                        {language === 'cs' ? 'Služby Studia' : 'Studio Services'}
                      </span>

                      <h3 id="service-modal-title" className="font-display font-bold text-ink text-3xl md:text-[44px] tracking-tightest leading-[1.08] mb-4 md:mb-6 pr-12 md:pr-0">
                        {service.title}
                      </h3>

                      <div className="h-px w-14 bg-gradient-to-r from-orchid-soft to-transparent mb-5 md:mb-7" aria-hidden />

                      <p className="text-ink-2 leading-relaxed text-sm md:text-base mb-6 md:mb-8 font-light">
                        {service.detailedDescription || service.description}
                      </p>

                      {service.features && (
                        <ul className="mb-8 md:mb-10 space-y-2.5 md:space-y-3">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-orchid-soft shrink-0 shadow-[0_0_10px_rgba(196,139,224,0.9)]" aria-hidden />
                              <span className="text-ink text-sm md:text-[15px] font-light leading-relaxed">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Call to action */}
                      <div className="pt-5 md:pt-6 border-t border-white/10 mt-auto">
                        <p className="eyebrow block mb-3 md:mb-4">{language === 'cs' ? 'Poptat tuto službu' : 'Request service'}</p>
                        <div className="flex flex-col gap-2.5">
                          <a
                            href="#contact"
                            onClick={closeModal}
                            className="btn-primary focus-ring group flex items-center justify-between w-full px-6 py-3.5 md:py-4 rounded-full font-display font-medium text-sm md:text-base"
                          >
                            {language === 'cs' ? 'Mám zájem' : 'I am interested'}
                            <ArrowUpRight className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                          </a>

                          {service.id === '6' && (
                            <a
                              href="https://granviaresidence.cz"
                              target="_blank"
                              rel="noreferrer"
                              className="btn-glass focus-ring group flex items-center justify-between w-full px-6 py-3.5 md:py-4 rounded-full font-display font-medium text-sm md:text-base"
                            >
                              {language === 'cs' ? 'Chci vidět ukázku' : 'View demo'}
                              <ArrowUpRight className="w-5 h-5 text-orchid-soft transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                            </a>
                          )}

                          {service.id === '7' && (
                            <a
                              href="#pricing-ai"
                              onClick={closeModal}
                              className="btn-glass focus-ring group flex items-center justify-between w-full px-6 py-3.5 md:py-4 rounded-full font-display font-medium text-sm md:text-base"
                            >
                              {language === 'cs' ? 'Zobrazit ceník AI vizualizací' : 'See AI visualization pricing'}
                              <ArrowRight className="w-5 h-5 text-orchid-soft transition-transform duration-500 group-hover:translate-x-0.5" aria-hidden />
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={closeModal}
                            className="focus-ring w-full py-2.5 rounded-full font-display text-sm text-ink-3 hover:text-ink transition-colors duration-300"
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
