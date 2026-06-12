import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, FileText, Clock, Sparkles } from 'lucide-react';
import { useLanguage, Language } from './LanguageContext';

interface FaqItem {
  question: string;
  answer: React.ReactNode;
  category: 'process' | 'pricing' | 'general';
}

const getFaqData = (language: Language): FaqItem[] => {
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
            <ul className="list-disc pl-5 space-y-1 text-gray-400 font-light">
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
            <ol className="list-decimal pl-5 space-y-2 text-gray-400 font-light">
              <li>
                <strong className="text-white">1. Clay Modeling (White Renders):</strong> 
                We construct the accurate 3D architecture, model the terrain, and set up the cameras. You verify if the structure is correct. <span className="text-secondary">(First revision loop)</span>
              </li>
              <li>
                <strong className="text-white">2. Materials & Lighting (Previews):</strong> 
                We apply textures, load realistic foliage, set matching daylight/sunset atmospheres, and integrate indoor custom furniture. <span className="text-secondary">(Second revision loop)</span>
              </li>
              <li>
                <strong className="text-white">3. High-Res Rendering:</strong> 
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
            <ul className="list-disc pl-5 space-y-1.5 text-gray-400 font-light">
              <li><strong className="text-white">Architectural complexity:</strong> Multi-angled facades, terrain slope profiling, and complex organic shapes take additional manual calculation of meshes.</li>
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
            Yes. Depending on our ongoing workload, we offer dedicated **rush rendering options** (e.g., 48 to 72 hour turnarounds). Expedited service features an extra fee of 30% to 50% above the base estimate, which is defined at booking.
          </p>
        ),
      },
      {
        category: 'general',
        question: 'In what files and resolutions do you deliver the finalized renders?',
        answer: (
          <p className="font-light">
            Renders are provided in high-quality **JPG or lossless PNG format in ultra-high 4K resolution** (4,000 pixels long edge). This sizing is stunning for web portfolios, social feeds, print brochures, and massive commercial billboards. If you require specialized formats (e.g., TIFF, multilayer PSD, EXR) or 8K render sizes, notify us at project initiation.
          </p>
        ),
      },
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
            <ul className="list-disc pl-5 space-y-1 text-gray-400 font-light">
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
            <ul className="list-disc pl-5 space-y-1.5 text-gray-400 font-light">
              <li><strong className="text-white">Složitost architektury a terénu:</strong> Členité fasády, atypické konstrukce nebo složitý sklonitý terén vyžadují delší modelování.</li>
              <li><strong className="text-white">Kvalita podkladů:</strong> Pokud obdržíme čisté DWG výkresy nebo kvalitní 3D model, cena je nižší než při překreslování ze skic či starých PDF.</li>
              <li><strong className="text-white">Množství detailů:</strong> Extrémně specifický designový nábytek na míru či komplexní zahradní architektury zvýší časovou náročnost.</li>
              <li><strong className="text-white">Počet výstupů:</strong> S větším množstvím záběrů ze stejného modelu cena za jeden snímek výrazně klesá.</li>
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
    ];
  }
};

export const FaqSection: React.FC = () => {
  const { language, t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<'all' | 'process' | 'pricing'>('all');

  const faqData = getFaqData(language);

  const filteredFaqs = activeTab === 'all' 
    ? faqData 
    : faqData.filter(item => item.category === activeTab);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-32 px-6 bg-[#040204] relative overflow-hidden border-t border-white/5">
      {/* Background radial glow */}
      <div className="absolute bottom-0 left-1/4 w-[450px] h-[450px] bg-primary/5 blur-[120px] rounded-full z-0 pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] bg-secondary/5 blur-[120px] rounded-full z-0 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 animate-fade-in"
        >
          <span className="text-secondary font-medium tracking-widest uppercase text-xs md:text-sm mb-2 block font-display">
            {t('faqHeaderLabel')}
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tighter">
            {language === 'cs' ? (
              <>Časté <span className="text-gray-500">Dotazy (FAQ)</span></>
            ) : (
              <>Frequently <span className="text-gray-500">Asked (FAQ)</span></>
            )}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mt-6 text-sm md:text-base leading-relaxed font-light">
            {t('faqSub')}
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex justify-center gap-2 mb-12 flex-wrap">
          <button
            onClick={() => { setActiveTab('all'); setOpenIndex(null); }}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'all'
                ? 'bg-primary text-white shadow-[0_0_15px_rgba(56,24,63,0.5)]'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {t('faqTabAll')}
          </button>
          <button
            onClick={() => { setActiveTab('process'); setOpenIndex(null); }}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'process'
                ? 'bg-primary text-white shadow-[0_0_15px_rgba(56,24,63,0.5)]'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {t('faqTabProcess')}
          </button>
          <button
            onClick={() => { setActiveTab('pricing'); setOpenIndex(null); }}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'pricing'
                ? 'bg-primary text-white shadow-[0_0_15px_rgba(56,24,63,0.5)]'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {t('faqTabPricing')}
          </button>
        </div>

        {/* Accordion Questions List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                  isOpen 
                    ? 'bg-white/[0.04] border-primary/30 shadow-[0_4px_25px_-5px_rgba(56,24,63,0.15)]' 
                    : 'bg-white/[0.02] border-white/5 hover:border-white/15'
                }`}
              >
                <button
                  onClick={() => toggleIndex(index)}
                  className="w-full py-5 px-6 sm:px-8 text-left flex items-start justify-between gap-4 group"
                >
                  <div className="flex items-start gap-3 mt-0.5">
                    <HelpCircle className={`w-5 h-5 shrink-0 mt-0.5 transition-colors duration-200 ${
                      isOpen ? 'text-secondary' : 'text-gray-500 group-hover:text-gray-300'
                    }`} />
                    <span className={`font-semibold text-sm sm:text-base transition-colors duration-200 ${
                      isOpen ? 'text-white' : 'text-gray-300 group-hover:text-white'
                    }`}>
                      {faq.question}
                    </span>
                  </div>
                  <div className={`p-1.5 rounded-full bg-white/5 border border-white/5 text-gray-400 transition-all duration-300 shrink-0 ${
                    isOpen ? 'rotate-180 bg-primary/20 border-primary/20 text-secondary' : 'group-hover:text-white group-hover:bg-white/10'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 sm:px-8 pb-6 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-white/5 pt-4 bg-black/10">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Interactive Feature highlight boxes */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-white/5">
          <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-secondary">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-sm">{t('faqFreeQuoteTitle')}</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-light">
              {t('faqFreeQuoteDesc')}
            </p>
          </div>

          <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-secondary">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-sm">{t('faqDeadlinesTitle')}</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-light">
              {t('faqDeadlinesDesc')}
            </p>
          </div>

          <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-secondary">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-sm">{t('faqQualityTitle')}</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-light">
              {t('faqQualityDesc')}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
