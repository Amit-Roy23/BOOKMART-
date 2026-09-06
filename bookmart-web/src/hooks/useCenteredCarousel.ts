"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseCenteredCarouselOptions {
  count: number;
  loop?: boolean;
  autoCenter?: boolean;
  initialIndex?: number;
  onCenterChange?: (index: number) => void;
}

/**
 * Drives a center-focused, horizontally scrollable carousel.
 *
 * - Detects the item closest to the viewport center on every scroll frame.
 * - Exposes a `scrollToIndex` helper that smoothly centers an item (choosing
 *   the shortest path when looping).
 * - When `loop` is enabled, renders three copies of the list and silently
 *   rewinds the scroll position by one full set whenever the user reaches the
 *   first or last copy, producing a seamless infinite scroll.
 */
export function useCenteredCarousel({
  count,
  loop = false,
  autoCenter = true,
  initialIndex = 0,
  onCenterChange,
}: UseCenteredCarouselOptions) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const frameRef = useRef<number | null>(null);
  const activeRef = useRef(((initialIndex % count) + count) % count);
  const [activeIndex, setActiveIndex] = useState(
    ((initialIndex % count) + count) % count
  );

  const registerItem = useCallback((el: HTMLDivElement | null, slot: number) => {
    itemRefs.current[slot] = el;
  }, []);

  const getCenteredSlot = useCallback(() => {
    const container = containerRef.current;
    if (!container) return 0;
    const center = container.scrollLeft + container.clientWidth / 2;
    let best = 0;
    let minDistance = Infinity;
    for (let i = 0; i < itemRefs.current.length; i++) {
      const el = itemRefs.current[i];
      if (!el) continue;
      const itemCenter = el.offsetLeft + el.offsetWidth / 2;
      const distance = Math.abs(itemCenter - center);
      if (distance < minDistance) {
        minDistance = distance;
        best = i;
      }
    }
    return best;
  }, []);

  const scrollToSlot = useCallback((slot: number) => {
    const el = itemRefs.current[slot];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, []);

  const detectCenter = useCallback(() => {
    const slot = getCenteredSlot();
    const logical = ((slot % count) + count) % count;
    if (logical !== activeRef.current) {
      activeRef.current = logical;
      setActiveIndex(logical);
      onCenterChange?.(logical);
    }
  }, [count, getCenteredSlot, onCenterChange]);

  const correctLoop = useCallback(() => {
    if (!loop || count === 0) return;
    const container = containerRef.current;
    if (!container || itemRefs.current.length < count * 3) return;
    const slot = getCenteredSlot();
    const copy = Math.floor(slot / count);
    if (copy === 0 || copy === 2) {
      const first = itemRefs.current[0];
      const target = itemRefs.current[count];
      if (!first || !target) return;
      const stride = target.offsetLeft - first.offsetLeft;
      if (stride <= 0) return;
      const delta = copy === 0 ? stride : -stride;
      const previous = container.style.scrollBehavior;
      container.style.scrollBehavior = "auto";
      container.scrollLeft += delta;
      container.style.scrollBehavior = previous;
    }
  }, [loop, count, getCenteredSlot]);

  const handleScroll = useCallback(() => {
    if (frameRef.current !== null) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      detectCenter();
      correctLoop();
    });
  }, [detectCenter, correctLoop]);

  const scrollToIndex = useCallback(
    (index: number) => {
      const logical = ((index % count) + count) % count;
      if (!loop) {
        scrollToSlot(logical);
        return;
      }
      const current = getCenteredSlot();
      const copy = Math.round((current - logical) / count);
      scrollToSlot(logical + copy * count);
    },
    [count, loop, getCenteredSlot, scrollToSlot]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (!autoCenter || count === 0) return;
    const target = ((initialIndex % count) + count) % count;
    const id = requestAnimationFrame(() => {
      scrollToSlot(loop ? count + target : target);
      activeRef.current = target;
      setActiveIndex(target);
      onCenterChange?.(target);
    });
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, autoCenter, initialIndex, loop]);

  return {
    containerRef,
    registerItem,
    activeIndex,
    scrollToIndex,
  };
}
