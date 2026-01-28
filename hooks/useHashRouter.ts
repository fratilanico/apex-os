import { useState, useEffect } from 'react';

export interface UseHashRouterReturn {
  currentHash: string;           // Current hash without '#' (e.g., 'module-01')
  navigateTo: (hash: string) => void;
  clearHash: () => void;
}

/**
 * Custom hook for URL hash-based routing
 * Enables direct linking to curriculum modules (e.g., #module-01)
 * 
 * @example
 * const { currentHash, navigateTo, clearHash } = useHashRouter();
 * 
 * // Navigate to module
 * navigateTo('module-01');
 * 
 * // Check current location
 * if (currentHash === 'module-01') { ... }
 * 
 * // Clear hash (return to landing)
 * clearHash();
 */
export function useHashRouter(): UseHashRouterReturn {
  const [currentHash, setCurrentHash] = useState<string>(() => {
    // Initialize from current URL hash
    const hash = window.location.hash.slice(1); // Remove '#'
    return hash;
  });

  useEffect(() => {
    // Handle hashchange events (browser back/forward, manual URL edits)
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      setCurrentHash(hash);
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const navigateTo = (hash: string) => {
    // Update URL hash
    window.location.hash = hash;
    setCurrentHash(hash);
  };

  const clearHash = () => {
    // Remove hash from URL
    history.pushState('', document.title, window.location.pathname + window.location.search);
    setCurrentHash('');
  };

  return {
    currentHash,
    navigateTo,
    clearHash,
  };
}
