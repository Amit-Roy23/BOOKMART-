'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { IoStar } from 'react-icons/io5';
import { SectionHeader } from '@/components/book/book-cards';
import { Avatar, BookCover } from '@/components/ui/primitives';
import { CATEGORIES } from '@/lib/categories';
import { cn } from '@/lib/utils';
import type { Author } from '@/types/api';

// Same banners as bookmart-app/src/components/ui/PromoBanner.tsx.
const BANNERS = [
  {
    title: 'New Exploration on Non-Fiction',
    subtitle: 'Discount 50% for first transaction',
    cta: 'Explore Now',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=900&h=500&fit=crop',
  },
  {
    title: 'Best Sellers This Week',
    subtitle: 'Up to 40% off on top picks',
    cta: 'Browse Now',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=900&h=500&fit=crop',
  },
  {
    title: 'Pre-owned Books at Unbeatable Prices',
    subtitle: 'Flat ₹99 on selected titles',
    cta: 'Shop Now',
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=900&h=500&fit=crop',
  },
];

/** Auto-sliding promo carousel with progress dots. */
export function PromoBanner() {
  const [active, setActive] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);
  const paused = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (paused.current || !scroller.current) return;
      const next = (active + 1) % BANNERS.length;
      const el = scroller.current;
      el.scrollTo({ left: (el.scrollWidth / BANNERS.length) * next, behavior: 'smooth' });
    }, 4000);
    return () => clearInterval(timer);
  }, [active]);

  return (
    <section className="mb-2.5">
      <div
        ref={scroller}
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
        onScroll={(e) => {
          const el = e.currentTarget;
          const index = Math.round(el.scrollLeft / (el.scrollWidth / BANNERS.length));
          if (index !== active) setActive(index);
        }}
        className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-1"
      >
        {BANNERS.map((b) => (
          <div
            key={b.title}
            className="relative h-[152px] w-full shrink-0 snap-center overflow-hidden rounded-2xl bg-white shadow-[0_8px_16px_rgba(6,32,43,0.08)] md:h-[220px] md:w-[calc(50%-8px)]"
          >
            <BookCover src={b.image} alt="" className="absolute inset-0" />
            <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-b from-transparent via-white/75 to-white/[0.98]" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-1 p-[18px]">
              <div className="min-w-0 flex-1">
                <p className="font-heading line-clamp-2 text-[15px] font-bold leading-tight text-text md:text-lg">
                  {b.title}
                </p>
                <p className="mt-1 truncate text-[11px] font-bold text-muted md:text-xs">
                  {b.subtitle}
                </p>
              </div>
              <Link
                href="/search"
                className="font-heading shrink-0 rounded-3xl bg-primary px-4 py-2 text-xs font-bold text-white shadow"
              >
                {b.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2.5 flex items-center justify-center gap-2" aria-hidden>
        {BANNERS.map((b, i) => (
          <span
            key={b.title}
            className={cn(
              'h-1 rounded-full transition-all duration-300',
              i === active ? 'w-5 bg-primary' : 'w-1.5 bg-[rgba(0,128,128,0.2)]'
            )}
          />
        ))}
      </div>
    </section>
  );
}

/** The app's “Categories” row: eight fixed categories, each opening its own screen. */
export function CategoriesRow() {
  return (
    <section className="mt-3">
      <SectionHeader title="Categories" className="px-6" seeAllHref="/categories" />
      <div className="scrollbar-hide flex gap-2.5 overflow-x-auto px-6 pb-2 md:justify-between md:gap-4">
        {CATEGORIES.map(({ slug, label, icon: Icon, background, border, iconColor }) => (
          <Link
            key={slug}
            href={`/categories/${slug}`}
            className="flex w-[70px] shrink-0 flex-col items-center gap-1.5 transition hover:-translate-y-0.5 md:w-auto md:flex-1"
          >
            <span
              className="flex h-14 w-14 items-center justify-center rounded-2xl border shadow-[0_2px_6px_rgba(6,32,43,0.04)] md:h-16 md:w-16"
              style={{ background, borderColor: border }}
            >
              <Icon size={22} color={iconColor} />
            </span>
            <span className="max-w-full truncate text-xs font-semibold text-text">{label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/** Authors strip on a soft teal gradient, like the app's AuthorsSection. */
export function AuthorsStrip({ authors }: { authors: Author[] }) {
  if (!authors.length) return null;
  return (
    <section className="mt-5 bg-gradient-to-b from-secondary to-app-bg pb-2 pt-4">
      <SectionHeader title="Authors" seeAllHref="/authors" className="px-6" />
      <div className="scrollbar-hide flex gap-3 overflow-x-auto px-6 pb-2">
        {authors.map((author) => (
          <Link
            key={author.id}
            href={`/authors/${author.id}`}
            className="flex w-60 shrink-0 items-center gap-3 rounded-[40px] bg-white p-2 pr-4 shadow-card"
          >
            <Avatar src={author.image_url} name={author.name} size={52} />
            <div className="min-w-0">
              <p className="font-heading truncate text-sm font-bold text-text">{author.name}</p>
              <p className="line-clamp-1 text-[10px] text-muted">
                {author.bio || author.designation || 'Author'}
              </p>
              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-[#c49a00]">
                <IoStar size={10} className="text-app-yellow" />
                {(parseFloat(author.rating) || 5).toFixed(1)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
