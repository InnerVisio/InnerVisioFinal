// Shared "only one video plays at a time" controller for the social mockup.
// Every <SocialVideo> has a key (`platform:videoId`); the page keeps the key of the one that is playing.
export type Platform = 'instagram' | 'facebook';

export const videoKey = (platform: Platform, id: string) => `${platform}:${id}`;

export interface PlayerController {
  playingKey: string | null;
  onPlay: (key: string) => void;
  onPause: (key: string) => void;
  /** Lets the page start a specific video (from the video list); returns an unregister function */
  register: (key: string, start: () => void) => () => void;
}

export const formatDuration = (seconds: number) => {
  const s = Math.round(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};
