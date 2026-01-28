import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface TerminalPortalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  showCloseButton?: boolean;
  enableBackdropClick?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

/**
 * UniversalTerminalPortal - Centralized portal rendering for all terminals
 * 
 * Features:
 * - Guaranteed portal rendering to document.body
 * - Proper z-index hierarchy (z-[9999])
 * - Backdrop with blur
 * - ESC key support
 * - Accessible (ARIA)
 * - Prevents scroll-jacking
 * - Text visibility guaranteed
 */
export const TerminalPortal: React.FC<TerminalPortalProps> = ({
  children,
  isOpen,
  onClose,
  title,
  showCloseButton = true,
  enableBackdropClick = true,
  size = 'lg',
  className = '',
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    
    // Prevent body scroll when modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      // Use setTimeout to prevent scroll jank during unmount
      setTimeout(() => {
        // Only restore if no other modals are open
        const otherModals = document.querySelectorAll('[role="dialog"]');
        if (otherModals.length === 0) {
          document.body.style.overflow = originalOverflow || '';
        }
      }, 50);
    };
  }, [isOpen, onClose]);

  // Don't render anything if not mounted or not open
  if (!mounted || !isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-xl',
    md: 'max-w-2xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
    full: 'max-w-7xl',
  };

  // Simplified modal without nested AnimatePresence to prevent animation conflicts
  const modalContent = (
    <motion.div
      key="terminal-portal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={enableBackdropClick ? onClose : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'terminal-portal-title' : undefined}
    >
      <motion.div
        key="terminal-portal-content"
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${sizeClasses[size]} relative ${className}`}
      >
        {/* Close Button */}
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 md:-top-3 md:-right-3 z-[10000] w-10 h-10 rounded-full bg-red-500/20 backdrop-blur-md hover:bg-red-500/40 border-2 border-red-500/50 hover:border-red-500/80 flex items-center justify-center text-red-400 hover:text-red-300 transition-all shadow-lg hover:shadow-red-500/20"
            aria-label="Close terminal"
          >
            <X className="w-5 h-5" strokeWidth={2.5} />
          </button>
        )}

        {/* Content with guaranteed visibility */}
        <div className="relative text-white">
          {title && (
            <h2 id="terminal-portal-title" className="sr-only">
              {title}
            </h2>
          )}
          {children}
        </div>
      </motion.div>
    </motion.div>
  );

  return createPortal(modalContent, document.body);
};
