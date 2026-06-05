import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  delay?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  hoverEffect = false,
  delay = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={`
        relative overflow-hidden
        bg-glass backdrop-blur-xl 
        border border-glass-border 
        rounded-2xl
        transition-all duration-500
        ${hoverEffect ? 'md:hover:bg-glass-hover md:hover:border-secondary/30 md:hover:shadow-[0_0_30px_rgba(101,36,111,0.2)]' : ''}
        ${className}
      `}
    >
      {/* Subtle Gradient Noise Texture Overlay could go here */}
      <div className="relative z-10 h-full">
        {children}
      </div>
      
      {/* Decorative Gradient Blob */}
      {hoverEffect && (
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-secondary/20 blur-[50px] rounded-full pointer-events-none transition-opacity duration-500 opacity-0 md:group-hover:opacity-100" />
      )}
    </motion.div>
  );
};
