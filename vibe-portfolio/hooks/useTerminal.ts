import { useState, useCallback } from 'react';

export interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'success' | 'system' | 'header';
  color?: string;
  delay?: number;
  showPrompt?: boolean;
}

export const useTerminal = () => {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const addLine = useCallback((line: TerminalLine) => {
    setLines((prev) => [...prev, line]);
  }, []);

  const clearTerminal = useCallback(() => {
    setLines([]);
  }, []);

  // Memoize typeLine to prevent recreation on every render (flickering fix)
  const typeLine = useCallback(async (line: TerminalLine, speed = 20) => {
    setIsTyping(true);
    
    // Add the line container
    setLines((prev) => [...prev, { ...line, text: '' }]);
    
    const text = line.text;
    for (let i = 0; i <= text.length; i++) {
      setLines((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        const lastItem = updated[lastIndex];
        if (lastItem) {
          updated[lastIndex] = { ...lastItem, text: text.slice(0, i), type: lastItem.type || 'output' };
        }
        return updated;
      });
      await new Promise((resolve) => setTimeout(resolve, speed));
    }
    
    setIsTyping(false);
  }, []); // Empty deps - uses functional state updates

  const processSequence = useCallback(async (sequence: TerminalLine[]) => {
    for (const line of sequence) {
      if (line.delay) {
        await new Promise((resolve) => setTimeout(resolve, line.delay));
      }
      await typeLine(line);
    }
  }, [typeLine]);

  return {
    lines,
    isTyping,
    addLine,
    typeLine,
    processSequence,
    clearTerminal,
  };
};
