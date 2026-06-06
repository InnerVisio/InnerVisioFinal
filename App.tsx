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
import { Copy, Check, ArrowLeft } from 'lucide-react';

function App() {
  const [pathname, setPathname] = useState(window.location.pathname);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { scrollY } = useScroll();

  // Route matching for the static email target image page
  const isEmailImageRoute = 
    pathname === '/101-exterier' || 
    pathname === '/101-Exterier' || 
    pathname === '/email-image' || 
    pathname === '/email/101-exterier';

  // Toggle for copying feedback
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const imageUrl = "https://innervisio.netlify.app/101-Exterier.jpg";
  const htmlCode = `<img src="${imageUrl}" alt="InnerVisio - Vizualizace Exteriéru" width="600" style="display: block; max-width: 100%; height: auto; border: none; outline: none; margin: 0 auto;" />`;

  const copyToClipboard = async (text: string, type: 'html' | 'url') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'html') {
        setCopiedHtml(true);
        setTimeout(() => setCopiedHtml(false), 2000);
      } else {
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  useEffect(() => {
    const handleLocationChange = () => {
      setPathname(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Set noindex dynamically for privacy & avoiding search crawlers on email asset page
  useEffect(() => {
    if (isEmailImageRoute) {
      let metaIndex = document.querySelector('meta[name="robots"]');
      if (!metaIndex) {
        metaIndex = document.createElement('meta');
        metaIndex.setAttribute('name', 'robots');
        document.head.appendChild(metaIndex);
      }
      metaIndex.setAttribute('content', 'noindex, nofollow, noarchive');
    }
  }, [isEmailImageRoute]);

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

  if (isEmailImageRoute) {
    return (
      <div className="min-h-screen bg-[#070408] text-white flex flex-col items-center justify-center p-4 sm:p-8 font-sans selection:bg-primary/35 selection:text-white">
        <div className="max-w-4xl w-full bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 sm:p-8 flex flex-col gap-8 shadow-2xl relative">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white mb-1">
                E-mailový Asset: 101-Exterier.jpg
              </h1>
              <p className="text-xs sm:text-sm text-gray-400">
                Tato stránka je skrytá pro vyhledávače (<span className="font-mono text-primary text-xs">noindex</span>). Slouží k snadnému zkopírování odkazu nebo HTML kódu pro Váš newsletter.
              </p>
            </div>
            <a 
              href="/" 
              className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 hover:text-white transition group self-start sm:self-center"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Zpět na web
            </a>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Copy URL */}
            <div className="bg-black/40 border border-white/5 rounded-xl p-5 flex flex-col justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-primary font-medium">Přímá URL adresa obrázku</span>
                <p className="text-xs text-gray-400 mt-1">
                  Použijte v e-mailovém editoru (např. Ecomail, Mailchimp) do pole "Odkaz na obrázek / Image URL".
                </p>
              </div>
              <div className="flex bg-white/5 border border-white/10 rounded-lg p-2 items-center justify-between gap-2 overflow-x-auto">
                <span className="text-xs font-mono text-gray-300 truncate max-w-full select-all">
                  {imageUrl}
                </span>
                <button
                  type="button"
                  id="copy-url-btn"
                  onClick={() => copyToClipboard(imageUrl, 'url')}
                  className="p-2 hover:bg-white/10 rounded-md transition text-primary hover:text-white shrink-0"
                  title="Zkopírovat URL"
                >
                  {copiedUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Copy HTML Tag */}
            <div className="bg-black/40 border border-white/5 rounded-xl p-5 flex flex-col justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-primary font-medium">Kompletní HTML kód</span>
                <p className="text-xs text-gray-400 mt-1">
                  Vložte přímo do e-mailové šablony jako blok vlastního kódu (Custom HTML).
                </p>
              </div>
              <div className="flex bg-white/5 border border-white/10 rounded-lg p-2 items-center justify-between gap-2 overflow-x-auto">
                <span className="text-xs font-mono text-gray-300 truncate max-w-full select-all">
                  {htmlCode}
                </span>
                <button
                  type="button"
                  id="copy-html-btn"
                  onClick={() => copyToClipboard(htmlCode, 'html')}
                  className="p-2 hover:bg-white/10 rounded-md transition text-primary hover:text-white shrink-0"
                  title="Zkopírovat HTML kód"
                >
                  {copiedHtml ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Pure live preview container */}
          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">
              Náhled obrázku (Velikost pro e-mail):
            </span>
            <div className="bg-black/50 border border-white/5 rounded-xl p-4 sm:p-8 flex items-center justify-center overflow-hidden">
              <img 
                src="/101-Exterier.jpg" 
                alt="InnerVisio - Vizualizace Exteriéru"
                style={{ display: 'block', maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

        </div>
      </div>
    );
  }

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
