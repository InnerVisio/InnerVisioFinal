import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Play } from 'lucide-react';
import { Language, useLanguage } from './LanguageContext';
import { SOCIAL_VIDEOS } from '../constants';
import { SITE } from '../site';
import { track } from '../analytics';
import { BRAND } from './ui/brand';
import { rise } from './social/motion';

const COPY: Record<Language, { title: [string, string]; text: string; all: string; instagram: string; instagramLabel: string; thumb: string }> = {
  cs: {
    title: ['Sledujte', ' nás'],
    text: 'Před a po, AI videa a tipy z praxe. Podívejte se, jak naše vizualizace vypadají v pohybu.',
    all: 'Všechna videa',
    instagram: 'Instagram',
    instagramLabel: 'InnerVisio na Instagramu (otevře se v nové záložce)',
    thumb: 'Přehrát na stránce Socials',
  },
  en: {
    title: ['Follow', ' us'],
    text: 'Before-and-afters, AI videos and practical tips. See how our visualizations look in motion.',
    all: 'All videos',
    instagram: 'Instagram',
    instagramLabel: 'InnerVisio on Instagram (opens in a new tab)',
    thumb: 'Play on the Socials page',
  },
};

// Compact home-page band between Pricing and FAQ: one line of copy, two buttons, three poster thumbnails
export const SocialsTeaser: React.FC = () => {
  const { language } = useLanguage();
  const copy = COPY[language];

  return (
    <section className="relative px-6 py-10 md:py-16" aria-labelledby="socials-teaser-title">
      <motion.div
        {...rise()}
        className="relative mx-auto max-w-7xl overflow-hidden rounded-card-lg border border-white/[0.1] bg-[linear-gradient(160deg,rgba(67,31,77,0.3)_0%,rgba(31,15,41,0.18)_100%)] px-7 py-9 md:px-12 md:py-12"
      >
        <div aria-hidden className="glow-plum pointer-events-none absolute -right-24 -top-32 h-80 w-[30rem] rounded-full opacity-60" />
        <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between md:gap-10">
          <div className="max-w-xl">
            <h2 id="socials-teaser-title" className="font-display text-3xl font-bold leading-[1.1] tracking-tightest text-ink md:text-4xl lg:text-5xl">
              <span className="text-gradient">{copy.title[0]}</span>
              {copy.title[1]}
            </h2>
            <p className={`${BRAND.lead} mt-4 text-base`}>{copy.text}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a href="/socials" className={`${BRAND.btnPrimary} min-h-[48px] whitespace-nowrap px-6 py-3 text-[15px]`}>
                {copy.all}
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              </a>
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={copy.instagramLabel}
                onClick={() => track('social_click', { network: 'instagram' })}
                className={`${BRAND.btnGlass} min-h-[48px] whitespace-nowrap px-6 py-3 text-[15px]`}
              >
                {copy.instagram}
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              </a>
            </div>
          </div>

          {/* Overlapping poster thumbnails */}
          <ul className="hidden shrink-0 items-center gap-3 lg:flex" aria-label={copy.all}>
            {SOCIAL_VIDEOS.map((video) => (
              <li
                key={video.id}
                className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 focus-within:-translate-y-1.5"
              >
                <a
                  href="/socials"
                  aria-label={`${copy.thumb}: ${video.title[language]}`}
                  className="focus-ring group relative block aspect-video w-[140px] overflow-hidden rounded-2xl border border-white/[0.16] bg-plum-black shadow-[0_18px_44px_rgba(0,0,0,0.6)] xl:w-[184px]"
                >
                  <img src={video.poster} alt="" loading="lazy" decoding="async" width={196} height={110} className="h-full w-full object-cover" />
                  <span className="absolute inset-0 flex items-center justify-center bg-[rgba(5,3,8,0.3)] transition-colors duration-500 group-hover:bg-[rgba(5,3,8,0.12)]">
                    <Play className="h-5 w-5 text-ink" strokeWidth={1.5} fill="currentColor" aria-hidden />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
};
