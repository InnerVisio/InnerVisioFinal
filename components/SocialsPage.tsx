import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MotionConfig, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, ArrowLeftRight, Clapperboard, Lightbulb, Mail, Phone } from 'lucide-react';
import { Language, useLanguage } from './LanguageContext';
import { SITE } from '../site';
import { track } from '../analytics';
import { BRAND } from './ui/brand';
import { rise } from './social/motion';
import { Platform, PlayerController } from './social/player';
import { PhoneMockup } from './social/PhoneMockup';
import { VideoList } from './social/VideoList';

const FACEBOOK: string = SITE.facebook;

interface Copy {
  h1: [string, string];
  lead: string;
  follow: string;
  followLabel: string;
  facebook: string;
  facebookLabel: string;
  back: string;
  whatTitle: [string, string];
  cards: { title: string; text: string }[];
  ctaTitle: [string, string, string];
  ctaText: string;
  ctaButton: string;
}

const COPY: Record<Language, Copy> = {
  cs: {
    h1: ['InnerVisio na ', 'sítích'],
    lead: 'Proměny před a po, AI videa nemovitostí a tipy z praxe. Sledujte nás a uvidíte naši práci v pohybu.',
    follow: 'Sledovat na Instagramu',
    followLabel: 'Sledovat InnerVisio na Instagramu (otevře se v nové záložce)',
    facebook: 'Facebook',
    facebookLabel: 'InnerVisio na Facebooku (otevře se v nové záložce)',
    back: 'Zpět na web',
    whatTitle: ['Co na sítích ', 'najdete'],
    cards: [
      { title: 'Před a po', text: 'Skutečné proměny prostoru. Fotka na jedné straně, vizualizace na druhé.' },
      { title: 'AI videa', text: 'Videoprohlídky nemovitostí z fotek, hotové do 24 hodin. Vždy označené jako AI.' },
      { title: 'Tipy a mýty', text: 'Upřímně o tom, co AI umí a co ne. Bez slibování nemožného.' },
    ],
    ctaTitle: ['Máte projekt? ', 'Napište', ' nám.'],
    ctaText: 'Pošlete nám fotku nebo projekt a ozveme se s nabídkou.',
    ctaButton: 'Poptat vizualizaci',
  },
  en: {
    h1: ['InnerVisio on ', 'social'],
    lead: 'Before-and-afters, AI property videos and practical tips. Follow us and see our work in motion.',
    follow: 'Follow on Instagram',
    followLabel: 'Follow InnerVisio on Instagram (opens in a new tab)',
    facebook: 'Facebook',
    facebookLabel: 'InnerVisio on Facebook (opens in a new tab)',
    back: 'Back to the site',
    whatTitle: ['What you will ', 'find'],
    cards: [
      { title: 'Before and after', text: 'Real transformations. The photo on one side, the visualization on the other.' },
      { title: 'AI videos', text: 'Property video tours made from photos, ready within 24 hours. Always labelled as AI.' },
      { title: 'Tips and myths', text: 'An honest look at what AI can and cannot do. No promises of the impossible.' },
    ],
    ctaTitle: ['Got a project? ', 'Write', ' to us.'],
    ctaText: 'Send us a photo or a project and we will get back to you with an offer.',
    ctaButton: 'Request a quote',
  },
};

const CARD_ICONS = [ArrowLeftRight, Clapperboard, Lightbulb];

export const SocialsPage: React.FC = () => {
  const { language } = useLanguage();
  const copy = COPY[language];

  const [platform, setPlatform] = useState<Platform>('instagram');
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const registry = useRef(new Map<string, () => void>());
  const feedRefs = useRef<Record<Platform, HTMLDivElement | null>>({ instagram: null, facebook: null });
  const phoneRef = useRef<HTMLDivElement>(null);

  const ctrl: PlayerController = {
    playingKey,
    onPlay: useCallback((key: string) => setPlayingKey(key), []),
    onPause: useCallback((key: string) => setPlayingKey((prev) => (prev === key ? null : prev)), []),
    register: useCallback((key: string, start: () => void) => {
      registry.current.set(key, start);
      return () => {
        if (registry.current.get(key) === start) registry.current.delete(key);
      };
    }, []),
  };

  // Switching network stops whatever is playing (the hidden feed keeps its own copy of the videos)
  const changePlatform = (next: Platform) => {
    if (next === platform) return;
    setPlayingKey(null);
    setPlatform(next);
  };

  // Video list: scroll the phone feed (and the page, on small screens) to the post and play it
  const playFromList = (id: string) => {
    const behavior: ScrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    const feed = feedRefs.current[platform];
    const post = feed?.querySelector<HTMLElement>(`[data-post="${id}"]`);
    if (feed && post) {
      const top = feed.scrollTop + post.getBoundingClientRect().top - feed.getBoundingClientRect().top - 4;
      feed.scrollTo({ top, behavior });
    }
    const phone = phoneRef.current;
    if (phone) {
      const r = phone.getBoundingClientRect();
      if (r.top < 70 || r.bottom > window.innerHeight) phone.scrollIntoView({ block: 'center', behavior });
    }
    registry.current.get(`${platform}:${id}`)?.();
  };

  // A page-level keyboard stop for the Escape key would fight native video controls, so nothing else is bound
  useEffect(() => () => registry.current.clear(), []);

  const playingId = playingKey ? playingKey.split(':')[1] : null;

  return (
    <MotionConfig reducedMotion="user">
      <main className="relative z-10 overflow-hidden">
        {/* Plum glows behind the whole page */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="glow-plum absolute -right-40 -top-24 h-[34rem] w-[34rem] rounded-full animate-drift-slow md:h-[48rem] md:w-[48rem]" />
          <div className="glow-orchid absolute -left-56 top-[55rem] h-[28rem] w-[28rem] rounded-full opacity-40 animate-drift-slow [animation-delay:-9s] md:h-[38rem] md:w-[38rem]" />
        </div>

        {/* Intro + mockup */}
        <section className="relative px-6 pb-20 pt-28 md:pb-28 md:pt-32">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-20 xl:gap-28">
            <div className="contents lg:flex lg:flex-col lg:gap-14 lg:pt-10">
              <motion.div {...rise()} className="order-1">
                <h1 className="font-display text-5xl font-bold leading-[1.04] tracking-tightest text-ink md:text-6xl xl:text-7xl">
                  {copy.h1[0]}
                  <span className="text-gradient">{copy.h1[1]}</span>
                </h1>
                <p className={`${BRAND.lead} mt-6 max-w-xl`}>{copy.lead}</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <a
                    href={SITE.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={copy.followLabel}
                    onClick={() => track('social_click', { network: 'instagram' })}
                    className={`${BRAND.btnPrimary} min-h-[48px] px-7 py-3 text-base`}
                  >
                    {copy.follow}
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                  </a>
                  {FACEBOOK && (
                    <a
                      href={FACEBOOK}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={copy.facebookLabel}
                      onClick={() => track('social_click', { network: 'facebook' })}
                      className={`${BRAND.btnGlass} min-h-[48px] px-7 py-3 text-base`}
                    >
                      {copy.facebook}
                      <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                    </a>
                  )}
                  <a href="/" className={`${BRAND.btnGlass} min-h-[48px] px-7 py-3 text-base`}>
                    <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                    {copy.back}
                  </a>
                </div>
              </motion.div>

              <motion.div {...rise(0.1)} className="order-3">
                <VideoList language={language} playingId={playingId} onSelect={playFromList} />
              </motion.div>
            </div>

            <motion.div {...rise(0.05, 32)} className="order-2">
              <PhoneMockup
                language={language}
                platform={platform}
                onPlatformChange={changePlatform}
                ctrl={ctrl}
                feedRefs={feedRefs}
                phoneRef={phoneRef}
              />
            </motion.div>
          </div>
        </section>

        {/* What you find */}
        <section className="relative px-6 pb-20 md:pb-28" aria-labelledby="socials-what">
          <div className="mx-auto max-w-7xl">
            <motion.h2 {...rise()} id="socials-what" className={BRAND.h2}>
              {copy.whatTitle[0]}
              <span className="text-gradient">{copy.whatTitle[1]}</span>
            </motion.h2>
            <div className="mt-12 grid gap-4 md:grid-cols-3 md:gap-6">
              {copy.cards.map((card, i) => {
                const Icon = CARD_ICONS[i];
                return (
                  <motion.div
                    key={card.title}
                    {...rise(i * 0.07)}
                    className="rounded-card border border-white/10 bg-white/[0.03] p-7 md:p-8"
                  >
                    <span className={BRAND.iconChip}>
                      <Icon className="h-5 w-5 icon-gradient" strokeWidth={1.5} aria-hidden />
                    </span>
                    <h3 className="mt-6 font-display text-xl font-semibold tracking-tightest text-ink">{card.title}</h3>
                    <p className="mt-2 text-[15px] font-light leading-relaxed text-ink-2">{card.text}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="relative px-6 pb-24 md:pb-32" aria-labelledby="socials-cta">
          <motion.div
            {...rise()}
            className="relative mx-auto max-w-5xl overflow-hidden rounded-card-lg border border-white/[0.12] bg-[linear-gradient(160deg,rgba(67,31,77,0.45)_0%,rgba(31,15,41,0.35)_100%)] px-7 py-12 text-center md:px-16 md:py-16"
          >
            <div aria-hidden className="glow-plum pointer-events-none absolute -top-40 left-1/2 h-80 w-[36rem] max-w-none -translate-x-1/2 rounded-full opacity-80" />
            <div className="relative">
              <h2 id="socials-cta" className={BRAND.h2}>
                {copy.ctaTitle[0]}
                <span className="text-gradient">{copy.ctaTitle[1]}</span>
                {copy.ctaTitle[2]}
              </h2>
              <p className={`${BRAND.lead} mx-auto mt-5 max-w-lg`}>{copy.ctaText}</p>
              <div className="mt-8 flex flex-col items-center justify-center gap-x-10 gap-y-3 font-display text-lg font-medium sm:flex-row">
                <a href={`mailto:${SITE.email}`} className="focus-ring link-orchid inline-flex min-h-[44px] items-center gap-2.5 rounded">
                  <Mail className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                  {SITE.email}
                </a>
                <a href={`tel:${SITE.phone}`} className="focus-ring link-orchid inline-flex min-h-[44px] items-center gap-2.5 rounded">
                  <Phone className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                  {SITE.phoneDisplay}
                </a>
              </div>
              <a href="/#contact" className={`${BRAND.btnPrimary} mt-8 min-h-[48px] px-8 py-3 text-base`}>
                {copy.ctaButton}
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              </a>
            </div>
          </motion.div>
        </section>
      </main>
    </MotionConfig>
  );
};
