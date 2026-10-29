'use client';

import { History, Search, SlidersHorizontal, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { ListingGrid, ListingGridSkeleton } from '@/components/listing/listing-card';
import { Button, Chip, EmptyState, ErrorState } from '@/components/ui/primitives';
import { useGenres, useListings, useTags } from '@/hooks/use-api';
import { getErrorMessage } from '@/lib/api';
import { cn, conditionLabel, LISTING_CONDITIONS } from '@/lib/utils';

const ORDERINGS = [
  { label: 'Newest first', value: '-created_at' },
  { label: 'Price: low to high', value: 'price' },
  { label: 'Price: high to low', value: '-price' },
  { label: 'Oldest first', value: 'created_at' },
];

const RECENT_KEY = 'bookmart:recent_searches';
const PAGE_SIZE = 20;

function readRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function writeRecent(list: string[]) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch {
    // Recent searches are a convenience only.
  }
}

function SearchView() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const q = params.get('q') ?? '';
  const condition = params.get('condition') ?? '';
  const genre = params.get('genre') ?? '';
  const tag = params.get('tag') ?? '';
  const ordering = params.get('ordering') ?? '-created_at';
  const page = Number(params.get('page') ?? '1');

  const [input, setInput] = useState(q);
  const [recent, setRecent] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { data: genres = [] } = useGenres();
  const { data: tags = [] } = useTags();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- keep the input in sync with the URL
    setInput(q);
  }, [q]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load from localStorage after mount
    setRecent(readRecent());
  }, []);

  const listings = useListings({
    search: q || undefined,
    condition: condition || undefined,
    genre: genre || undefined,
    tag: tag || undefined,
    ordering,
    status: 'AVAILABLE',
    page,
    page_size: PAGE_SIZE,
  });

  const update = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    if (!('page' in changes)) next.delete('page');
    router.push(`${pathname}?${next.toString()}`);
  };

  const submit = (value: string) => {
    const term = value.trim();
    if (term) {
      const list = [term, ...recent.filter((r) => r.toLowerCase() !== term.toLowerCase())].slice(
        0,
        8
      );
      setRecent(list);
      writeRecent(list);
    }
    update({ q: term || null });
  };

  const activeFilters = [condition, genre, tag].filter(Boolean).length;
  const total = listings.data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const filters = (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Condition</h3>
        <div className="flex flex-wrap gap-2">
          <Chip active={!condition} onClick={() => update({ condition: null })}>
            All
          </Chip>
          {LISTING_CONDITIONS.map((c) => (
            <Chip key={c} active={condition === c} onClick={() => update({ condition: c })}>
              {conditionLabel(c)}
            </Chip>
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Genre</h3>
        <div className="flex flex-wrap gap-2">
          <Chip active={!genre} onClick={() => update({ genre: null })}>
            All
          </Chip>
          {genres.map((g) => (
            <Chip key={g.id} active={genre === g.slug} onClick={() => update({ genre: g.slug })}>
              {g.name}
            </Chip>
          ))}
        </div>
      </div>
      {tags.length > 0 && (
        <div>
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <Chip
                key={t.id}
                active={tag === t.slug}
                onClick={() => update({ tag: tag === t.slug ? null : t.slug })}
              >
                #{t.name}
              </Chip>
            ))}
          </div>
        </div>
      )}
      {activeFilters > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => update({ condition: null, genre: null, tag: null })}
        >
          Reset filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(input);
        }}
        className="flex gap-2"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search by title or author"
            aria-label="Search books"
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm shadow-xs focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-light"
          />
        </div>
        <Button type="submit" size="lg">
          Search
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="relative lg:hidden"
          onClick={() => setFiltersOpen(true)}
          aria-label="Filters"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {activeFilters > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary text-[10px] text-white">
              {activeFilters}
            </span>
          )}
        </Button>
      </form>

      {!q && recent.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <History className="h-4 w-4 text-slate-400" />
          {recent.map((term) => (
            <Chip key={term} onClick={() => submit(term)}>
              {term}
            </Chip>
          ))}
          <button
            className="text-xs font-semibold text-slate-500 hover:underline"
            onClick={() => {
              setRecent([]);
              writeRecent([]);
            }}
          >
            Clear
          </button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="hidden rounded-2xl border border-slate-100 bg-white p-5 lg:block lg:self-start">
          {filters}
        </aside>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-600">
              {listings.isLoading ? (
                'Searching…'
              ) : (
                <>
                  <b className="text-slate-900">{total}</b> {total === 1 ? 'book' : 'books'}
                  {q && (
                    <>
                      {' '}
                      for “<b className="text-slate-900">{q}</b>”
                    </>
                  )}
                </>
              )}
            </p>
            <select
              value={ordering}
              onChange={(e) => update({ ordering: e.target.value })}
              aria-label="Sort by"
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm"
            >
              {ORDERINGS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {listings.isLoading ? (
            <ListingGridSkeleton />
          ) : listings.isError ? (
            <ErrorState
              message={getErrorMessage(listings.error)}
              onRetry={() => listings.refetch()}
            />
          ) : total === 0 ? (
            <EmptyState
              icon={Search}
              title="No results found"
              description="Try different keywords or remove some filters."
            />
          ) : (
            <div className={cn(listings.isPlaceholderData && 'opacity-60 transition-opacity')}>
              <ListingGrid listings={listings.data!.results} />
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => update({ page: String(page - 1) })}
              >
                Previous
              </Button>
              <span className="text-sm text-slate-600">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => update({ page: String(page + 1) })}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>

      {filtersOpen && (
        <div
          className="fixed inset-0 z-[80] bg-slate-900/40 lg:hidden"
          onClick={() => setFiltersOpen(false)}
        >
          <div
            className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-white p-5 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Filters</h2>
              <button onClick={() => setFiltersOpen(false)} aria-label="Close filters">
                <X className="h-5 w-5" />
              </button>
            </div>
            {filters}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchView />
    </Suspense>
  );
}
