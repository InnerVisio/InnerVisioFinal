import React from 'react';
import { Globe, Heart, MessageCircle, MoreHorizontal, Share2, ThumbsUp } from 'lucide-react';
import { SOCIAL_HASHTAGS, SOCIAL_VIDEOS } from '../../constants';
import { SITE } from '../../site';
import { track } from '../../analytics';
import { Language } from '../LanguageContext';
import { Avatar } from './Avatar';
import { MOCK_COPY } from './copy';
import { PlayerController, videoKey } from './player';
import { SocialVideoPlayer } from './SocialVideo';

const FACEBOOK: string = SITE.facebook;

// Page-style feed in the plum palette: cover band, page header, post cards with a full-width video
export const FacebookView: React.FC<{ language: Language; ctrl: PlayerController }> = ({ language, ctrl }) => {
  const copy = MOCK_COPY[language];

  return (
    <>
      {/* Cover + page header */}
      <div className="relative">
        <div className="h-[88px] bg-[radial-gradient(120%_140%_at_20%_0%,#7A3589_0%,#43204F_45%,#1F0F29_100%)]" aria-hidden />
        <div className="px-4">
          <Avatar size={72} className="-mt-9 border-[3px] border-[#1B0D25]" />
          <div className="mt-2 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-display text-[19px] font-bold leading-tight text-ink">{copy.displayName}</p>
              <p className="mt-0.5 text-[12.5px] text-ink-2">{copy.category}</p>
            </div>
            {FACEBOOK && (
              <a
                href={FACEBOOK}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={language === 'cs' ? 'Sledovat InnerVisio na Facebooku (otevře se v nové záložce)' : 'Follow InnerVisio on Facebook (opens in a new tab)'}
                onClick={() => track('social_click', { network: 'facebook' })}
                className="focus-ring btn-primary inline-flex min-h-[44px] flex-none items-center justify-center rounded-lg px-4 font-display text-[13px] font-medium"
              >
                {copy.follow}
              </a>
            )}
          </div>
        </div>
        <div className="mt-3 flex gap-5 border-b border-white/[0.08] px-4 text-[13px]" aria-hidden>
          {copy.fbTabs.map((tab, i) => (
            <span key={tab} className={`pb-2.5 font-medium ${i === 0 ? 'border-b-2 border-orchid-soft text-ink' : 'text-ink-3'}`}>
              {tab}
            </span>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-2.5 bg-[#0F0615] px-0 pb-3 pt-2.5">
        {SOCIAL_VIDEOS.map((video) => (
          <article key={video.id} data-post={video.id} className="overflow-hidden bg-[#22112D] pt-3">
            <div className="flex items-center gap-2.5 px-3 pb-2.5">
              <Avatar size={40} />
              <div className="min-w-0 flex-1 leading-tight">
                <p className="font-display text-[13.5px] font-semibold text-ink">{copy.displayName}</p>
                <p className="mt-0.5 flex items-center gap-1 text-[11.5px] text-ink-3">
                  {copy.fbCategory} · {copy.postTime}
                  <Globe className="h-3 w-3" strokeWidth={1.75} aria-hidden />
                </p>
              </div>
              <MoreHorizontal className="h-5 w-5 text-ink-2" strokeWidth={1.5} aria-hidden />
            </div>
            <div className="px-3 pb-2.5 text-[13.5px] leading-[1.45]">
              <p className="font-medium text-ink">{video.title[language]}</p>
              <p className="mt-1 text-ink-2">{video.caption[language]}</p>
              <p className="mt-1 text-orchid-soft">{SOCIAL_HASHTAGS.slice(0, 4).join(' ')}</p>
            </div>
            <SocialVideoPlayer
              video={video}
              title={video.title[language]}
              playLabel={copy.play}
              playerKey={videoKey('facebook', video.id)}
              ctrl={ctrl}
            />
            <div className="flex items-center px-3 pt-2.5" aria-hidden>
              <span className="flex">
                <span className="bg-chip-gradient flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 border-[#22112D] text-plum-black">
                  <ThumbsUp className="h-3 w-3" strokeWidth={2.25} />
                </span>
                <span className="-ml-1.5 flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 border-[#22112D] bg-secondary text-white">
                  <Heart className="h-3 w-3" strokeWidth={2.25} fill="currentColor" />
                </span>
              </span>
            </div>
            <div className="mx-3 mt-2.5 grid grid-cols-3 border-t border-white/[0.08] py-2 text-[12.5px] font-medium text-ink-2" aria-hidden>
              <span className="flex items-center justify-center gap-1.5"><ThumbsUp className="h-[17px] w-[17px]" strokeWidth={1.5} />{copy.like}</span>
              <span className="flex items-center justify-center gap-1.5"><MessageCircle className="h-[17px] w-[17px]" strokeWidth={1.5} />{copy.comment}</span>
              <span className="flex items-center justify-center gap-1.5"><Share2 className="h-[17px] w-[17px]" strokeWidth={1.5} />{copy.share}</span>
            </div>
          </article>
        ))}
      </div>
    </>
  );
};
