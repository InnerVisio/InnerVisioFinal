import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from './ui/GlassCard';
import { SERVICES } from '../constants';
import { ArrowRight, ChevronRight, X, ArrowUpRight } from 'lucide-react';
import { ServiceItem } from '../types';

export const ServiceGrid: React.FC = () => {
  const [activeServiceId, setActiveServiceId] = useState(SERVICES[0].id);
  const [selectedServiceModal, setSelectedServiceModal] = useState<ServiceItem | null>(null);
  const [selectedServiceImageIndex, setSelectedServiceImageIndex] = useState(0);
  
  const activeService = SERVICES.find(s => s.id === activeServiceId) || SERVICES[0];

  const handleOpenModal = (service: ServiceItem) => {
    setSelectedServiceModal(service);
    setSelectedServiceImageIndex(0);
  };

  return (
    <section id="services" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Naše Odbornost
            </h2>
            <p className="text-gray-300 text-lg">
              Spojujeme uměleckou vizi s technickou precizností. Naše špičkové architektonické vizualizace exteriéru i interiéru pomáhají prezentovat reality v městech jako Praha, Ostrava, Havířov a po celé České republice.
            </p>
          </div>
        </div>

        {/* Desktop: Tabbed Glass Interface */}
        <div className="hidden lg:block">
          <GlassCard className="border border-white/10 bg-black/40 backdrop-blur-2xl">
            {/* Internal Layout Wrapper */}
            <div className="flex flex-col lg:flex-row">
              
              {/* LEFT SIDE: Navigation (Tabs) */}
              <div className="w-full lg:w-[35%] border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col flex-shrink-0">
                <div className="p-5 pb-3">
                  <span className="text-xs font-bold text-secondary uppercase tracking-widest">Služby Studia</span>
                </div>
                
                <div className="flex flex-col">
                  {SERVICES.map((service) => {
                    const isActive = activeServiceId === service.id;
                    return (
                      <button
                        key={service.id}
                        onClick={() => setActiveServiceId(service.id)}
                        className={`
                          group relative w-full text-left px-5 py-4 flex items-center justify-between
                          transition-all duration-300 ease-in-out border-l-4
                          ${isActive 
                            ? 'bg-white/5 border-secondary' 
                            : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/10'}
                        `}
                      >
                        <motion.div 
                          whileHover={window.innerWidth >= 768 ? { x: 5 } : undefined}
                          className="flex items-center gap-3 relative z-10"
                        >
                          <div className={`
                            p-1.5 rounded-md transition-colors duration-300
                            ${isActive ? 'bg-secondary/20 text-secondary' : 'bg-white/5 text-gray-400 group-hover:text-white'}
                          `}>
                            <service.icon className="w-4 h-4" />
                          </div>
                          <span className={`
                            font-display font-medium text-base tracking-wide transition-colors duration-300
                            ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}
                          `}>
                            {service.title}
                          </span>
                        </motion.div>
                        
                        <ChevronRight 
                          className={`
                            w-4 h-4 transition-all duration-300 
                            ${isActive ? 'text-secondary translate-x-0 opacity-100' : 'text-gray-500 -translate-x-2 opacity-0 group-hover:opacity-50'}
                          `} 
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT SIDE: Content Reveal */}
              <div className="w-full lg:w-[65%] relative flex flex-col bg-black/20">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeService.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col h-full"
                  >
                    {/* Image Area - Reduced height */}
                    <div className="relative h-56 w-full overflow-hidden shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a050a] to-transparent z-10" />
                      <motion.img 
                        initial={{ scale: 1.05 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 4, ease: "easeOut" }}
                        src={activeService.imageUrl || `https://picsum.photos/seed/arch${activeService.id}/800/600`} 
                        alt={`Služba: ${activeService.title} - InnerVisio`}
                        className="w-full h-full object-cover opacity-80"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-6 right-6 z-20">
                         <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl">
                            <activeService.icon className="w-6 h-6 text-white" />
                         </div>
                      </div>
                    </div>

                    {/* Text Content - Compact padding */}
                    <div className="p-6 md:p-8 flex flex-col flex-grow bg-gradient-to-b from-[#0a050a] to-transparent">
                      <motion.div 
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">
                          {activeService.title}
                        </h3>
                        <p className="text-gray-300 leading-relaxed text-base max-w-xl">
                          {activeService.description}
                        </p>
                      </motion.div>
                      
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between"
                      >
                        <div className="flex gap-3">
                            <span className="px-2.5 py-1 rounded-full border border-white/10 text-[10px] text-gray-400 bg-white/5 uppercase tracking-wider">Professional</span>
                            <span className="px-2.5 py-1 rounded-full border border-white/10 text-[10px] text-gray-400 bg-white/5 uppercase tracking-wider">Fast Delivery</span>
                        </div>
                        
                        <button 
                          onClick={() => handleOpenModal(activeService)}
                          className="flex items-center gap-2 text-white hover:text-secondary transition-colors group"
                        >
                          <span className="font-medium text-sm">Zjistit více</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </motion.div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </GlassCard>
        </div>

        {/* Mobile: Horizontal Swipe Slider */}
        <div className="lg:hidden mb-6 flex items-center justify-center gap-2 text-gray-500 animate-pulse">
          <div className="w-8 h-px bg-gray-700" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold">přetáhněte doprava</span>
          <div className="w-8 h-px bg-gray-700" />
        </div>
        <div className="lg:hidden -mx-6 px-6 overflow-x-auto overflow-y-hidden snap-x snap-mandatory no-scrollbar pb-8">
          <div className="flex gap-6 w-max">
            {SERVICES.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                transition={{ delay: index * 0.1 }}
                className="group w-[85vw] snap-center"
              >
                <GlassCard className="h-full border border-white/10 bg-white/5 overflow-hidden flex flex-col">
                  <div className="relative h-48 w-full overflow-hidden">
                    <img 
                      src={service.imageUrl || `https://picsum.photos/seed/arch${service.id}/800/600`} 
                      alt={`Vizualizace: ${service.title}`}
                      className="w-full h-full object-cover opacity-60 md:group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a050a] to-transparent" />
                    <div className="absolute top-4 right-4">
                      <div className="w-10 h-10 rounded-full bg-secondary/20 backdrop-blur-md border border-secondary/30 flex items-center justify-center">
                        <service.icon className="w-5 h-5 text-secondary" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-display font-bold text-white mb-3 md:group-hover:text-secondary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                      {service.description}
                    </p>
                    <button 
                      onClick={() => handleOpenModal(service)}
                      className="flex items-center gap-2 text-white text-sm font-medium group/btn py-2"
                    >
                      <span>Zjistit více</span>
                      <ArrowRight className="w-4 h-4 md:group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      {/* Service Modal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedServiceModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedServiceModal(null)}
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
                  onClick={() => setSelectedServiceModal(null)}
                  className="absolute top-3 right-3 md:top-4 md:right-4 p-2 md:p-3 bg-black/50 backdrop-blur-md hover:bg-white/10 rounded-full text-white transition-all z-[110] border border-white/10 outline-none focus:outline-none focus:ring-0 select-none"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <X className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                
                {/* Left: Image & Thumbnails */}
                <div className="w-full md:w-[50%] lg:w-[60%] flex flex-col shrink-0 border-b md:border-b-0 md:border-r border-white/5 relative bg-black">
                  <div className="relative flex-grow min-h-[30vh] sm:min-h-[35vh] md:min-h-[500px]">
                    <motion.img 
                      key={selectedServiceImageIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      src={selectedServiceModal.galleryUrls?.[selectedServiceImageIndex] || selectedServiceModal.imageUrl || `https://picsum.photos/seed/arch${selectedServiceModal.id}/800/600`} 
                      alt={`Služba: ${selectedServiceModal.title}`} 
                      className="absolute inset-0 w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#050205] to-transparent opacity-90 pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050205] via-transparent to-transparent opacity-60 pointer-events-none" />
                    
                    <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20">
                      <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl">
                        <selectedServiceModal.icon className="w-5 h-5 md:w-7 md:h-7 text-secondary drop-shadow-md" />
                      </div>
                    </div>
                  </div>
                  
                  {selectedServiceModal.galleryUrls && selectedServiceModal.galleryUrls.length > 1 && (
                    <div className="absolute bottom-4 md:bottom-6 left-0 w-full flex justify-center gap-2 md:gap-3 px-4 md:px-6 overflow-x-auto no-scrollbar z-20">
                      {selectedServiceModal.galleryUrls.map((url, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedServiceImageIndex(idx);
                          }}
                          className={`relative shrink-0 w-12 h-10 md:w-20 md:h-14 rounded overflow-hidden transition-all duration-300 ${
                            selectedServiceImageIndex === idx 
                              ? 'ring-2 ring-secondary ring-offset-2 ring-offset-[#050205] opacity-100' 
                              : 'opacity-40 md:hover:opacity-100 border border-white/10'
                          }`}
                        >
                          <img 
                            src={url} 
                            alt={`${selectedServiceModal.title} - ${idx + 1}`} 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Right: Text Content */}
                <div className="w-full md:w-[50%] lg:w-[40%] p-5 sm:p-6 md:p-14 flex flex-col justify-center relative bg-gradient-to-br from-[#0a050a] to-[#050205] overflow-y-auto no-scrollbar">
                  <div className="flex flex-wrap items-center gap-2 mb-3 md:mb-6">
                    <span className="px-2.5 py-1 md:px-3 md:py-1 bg-secondary/10 border border-secondary/20 text-secondary rounded shadow-[0_0_15px_rgba(101,36,111,0.2)] text-[9px] md:text-xs font-bold tracking-widest uppercase">
                      Naše Služba
                    </span>
                  </div>
                  
                  <h3 className="text-2xl md:text-5xl font-display font-bold text-white mb-3 md:mb-6 leading-tight drop-shadow-lg">
                    {selectedServiceModal.title}
                  </h3>
                  
                  <div className="h-px w-12 md:w-16 bg-gradient-to-r from-secondary to-transparent mb-4 md:mb-8" />
                  
                  <p className="text-gray-300 leading-relaxed text-xs sm:text-sm md:text-base mb-4 md:mb-8">
                    {selectedServiceModal.detailedDescription || selectedServiceModal.description}
                  </p>
                  
                  {selectedServiceModal.features && (
                    <ul className="mb-6 md:mb-12 space-y-2 md:space-y-3">
                      {selectedServiceModal.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 md:gap-3">
                          <div className="mt-1 md:mt-1.5 w-1.5 h-1.5 rounded-full bg-secondary shrink-0 shadow-[0_0_8px_rgba(101,36,111,0.8)]" />
                          <span className="text-gray-400 text-xs sm:text-sm md:text-base">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  {/* Call to action */}
                  <div className="pt-4 md:pt-6 border-t border-white/5 mt-auto">
                    <p className="text-[10px] md:text-xs text-secondary font-bold tracking-widest uppercase mb-2 md:mb-4">Poptat tuto službu</p>
                    <a 
                      href="#contact"
                      onClick={() => setSelectedServiceModal(null)}
                      className="group flex items-center justify-between w-full px-4 py-3 md:px-6 md:py-4 bg-white md:hover:bg-gray-100 text-black rounded-lg font-bold transition-all shadow-[0_4px_20px_rgba(255,255,255,0.1)] md:hover:shadow-[0_4px_25px_rgba(255,255,255,0.2)] text-sm md:text-base mb-3"
                    >
                      Mám zájem
                      <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>
                    <button
                      onClick={() => setSelectedServiceModal(null)}
                      className="w-full py-2 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      Zavřít
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
};
