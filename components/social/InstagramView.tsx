import React from 'react';
import { ArrowLeftRight, Bookmark, Box, ChevronDown, Clapperboard, Heart, LayoutGrid, Mail, Menu, MessageCircle, MoreHorizontal, Send, Sparkles } from 'lucide-react';
import { SOCIAL_HASHTAGS, SOCIAL_VIDEOS } from '../../constants';
import { SITE } from '../../site';
import { track } from '../../analytics';
import { Language } from '../LanguageContext';
import { Avatar } from './Avatar';
import { MOCK_COPY } from './copy';
import { PlayerController, videoKey } from './player';
import { SocialVideoPlayer } from './SocialVideo';

const HIGHLIGHT_ICONS = { ba: ArrowLeftRight, ai: Sparkles, '3d': Box, contact: Mail } as const;

export const InstagramView: React.FC<{ language: Language; ctrl: PlayerController }> = ({ language, ctrl }) => {
  const copy = MOCK_COPY[language];

  return (
    <>
      {/* App bar */}
      <div className="flex items-center justify-between px-4 pb-2 pt-1" aria-hidden>
        <span className="flex items-center gap-1 font-display text-[16px] font-semibold text-ink">
          {SITE.instagramHandle}
          <ChevronDown className="h-4 w-4 text-ink-2" strokeWidth={2} />
        </span>
        <Menu className="h-[22px] w-[22px] text-ink" strokeWidth={1.5} />
      </div>

      {/* Profile */}
      <div className="px-4 pt-2">
        <div className="flex items-center gap-4">
          <Avatar size={80} />
          <div className="min-w-0 flex-1">
            <p className="font-display text-[15px] font-semibold leading-tight text-ink">{copy.displayName}</p>
            <div className="mt-2.5 flex gap-2">
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={copy.followLabel}
                onClick={() => track('social_click', { network: 'instagram' })}
                className="focus-ring btn-primary inline-flex min-h-[44px] flex-1 items-center justify-center rounded-lg px-3 font-display text-[13px] font-medium"
              >
                {copy.follow}
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="focus-ring inline-flex min-h-[44px] flex-1 items-center justify-center rounded-lg border border-white/[0.16] bg-white/[0.07] px-3 font-display text-[13px] font-medium text-ink transition-colors hover:bg-white/[0.12]"
              >
                {copy.message}
              </a>
            </div>
          </div>
        </div>
        <div className="mt-3 text-[13px] leading-[1.45]">
          <p className="font-semibold text-ink">{copy.displayName}</p>
          <p className="text-ink-2">{copy.category}</p>
          <p className="text-ink-2">{copy.bio}</p>
          <p className="mt-0.5">
            <a href={`mailto:${SITE.email}`} className="focus-ring link-orchid break-all rounded">
              ✉ {SITE.email}
            </a>
          </p>
        </div>
      </div>

      {/* Highlights: plum gradient with a thin white icon */}
      <ul className="mt-4 flex gap-3 overflow-hidden px-4" aria-hidden>
        {copy.highlights.map((h) => {
          const Icon = HIGHLIGHT_ICONS[h.id];
          return (
            <li key={h.id} className="flex w-[58px] flex-none flex-col items-center gap-1.5">
              <span className="bg-logo-plum flex h-[56px] w-[56px] items-center justify-center rounded-full border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
                <Icon className="h-6 w-6 text-white" strokeWidth={1.25} />
              </span>
              <span className="whitespace-nowrap text-center text-[11px] text-ink-2">{h.label}</span>
            </li>
          );
        })}
      </ul>

      {/* Grid / reels switcher (decorative) */}
      <div className="mt-4 grid grid-cols-2 border-t border-white/[0.08]" aria-hidden>
        <span className="flex h-10 items-center justify-center border-b border-ink text-ink">
          <LayoutGrid className="h-[22px] w-[22px]" strokeWidth={1.5} />
        </span>
        <span className="flex h-10 items-center justify-center border-b border-transparent text-ink-3">
          <Clapperboard className="h-[22px] w-[22px]" strokeWidth={1.5} />
        </span>
      </div>

      {/* Feed */}
      <div>
        {SOCIAL_VIDEOS.map((video) => (
          <article key={video.id} data-post={video.id} className="border-b border-white/[0.06] pb-4 pt-3 last:border-b-0">
            <div className="flex items-center gap-2.5 px-3 pb-2.5">
              <Avatar size={32} />
              <span className="flex-1 font-display text-[13px] font-semibold text-ink">{SITE.instagramHandle}</span>
              <MoreHorizontal className="h-5 w-5 text-ink-2" strokeWidth={1.5} aria-hidden />
            </div>
            <SocialVideoPlayer
              video={video}
              title={video.title[language]}
              playLabel={copy.play}
              playerKey={videoKey('instagram', video.id)}
              ctrl={ctrl}
            />
            <div className="flex items-center gap-4 px-3 pt-3 text-ink" aria-hidden>
              <Heart className="h-[22px] w-[22px]" strokeWidth={1.5} />
              <MessageCircle className="h-[22px] w-[22px]" strokeWidth={1.5} />
              <Send className="h-[22px] w-[22px]" strokeWidth={1.5} />
              <Bookmark className="ml-auto h-[22px] w-[22px]" strokeWidth={1.5} />
            </div>
            <p className="px-3 pt-2 text-[13px] leading-[1.45] text-ink-2">
              <span className="font-semibold text-ink">{SITE.instagramHandle}</span> {video.caption[language]}{' '}
              <span className="text-orchid-soft">{SOCIAL_HASHTAGS.slice(0, 6).join(' ')}</span>
            </p>
          </article>
        ))}
      </div>
    </>
  );
};
