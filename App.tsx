import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServiceGrid } from './components/ServiceGrid';
import { PortfolioGallery } from './components/PortfolioGallery';
import { PricingSection } from './components/PricingSection';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { CookieBanner } from './components/CookieBanner';
import { MobileCta } from './components/MobileCta';
import { SocialsPage } from './components/SocialsPage';
import { SocialsTeaser } from './components/SocialsTeaser';
import { UnsubscribeView } from './components/UnsubscribeView';
import { HERO_SLIDES } from './constants';
import { Copy, Check, ArrowLeft } from 'lucide-react';
import { EASE_OUT, EASE_IN_OUT } from './components/ui/brand';

// initialPath is only used by the build-time prerender (no window); in the browser the real URL wins
function App({ initialPath = '/' }: { initialPath?: string }) {
  const [pathname, setPathname] = useState(typeof window === 'undefined' ? initialPath : window.location.pathname);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { scrollY } = useScroll();

  // Route matching for the static email target image page
  const isEmailImageRoute = 
    pathname === '/101-exterier' || 
    pathname === '/101-Exterier' || 
    pathname === '/email-image' || 
    pathname === '/email/101-exterier';

  // /socials: video showcase with an Instagram/Facebook mockup (prerendered to dist/socials/index.html)
  const isSocialsRoute = pathname === '/socials' || pathname === '/socials/';

  // Route matching for unsubscribe page
  const isUnsubscribeRoute = 
    pathname === '/unsubscribe' || 
    pathname === '/odhlasit' || 
    pathname === '/odhlasit-se' || 
    pathname === '/email/unsubscribe';

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
    if (isEmailImageRoute || isUnsubscribeRoute) {
      let metaIndex = document.querySelector('meta[name="robots"]');
      if (!metaIndex) {
        metaIndex = document.createElement('meta');
        metaIndex.setAttribute('name', 'robots');
        document.head.appendChild(metaIndex);
      }
      metaIndex.setAttribute('content', 'noindex, nofollow, noarchive');
    }
  }, [isEmailImageRoute, isUnsubscribeRoute]);

  // Smooth out the raw scroll value using a spring
  const smoothY = useSpring(scrollY, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const y1 = useTransform(smoothY, [0, 1000], [0, 200]);
  const opacity = useTransform(smoothY, [0, 500], [1, 0.5]);

  // Advance every 10 s; restarts after a manual selection so the hero's progress line stays in sync
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentSlide((currentSlide + 1) % HERO_SLIDES.length);
    }, 10000);

    return () => clearTimeout(timer);
  }, [currentSlide]);

  if (isEmailImageRoute) {
    return (
      <div className="min-h-screen bg-background text-ink flex flex-col items-center justify-center p-4 sm:p-8 font-sans ">
        <div className="max-w-4xl w-full glass rounded-card p-6 sm:p-8 flex flex-col gap-8 shadow-2xl relative">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-bold tracking-tightest text-ink mb-1">
                E-mailový Asset: 101-Exterier.jpg
              </h1>
              <p className="text-xs sm:text-sm text-ink-2">
                Tato stránka je skrytá pro vyhledávače (<span className="font-mono text-orchid-soft text-xs">noindex</span>). Slouží k snadnému zkopírování odkazu nebo HTML kódu pro Váš newsletter.
              </p>
            </div>
            <a 
              href="/" 
              className="flex items-center gap-2 text-xs sm:text-sm text-ink-2 hover:text-orchid-pink transition group self-start sm:self-center"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Zpět na web
            </a>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Copy URL */}
            <div className="bg-black/40 border border-white/5 rounded-2xl p-5 flex flex-col justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-orchid-soft font-medium">Přímá URL adresa obrázku</span>
                <p className="text-xs text-ink-2 mt-1">
                  Použijte v e-mailovém editoru (např. Ecomail, Mailchimp) do pole "Odkaz na obrázek / Image URL".
                </p>
              </div>
              <div className="flex bg-white/5 border border-white/10 rounded-lg p-2 items-center justify-between gap-2 overflow-x-auto">
                <span className="text-xs font-mono text-ink truncate max-w-full select-all">
                  {imageUrl}
                </span>
                <button
                  type="button"
                  id="copy-url-btn"
                  onClick={() => copyToClipboard(imageUrl, 'url')}
                  className="p-2 hover:bg-white/10 rounded-md transition text-orchid-soft hover:text-orchid-pink shrink-0"
                  title="Zkopírovat URL"
                >
                  {copiedUrl ? <Check className="w-4 h-4 text-orchid-soft" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Copy HTML Tag */}
            <div className="bg-black/40 border border-white/5 rounded-2xl p-5 flex flex-col justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-orchid-soft font-medium">Kompletní HTML kód</span>
                <p className="text-xs text-ink-2 mt-1">
                  Vložte přímo do e-mailové šablony jako blok vlastního kódu (Custom HTML).
                </p>
              </div>
              <div className="flex bg-white/5 border border-white/10 rounded-lg p-2 items-center justify-between gap-2 overflow-x-auto">
                <span className="text-xs font-mono text-ink truncate max-w-full select-all">
                  {htmlCode}
                </span>
                <button
                  type="button"
                  id="copy-html-btn"
                  onClick={() => copyToClipboard(htmlCode, 'html')}
                  className="p-2 hover:bg-white/10 rounded-md transition text-orchid-soft hover:text-orchid-pink shrink-0"
                  title="Zkopírovat HTML kód"
                >
                  {copiedHtml ? <Check className="w-4 h-4 text-orchid-soft" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Pure live preview container */}
          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase tracking-wider text-ink-2 font-medium">
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

  if (isSocialsRoute) {
    return (
      <div className="relative min-h-screen bg-background selection:bg-secondary selection:text-white overflow-x-hidden">
        <Navbar homePrefix="/" />
        <SocialsPage />
        <Footer homePrefix="/" />
        <MobileCta />
        <CookieBanner />
      </div>
    );
  }

  if (isUnsubscribeRoute) {
    const searchParams = new URLSearchParams(window.location.search);
    const emailParam = searchParams.get('email') || '';
    return (
      <UnsubscribeView 
        emailParam={emailParam} 
        onGoBack={() => {
          window.history.pushState({}, '', '/');
          setPathname('/');
        }} 
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-background selection:bg-secondary selection:text-white overflow-x-hidden">
      
      {/* GLOBAL BACKGROUND LAYER */}
      {/* Extends 160vh to cover Hero and the start of Services */}
      <motion.div 
        style={{ y: y1, opacity, willChange: "transform" }}
        className="absolute top-0 left-0 w-full h-[160vh] z-0 overflow-hidden pointer-events-none"
      >
        {/* Calm crossfade between slides (slow settle from 1.04, no fast zoom).
            initial={false}: the first slide is visible on first paint (and in the prerendered HTML),
            so it counts as the page's Largest Contentful Paint instead of waiting for a fade-in. */}
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1.8, ease: EASE_IN_OUT },
              scale: { duration: 9, ease: EASE_OUT },
            }}
            className="absolute inset-0"
          >
            <img
              src={HERO_SLIDES[currentSlide].image}
              alt={`Architektonická vizualizace - ${HERO_SLIDES[currentSlide].title}, ${HERO_SLIDES[currentSlide].location}`}
              fetchPriority={currentSlide === 0 ? 'high' : 'auto'}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </AnimatePresence>

        {/* Overlays, constant across slides: the photo stays the hero, but black dominates */}
        <div className="absolute inset-0 z-10 bg-[rgba(5,3,8,0.42)]" />
        {/* Darker behind the text: from the left on wide screens, an even veil on phones where text spans the width */}
        <div className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(5,3,8,0.5)_0%,rgba(5,3,8,0.35)_60%,rgba(5,3,8,0.5)_100%)] md:bg-[linear-gradient(90deg,rgba(5,3,8,0.86)_0%,rgba(5,3,8,0.6)_42%,rgba(5,3,8,0.12)_100%)]" />
        {/* Top shade behind the navbar */}
        <div className="absolute top-0 left-0 w-full h-48 z-10 bg-gradient-to-b from-[rgba(5,3,8,0.7)] to-transparent" />
        {/* Fade into the page background */}
        {/* (photo is gone by ~110vh so it never sits behind the next section's copy) */}
        <div className="absolute inset-0 z-20 bg-[linear-gradient(180deg,rgba(5,3,8,0)_0%,rgba(5,3,8,0)_46%,rgba(5,3,8,0.82)_62%,#050308_72%)]" />

        {/* Ambient plum / orchid glows, drifting slowly (the hero glass sits on these) */}
        <div className="absolute z-20 -top-48 -right-40 w-[30rem] h-[30rem] md:w-[48rem] md:h-[48rem] rounded-full glow-plum animate-drift-slow" />
        <div className="absolute z-20 top-[45vh] -left-56 w-[26rem] h-[26rem] md:w-[38rem] md:h-[38rem] rounded-full glow-orchid opacity-40 animate-drift-slow [animation-delay:-9s]" />
        <div className="absolute z-20 top-[112vh] left-[10%] w-[80%] h-[22rem] md:h-[30rem] rounded-full glow-plum opacity-70 animate-drift-slow [animation-delay:-15s]" />
      </motion.div>

      <Navbar />
      
      <main className="relative z-10">
        {/* Pass state control to Hero for the text and dots */}
        <Hero currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} />
        
        <div className="min-h-screen md:min-h-0">
          <ServiceGrid />
        </div>

        <div className="min-h-screen md:min-h-0">
          <PortfolioGallery />
        </div>
        
        <div className="min-h-screen md:min-h-0">
          <PricingSection />
        </div>

        <SocialsTeaser />

        <div className="min-h-screen md:min-h-0">
          <FaqSection />
        </div>
        
        <div className="min-h-screen md:min-h-0">
          <ContactSection />
        </div>
      </main>

      <div>
        <Footer />
      </div>

      <MobileCta />
      <CookieBanner />
    </div>
  );
}

export default App;
