import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

const levelStyles = {
  1: {
    background: 'rgba(255, 255, 255, 0.02)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: 'none',
  },
  2: {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  },
  3: {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
    backdropFilter: 'blur(30px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
  },
};

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  level = 1,
  className = '',
  hover = true,
  onClick,
}) => {
  const styles = levelStyles[level];

  return (
    <motion.div
      className={`rounded-3xl p-6 ${className}`}
      style={{
        background: styles.background,
        backdropFilter: styles.backdropFilter,
        WebkitBackdropFilter: styles.backdropFilter,
        border: styles.border,
        boxShadow: styles.boxShadow,
      }}
      whileHover={
        hover
          ? {
              scale: 1.02,
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 30px rgba(34, 211, 238, 0.1)',
              transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
            }
          : undefined
      }
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
