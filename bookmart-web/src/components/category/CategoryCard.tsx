'use client';

import { memo } from 'react';
import Image from 'next/image';

export interface CategoryCardProps {
  name: string;
  image?: string;
  emoji?: string;
  gradient?: string;
  isActive: boolean;
  onSelect: () => void;
  registerRef: (el: HTMLDivElement | null) => void;
}

function CategoryCardBase({
  name,
  image,
  emoji,
  gradient,
  isActive,
  onSelect,
  registerRef,
}: CategoryCardProps) {
  return (
    <div
      ref={registerRef}
      className={`flex-shrink-0 snap-center px-1.4 transition-[margin] duration-300 ease-out ${
        isActive ? 'mx-3' : 'mx-0'
      }`}
      role="listitem"
    >
      <button
        type="button"
        onClick={onSelect}
        aria-label={name}
        aria-current={isActive}
        className={`group relative block w-[72px] h-[96px] rounded-2xl bg-white outline-none transition-transform duration-300 ease-out will-change-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary ${
          isActive
            ? 'scale-[1.25] z-20 shadow-xl shadow-teal-primary/25 ring-2 ring-brand-primary'
            : 'scale-90 z-10 shadow-sm opacity-90 hover:shadow-md hover:opacity-100'
        }`}
      >
        <div
          className={`absolute inset-0 rounded-2xl overflow-hidden ${gradient ?? 'bg-brand-light'}`}
        >
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              loading="lazy"
              sizes="72px"
              className="object-cover rounded-2xl"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-3xl">{emoji}</span>
          )}
        </div>
      </button>
    </div>
  );
}

export const CategoryCard = memo(CategoryCardBase);
