import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServiceGrid } from './components/ServiceGrid';
import { PortfolioGallery } from './components/PortfolioGallery';
import { PricingSection } from './components/PricingSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { CookieBanner } from './components/CookieBanner';
import { HERO_SLIDES } from './constants';

function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { scrollY } = useScroll();
  
  // Smooth out the raw scroll value using a spring
  const smoothY = useSpring(scrollY, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const y1 = useTransform(smoothY, [0, 1000], [0, 200]);
  const opacity = useTransform(smoothY, [0, 500], [1, 0.5]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-background selection:bg-secondary selection:text-white overflow-x-hidden">
      
      {/* GLOBAL BACKGROUND LAYER */}
      {/* Extends 150vh to cover Hero and half of Services */}
      <motion.div 
        style={{ y: y1, opacity, willChange: "transform" }}
        className="absolute top-0 left-0 w-full h-[160vh] z-0 overflow-hidden pointer-events-none"
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {/* Dark overlay for text contrast */}
            <div className="absolute inset-0 bg-black/50 z-10" /> 
            
            {/* Gradient Mask at the bottom to fade into body color */}
            <div className="absolute bottom-0 left-0 w-full h-[40vh] bg-gradient-to-b from-transparent to-[#050205] z-20" />

            <img 
              src={HERO_SLIDES[currentSlide].image} 
              alt={`Architektonická vizualizace - ${HERO_SLIDES[currentSlide].title}, ${HERO_SLIDES[currentSlide].location}`} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Ambient Glows */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full z-10" />
      </motion.div>

      <Navbar />
      
      <main className="relative z-10">
        {/* Pass state control to Hero for the text and dots */}
        <div className="min-h-screen md:h-auto">
          <Hero currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} />
        </div>
        
        <div className="min-h-screen md:min-h-0">
          <ServiceGrid />
        </div>

        <div className="min-h-screen md:min-h-0">
          <PortfolioGallery />
        </div>
        
        <div className="min-h-screen md:min-h-0">
          <PricingSection />
        </div>
        
        <div className="min-h-screen md:min-h-0">
          <ContactSection />
        </div>
      </main>

      <div>
        <Footer />
      </div>

      <CookieBanner />
    </div>
  );
}

export default App;
