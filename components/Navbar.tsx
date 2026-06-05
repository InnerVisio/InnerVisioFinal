import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { NAV_ITEMS } from '../constants';

const navContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const navItemVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 }
  },
};

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);

          // Simple scroll spy logic
          const sections = NAV_ITEMS.map(item => item.href.substring(1));
          let current = '';
          for (const section of sections) {
            const element = document.getElementById(section);
            if (element) {
              const rect = element.getBoundingClientRect();
              // Check if the top of the section is near the top of the viewport
              if (rect.top <= 150 && rect.bottom >= 150) {
                current = section;
              }
            }
          }
          setActiveSection(current);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Optimized Background Layer */}
      <div 
        className={`absolute inset-0 bg-[#050205]/90 backdrop-blur-lg border-b border-white/5 shadow-2xl transition-opacity duration-300 pointer-events-none ${
          isScrolled ? 'opacity-100' : 'opacity-0'
        }`}
      />
      
      <div className={`relative max-w-7xl mx-auto px-4 md:px-8 transition-all duration-300 ${isScrolled ? 'py-3' : 'py-5 md:py-8'}`}>
        <div className="flex items-center justify-between w-full">
          {/* Logo & Greeting Style Container */}
          <a href="#root" className="flex items-center gap-3 group/logo shrink-0 z-50">
            <div className="w-12 md:w-14 h-12 md:h-14 flex items-center justify-center group-hover/logo:scale-105 transition-transform duration-300">
              <img 
                src="https://innervisio.cz/wp-content/uploads/2026/01/Kreslici-platno-11920x1080-bila.png" 
                alt="InnerVisio Logo" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-display font-medium text-white leading-tight">
                InnerVisio
              </span>
              <span className="text-xs text-gray-400 font-medium leading-tight">
                Architecture
              </span>
            </div>
          </a>

          {/* Desktop Nav - Pill Style */}
          <motion.div 
            className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2"
            variants={navContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.href.substring(1);
              return (
                <motion.a
                  key={item.label}
                  href={item.href}
                  variants={navItemVariants}
                  className={`px-5 py-2.5 rounded-full text-sm transition-all duration-300 font-medium ${
                    isActive 
                      ? 'bg-primary text-white shadow-[0_0_15px_rgba(56,24,63,0.6)]' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </motion.a>
              );
            })}
          </motion.div>

          {/* Desktop Call to Action & Icons */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <motion.a 
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-gray-200 transition-colors shadow-lg"
            >
              Zahájit projekt
            </motion.a>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden relative z-50 text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Content */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="md:hidden absolute top-full left-0 right-0 bg-[#050205] border-b border-white/10 shadow-2xl p-4 flex flex-col gap-2"
            >
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.href.substring(1);
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-lg font-display px-4 py-3 rounded-xl transition-colors ${
                      isActive 
                        ? 'bg-primary/20 text-white' 
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
              <a 
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-4 mx-2 px-6 py-3.5 rounded-xl bg-white text-black font-semibold text-center hover:bg-gray-200 transition-colors"
              >
                Zahájit projekt
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};