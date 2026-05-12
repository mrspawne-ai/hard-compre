import { useState, useEffect } from 'react';

export interface ScrollState {
  scrolled: boolean;       // true once user scrolls > threshold
  scrollY: number;         // current scroll position
  scrollDirection: 'up' | 'down' | null;
}

export function useScrollEffect(threshold = 20): ScrollState {
  const [state, setState] = useState<ScrollState>({
    scrolled: false,
    scrollY: 0,
    scrollDirection: null,
  });

  useEffect(() => {
    let lastY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      setState({
        scrolled: currentY > threshold,
        scrollY: currentY,
        scrollDirection: currentY > lastY ? 'down' : 'up',
      });
      lastY = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return state;
}
