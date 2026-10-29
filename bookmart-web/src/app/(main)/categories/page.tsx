'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { IoChevronForward } from 'react-icons/io5';
import { ScreenHeader } from '@/components/app/screen-header';
import { useAvailableListings } from '@/hooks/use-api';
import { CATEGORIES, matchesCategory } from '@/lib/categories';

/** All categories. Each opens its own category screen (no redirect to a default category). */
export default function CategoriesPage() {
  const { data: listings = [] } = useAvailableListings();
  const counts = useMemo(
    () =>
      Object.fromEntries(
        CATEGORIES.map((c) => [
          c.slug,
          listings.filter((l) => matchesCategory(c, l.book.genres)).length,
        ])
      ),
    [listings]
  );

  return (
    <>
      <ScreenHeader title="Categories" />
      <div className="grid gap-3 px-6 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map(({ slug, label, icon: Icon, background, border, iconColor }) => (
          <Link
            key={slug}
            href={`/categories/${slug}`}
            className="flex items-center gap-4 rounded-2xl border border-gray-light bg-white p-4 shadow-card transition hover:-translate-y-0.5"
          >
            <span
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border"
              style={{ background, borderColor: border }}
            >
              <Icon size={24} color={iconColor} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="font-heading block font-bold text-text">{label}</span>
              <span className="text-xs text-muted">
                {counts[slug] ?? 0} book{counts[slug] === 1 ? '' : 's'}
              </span>
            </span>
            <IoChevronForward className="text-muted" />
          </Link>
        ))}
      </div>
    </>
  );
}
