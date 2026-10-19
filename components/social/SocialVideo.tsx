import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { SocialVideo as SocialVideoData } from '../../constants';
import { track } from '../../analytics';
import { PlayerController } from './player';

interface Props {
  video: SocialVideoData;
  title: string;
  playLabel: string;
  playerKey: string;
  ctrl: PlayerController;
}

// A 16:9 video with a poster, a play button and native controls once started.
// Starting one video pauses whichever other one is playing (via the shared controller).
export const SocialVideoPlayer: React.FC<Props> = ({ video, title, playLabel, playerKey, ctrl }) => {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const { register, playingKey, onPlay, onPause } = ctrl;

  const start = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setStarted(true);
    el.controls = true;
    void el.play().catch(() => {});
    track('video_start', { video_title: video.id });
  }, [video.id]);

  useEffect(() => register(playerKey, start), [register, playerKey, start]);

  // Another video took over (or the network was switched): pause this one
  useEffect(() => {
    const el = ref.current;
    if (el && playingKey !== playerKey && !el.paused) el.pause();
  }, [playingKey, playerKey]);

  return (
    <div className="relative aspect-video overflow-hidden bg-plum-black">
      <video
        ref={ref}
        className="absolute inset-0 w-full h-full object-cover"
        src={video.src}
        poster={video.poster}
        width={1920}
        height={1080}
        preload="none"
        playsInline
        muted={!video.hasAudio}
        controls={started}
        aria-label={title}
        onPlay={() => onPlay(playerKey)}
        onPause={() => onPause(playerKey)}
        onEnded={() => setStarted(false)}
      />
      {!started && (
        <button
          type="button"
          onClick={start}
          aria-label={`${playLabel}: ${title}`}
          className="focus-ring group absolute inset-0 flex items-center justify-center bg-[linear-gradient(180deg,rgba(5,3,8,0)_35%,rgba(5,3,8,0.4)_100%)]"
        >
          <span className="glass-strong w-14 h-14 rounded-full flex items-center justify-center transition-[transform,box-shadow] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:group-hover:scale-105 md:group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_0_44px_rgba(162,77,184,0.55)]">
            <Play className="w-5 h-5 text-ink ml-0.5" strokeWidth={1.5} fill="currentColor" aria-hidden />
          </span>
        </button>
      )}
    </div>
  );
};
