import React, { useCallback, useRef, useState } from 'react';
import { ChevronsLeftRight, Smartphone, Sparkles } from 'lucide-react';
import { FOCUS_RING } from './pricingNav';

interface BeforeAfterSliderProps {
  beforeSrc?: string;
  afterSrc?: string;
  beforeLabel: string;
  afterLabel: string;
  sliderLabel: string;
  beforePlaceholder: string;
  afterPlaceholder: string;
}

const clamp = (value: number) => Math.min(100, Math.max(0, value));

// Shown until real before/after images are provided in AI_BEFORE_AFTER (constants.tsx)
const Placeholder: React.FC<{ variant: 'before' | 'after'; text: string }> = ({ variant, text }) => (
  <div
    className={`absolute inset-0 flex items-center justify-center ${
      variant === 'before'
        ? 'bg-[linear-gradient(135deg,#120e14_0%,#1c161f_55%,#0b080d_100%)]'
        : 'bg-[radial-gradient(110%_90%_at_75%_15%,rgba(196,139,224,0.26)_0%,rgba(122,53,137,0.34)_40%,#1F0F29_80%,#120818_100%)]'
    }`}
  >
    {/* Centered within its own half so the two placeholder labels never overlap */}
    <div
      className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3 text-center ${
        variant === 'before' ? 'left-1/4 text-ink-3' : 'left-3/4 text-ink-2'
      }`}
    >
      <span className="icon-chip w-12 h-12 rounded-2xl">
        {variant === 'before' ? (
          <Smartphone className="w-6 h-6" strokeWidth={1.5} aria-hidden />
        ) : (
          <Sparkles className="w-6 h-6 icon-gradient" strokeWidth={1.5} aria-hidden />
        )}
      </span>
      <span className="font-display font-medium text-[11px] uppercase tracking-[0.2em]">{text}</span>
    </div>
  </div>
);

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeSrc,
  afterSrc,
  beforeLabel,
  afterLabel,
  sliderLabel,
  beforePlaceholder,
  afterPlaceholder,
}) => {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    setPosition(clamp(((clientX - rect.left) / rect.width) * 100));
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (draggingRef.current) updateFromClientX(e.clientX);
  };

  const stopDragging = () => {
    draggingRef.current = false;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 5;
    const next: Record<string, number> = {
      ArrowLeft: position - step,
      ArrowDown: position - step,
      ArrowRight: position + step,
      ArrowUp: position + step,
      Home: 0,
      End: 100,
    };
    if (e.key in next) {
      e.preventDefault();
      setPosition(clamp(next[e.key]));
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      className="relative isolate w-full aspect-[3/2] rounded-card overflow-hidden border border-white/10 bg-plum-black shadow-[0_30px_80px_rgba(0,0,0,0.5)] select-none cursor-ew-resize touch-pan-y"
    >
      {/* AFTER: full image underneath */}
      {afterSrc ? (
        <img src={afterSrc} alt={afterLabel} loading="lazy" draggable={false} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <Placeholder variant="after" text={afterPlaceholder} />
      )}

      {/* BEFORE: clipped from the right by the handle position */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        {beforeSrc ? (
          <img src={beforeSrc} alt={beforeLabel} loading="lazy" draggable={false} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <Placeholder variant="before" text={beforePlaceholder} />
        )}
      </div>

      {/* Corner labels */}
      {/* Soft scrims keep the plain-type labels legible over bright skies (no label boxes) */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/45 to-transparent pointer-events-none" aria-hidden />
      <div className="md:hidden absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/45 to-transparent pointer-events-none" aria-hidden />
      <span className="absolute top-4 left-4 md:top-5 md:left-6 font-display font-medium text-xs sm:text-sm text-ink drop-shadow-[0_1px_12px_rgba(0,0,0,0.85)] pointer-events-none">
        {beforeLabel}
      </span>
      <span className="absolute bottom-4 md:bottom-auto md:top-5 right-4 md:right-6 font-display font-medium text-xs sm:text-sm text-ink drop-shadow-[0_1px_12px_rgba(0,0,0,0.85)] pointer-events-none">
        {afterLabel}
      </span>

      {/* Divider + handle */}
      <div
        className="absolute inset-y-0 w-px -translate-x-1/2 bg-white/80 pointer-events-none"
        style={{ left: `${position}%` }}
      />
      <div
        role="slider"
        tabIndex={0}
        aria-label={sliderLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        aria-valuetext={`${Math.round(position)} %`}
        onKeyDown={handleKeyDown}
        style={{ left: `${position}%` }}
        className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#F1E6F2] text-plum-black shadow-[0_8px_28px_rgba(0,0,0,0.5)] flex items-center justify-center ${FOCUS_RING}`}
      >
        <ChevronsLeftRight className="w-5 h-5" strokeWidth={1.75} aria-hidden />
      </div>
    </div>
  );
};
