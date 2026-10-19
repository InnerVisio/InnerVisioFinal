import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowRight, ChevronLeft, ChevronRight, MapPin, X } from 'lucide-react';
import { PROJECTS } from '../constants';
import { ProjectItem } from '../types';
import { useLanguage, Language } from './LanguageContext';
import { blurInRise, EASE_OUT } from './ui/brand';

const PROJECT_TRANSLATIONS: Record<Language, Record<string, { title: string; location: string; description: string; category: string }>> = {
  cs: {
    '1': {
       title: 'Moderní dům v Bludovicích',
       location: 'Bludovice, ČR',
       category: 'Exteriér',
       description: 'Návrh a vizualizace moderního bydlení v Bludovicích. Důraz na čisté linie, útulnou atmosféru a funkční prostorové uspořádání.'
    },
    '2': {
       title: 'Kancelář inspirovaná přírodou',
       location: 'ČR',
       category: 'Interiér',
       description: 'Hory, dřevo a zeleň. Kancelář navržená tak, aby se v ní dobře pracovalo i přemýšlelo.'
    },
    '3': {
       title: 'Moderní bungalov ve Skorkově',
       location: 'Skorkov, ČR',
       category: 'Exteriér',
       description: 'Pozemek, který byl pouze zahradou, jsme proměnili ve vizualizaci moderního bungalovu.'
    },
    '4': {
       title: 'Nadčasový béžový interiér',
       location: 'ČR',
       category: 'Interiér',
       description: 'Útulný dům, kde dominují teplé odstíny s kombinací dřeva, díky čemuž z interiéru srší domácí atmosféra.'
    },
    '5': {
       title: 'Dům v Třanovicích',
       location: 'Třanovice, ČR',
       category: 'Exteriér',
       description: 'Původně starší chata, která díky naší vizualizaci znovu ožila a zájemcům ukázala její plný potenciál.'
    },
    '6': {
       title: 'Rezidence Horská, Litvínov',
       location: 'Litvínov, ČR',
       category: 'Exteriér',
       description: 'Na místě původní střechy vznikla nástavba s dalším patrem, novými byty a terasou. Detaily byly navrženy tak, aby budoucí majitelé viděli, jak bude jejich nový domov vypadat.'
    },
    '7': {
       title: 'Rekonstrukce venkovského domu',
       location: 'ČR',
       category: 'AI vizualizace',
       description: 'Z fotky zchátralého domu vznikla AI vizualizace hotové rekonstrukce. Stejný záběr, stejná geometrie. Na druhém snímku najdete stav před.'
    },
    '8': {
       title: 'Terasa s pergolou a zahrada',
       location: 'ČR',
       category: 'AI vizualizace',
       description: 'AI vizualizace exteriéru: zastřešená terasa, ohniště a zahrada ve světle zapadajícího slunce.'
    },
    '9': {
       title: 'Obývací pokoj v zelených tónech',
       location: 'ČR',
       category: 'AI vizualizace',
       description: 'AI vizualizace interiéru s měkkým denním světlem, přírodními materiály a výrazným akcentem v olivové barvě.'
    },
    '10': {
       title: 'Ložnice v teplých tónech',
       location: 'ČR',
       category: 'AI vizualizace',
       description: 'AI vizualizace ložnice s vestavěnou šatnou, jemným osvětlením a lehkými záclonami.'
    }
  },
  en: {
    '1': {
       title: 'Modern House in Bludovice',
       location: 'Bludovice, CZ',
       category: 'Exterior',
       description: 'Design and architectural rendering of a contemporary residence in Bludovice. Emphasizing clean geometric lines, cozy atmosphere, and highly optimized functional layouts.'
    },
    '2': {
       title: 'Nature-Inspired Workspace',
       location: 'CZ',
       category: 'Interior',
       description: 'Mountains, raw timber, and ambient greenery. An office layout masterfully drafted to foster productivity and trigger natural brainstorming sessions.'
    },
    '3': {
       title: 'Modern Bungalow in Skorkov',
       location: 'Skorkov, CZ',
       category: 'Exterior',
       description: 'We transformed an empty backyard plot into a photorealistic modern architectural bungalow concept.'
    },
    '4': {
       title: 'Timeless Beige Interior',
       location: 'CZ',
       category: 'Interior',
       description: 'A cozy family home dominated by warm neutral hues combined with rich oak wood texturing, breathing cozy vibes into every corner.'
    },
    '5': {
       title: 'House in Tranovice',
       location: 'Tranovice, CZ',
       category: 'Exterior',
       description: 'An older holiday cabin brought back to life, unveiling its massive design potential to prospective home builders.'
    },
    '6': {
       title: 'Horska Residence, Litvinov',
       location: 'Litvinov, CZ',
       category: 'Exterior',
       description: 'Constructing another modern residential floor directly top of the classic brick roof, equipped with spacious terraces. Designed for prospective buyers to explore materials.'
    },
    '7': {
       title: 'Country House Renovation',
       location: 'CZ',
       category: 'AI visualization',
       description: 'From a photo of a run-down house we created an AI visualization of the finished renovation. Same viewpoint, same geometry. The second image shows the state before.'
    },
    '8': {
       title: 'Pergola Terrace and Garden',
       location: 'CZ',
       category: 'AI visualization',
       description: 'AI exterior visualization: a covered terrace, fire pit and garden in the light of the setting sun.'
    },
    '9': {
       title: 'Living Room in Green Tones',
       location: 'CZ',
       category: 'AI visualization',
       description: 'AI interior visualization with soft daylight, natural materials and a bold olive accent.'
    },
    '10': {
       title: 'Bedroom in Warm Tones',
       location: 'CZ',
       category: 'AI visualization',
       description: 'AI bedroom visualization with a built-in wardrobe, soft lighting and light curtains.'
    }
  }
};

// Filter keys map onto the raw (Czech) categories in constants
type CategoryFilter = 'all' | 'Exteriér' | 'Interiér' | 'AI vizualizace';

const pad = (n: number) => String(n).padStart(2, '0');

export const PortfolioGallery: React.FC = () => {
  const { language, t } = useLanguage();
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);

  const getLocalizedProject = (raw: ProjectItem): ProjectItem => {
    const local = PROJECT_TRANSLATIONS[language]?.[raw.id];
    return {
      ...raw,
      title: local?.title || raw.title,
      location: local?.location || raw.location,
      description: local?.description || raw.description,
      category: local?.category || raw.category,
    };
  };

  const handleSelectProject = (project: ProjectItem) => {
    lastFocusRef.current = document.activeElement as HTMLElement | null;
    setSelectedProject(project);
    setSelectedImageIndex(0);
  };

  const closeModal = () => {
    setSelectedProject(null);
    lastFocusRef.current?.focus?.();
  };

  const hasSelectedProject = selectedProject !== null;
  const activeProject = selectedProject ? getLocalizedProject(selectedProject) : null;
  const gallery = activeProject ? (activeProject.galleryUrls?.length ? activeProject.galleryUrls : [activeProject.imageUrl]) : [];
  const showPrev = () => setSelectedImageIndex((i) => (i - 1 + gallery.length) % gallery.length);
  const showNext = () => setSelectedImageIndex((i) => (i + 1) % gallery.length);

  // Keyboard: Escape closes, arrows browse; focus moves into the dialog on open
  useEffect(() => {
    if (!selectedProject) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
      if (gallery.length > 1 && e.key === 'ArrowRight') showNext();
      if (gallery.length > 1 && e.key === 'ArrowLeft') showPrev();
    };
    window.addEventListener('keydown', onKey);
    const id = window.setTimeout(() => closeBtnRef.current?.focus(), 50);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProject, gallery.length]);

  const filters: { key: CategoryFilter; label: string }[] = [
    { key: 'all', label: t('portfolioCatAll') },
    { key: 'Exteriér', label: t('portfolioCatExterier') },
    { key: 'Interiér', label: t('portfolioCatInterier') },
    { key: 'AI vizualizace', label: language === 'cs' ? 'AI vizualizace' : 'AI visualization' },
  ];
  const visibleProjects = PROJECTS.filter((p) => filter === 'all' || p.category === filter);

  return (
    <section id="work" className="relative py-28 md:py-36">
      {/* Soft plum glows separating the section and lighting the glass */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="glow-plum rounded-full absolute right-[-180px] top-[4%] w-[620px] h-[620px] animate-drift-slow" />
        <div className="glow-plum rounded-full absolute left-[-220px] top-[45%] w-[560px] h-[560px] opacity-70" />
        <div className="glow-orchid rounded-full absolute left-1/2 -translate-x-1/2 bottom-[-160px] w-[700px] h-[320px] opacity-50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          {...blurInRise(0)}
          className="mb-10 md:mb-14 flex flex-col md:flex-row justify-between md:items-end gap-6 md:gap-12"
        >
          <div className="max-w-2xl">
            <span className="eyebrow block mb-4">{t('portfolioTitle')}</span>
            <h2 className="font-display font-bold text-ink text-4xl md:text-6xl tracking-tightest leading-[1.05]">
              {language === 'cs' ? (
                <>Galerie <span className="text-gradient">Vizí</span></>
              ) : (
                <>Gallery of <span className="text-gradient">Visions</span></>
              )}
            </h2>
          </div>
          <p className="text-ink-2 max-w-md text-base md:text-lg leading-relaxed font-light">
            {t('portfolioDesc')}
          </p>
        </motion.div>

        {/* Category filter */}
        <motion.div
          {...blurInRise(0.08)}
          role="group"
          aria-label={t('portfolioCategoryLabel')}
          className="flex flex-wrap items-center gap-2 mb-8 md:mb-12"
        >
          {filters.map(({ key, label }) => {
            const isActive = filter === key;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={isActive}
                onClick={() => setFilter(key)}
                className={`focus-ring relative rounded-full px-5 py-2.5 font-display font-medium text-sm transition-colors duration-500 ${
                  isActive ? 'text-white' : 'glass-pill text-ink-2 hover:text-ink'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="portfolio-filter-active"
                    transition={{ duration: 0.6, ease: EASE_OUT }}
                    className="absolute inset-0 rounded-full bg-[linear-gradient(160deg,#A24DB8_0%,#5B2769_100%)] border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_0_28px_rgba(162,77,184,0.45)]"
                    aria-hidden
                  />
                )}
                <span className="relative">{label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Mobile Swipe Indicator */}
        <div className="flex md:hidden items-center gap-3 mb-5 text-ink-3" aria-hidden>
          <span className="w-8 h-px bg-gradient-to-r from-transparent to-orchid-soft/60" />
          <span className="font-display text-[11px] uppercase tracking-[0.22em] font-medium">{language === 'cs' ? 'přetáhněte doprava' : 'swipe right'}</span>
          <ArrowRight className="w-3.5 h-3.5 text-orchid-soft" />
        </div>

        {/* Grid / Mobile Slider */}
        <motion.ul
          layout
          className="flex flex-nowrap md:grid md:grid-cols-2 gap-5 md:gap-x-8 md:gap-y-14 overflow-x-auto overflow-y-hidden md:overflow-visible pb-6 md:pb-0 snap-x snap-mandatory no-scrollbar -mx-6 px-6 scroll-px-6 md:mx-0 md:px-0"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {visibleProjects.map((rawProject, index) => {
              const project = getLocalizedProject(rawProject);
              return (
                <motion.li
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, filter: 'blur(8px)' }}
                  transition={{ duration: 0.7, ease: EASE_OUT, delay: Math.min(index, 3) * 0.06 }}
                  className="w-[84vw] max-w-[420px] shrink-0 md:w-auto md:max-w-none snap-start"
                >
                  <GalleryItem project={project} index={index} onSelectProject={handleSelectProject} />
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>

        {/* 'More' Button */}
        <motion.div {...blurInRise(0.1)} className="mt-14 md:mt-20 flex justify-center">
          <a
            href="#contact"
            className="btn-glass focus-ring group inline-flex items-center gap-3 px-8 py-4 rounded-full font-display font-medium"
          >
            <span>{t('portfolioContactBtn') || (language === 'cs' ? 'Kontaktujte nás' : 'Contact us')}</span>
            <ArrowUpRight className="w-4 h-4 text-orchid-soft transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
          </a>
        </motion.div>

        {/* Project Lightbox */}
        {typeof document !== 'undefined' && createPortal(
          <AnimatePresence>
            {hasSelectedProject && activeProject && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center md:p-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                  onClick={closeModal}
                  className="absolute inset-0 bg-[#050308]/85 backdrop-blur-md"
                  aria-hidden
                />
                <div className="hidden md:block absolute w-[70vw] h-[60vh] glow-plum rounded-full pointer-events-none" aria-hidden />
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="project-modal-title"
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

                  {/* Left: Image, arrows & thumbnails */}
                  <div className="w-full md:w-[60%] flex flex-col shrink-0 relative md:p-3">
                    <div className="relative flex-grow min-h-[36vh] sm:min-h-[40vh] md:min-h-[540px] overflow-hidden md:rounded-[26px] bg-plum-black">
                      <AnimatePresence initial={false}>
                        <motion.img
                          key={selectedImageIndex}
                          initial={{ opacity: 0, filter: 'blur(8px)' }}
                          animate={{ opacity: 1, filter: 'blur(0px)' }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.7, ease: EASE_OUT }}
                          src={gallery[selectedImageIndex]}
                          alt={`${activeProject.title} - ${activeProject.location} - Detail vizualizace`}
                          className="absolute inset-0 w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </AnimatePresence>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a050e]/80 via-transparent to-transparent pointer-events-none" />

                      {gallery.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={showPrev}
                            aria-label={language === 'cs' ? 'Předchozí obrázek' : 'Previous image'}
                            className="border border-white/20 bg-[rgba(12,6,18,0.42)] backdrop-blur-xl backdrop-saturate-150 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] text-ink transition-colors duration-300 hover:bg-[rgba(162,77,184,0.5)] focus-ring absolute left-3 md:left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center z-20"
                          >
                            <ChevronLeft className="w-5 h-5" aria-hidden />
                          </button>
                          <button
                            type="button"
                            onClick={showNext}
                            aria-label={language === 'cs' ? 'Další obrázek' : 'Next image'}
                            className="border border-white/20 bg-[rgba(12,6,18,0.42)] backdrop-blur-xl backdrop-saturate-150 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] text-ink transition-colors duration-300 hover:bg-[rgba(162,77,184,0.5)] focus-ring absolute right-3 md:right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center z-20"
                          >
                            <ChevronRight className="w-5 h-5" aria-hidden />
                          </button>

                          <div className="absolute top-4 left-4 md:top-5 md:left-5 z-20 border border-white/20 bg-[rgba(12,6,18,0.42)] backdrop-blur-xl backdrop-saturate-150 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] rounded-full px-3 py-1 font-display font-medium text-xs text-ink tabular-nums" aria-live="polite">
                            {pad(selectedImageIndex + 1)} <span className="text-ink-3">/ {pad(gallery.length)}</span>
                          </div>

                          <div className="absolute bottom-4 md:bottom-5 left-0 w-full flex justify-center z-20 px-4">
                            <div className="border border-white/20 bg-[rgba(12,6,18,0.42)] backdrop-blur-xl backdrop-saturate-150 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] rounded-full flex gap-2 p-1.5 max-w-full overflow-x-auto no-scrollbar">
                              {gallery.map((url, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedImageIndex(idx);
                                  }}
                                  aria-label={language === 'cs' ? `Zobrazit obrázek ${idx + 1}` : `View image ${idx + 1}`}
                                  aria-current={selectedImageIndex === idx}
                                  className={`focus-ring relative shrink-0 w-12 h-9 md:w-16 md:h-11 rounded-full overflow-hidden transition-all duration-500 ${
                                    selectedImageIndex === idx
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
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right: Text Content */}
                  <div className="relative w-full md:w-[40%] flex-1 md:flex-none p-6 md:p-10 lg:p-12 flex flex-col overflow-y-auto no-scrollbar">
                    <div className="absolute inset-0 glass-inner-glow opacity-70 pointer-events-none" aria-hidden />
                    <div className="relative flex flex-col flex-grow">
                      <h3 id="project-modal-title" className="font-display font-bold text-ink text-3xl md:text-[44px] tracking-tightest leading-[1.08] mb-3 md:mb-4 pr-12 md:pr-0 md:mt-4">
                        {activeProject.title}
                      </h3>

                      <div className="flex items-center gap-2 text-ink-2 mb-5 md:mb-7 text-sm md:text-base">
                        <MapPin className="w-4 h-4 icon-gradient shrink-0" strokeWidth={1.75} aria-hidden />
                        <span className="sr-only">{t('portfolioLocationLabel')}: </span>
                        <span>{activeProject.location}</span>
                        <span className="text-ink-3" aria-hidden>·</span>
                        <span className="sr-only">{t('portfolioCategoryLabel')}: </span>
                        <span>{activeProject.category}</span>
                      </div>

                      <div className="h-px w-14 bg-gradient-to-r from-orchid-soft to-transparent mb-5 md:mb-7" aria-hidden />

                      <p className="text-ink-2 leading-relaxed text-sm md:text-base mb-8 md:mb-10 flex-grow font-light">
                        {activeProject.description}
                      </p>

                      {/* Call to action */}
                      <div className="pt-5 md:pt-6 border-t border-white/10 mt-auto">
                        <p className="eyebrow block mb-3 md:mb-4">
                          {language === 'cs' ? 'Líbí se vám tento projekt?' : 'Do you like this project?'}
                        </p>
                        <div className="flex flex-col gap-2.5">
                          <a
                            href="#contact"
                            onClick={closeModal}
                            className="btn-primary focus-ring group flex items-center justify-between w-full px-6 py-3.5 md:py-4 rounded-full font-display font-medium text-sm md:text-base"
                          >
                            {language === 'cs' ? 'Mám zájem o spolupráci' : 'I am interested in collaboration'}
                            <ArrowUpRight className="w-5 h-5 shrink-0 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                          </a>
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
            )}
          </AnimatePresence>,
          document.body
        )}
      </div>
    </section>
  );
};

// Calm portfolio card: big photo (28px radius), slow <=1.04 zoom and a soft plum glow on hover
const GalleryItem: React.FC<{ project: ProjectItem; index: number; onSelectProject: (p: ProjectItem) => void }> = ({ project, index, onSelectProject }) => {
  const { language } = useLanguage();
  const viewLabel = language === 'cs' ? 'Zobrazit studii' : 'View study';

  return (
    <article className="group relative w-full">
      {/* Stretched button: the whole card opens the lightbox */}
      <button
        type="button"
        onClick={() => onSelectProject(project)}
        aria-label={`${viewLabel}: ${project.title}, ${project.location}`}
        className="absolute inset-0 z-20 w-full rounded-card focus-ring cursor-pointer"
      />
      {/* Photo */}
      <div className="relative">
        {/* Glow that blooms behind the photo on hover */}
        <div className="absolute inset-6 rounded-card glow-plum opacity-0 md:group-hover:opacity-100 transition-opacity duration-1000" aria-hidden />
        <div className="relative aspect-[4/5] md:aspect-[4/3] overflow-hidden rounded-card bg-plum-black border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.55)] transition-[box-shadow,border-color] duration-700 md:group-hover:border-white/20 md:group-hover:shadow-[0_30px_80px_rgba(0,0,0,0.55),0_0_60px_rgba(162,77,184,0.35)]">
          <img
            loading="lazy"
            src={project.imageUrl}
            alt={`Projekt ${project.title} - ${project.category}, ${project.location}`}
            className="w-full h-full object-cover transition-transform duration-[2200ms] ease-[cubic-bezier(0.16,1,0.3,1)] md:group-hover:scale-[1.04]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050308]/70 via-transparent to-transparent pointer-events-none" />

          <span className="absolute top-4 right-4 border border-white/20 bg-[rgba(12,6,18,0.42)] backdrop-blur-xl backdrop-saturate-150 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] rounded-full w-11 h-11 flex items-center justify-center transition-[background-color,box-shadow] duration-500 md:group-hover:bg-[rgba(162,77,184,0.5)] md:group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_0_24px_rgba(196,139,224,0.45)]" aria-hidden>
            <ArrowUpRight className="w-5 h-5 text-ink transition-transform duration-700 md:group-hover:translate-x-0.5 md:group-hover:-translate-y-0.5" />
          </span>
          <span className="absolute bottom-4 left-5 font-display font-medium text-xs tracking-[0.22em] text-ink/80 tabular-nums" aria-hidden>
            {pad(Number(project.id) || index + 1)}
          </span>
        </div>
      </div>

      {/* Caption */}
      <div className="pt-5 md:pt-6 px-1">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display font-bold text-ink text-xl md:text-2xl tracking-tightest leading-tight">
            {project.title}
          </h3>
          <span className="hidden md:inline-flex items-center gap-1.5 shrink-0 pt-1 font-display font-medium text-sm text-orchid-soft transition-colors duration-300 group-hover:text-orchid-pink" aria-hidden>
            {viewLabel}
            <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-0.5" />
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-ink-3 text-sm">
          <MapPin className="w-3.5 h-3.5 icon-gradient shrink-0" strokeWidth={1.75} aria-hidden />
          <span>{project.location}</span>
        </div>
        <p className="mt-3 text-ink-2 text-sm md:text-[15px] font-light leading-relaxed line-clamp-2 max-w-xl">
          {project.description}
        </p>
        <span className="md:hidden inline-flex items-center gap-1.5 mt-4 font-display font-medium text-sm text-orchid-soft" aria-hidden>
          {viewLabel}
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </article>
  );
};
