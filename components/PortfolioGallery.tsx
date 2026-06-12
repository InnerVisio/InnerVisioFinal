import React, { useState, useRef, MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { Plus, ArrowUpRight, MapPin, Tag, X } from 'lucide-react';
import { PROJECTS } from '../constants';
import { ProjectItem } from '../types';
import { useLanguage, Language } from './LanguageContext';

const springTransition = { type: "spring" as const, stiffness: 70, damping: 20 };

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
    }
  }
};

export const PortfolioGallery: React.FC = () => {
  const { language, t } = useLanguage();
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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
    setSelectedProject(project);
    setSelectedImageIndex(0);
  };

  const hasSelectedProject = selectedProject !== null;
  const activeProject = selectedProject ? getLocalizedProject(selectedProject) : null;

  return (
    <section id="work" className="py-32 relative bg-background">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header with reveal animation */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12 md:mb-20 flex flex-col md:flex-row justify-between items-center md:items-end gap-6 text-center md:text-left animate-fade-in"
        >
          <div className="flex flex-col items-center md:items-start">
            <span className="text-secondary font-medium tracking-widest uppercase text-xs md:text-sm mb-2 block font-display">
              {t('portfolioTitle')}
            </span>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tighter">
              {language === 'cs' ? (
                <>Galerie <span className="text-gray-600">Vizí</span></>
              ) : (
                <>Gallery of <span className="text-gray-600">Visions</span></>
              )}
            </h2>
          </div>
          <p className="text-gray-400 max-w-md text-sm md:text-lg leading-relaxed font-light">
            {t('portfolioDesc')}
          </p>
        </motion.div>

        {/* Mobile Swipe Indicator */}
        <div className="flex md:hidden items-center justify-center gap-2 mb-6 text-gray-400 animate-pulse">
          <div className="w-8 h-px bg-gray-600" />
          <span className="text-xs uppercase tracking-[0.2em] font-bold">{language === 'cs' ? 'přetáhněte doprava' : 'swipe right'}</span>
          <div className="w-8 h-px bg-gray-600" />
        </div>

        {/* Flex Grid / Mobile Slider */}
        <div className="flex flex-nowrap md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 overflow-x-auto overflow-y-hidden md:overflow-visible pb-8 pt-4 md:py-8 snap-x snap-mandatory no-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
          {PROJECTS.map((rawProject, index) => {
            const project = getLocalizedProject(rawProject);
            return (
              <div key={project.id} className="min-w-[85vw] md:min-w-0 snap-center">
                <GalleryItem project={project} index={index} onSelectProject={handleSelectProject} />
              </div>
            );
          })}
        </div>
        
        {/* 'More' Button */}
        <div className="mt-20 flex justify-center">
            <motion.a 
                href="#contact"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="group flex items-center gap-3 px-8 py-4 rounded-full border border-white/10 md:hover:border-secondary/50 md:hover:bg-secondary/10 transition-all duration-500"
            >
                <span className="text-white font-medium">{t('portfolioContactBtn') || (language === 'cs' ? 'Kontaktujte nás' : 'Contact us')}</span>
                <ArrowUpRight className="w-4 h-4 text-secondary md:group-hover:translate-x-1 md:group-hover:-translate-y-1 transition-transform duration-500" />
            </motion.a>
        </div>

        {/* Project Modal */}
        {typeof document !== 'undefined' && createPortal(
          <AnimatePresence>
            {hasSelectedProject && activeProject && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedProject(null)}
                  className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="relative w-full h-full md:h-auto md:max-w-6xl md:max-h-[85vh] bg-[#050205] md:border md:border-white/5 md:rounded-3xl shadow-[0_0_80px_rgba(101,36,111,0.15)] z-10 flex flex-col md:flex-row overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setSelectedProject(null)}
                    className="absolute top-3 right-3 md:top-4 md:right-4 p-2 md:p-3 bg-black/50 backdrop-blur-md hover:bg-white/10 rounded-full text-white transition-all z-[110] border border-white/10 outline-none focus:outline-none focus:ring-0 select-none"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <X className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  
                  {/* Left: Image & Thumbnails */}
                  <div className="w-full md:w-[60%] flex flex-col shrink-0 border-b md:border-b-0 md:border-r border-white/5 relative bg-black">
                    <div className="relative flex-grow min-h-[30vh] sm:min-h-[35vh] md:min-h-[500px]">
                      <motion.img 
                        key={selectedImageIndex}
                        loading="lazy"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        src={activeProject.galleryUrls?.[selectedImageIndex] || activeProject.imageUrl} 
                        alt={`${activeProject.title} - ${activeProject.location} - Detail vizualizace`} 
                        className="absolute inset-0 w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                      {/* Gradient overlays to blend into background */}
                      <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#050205] to-transparent opacity-90 pointer-events-none" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050205] via-transparent to-transparent opacity-60 pointer-events-none" />
                    </div>
                    
                    {activeProject.galleryUrls && activeProject.galleryUrls.length > 1 && (
                      <div className="absolute bottom-4 md:bottom-6 left-0 w-full flex justify-center gap-2 md:gap-3 px-4 md:px-6 overflow-x-auto no-scrollbar z-20">
                        {activeProject.galleryUrls.map((url, idx) => (
                          <button
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedImageIndex(idx);
                            }}
                            aria-label={`View image ${idx + 1}`}
                            className={`relative shrink-0 w-12 h-10 md:w-20 md:h-14 rounded overflow-hidden transition-all duration-300 ${
                              selectedImageIndex === idx 
                                ? 'ring-2 ring-secondary ring-offset-2 ring-offset-[#050205] opacity-100' 
                                : 'opacity-40 md:hover:opacity-100 border border-white/10'
                            }`}
                          >
                            <img 
                              loading="lazy"
                              src={url} 
                              alt={`${activeProject.title} - ${idx + 1}`} 
                              className="w-full h-full object-cover" 
                              referrerPolicy="no-referrer"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Right: Text Content */}
                  <div className="w-full md:w-[40%] p-5 sm:p-6 md:p-14 flex flex-col justify-center relative bg-gradient-to-br from-[#0a050a] to-[#050205] overflow-y-auto no-scrollbar">
                    <div className="flex flex-wrap items-center gap-2 mb-3 md:mb-6">
                      <span className="px-2.5 py-1 md:px-3 md:py-1 bg-secondary/10 border border-secondary/20 text-secondary rounded shadow-[0_0_15px_rgba(101,36,111,0.2)] text-[9px] md:text-xs font-bold tracking-widest uppercase font-display">
                        {activeProject.category}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl md:text-5xl font-display font-bold text-white mb-3 md:mb-4 leading-tight drop-shadow-lg">
                      {activeProject.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-gray-300 mb-4 md:mb-8 text-xs sm:text-sm md:text-base font-medium">
                      <MapPin className="w-3.5 h-3.5 md:w-5 md:h-5 text-secondary" />
                      <span>{activeProject.location}</span>
                    </div>
                    
                    <div className="h-px w-12 md:w-16 bg-gradient-to-r from-secondary to-transparent mb-4 md:mb-8" />
                    
                    <p className="text-gray-400 leading-relaxed text-xs sm:text-sm md:text-base mb-6 md:mb-12 flex-grow font-light">
                      {activeProject.description}
                    </p>
                    
                    {/* Call to action */}
                    <div className="pt-4 md:pt-6 border-t border-white/5 mt-auto">
                      <p className="text-xs md:text-sm text-secondary font-bold tracking-widest uppercase mb-2 md:mb-4">
                        {language === 'cs' ? 'Líbí se vám tento projekt?' : 'Do you like this project?'}
                      </p>
                      <a 
                        href="#contact"
                        onClick={() => setSelectedProject(null)}
                        className="group flex items-center justify-between w-full px-4 py-3 md:px-6 md:py-4 bg-white md:hover:bg-gray-100 text-black rounded-lg font-bold transition-all shadow-[0_4px_20px_rgba(255,255,255,0.1)] md:hover:shadow-[0_4px_25px_rgba(255,255,255,0.2)] text-sm md:text-base mb-3"
                      >
                        {language === 'cs' ? 'Mám zájem o spolupráci' : 'I am interested in collaboration'}
                        <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </a>
                      <button
                        onClick={() => setSelectedProject(null)}
                        className="w-full py-2 text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        {t('portfolioCloseBtn')}
                      </button>
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

const GalleryItem: React.FC<{ project: ProjectItem; index: number; onSelectProject: (p: ProjectItem) => void }> = ({ project, index, onSelectProject }) => {
  const { language } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Motion values for smoother tilt
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 25 });
  const rotateX = useTransform(springY, [0, 1], [8, -8]);
  const rotateY = useTransform(springX, [0, 1], [-8, 8]);

  // Motion values for subtle flashlight
  const touchX = useMotionValue(0);
  const touchY = useMotionValue(0);
  const smoothTouchX = useSpring(touchX, { stiffness: 60, damping: 20 });
  const smoothTouchY = useSpring(touchY, { stiffness: 60, damping: 20 });
  const spotlight = useMotionTemplate`radial-gradient(400px circle at ${smoothTouchX}px ${smoothTouchY}px, rgba(255,255,255,0.06), transparent 80%)`;

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || window.innerWidth < 768) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // Normalize coordinates to 0 -> 1 for tilt
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);

    // Pixel coordinates for flashlight
    touchX.set(e.clientX - rect.left);
    touchY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        ...springTransition,
        delay: index * 0.1 
      }}
      className="relative group cursor-pointer w-full flex flex-col"
      style={{ perspective: '1200px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onClick={() => onSelectProject(project)}
    >
      <motion.div 
        className="relative w-full flex-grow aspect-[4/5]" 
        ref={cardRef}
        style={{
          rotateX: isHovered && window.innerWidth >= 768 ? rotateX : 0,
          rotateY: isHovered && window.innerWidth >= 768 ? rotateY : 0,
        }}
        animate={{ 
          scale: isHovered && window.innerWidth >= 768 ? 1.02 : 1
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.div
          animate={{ rotateY: isHovered && window.innerWidth >= 768 ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }} 
          className="w-full h-full relative"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* ==================== FRONT FACE ==================== */}
          <div 
            className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden backface-hidden"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          >
            {/* Image */}
            <div className="relative w-full h-full bg-gray-900">
              <motion.img 
                loading="lazy"
                src={project.imageUrl} 
                alt={`Projekt ${project.title} - ${project.category}, ${project.location}`}
                className="w-full h-full object-cover"
                transition={{ duration: 0.8 }}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
            </div>

            {/* Front Static Content */}
            <div className="absolute bottom-0 left-0 w-full p-6 z-10">
                 <div className="flex justify-between items-end">
                    <div>
                        <span className="text-secondary text-xs font-bold tracking-widest uppercase mb-2 block font-display">{project.category}</span>
                        <h3 className="text-xl md:text-2xl font-display font-bold text-white leading-tight">{project.title}</h3>
                    </div>
                    <div className="p-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10 md:group-hover:bg-white/10 transition-colors">
                        <ArrowUpRight className="w-5 h-5 text-white" />
                    </div>
                 </div>
            </div>
          </div>

          {/* ==================== BACK FACE ==================== */}
          <div 
            className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden bg-[#0a050a] border border-white/10 shadow-2xl"
            style={{ 
              transform: 'rotateY(180deg)', 
              backfaceVisibility: 'hidden', 
              WebkitBackfaceVisibility: 'hidden' 
            }}
          >
            {/* Elegant Grid Pattern */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />
            
            {/* Subtle Spotlight Effect */}
            <motion.div 
              className="absolute inset-0 pointer-events-none transition-opacity duration-500"
              style={{
                background: spotlight,
                opacity: isHovered ? 1 : 0
              }}
            />

            {/* Back Content */}
            <div className="relative z-10 h-full p-6 md:p-8 flex flex-col overflow-y-auto">
              <div className="flex justify-between items-start mb-4 shrink-0">
                 <div className="p-2 bg-white/10 rounded-full border border-white/20 text-white shadow-xl">
                   <Tag className="w-4 h-4 text-secondary drop-shadow-md" />
                 </div>
                 <span className="text-xs uppercase tracking-widest text-gray-300 font-bold drop-shadow-sm bg-[#0a050a]/50 px-2 py-1 rounded backdrop-blur-sm font-display">{project.category}</span>
              </div>
              
              <div className="flex-grow flex flex-col justify-center gap-3 md:gap-4 my-2">
                <h3 className="text-2xl md:text-3xl font-display font-bold text-white leading-tight drop-shadow-xl">
                  {project.title}
                </h3>
                
                <div className="flex items-center gap-2 text-sm text-gray-200 drop-shadow-md">
                  <MapPin className="w-4 h-4 text-secondary shrink-0 drop-shadow-md relative z-10" />
                  <span className="truncate font-medium">{project.location}</span>
                </div>

                <div className="h-px w-12 bg-secondary/80 my-1 md:my-2 shrink-0 shadow-[0_0_10px_rgba(101,36,111,0.8)]" />

                <p className="text-white leading-relaxed text-sm font-light drop-shadow-md">
                  {project.description}
                </p>
              </div>

              <div className="mt-auto pt-4 shrink-0">
                 <button 
                   onClick={(e) => {
                     e.stopPropagation();
                     onSelectProject(project);
                   }}
                   className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-purple-100 transition-colors text-sm shadow-[0_4px_20px_rgba(255,255,255,0.25)] ring-1 ring-white/50"
                 >
                   {language === 'cs' ? 'Zobrazit studii' : 'View study'}
                 </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
