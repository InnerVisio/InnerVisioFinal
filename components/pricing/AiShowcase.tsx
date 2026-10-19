import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { AI_GALLERY, AI_VIDEO } from '../../constants';
import { Language } from '../LanguageContext';
import { blurInRise } from '../ui/brand';
import { track } from '../../analytics';

const COPY: Record<Language, {
  title: string;
  lead: string;
  videoTitle: string;
  videoMeta: string;
  play: string;
  note: string;
}> = {
  cs: {
    title: 'AI video a další ukázky',
    lead: 'Videoprohlídka interiéru a snímky z AI vizualizací. Každý výstup označujeme jako ilustrační.',
    videoTitle: 'AI videoprohlídka',
    videoMeta: 'Dolní, Ostrava – Zábřeh · 30 s',
    play: 'Přehrát ukázku AI videa',
    note: 'Video i snímky jsou vytvořené pomocí AI a označené jako ilustrační.',
  },
  en: {
    title: 'AI video and more examples',
    lead: 'An interior video tour and stills from our AI visualizations. Every output is labelled as illustrative.',
    videoTitle: 'AI video tour',
    videoMeta: 'Dolní, Ostrava – Zábřeh · 30 s',
    play: 'Play the AI video sample',
    note: 'The video and images are AI-generated and labelled as illustrative.',
  },
};

// Same blur-in rise as the rest of the page, but the blur filter is cleared afterwards
const rise = (delay = 0) => {
  const p = blurInRise(delay, 24);
  return { ...p, whileInView: { ...p.whileInView, transitionEnd: { filter: 'none' } } };
};

export const AiShowcase: React.FC<{ language: Language }> = ({ language }) => {
  const copy = COPY[language];
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  const play = () => {
    const el = videoRef.current;
    if (!el) return;
    setStarted(true);
    el.controls = true;
    void el.play();
    track('video_start', { video_title: 'ai-video-nemovitosti' });
  };

  return (
    <div>
      <motion.div {...rise()} className="text-center mb-10 md:mb-12">
        <h3 className="font-display font-bold text-ink text-3xl md:text-4xl tracking-tightest">{copy.title}</h3>
        <p className="mt-4 text-ink-2 font-light text-sm md:text-base max-w-2xl mx-auto">{copy.lead}</p>
      </motion.div>

      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
        {/* Video */}
        <motion.figure {...rise(0.05)} className="m-0">
          <div className="relative overflow-hidden rounded-card md:rounded-card-lg border border-white/10 bg-plum-black aspect-video">
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              src={AI_VIDEO.src}
              poster={AI_VIDEO.poster}
              width={AI_VIDEO.width}
              height={AI_VIDEO.height}
              preload="none"
              playsInline
              onEnded={() => setStarted(false)}
              aria-label={`${copy.videoTitle}: ${copy.videoMeta}`}
            />
            {!started && (
              <button
                type="button"
                onClick={play}
                aria-label={copy.play}
                className="focus-ring group absolute inset-0 flex items-center justify-center bg-[linear-gradient(180deg,rgba(5,3,8,0.1)_0%,rgba(5,3,8,0.55)_100%)]"
              >
                <span className="glass-strong w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-[transform,box-shadow] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:group-hover:scale-105 md:group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_0_50px_rgba(162,77,184,0.5)]">
                  <Play className="w-6 h-6 md:w-7 md:h-7 text-ink ml-1" strokeWidth={1.5} fill="currentColor" aria-hidden />
                </span>
              </button>
            )}
          </div>
          <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-1">
            <span className="font-display font-medium text-ink text-sm md:text-base">{copy.videoTitle}</span>
            <span className="text-ink-3 text-xs md:text-sm font-light">{copy.videoMeta}</span>
          </figcaption>
        </motion.figure>

        {/* Stills */}
        <div className="grid grid-cols-3 gap-3 md:gap-5">
          {AI_GALLERY.map((item, i) => (
            <motion.figure key={item.src} {...rise(0.1 + i * 0.06)} className="m-0 min-w-0">
              <div className="overflow-hidden rounded-xl md:rounded-2xl border border-white/10 bg-plum-black aspect-[4/3]">
                <img
                  src={item.src}
                  alt={item[language]}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-[2400ms] ease-out md:hover:scale-[1.04]"
                />
              </div>
              <figcaption className="mt-2 text-ink-3 text-[11px] md:text-xs font-light leading-snug px-0.5">{item[language]}</figcaption>
            </motion.figure>
          ))}
        </div>
      </div>

      <p className="mt-6 text-center text-ink-3 text-xs font-light">{copy.note}</p>
    </div>
  );
};
