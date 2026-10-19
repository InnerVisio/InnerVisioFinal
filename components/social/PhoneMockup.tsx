import React, { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Clapperboard, Heart, House, Send } from 'lucide-react';
import { Language } from '../LanguageContext';
import { Avatar } from './Avatar';
import { FacebookView } from './FacebookView';
import { InstagramView } from './InstagramView';
import { MOCK_COPY } from './copy';
import { Platform, PlayerController } from './player';
import { PhoneFrame } from './PhoneFrame';

const PLATFORMS: { id: Platform; label: string }[] = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'facebook', label: 'Facebook' },
];

interface Props {
  language: Language;
  platform: Platform;
  onPlatformChange: (p: Platform) => void;
  ctrl: PlayerController;
  /** Scroll containers of the two feeds, so the page can scroll a post into view */
  feedRefs: React.MutableRefObject<Record<Platform, HTMLDivElement | null>>;
  phoneRef: React.RefObject<HTMLDivElement | null>;
}

export const PhoneMockup: React.FC<Props> = ({ language, platform, onPlatformChange, ctrl, feedRefs, phoneRef }) => {
  const copy = MOCK_COPY[language];
  const reduced = useReducedMotion();
  const tabRefs = useRef<Record<Platform, HTMLButtonElement | null>>({ instagram: null, facebook: null });

  // Arrow keys / Home / End move between the two tabs (automatic activation)
  const onKeyDown = (e: React.KeyboardEvent) => {
    const index = PLATFORMS.findIndex((p) => p.id === platform);
    let next = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (index + 1) % PLATFORMS.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (index - 1 + PLATFORMS.length) % PLATFORMS.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = PLATFORMS.length - 1;
    if (next < 0) return;
    e.preventDefault();
    const id = PLATFORMS[next].id;
    onPlatformChange(id);
    tabRefs.current[id]?.focus();
  };

  return (
    <div ref={phoneRef} className="relative isolate mx-auto w-full max-w-[380px] md:w-[clamp(320px,calc((100svh_-_13rem)*0.48),380px)] md:max-w-none">
      {/* Soft plum light behind the phone */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="glow-plum absolute left-1/2 top-[38%] h-[120%] w-[190%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-90" />
        <div className="glow-orchid absolute -right-[40%] bottom-[-8%] h-[60%] w-[100%] rounded-full opacity-50" />
      </div>

      {/* Network switcher */}
      <div className="mb-5 flex justify-center">
        <div role="tablist" aria-label={copy.tablistLabel} onKeyDown={onKeyDown} className="glass-pill inline-flex items-center gap-0.5 p-1">
          {PLATFORMS.map((p) => {
            const active = p.id === platform;
            return (
              <button
                key={p.id}
                ref={(el) => { tabRefs.current[p.id] = el; }}
                type="button"
                role="tab"
                id={`social-tab-${p.id}`}
                aria-selected={active}
                aria-controls={`social-panel-${p.id}`}
                tabIndex={active ? 0 : -1}
                onClick={() => onPlatformChange(p.id)}
                className={`focus-ring min-h-[44px] min-w-[116px] rounded-full px-5 font-display text-sm font-medium transition-[background-color,color,box-shadow] duration-500 ${
                  active
                    ? 'bg-[rgba(162,77,184,0.42)] text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_0_22px_rgba(162,77,184,0.5)]'
                    : 'text-ink-2 hover:text-ink hover:bg-white/[0.07]'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      <PhoneFrame label={copy.phoneLabel[platform]}>
        {PLATFORMS.map((p) => {
          const active = p.id === platform;
          return (
            <motion.div
              key={p.id}
              ref={(el: HTMLDivElement | null) => { feedRefs.current[p.id] = el; }}
              role="tabpanel"
              id={`social-panel-${p.id}`}
              aria-labelledby={`social-tab-${p.id}`}
              hidden={!active}
              tabIndex={active ? 0 : -1}
              initial={false}
              animate={{ opacity: active ? 1 : 0 }}
              transition={{ duration: reduced ? 0 : 0.5 }}
              className={`${active ? '' : 'hidden'} focus-ring no-scrollbar relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden`}
            >
              {p.id === 'instagram' ? <InstagramView language={language} ctrl={ctrl} /> : <FacebookView language={language} ctrl={ctrl} />}
            </motion.div>
          );
        })}

        {/* Bottom bar + home indicator (decorative) */}
        <div aria-hidden className="relative z-20 flex-none border-t border-white/[0.08] bg-[#130819]/95 pb-2.5 pt-2">
          <div className="flex items-center justify-around px-4 text-ink">
            <House className="h-[22px] w-[22px]" strokeWidth={1.5} fill="currentColor" />
            <Clapperboard className="h-[22px] w-[22px] text-ink-3" strokeWidth={1.5} />
            <Send className="h-[22px] w-[22px] text-ink-3" strokeWidth={1.5} />
            <Heart className="h-[22px] w-[22px] text-ink-3" strokeWidth={1.5} />
            <Avatar size={24} />
          </div>
          <div className="mx-auto mt-2.5 h-1 w-[104px] rounded-full bg-white/35" />
        </div>
      </PhoneFrame>

      <p className="mx-auto mt-5 max-w-[300px] text-center text-xs font-light leading-relaxed text-ink-3">{copy.note}</p>
    </div>
  );
};
