import React from 'react';
import { SITE } from '../../site';

// Brand avatar: the white house mark on the plum gradient, no wordmark
export const Avatar: React.FC<{ size: number; className?: string }> = ({ size, className = '' }) => (
  <span
    aria-hidden
    style={{ width: size, height: size }}
    className={`bg-logo-plum shrink-0 inline-flex items-center justify-center rounded-full border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.28)] ${className}`}
  >
    <img src={SITE.logo} alt="" width={size} height={size} style={{ width: size * 0.58, height: size * 0.58 }} className="object-contain" />
  </span>
);
