'use client';

import { BookOpen, Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { EmptyState, ErrorState, PageHeader, Skeleton } from '@/components/ui/primitives';
import { useGenres } from '@/hooks/use-api';
import { getErrorMessage } from '@/lib/api';

export default function CategoriesPage() {
  const { data: genres = [], isLoading, isError, error, refetch } = useGenres();
  const [filter, setFilter] = useState('');
  const shown = genres.filter((g) => g.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div>
      <PageHeader
        title="Browse by genre"
        description="Textbooks, exam prep, fiction and everything in between."
        action={
          <div className="relative sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter genres"
              aria-label="Filter genres"
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm focus:border-brand-primary focus:outline-none"
            />
          </div>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
      ) : shown.length === 0 ? (
        <EmptyState icon={BookOpen} title="No genres found" />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {shown.map((genre) => (
            <Link
              key={genre.id}
              href={`/categories/${genre.slug}`}
              className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-xs transition hover:-translate-y-0.5 hover:border-brand-border hover:shadow-md"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-light text-xl">
                {genre.icon || <BookOpen className="h-5 w-5 text-brand-primary" />}
              </span>
              <h2 className="mt-3 font-bold text-slate-900 group-hover:text-brand-primary">
                {genre.name}
              </h2>
              {genre.subtitle && (
                <p className="line-clamp-1 text-xs text-slate-500">{genre.subtitle}</p>
              )}
              <p className="mt-2 text-xs font-semibold text-slate-400">
                {genre.total_books_count} book{genre.total_books_count === 1 ? '' : 's'}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
