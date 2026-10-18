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
        ? 'bg-[linear-gradient(135deg,#141016_0%,#211b24_50%,#0d0a0f_100%)]'
        : 'bg-[radial-gradient(110%_90%_at_72%_18%,rgba(196,139,224,0.32)_0%,rgba(122,53,137,0.40)_38%,#1F0F29_78%,#120818_100%)]'
    }`}
  >
    {/* Centered within its own half so the two placeholder labels never overlap */}
    <div
      className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3 text-center ${
        variant === 'before' ? 'left-1/4 text-ink-3' : 'left-3/4 text-ink-2'
      }`}
    >
      <span className="icon-chip w-14 h-14 rounded-2xl">
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
      className="relative isolate w-full aspect-[4/3] md:aspect-[16/9] rounded-card-lg overflow-hidden border-[1.5px] border-white/[0.16] bg-plum-black shadow-[0_30px_80px_rgba(0,0,0,0.55),0_0_80px_rgba(162,77,184,0.18)] select-none cursor-ew-resize touch-pan-y"
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
      <span className="absolute top-4 left-4 md:top-5 md:left-5 glass-pill !bg-black/40 px-3.5 py-1.5 font-display font-medium text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-ink pointer-events-none">
        {beforeLabel}
      </span>
      <span className="absolute bottom-4 md:bottom-auto md:top-5 right-4 md:right-5 glass-pill !bg-[rgba(162,77,184,0.55)] px-3.5 py-1.5 font-display font-medium text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-white pointer-events-none">
        {afterLabel}
      </span>

      {/* Divider + handle */}
      <div
        className="absolute inset-y-0 w-px -translate-x-1/2 bg-gradient-to-b from-white/10 via-white/85 to-white/10 shadow-[0_0_14px_rgba(240,212,244,0.55)] pointer-events-none"
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
        className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 glass-pill !bg-white/[0.14] !border-[1.5px] !border-white/35 !shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_12px_32px_rgba(0,0,0,0.5),0_0_30px_rgba(162,77,184,0.4)] flex items-center justify-center text-ink ${FOCUS_RING}`}
      >
        <ChevronsLeftRight className="w-5 h-5 icon-gradient" strokeWidth={1.75} aria-hidden />
      </div>
    </div>
  );
};
