import { useEffect } from 'react';
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

export function useWebVitals() {
  useEffect(() => {
    onCLS(console.log);
    onFCP(console.log);
    onINP(console.log);
    onLCP(console.log);
    onTTFB(console.log);
  }, []);
}
