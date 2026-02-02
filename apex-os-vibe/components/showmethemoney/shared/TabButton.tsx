import React from 'react';
import { motion } from 'framer-motion';

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}

export const TabButton: React.FC<TabButtonProps> = ({
  label,
  isActive,
  onClick,
  icon,
}) => {
  return (
    <motion.button
      onClick={onClick}
      className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 flex items-center gap-2 ${
        isActive
          ? 'text-white'
          : 'text-white/50 hover:text-white/80'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-white/10 rounded-lg"
          style={{
            boxShadow: '0 0 20px rgba(34, 211, 238, 0.2)',
          }}
          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
        />
      )}
      
      <span className="relative z-10 flex items-center gap-2">
        {icon}
        {label}
      </span>
    </motion.button>
  );
};

export default TabButton;
