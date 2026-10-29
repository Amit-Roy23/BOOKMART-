'use client';

import { Search, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { AuthorCard } from '@/components/author/author-card';
import { Chip, EmptyState, ErrorState, PageHeader, Skeleton } from '@/components/ui/primitives';
import { useAuthors } from '@/hooks/use-api';
import { getErrorMessage } from '@/lib/api';

export default function AuthorsPage() {
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [designation, setDesignation] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  const { data: authors = [], isLoading, isError, error, refetch } = useAuthors(debounced);
  const designations = useMemo(
    () => Array.from(new Set(authors.map((a) => a.designation).filter(Boolean))).sort(),
    [authors]
  );
  const shown = designation ? authors.filter((a) => a.designation === designation) : authors;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Authors"
        description="Authors whose books are currently on sale on Bookmart."
        action={
          <div className="relative sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search authors"
              aria-label="Search authors"
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm focus:border-brand-primary focus:outline-none"
            />
          </div>
        }
      />

      {designations.length > 1 && (
        <div className="scrollbar-hide flex gap-2 overflow-x-auto">
          <Chip active={!designation} onClick={() => setDesignation(null)}>
            All
          </Chip>
          {designations.map((d) => (
            <Chip key={d} active={designation === d} onClick={() => setDesignation(d)}>
              {d}
            </Chip>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-44" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
      ) : shown.length === 0 ? (
        <EmptyState icon={Users} title="No authors found" description="Try a different name." />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {shown.map((author) => (
            <AuthorCard key={author.id} author={author} />
          ))}
        </div>
      )}
    </div>
  );
}
