'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CLITypingButtonProps {
  initialText: string;
  finalButtonText: string;
  onFinalClick: () => void;
  typingSpeed?: number;
}

export function CLITypingButton({
  initialText,
  finalButtonText,
  onFinalClick,
  typingSpeed = 50,
}: CLITypingButtonProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showFinalButton, setShowFinalButton] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    if (!isTyping) return;

    if (displayedText.length < initialText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(initialText.slice(0, displayedText.length + 1));
      }, typingSpeed);
      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
      const timeout = setTimeout(() => {
        setShowFinalButton(true);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [displayedText, initialText, isTyping, typingSpeed]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  const handleFinalClick = useCallback(() => {
    onFinalClick();
  }, [onFinalClick]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="font-mono text-sm text-green-400 flex items-center gap-2">
        <span className="text-green-500">&gt;_</span>
        <span>
          {displayedText}
          <motion.span
            animate={{ opacity: cursorVisible ? 1 : 0 }}
            transition={{ duration: 0 }}
            className="inline-block w-[2px] h-[1em] bg-green-400 ml-0.5 align-middle"
          />
        </span>
      </div>

      <AnimatePresence mode="wait">
        {showFinalButton && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={handleFinalClick}
            className="relative px-6 py-3 bg-black border border-red-500/50 rounded font-mono text-sm text-red-400 
                       transition-all duration-300 ease-out
                       hover:border-red-400 hover:text-red-300
                       focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-black"
            style={{
              boxShadow: '0 0 20px rgba(239, 68, 68, 0.3), inset 0 0 20px rgba(239, 68, 68, 0.1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(239, 68, 68, 0.5), inset 0 0 30px rgba(239, 68, 68, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.3), inset 0 0 20px rgba(239, 68, 68, 0.1)';
            }}
          >
            {finalButtonText}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
