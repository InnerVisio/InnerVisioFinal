import React from 'react';
import { Battery, Signal, Wifi } from 'lucide-react';

// CSS-only phone: dark body (#160A1D) with a thin light edge and a plum screen (#1F0F29 family)
export const PhoneFrame: React.FC<{ label: string; className?: string; children: React.ReactNode }> = ({ label, className = '', children }) => (
  <div
    role="group"
    aria-label={label}
    className={`relative mx-auto aspect-[9/18.8] rounded-[44px] p-[9px] bg-[linear-gradient(155deg,#2A1536_0%,#160A1D_38%,#110717_100%)] border border-white/[0.16] shadow-[0_50px_110px_rgba(0,0,0,0.7),0_0_100px_rgba(162,77,184,0.26),inset_0_1px_0_rgba(255,255,255,0.28),inset_0_0_0_1px_rgba(255,255,255,0.03)] ${className}`}
  >
    {/* Side buttons */}
    <span aria-hidden className="absolute -left-[3px] top-[104px] h-7 w-[3px] rounded-l bg-[#2A1536]" />
    <span aria-hidden className="absolute -left-[3px] top-[152px] h-12 w-[3px] rounded-l bg-[#2A1536]" />
    <span aria-hidden className="absolute -left-[3px] top-[212px] h-12 w-[3px] rounded-l bg-[#2A1536]" />
    <span aria-hidden className="absolute -right-[3px] top-[168px] h-16 w-[3px] rounded-r bg-[#2A1536]" />

    <div className="relative flex h-full flex-col overflow-hidden rounded-[36px] bg-[linear-gradient(180deg,#1B0D25_0%,#130819_100%)] text-ink">
      {/* Status bar */}
      <div aria-hidden className="relative z-20 flex h-[46px] flex-none items-end justify-between px-7 pb-1.5 text-[12px] font-semibold text-ink">
        <span>9:41</span>
        <span className="absolute left-1/2 top-[9px] h-[24px] w-[84px] -translate-x-1/2 rounded-full bg-black" />
        <span className="flex items-center gap-1.5">
          <Signal className="h-3.5 w-3.5" strokeWidth={2} />
          <Wifi className="h-3.5 w-3.5" strokeWidth={2} />
          <Battery className="h-4 w-4" strokeWidth={1.75} />
        </span>
      </div>
      {children}
    </div>
  </div>
);
