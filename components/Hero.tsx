import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { HERO_SLIDES, STATS } from '../constants';

interface HeroProps {
  currentSlide: number;
  setCurrentSlide: (index: number) => void;
}

export const Hero: React.FC<HeroProps> = ({ currentSlide, setCurrentSlide }) => {

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-12">
      
      {/* Main Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 w-full flex flex-col justify-center">
        
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[1.1] tracking-tighter text-white overflow-hidden">
              <motion.span 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                className="block"
              >
                Navrhujeme
              </motion.span>
              <motion.span 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
                className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-white to-purple-300"
              >
                Nepředstavitelné
              </motion.span>
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base md:text-lg text-gray-300 max-w-md font-light leading-relaxed mt-6"
          >
            Přinášíme prezentaci nemovitostí na nové úrovni. Zvyšte svou úroveň prezentace skrze světlo, emoce a profesionální vizuál.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 md:gap-6 mt-10"
          >
            <a href="#work" className="group relative px-8 py-4 bg-white text-black rounded-full font-bold flex items-center justify-center gap-3 overflow-hidden">
              <div className="absolute inset-0 bg-purple-100 transform scale-x-0 md:group-hover:scale-x-100 transition-transform origin-left duration-300" />
              <span className="relative z-10">Prozkoumat portfolio</span>
              <ArrowRight className="relative z-10 w-4 h-4 md:group-hover:translate-x-1 transition-transform" />
            </a>
            
            <a href="#contact" className="flex items-center justify-center sm:justify-start gap-3 text-white md:hover:text-purple-300 transition-colors group py-2">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 flex items-center justify-center md:group-hover:border-secondary md:group-hover:bg-secondary/20 transition-all">
                <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
              </div>
              <span className="text-sm font-medium tracking-wide">Kontaktovat studio</span>
            </a>
          </motion.div>

          {/* Info Card - Integrated into flow on mobile, absolute on desktop */}
          <div className="md:contents">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-10 md:mt-0 md:absolute md:bottom-12 md:right-24 md:z-30 w-full md:w-auto"
            >
              <div className="p-5 md:p-6 bg-white/5 md:bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl md:min-w-[300px]">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                    </span>
                    <span className="text-sm md:text-base font-medium text-white">Máme prostor pro nové zakázky</span>
                  </div>
                  <div className="w-full h-px bg-white/10 my-1"></div>
                  <div className="flex items-center gap-3">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                    <span className="text-sm md:text-base font-medium text-white">Rychlá doba dodání</span>
                  </div>
                  <div className="w-full h-px bg-white/10 my-1"></div>
                  <div className="flex items-center gap-3">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    <span className="text-sm md:text-base font-medium text-white">Moderní prezentace</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-6 md:gap-8 pt-8 border-t border-white/10 mt-10 md:mt-12 max-w-xl"
          >
            {STATS.map((stat, idx) => (
              <div key={stat.label} className={idx === 2 ? "col-span-2 sm:col-span-1" : ""}>
                <h4 className="text-xl md:text-3xl font-display font-bold text-white mb-1">{stat.value}</h4>
                <p className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

      </div>

      {/* Vertical Navigation Dots on Right Side - Hidden on small mobile to avoid overlap */}
      <div className="absolute right-4 md:right-6 top-1/2 transform -translate-y-1/2 z-30 hidden sm:flex flex-col gap-4">
        {HERO_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className="group flex items-center justify-end"
            aria-label={`Go to slide ${index + 1}`}
          >
            <span className={`
              h-2.5 w-2.5 md:h-3 md:w-3 rounded-full border border-white transition-all duration-300
              ${currentSlide === index ? 'bg-white scale-125' : 'bg-transparent md:group-hover:bg-white/50'}
            `} />
          </button>
        ))}
      </div>

    </section>
  );
};
