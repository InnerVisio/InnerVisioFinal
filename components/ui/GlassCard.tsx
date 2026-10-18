import React from 'react';
import { motion } from 'framer-motion';
import { blurInRise } from './brand';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  delay?: number;
}

// Liquid glass surface from the brand guidelines; hover strengthens the plum glow
export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  delay = 0
}) => {
  return (
    <motion.div
      {...blurInRise(delay)}
      className={`
        glass relative overflow-hidden rounded-card
        transition-shadow duration-500
        ${hoverEffect ? 'md:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_30px_80px_rgba(0,0,0,0.55),0_0_60px_rgba(162,77,184,0.35)]' : ''}
        ${className}
      `}
    >
      <div className="relative z-10 h-full">
        {children}
      </div>

      {hoverEffect && (
        <div className="absolute -bottom-20 -right-20 w-48 h-48 glow-plum rounded-full transition-opacity duration-500 opacity-0 md:group-hover:opacity-100" />
      )}
    </motion.div>
  );
};
