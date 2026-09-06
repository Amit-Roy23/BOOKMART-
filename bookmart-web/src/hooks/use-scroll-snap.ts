'use client';

'use client';

import { useEffect, useRef } from 'react';

export function useScrollSnap(
  containerRef: React.RefObject<HTMLDivElement | null>,
  snapPoints: number[]
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const width = container.clientWidth;
      const closest = snapPoints.reduce((prev, curr) =>
        Math.abs(curr - scrollLeft) < Math.abs(prev - scrollLeft) ? curr : prev
      );
      container.scrollTo({ left: closest, behavior: 'smooth' });
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [containerRef, snapPoints]);
}

export function useDebounce<T extends (...args: unknown[]) => void>(callback: T, delay: number): T {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return ((...args: unknown[]) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => callback(...args), delay);
  }) as T;
}
