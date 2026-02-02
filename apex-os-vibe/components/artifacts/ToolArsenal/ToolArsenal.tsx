import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { ToolCard } from './ToolCard';
import { tools } from '../../../data/curriculumData';
import { FOUNDER_ROLE_MAPPING } from '../../../data/founderRoles';
import type { Tool } from '../../../types/curriculum';

// Boot sequence messages for terminal effect
const BOOT_SEQUENCE = [
  { text: '> Initializing AI agents...', delay: 0 },
  { text: '> Loading curriculum modules...', delay: 400 },
  { text: '> Establishing neural links...', delay: 800 },
  { text: '> System ready. Launching...', delay: 1200 },
];

// Terminal Boot Button Component
function TerminalBootButton({ onComplete }: { onComplete: () => void }) {
  const [isBooting, setIsBooting] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const startBoot = useCallback(() => {
    if (isBooting) return;
    setIsBooting(true);
    setCurrentLine(0);
    setDisplayedText('');
  }, [isBooting]);

  // Handle typing animation
  useEffect(() => {
    if (!isBooting) return;
    
    if (currentLine >= BOOT_SEQUENCE.length) {
      // Boot complete, navigate after brief pause
      const timer = setTimeout(onComplete, 300);
      return () => clearTimeout(timer);
    }

    const sequenceItem = BOOT_SEQUENCE[currentLine];
    if (!sequenceItem) return;
    
    const { text, delay } = sequenceItem;
    
    // Start this line after its delay
    const startTimer = setTimeout(() => {
      let charIndex = 0;
      const typeInterval = setInterval(() => {
        if (charIndex <= text.length) {
          setDisplayedText(text.slice(0, charIndex));
          charIndex++;
        } else {
          clearInterval(typeInterval);
          // Move to next line
          setTimeout(() => setCurrentLine(prev => prev + 1), 150);
        }
      }, 25); // Typing speed

      return () => clearInterval(typeInterval);
    }, currentLine === 0 ? 0 : delay - (BOOT_SEQUENCE[currentLine - 1]?.delay || 0));

    return () => clearTimeout(startTimer);
  }, [isBooting, currentLine, onComplete]);

  return (
    <motion.button
      onClick={startBoot}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={isBooting}
      className="relative px-8 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-semibold cursor-pointer overflow-hidden group disabled:cursor-wait"
      whileHover={{ scale: isBooting ? 1 : 1.05 }}
      whileTap={{ scale: isBooting ? 1 : 0.98 }}
    >
      {/* Animated glow effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-violet-400 opacity-0 blur-xl"
        animate={{ 
          opacity: isHovered && !isBooting ? 0.6 : 0,
          scale: isHovered && !isBooting ? 1.2 : 1 
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Scanning line effect during boot */}
      {isBooting && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent"
          animate={{ y: ['-100%', '200%'] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        <AnimatePresence mode="wait">
          {!isBooting ? (
            <motion.span
              key="default"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              Start the Academy
            </motion.span>
          ) : (
            <motion.span
              key="booting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-mono text-sm min-w-[240px] text-left"
            >
              {displayedText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="inline-block w-2 h-4 bg-white ml-0.5 align-middle"
              />
            </motion.span>
          )}
        </AnimatePresence>
      </span>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/30" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/30" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/30" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/30" />
    </motion.button>
  );
}

// Extended tool interface with founder-focused roles
interface ToolWithRole extends Tool {
  role: string;
  subtitle: string;
  description: string;
}

export const ToolArsenal = React.memo(function ToolArsenal() {
  const navigate = useNavigate();

  // Enhance tools with founder-focused role data
  const toolsWithRoles: ToolWithRole[] = tools.map(tool => ({
    ...tool,
    role: FOUNDER_ROLE_MAPPING[tool.id]?.role || 'The Specialist',
    subtitle: FOUNDER_ROLE_MAPPING[tool.id]?.subtitle || 'AI Assistant',
    description: FOUNDER_ROLE_MAPPING[tool.id]?.description || tool.description,
  }));

  // Separate CORE and ASSET tools
  const coreTools = toolsWithRoles.filter(t => t.tier === 'core');
  const assetTools = toolsWithRoles.filter(t => t.tier === 'asset');

  return (
    <section className="relative py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">C-Suite AI Team</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Meet the 12 specialized agents that turn you into a one-person software company.
            Each tool plays a distinct role in your development orchestra.
          </p>
        </motion.div>

        {/* CORE TIER Section */}
        <div className="mb-16">
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl font-bold text-cyan-400 mb-6 flex items-center gap-3"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            CORE STACK
            <span className="text-sm text-zinc-500 font-normal">Daily Drivers</span>
          </motion.h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreTools.map((tool, index) => (
              <ToolCard key={tool.id} tool={tool} index={index} />
            ))}
          </div>
        </div>

        {/* ASSET TIER Section */}
        <div>
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-2xl font-bold text-violet-400 mb-6 flex items-center gap-3"
          >
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            ASSET LAYER
            <span className="text-sm text-zinc-500 font-normal">Specialized Tools</span>
          </motion.h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assetTools.map((tool, index) => (
              <ToolCard key={tool.id} tool={tool} index={index + coreTools.length} />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-zinc-400 mb-6">
            Ready to assemble your AI team?
          </p>
          <TerminalBootButton onComplete={() => navigate('/academy')} />
        </motion.div>
      </div>
    </section>
  );
});
