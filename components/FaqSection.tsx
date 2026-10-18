import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, FileText, Clock, Sparkles } from 'lucide-react';
import { useLanguage, Language } from './LanguageContext';
import { BRAND, EASE_OUT, blurInRise } from './ui/brand';

interface FaqItem {
  question: string;
  answer: React.ReactNode;
  category: 'process' | 'pricing' | 'general' | 'ai';
}

const AI_FAQ: Record<Language, { question: string; answer: string }[]> = {
  cs: [
    {
      question: 'Pozná se, že jde o AI?',
      answer: 'Naším cílem je, aby ne. Každý snímek ručně kontrolujeme a dolaďujeme. Hlídáme proporce, okna, dveře i světlo. Vizualizace zároveň transparentně označujeme, jak vyžaduje EU AI Act.',
    },
    {
      question: 'Odpovídá AI vizualizace skutečnosti?',
      answer: 'Zachováváme geometrii prostoru z fotky nebo půdorysu. Vybavení a materiály jsou návrh. Pro přesnost dle projektové dokumentace doporučujeme klasickou 3D vizualizaci.',
    },
    {
      question: 'Mohu ji použít v realitním inzerátu?',
      answer: 'Ano. Každý snímek dodáváme s označením ilustrační vizualizace, takže je inzerát férový ke kupujícím.',
    },
    {
      question: 'Jaké podklady potřebujete?',
      answer: 'Stačí fotky z mobilu za denního světla, ideálně z rohu místnosti. Případně půdorys nebo skica a pár ukázek stylu, který se vám líbí.',
    },
    {
      question: 'Proč si to neudělat v AI aplikaci sám?',
      answer: 'Můžete. Bez zkušeností ale výsledky často působí uměle: zkroucené linie, nesmyslný nábytek, plastové světlo. Kupující to poznají. My víme, jak AI řídit, a každý snímek dotáhneme do profesionální kvality.',
    },
  ],
  en: [
    {
      question: 'Can you tell it was made with AI?',
      answer: 'Our goal is that you can’t. We check and fine-tune every image by hand, watching proportions, windows, doors and light. At the same time, we label the visualizations transparently, as the EU AI Act requires.',
    },
    {
      question: 'Does an AI visualization match reality?',
      answer: 'We keep the geometry of the space from the photo or floor plan. Furnishings and materials are a proposal. For accuracy based on project documentation, we recommend classic 3D rendering.',
    },
    {
      question: 'Can I use it in a real estate listing?',
      answer: 'Yes. Every image is delivered labelled as an illustrative visualization, so the listing stays fair to buyers.',
    },
    {
      question: 'What materials do you need?',
      answer: 'Phone photos taken in daylight are enough, ideally from a corner of the room. Optionally a floor plan or sketch and a few examples of a style you like.',
    },
    {
      question: 'Why not do it myself in an AI app?',
      answer: 'You can. Without experience, though, results often look artificial: warped lines, nonsensical furniture, plastic light. Buyers notice. We know how to steer AI and bring every image up to professional quality.',
    },
  ],
};

const getAiFaqItems = (language: Language): FaqItem[] =>
  AI_FAQ[language].map(({ question, answer }) => ({
    category: 'ai',
    question,
    answer: <p className="font-light">{answer}</p>,
  }));

// Also used at build time to generate FAQPage structured data and llms.txt (entry-server.tsx)
export const getFaqData = (language: Language): FaqItem[] => {
  if (language === 'en') {
    return [
      {
        category: 'process',
        question: 'What initial source files do you need from me to start working?',
        answer: (
          <div className="space-y-3">
            <p>
              To achieve the cleanest results and ensure the fastest progress, we prefer having as many of these resources as possible:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-ink-2 font-light">
              <li><strong>Building Plans:</strong> Floorplans, elevations, sections, site schemas, or blueprints in DWG or PDF.</li>
              <li><strong>CAD/3D Models:</strong> If you already have a 3D shell drafted (e.g. SketchUp, Revit, ArchiCAD), it significantly reduces the turnaround time.</li>
              <li><strong>Material Spec:</strong> Lists of colors, timber finishes, references, or links to concrete brick/furniture materials or moodboards.</li>
              <li><strong>Reference Photos:</strong> Inspirational samples of lighting styles, environment settings, or materials you adore.</li>
            </ul>
          </div>
        ),
      },
      {
        category: 'process',
        question: 'How does the design loop work, and how many modification rounds are included?',
        answer: (
          <div className="space-y-3">
            <p>
              Our entire process is structured in 3 transparent, logical milestones:
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-ink-2 font-light">
              <li>
                <strong className="text-ink font-medium">1. Clay Modeling (White Renders):</strong> 
                We construct the accurate 3D architecture, model the terrain, and set up the cameras. You verify if the structure is correct. <span className="text-orchid-soft">(First revision loop)</span>
              </li>
              <li>
                <strong className="text-ink font-medium">2. Materials & Lighting (Previews):</strong> 
                We apply textures, load realistic foliage, set matching daylight/sunset atmospheres, and integrate indoor custom furniture. <span className="text-orchid-soft">(Second revision loop)</span>
              </li>
              <li>
                <strong className="text-ink font-medium">3. High-Res Rendering:</strong> 
                Once approved, we render the scene in crystal clear 4K+ resolutions and apply rich, post-production tuning (color grading, ambient skies, etc.).
              </li>
            </ol>
          </div>
        ),
      },
      {
        category: 'process',
        question: 'What is the average delivery timeframe for a project?',
        answer: (
          <p className="font-light">
            We typically present the first Clay draft within <strong>5–10 business days</strong> after final brief agreement and receipt of the deposit. The complete lifecycle depends on prompt feedback, revisions, and scale. Compact interior rooms are completed within 2 weeks, while major commercial developments may be sized individually.
          </p>
        ),
      },
      {
        category: 'pricing',
        question: 'How is the final quote calculated, and which factors affect the price?',
        answer: (
          <div className="space-y-3">
            <p>
              We do not use cookie-cutter flat charges. Instead, quotes are computed per project depending on the specific rendering time, detail levels, and context. Key drivers include:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-ink-2 font-light">
              <li><strong className="text-ink font-medium">Architectural complexity:</strong> Multi-angled facades, terrain slope profiling, and complex organic shapes take additional manual calculation of meshes.</li>
              <li><strong>Supplied material quality:</strong> Starting directly from native 3D DWG or clean models lowers cost compared to reconstruction from analog hand-drawn PDF files.</li>
              <li><strong>Level of interior detailing:</strong> Modeling unique customized luxury designer furniture schemes or detailed gardens increases time spent.</li>
              <li><strong>Quantity of angles:</strong> The price per finished image scales down drastically when generating multiple different vantage points from the same 3D workspace.</li>
            </ul>
          </div>
        ),
      },
      {
        category: 'pricing',
        question: 'Is an upfront payment required, and what are the payment steps?',
        answer: (
          <p className="font-light">
            Yes, for all first-time commissions and extensive commercial projects, we require a safety upfront deposit of <strong>40% to 50%</strong> prior to scheduling modeling tasks. The remaining balance of 50% to 60% becomes due upon final draft approval, and is paid prior to issuing the un-watermarked high-resolution 4K deliverables.
          </p>
        ),
      },
      {
        category: 'pricing',
        question: 'Is it possible to request expedited rush rendering services?',
        answer: (
          <p className="font-light">
            Yes. Depending on our ongoing workload, we offer dedicated <strong>rush rendering options</strong> (e.g., 48 to 72 hour turnarounds). Expedited service features an extra fee of 30% to 50% above the base estimate, which is defined at booking.
          </p>
        ),
      },
      {
        category: 'general',
        question: 'In what files and resolutions do you deliver the finalized renders?',
        answer: (
          <p className="font-light">
            Renders are provided in high-quality <strong>JPG or lossless PNG format in ultra-high 4K resolution</strong> (4,000 pixels long edge). This sizing is stunning for web portfolios, social feeds, print brochures, and massive commercial billboards. If you require specialized formats (e.g., TIFF, multilayer PSD, EXR) or 8K render sizes, notify us at project initiation.
          </p>
        ),
      },
      ...getAiFaqItems(language),
    ];
  } else {
    return [
      {
        category: 'process',
        question: 'Jaké podklady od mě potřebujete pro začátek práce?',
        answer: (
          <div className="space-y-3">
            <p>
              Pro nejlepší výsledek a nejrychlejší zpracování budeme potřebovat co nejvíce z následujících podkladů:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-ink-2 font-light">
              <li><strong>Projektová dokumentace:</strong> Půdorysy, řezy, pohledy nebo situace ve formátech (DWG, PDF).</li>
              <li><strong>3D model:</strong> Pokud již máte hotový model (např. SketchUp, Revit, ArchiCAD), ušetří nám to čas při rýsování geometrie.</li>
              <li><strong>Materiálové řešení:</strong> Popis materiálů, barev, konkrétních produktů nebo fotky vzorků a moodboard.</li>
              <li><strong>Referenční obrázky:</strong> Příklady vizualizací, stylů osvětlení nebo atmosféry, která se vám líbí.</li>
            </ul>
          </div>
        ),
      },
      {
        category: 'process',
        question: 'Jak probíhá proces zpracování vizualizace a kolik kol připomínek mám?',
        answer: (
          <p className="font-light">
            Jakmile obdržíme projektovou dokumentaci nebo podklady, které nám jste schopni k tvorbě dodat, tak na projektu začneme pracovat, v případě našich dalších dotazů, se Vás ještě doptáme, až budeme mít připravený prezentovatelný výstup, tak vám jej pošleme na kontrolu.
          </p>
        ),
      },
      {
        category: 'process',
        question: 'Jaká je obvyklá dodací lhůta jednoho projektu?',
        answer: (
          <p className="font-light">
            První náhledy (rozpracovaný 3D model s kamerami) standardně dodáváme do <strong>5–10 pracovních dnů</strong> od odsouhlasení zadání a obdržení zálohy. Celková doba pak závisí na rozsahu projektu a Vaší rychlosti při zpětné vazbě. Menší interiéry či jednoduché exteriéry lze dokončit do 2 týdnů, u větších celků a developerských projektů je termín stanoven individuálně.
          </p>
        ),
      },
      {
        category: 'pricing',
        question: 'Jak se počítá finální cena vizualizace a co ji ovlivňuje?',
        answer: (
          <div className="space-y-3">
            <p>
              Cena vizualizace není paušální, ale vždy ji kalkulujeme individuálně na základě náročnosti scény. Klíčové faktory ovlivňující cenu jsou:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-ink-2 font-light">
              <li><strong className="text-ink font-medium">Složitost architektury a terénu:</strong> Členité fasády, atypické konstrukce nebo složitý sklonitý terén vyžadují delší modelování.</li>
              <li><strong className="text-ink font-medium">Kvalita podkladů:</strong> Pokud obdržíme čisté DWG výkresy nebo kvalitní 3D model, cena je nižší než při překreslování ze skic či starých PDF.</li>
              <li><strong className="text-ink font-medium">Množství detailů:</strong> Extrémně specifický designový nábytek na míru či komplexní zahradní architektury zvýší časovou náročnost.</li>
              <li><strong className="text-ink font-medium">Počet výstupů:</strong> S větším množstvím záběrů ze stejného modelu cena za jeden snímek výrazně klesá.</li>
            </ul>
          </div>
        ),
      },
      {
        category: 'pricing',
        question: 'Platí se záloha předem a jaké jsou platební podmínky?',
        answer: (
          <p className="font-light">
            Ano, u nových klientů a větších zakázek standardně požadujeme před zahájením prací zálohu ve výši <strong>40 % až 50 %</strong> ze sjednané ceny projektu. Zbývajících 50 % až 60 % je splatných na základě faktury po dokončení díla a předání finálních renderů bez vodoznaku. Všechny ceny a platební milníky jsou zaneseny do cenové nabídky.
          </p>
        ),
      },
      {
        category: 'pricing',
        question: 'Je možné sjednat expresní zpracování projektu?',
        answer: (
          <p className="font-light">
            Ano, pokud na projekt spěcháte, nabízíme po předchozí domluvě a ověření kapacit <strong>expresní vyhotovení</strong> (např. do 48–72 hodin). Expresní realizace podléhá individuálnímu příplatku ve výši 30 % až 50 % z celkového rozpočtu, v závislostech na obsazenosti studia.
          </p>
        ),
      },
      {
        category: 'general',
        question: 'V jakém rozlišení a jakých formátech dodáváte finální vizualizace?',
        answer: (
          <p className="font-light">
            Finální vizualizace standardně odevzdáváme ve formátu <strong>JPG nebo PNG ve vysokém 4K rozlišení</strong> (delší strana 4000 px). Toto rozlišení je naprosto dostačující pro online prezentaci na webu, inzerci, prezentaci na sociálních sítích i kvalitní velkoformátový tisk billboardů či bannerů. Pokud potřebujete nestandardní formát nebo ještě vyšší rozlišení (např. 8K), dejte nám vědět předem.
          </p>
        ),
      },
      ...getAiFaqItems(language),
    ];
  }
};


type FaqTab = 'all' | 'process' | 'pricing' | 'ai';

// Glass pill tabs; the active one is filled with Orchid Plum and a soft glow
const tabClass = (active: boolean) =>
  `focus-ring inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-display font-medium text-xs sm:text-sm transition-[background-color,color,box-shadow,border-color] duration-500 border ${
    active
      ? 'bg-secondary border-white/25 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_0_28px_rgba(162,77,184,0.45)]'
      : 'bg-white/[0.06] border-white/[0.14] text-ink-2 backdrop-blur-[20px] backdrop-saturate-150 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] md:hover:text-ink md:hover:bg-white/[0.10] md:hover:border-white/25'
  }`;

export const FaqSection: React.FC = () => {
  const { language, t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<FaqTab>('all');

  const faqData = getFaqData(language);

  const filteredFaqs = activeTab === 'all'
    ? faqData
    : faqData.filter(item => item.category === activeTab);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const tabs: { id: FaqTab; label: string; openFirst: boolean }[] = [
    { id: 'all', label: t('faqTabAll'), openFirst: false },
    { id: 'process', label: t('faqTabProcess'), openFirst: false },
    { id: 'pricing', label: t('faqTabPricing'), openFirst: false },
    { id: 'ai', label: t('faqTabAi'), openFirst: true },
  ];

  const features = [
    { icon: FileText, title: t('faqFreeQuoteTitle'), desc: t('faqFreeQuoteDesc') },
    { icon: Clock, title: t('faqDeadlinesTitle'), desc: t('faqDeadlinesDesc') },
    { icon: Sparkles, title: t('faqQualityTitle'), desc: t('faqQualityDesc') },
  ];

  return (
    <section id="faq" className="relative bg-background py-28 md:py-36 px-6">
      {/* Soft plum glows: they separate the section and give the glass something to refract */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] max-w-[140vw] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute top-[18%] -right-40 w-[620px] h-[620px] rounded-full glow-plum opacity-70 animate-drift-slow" />
        <div className="absolute top-[55%] -left-48 w-[560px] h-[560px] rounded-full glow-plum opacity-60 animate-drift-slow [animation-delay:-11s]" />
        <div className="absolute bottom-0 right-1/4 w-[420px] h-[420px] rounded-full glow-orchid opacity-30" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">

        {/* Section Header */}
        <motion.div {...blurInRise(0)} className="text-center mb-12 md:mb-14">
          <span className={BRAND.eyebrow}>{t('faqHeaderLabel')}</span>
          <h2 className={BRAND.h2}>
            {language === 'cs' ? (
              <>Časté <span className="text-gradient">dotazy</span></>
            ) : (
              <>Frequently asked <span className="text-gradient">questions</span></>
            )}
          </h2>
          <p className={`${BRAND.lead} max-w-2xl mx-auto mt-6`}>
            {t('faqSub')}
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div {...blurInRise(0.1, 16)} className="flex justify-center gap-2 sm:gap-2.5 mb-10 md:mb-12 flex-wrap">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              aria-pressed={activeTab === tab.id}
              onClick={() => { setActiveTab(tab.id); setOpenIndex(tab.openFirst ? 0 : null); }}
              className={tabClass(activeTab === tab.id)}
            >
              {tab.id === 'ai' && (
                <span className={`w-1.5 h-1.5 rounded-full ${activeTab === tab.id ? 'bg-orchid-pale shadow-[0_0_8px_rgba(240,212,244,0.9)]' : 'bg-magenta shadow-[0_0_8px_rgba(224,85,240,0.9)]'}`} aria-hidden />
              )}
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Accordion Questions List */}
        <div className="space-y-3 md:space-y-4">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.8, delay: Math.min(index, 6) * 0.05, ease: EASE_OUT }}
                className={`relative rounded-[24px] md:rounded-card overflow-hidden border-[1.5px] backdrop-blur-[24px] backdrop-saturate-150 transition-[background-color,border-color,box-shadow] duration-500 ${
                  isOpen
                    ? 'bg-white/[0.08] border-orchid-soft/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_30px_80px_rgba(0,0,0,0.55),0_0_48px_rgba(162,77,184,0.30)]'
                    : 'bg-white/[0.045] border-white/[0.12] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_20px_50px_rgba(0,0,0,0.35)] md:hover:bg-white/[0.07] md:hover:border-white/20'
                }`}
              >
                {/* Inner plum glow on the open card */}
                <div
                  aria-hidden
                  className={`absolute inset-0 pointer-events-none glass-inner-glow transition-opacity duration-700 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                />

                <button
                  type="button"
                  id={`faq-question-${index}`}
                  onClick={() => toggleIndex(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  className="relative w-full py-5 px-5 sm:px-7 text-left flex items-start justify-between gap-4 group rounded-[24px] md:rounded-card focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orchid-soft"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <HelpCircle
                      strokeWidth={1.5}
                      className={`w-5 h-5 shrink-0 mt-0.5 transition-colors duration-300 ${
                        isOpen ? 'icon-gradient' : 'text-ink-3 md:group-hover:text-ink-2'
                      }`}
                    />
                    <span className={`font-display font-medium text-[15px] sm:text-base leading-snug transition-colors duration-300 ${
                      isOpen ? 'text-ink' : 'text-ink-2 md:group-hover:text-ink'
                    }`}>
                      {faq.question}
                    </span>
                  </div>
                  <span className={`w-8 h-8 -mt-0.5 rounded-full flex items-center justify-center border shrink-0 transition-[transform,background-color,border-color,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isOpen
                      ? 'rotate-180 bg-secondary/25 border-orchid-soft/40 text-orchid-pale'
                      : 'bg-white/[0.06] border-white/[0.14] text-ink-2 md:group-hover:text-ink md:group-hover:bg-white/10'
                  }`}>
                    <ChevronDown className="w-4 h-4" strokeWidth={1.75} />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      role="region"
                      aria-labelledby={`faq-question-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { duration: 0.55, ease: EASE_OUT },
                        opacity: { duration: 0.4, ease: EASE_OUT },
                      }}
                      className="relative overflow-hidden"
                    >
                      <div className="mx-5 sm:mx-7 pb-6 pt-4 sm:pl-[34px] border-t border-white/[0.08] text-sm sm:text-[15px] text-ink-2 leading-relaxed font-light [&_strong]:text-ink [&_strong]:font-medium [&_li]:marker:text-orchid-soft">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Build-time prerender: collapsed answers go into the static HTML (hidden) for crawlers */}
                {typeof window === 'undefined' && !isOpen && (
                  <div id={`faq-answer-${index}`} role="region" aria-labelledby={`faq-question-${index}`} hidden>
                    {faq.answer}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Feature highlight boxes */}
        <div className="mt-16 md:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              {...blurInRise(0.08 * i, 20)}
              className={`${BRAND.card} ${BRAND.cardHover} relative overflow-hidden p-6 md:p-7 flex flex-col gap-4`}
            >
              <span className={BRAND.iconChip}>
                <Icon className="w-5 h-5 icon-gradient" strokeWidth={1.5} />
              </span>
              <div className="space-y-2">
                <h3 className="font-display font-semibold text-ink text-base tracking-tightest">{title}</h3>
                <p className="text-sm text-ink-2 leading-relaxed font-light">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
