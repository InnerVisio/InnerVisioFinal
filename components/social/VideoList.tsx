import React from 'react';
import { Play } from 'lucide-react';
import { SOCIAL_VIDEOS } from '../../constants';
import { Language } from '../LanguageContext';
import { formatDuration } from './player';

const COPY: Record<Language, { title: string; hint: string; play: string; playing: string; sound: string; silent: string }> = {
  cs: {
    title: 'Videa',
    hint: 'Vyberte video a přehraje se v telefonu.',
    play: 'Přehrát',
    playing: 'Právě hraje',
    sound: 'se zvukem',
    silent: 'bez zvuku',
  },
  en: {
    title: 'Videos',
    hint: 'Pick a video and it plays in the phone.',
    play: 'Play',
    playing: 'Now playing',
    sound: 'with sound',
    silent: 'no sound',
  },
};

interface Props {
  language: Language;
  playingId: string | null;
  onSelect: (id: string) => void;
}

// Plain list: poster, title, duration. Selecting an item scrolls the phone to the post and plays it.
export const VideoList: React.FC<Props> = ({ language, playingId, onSelect }) => {
  const copy = COPY[language];

  return (
    <div>
      <h2 className="font-display text-2xl font-bold tracking-tightest text-ink md:text-3xl">{copy.title}</h2>
      <p className="mt-2 text-sm font-light text-ink-2">{copy.hint}</p>
      <ul className="mt-5 divide-y divide-white/[0.08] border-y border-white/[0.08]">
        {SOCIAL_VIDEOS.map((video) => {
          const isPlaying = playingId === video.id;
          const title = video.title[language];
          return (
            <li key={video.id}>
              <button
                type="button"
                onClick={() => onSelect(video.id)}
                aria-label={`${copy.play}: ${title}`}
                className="focus-ring group flex w-full min-h-[44px] items-center gap-4 py-3.5 text-left"
              >
                <span
                  className={`relative block aspect-video w-[116px] flex-none overflow-hidden rounded-xl border bg-plum-black transition-[border-color,box-shadow] duration-500 sm:w-[132px] ${
                    isPlaying ? 'border-orchid-soft/70 shadow-[0_0_28px_rgba(162,77,184,0.45)]' : 'border-white/10 md:group-hover:border-white/25'
                  }`}
                >
                  <img src={video.poster} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-[1600ms] ease-out md:group-hover:scale-[1.04]" />
                  <span className="absolute inset-0 flex items-center justify-center bg-[rgba(5,3,8,0.28)]">
                    <Play className="h-5 w-5 text-ink" strokeWidth={1.5} fill="currentColor" aria-hidden />
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-[15px] font-medium leading-snug text-ink transition-colors md:group-hover:text-orchid-pink">{title}</span>
                  <span className="mt-1.5 block text-[13px] font-light text-ink-3">
                    {formatDuration(video.durationSeconds)} · {video.hasAudio ? copy.sound : copy.silent}
                    {isPlaying && <span className="ml-2 text-orchid-soft">· {copy.playing}</span>}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
