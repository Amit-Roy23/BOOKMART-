"use client";

import { useCallback, useMemo } from "react";
import { CategoryCarouselProps } from "@/types/category";
import { useCenteredCarousel } from "@/hooks/useCenteredCarousel";
import { CategoryCard } from "./CategoryCard";
import { ActiveCategoryTitle } from "./ActiveCategoryTitle";

const ITEM_HALF_WIDTH = 36;

export function CategoryCarousel({
  categories,
  activeCategory,
  initialCategory,
  onCategoryChange,
  loop = false,
  autoCenter = true,
  className = "",
}: CategoryCarouselProps) {
  const baseIndex = useMemo(() => {
    if (initialCategory) {
      const idx = categories.findIndex((c) => c.id === initialCategory);
      if (idx >= 0) return idx;
    }
    if (activeCategory) {
      const idx = categories.findIndex((c) => c.id === activeCategory);
      if (idx >= 0) return idx;
    }
    return Math.floor(categories.length / 2);
  }, [categories, initialCategory, activeCategory]);

  const handleChange = useCallback(
    (index: number) => {
      onCategoryChange?.(categories[index]);
    },
    [categories, onCategoryChange]
  );

  const { containerRef, registerItem, activeIndex, scrollToIndex } =
    useCenteredCarousel({
      count: categories.length,
      loop,
      autoCenter,
      initialIndex: baseIndex,
      onCenterChange: handleChange,
    });

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollToIndex(activeIndex + 1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollToIndex(activeIndex - 1);
      }
    },
    [activeIndex, scrollToIndex]
  );

  const spacerStyle = { width: `calc(50% - ${ITEM_HALF_WIDTH}px)` };
  const copies = loop ? 3 : 1;

  return (
    <div className={`w-full ${className}`}>
      <ActiveCategoryTitle name={categories[activeIndex]?.name ?? ""} />

      <div
        ref={containerRef}
        role="list"
        aria-label="Book categories"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="scrollbar-hide relative flex items-center overflow-x-auto overscroll-x-contain snap-x snap-mandatory scroll-smooth py-6 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-primary"
      >
        <div
          aria-hidden="true"
          className="flex-shrink-0 h-px"
          style={spacerStyle}
        />
        {Array.from({ length: copies }).flatMap((_, copy) =>
          categories.map((category, index) => {
            const slot = copy * categories.length + index;
            return (
              <CategoryCard
                key={`${category.id}-${copy}`}
                name={category.name}
                image={category.image}
                emoji={category.emoji}
                gradient={category.gradient}
                isActive={loop ? copy === 1 && index === activeIndex : index === activeIndex}
                onSelect={() => scrollToIndex(index)}
                registerRef={(el) => registerItem(el, slot)}
              />
            );
          })
        )}
        <div
          aria-hidden="true"
          className="flex-shrink-0 h-px"
          style={spacerStyle}
        />
      </div>
    </div>
  );
}
