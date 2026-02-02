import React from 'react';
import { motion } from 'framer-motion';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  align = 'left',
  className = '',
}) => {
  return (
    <div className={`${align === 'center' ? 'text-center' : ''} ${className}`}>
      <motion.h2
        className="text-3xl md:text-4xl font-bold text-white mb-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        {title}
      </motion.h2>
      
      {subtitle && (
        <motion.p
          className="text-lg text-white/60 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
          style={{ marginLeft: align === 'center' ? 'auto' : '0', marginRight: align === 'center' ? 'auto' : '0' }}
        >
          {subtitle}
        </motion.p>
      )}
      
      <motion.div
        className="h-1 bg-gradient-to-r from-cyan-400 to-violet-400 rounded-full mt-4"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
        style={{
          width: '80px',
          transformOrigin: align === 'center' ? 'center' : 'left',
          marginLeft: align === 'center' ? 'auto' : '0',
          marginRight: align === 'center' ? 'auto' : '0',
        }}
      />
    </div>
  );
};

export default SectionHeader;
