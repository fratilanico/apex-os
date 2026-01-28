import { useEffect } from 'react';
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

const noop = () => {};

export function useWebVitals() {
  useEffect(() => {
    const reporter = process.env.NODE_ENV === 'development' ? console.log : noop;
    onCLS(reporter);
    onFCP(reporter);
    onINP(reporter);
    onLCP(reporter);
    onTTFB(reporter);
  }, []);
}
