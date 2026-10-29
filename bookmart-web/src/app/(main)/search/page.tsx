'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import {
  IoChevronDown,
  IoCloseCircle,
  IoFilter,
  IoFilterOutline,
  IoLocationOutline,
  IoSearchOutline,
  IoTimeOutline,
} from 'react-icons/io5';
import { ScreenHeader } from '@/components/app/screen-header';
import { BookCover, Button, Chip, ErrorState, Modal, Skeleton } from '@/components/ui/primitives';
import { useGenres, useListings, useTags } from '@/hooks/use-api';
import { getErrorMessage } from '@/lib/api';
import { cn, conditionLabel, formatPrice, LISTING_CONDITIONS, listingCover } from '@/lib/utils';

// Mirrors the app's SearchScreen: search bar, filter sheet, horizontal result cards.

const ORDERINGS = [
  { label: 'Default', value: '' },
  { label: 'Price: Low to High', value: 'price' },
  { label: 'Price: High to Low', value: '-price' },
  { label: 'Recently Added', value: '-created_at' },
];

const CONDITION_TEXT: Record<string, string> = {
  NEW: 'text-app-green bg-app-green-light',
  LIKE_NEW: 'text-primary bg-secondary',
  GOOD: 'text-app-blue bg-app-blue-light',
  FAIR: 'text-[#c49a00] bg-app-yellow-light',
  POOR: 'text-app-red bg-app-red-light',
};

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
    // Recent searches are only a convenience.
  }
}

function Accordion({
  title,
  active,
  children,
}: {
  title: string;
  active: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-gray-light py-3">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between"
      >
        <span
          className={cn(
            'font-heading flex items-center gap-2 text-sm font-semibold',
            active ? 'text-primary' : 'text-ink'
          )}
        >
          {title} {active && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
        </span>
        <IoChevronDown size={18} className={cn('text-muted transition', open && 'rotate-180')} />
      </button>
      {open && <div className="mt-3 flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

function SearchView() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const q = params.get('q') ?? '';
  const condition = params.get('condition') ?? '';
  const genre = params.get('genre') ?? '';
  const tag = params.get('tag') ?? '';
  const ordering = params.get('ordering') ?? '';
  const page = Number(params.get('page') ?? '1');
  const [input, setInput] = useState(q);
  const [recent, setRecent] = useState<string[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
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

  const hasFilters = !!(condition || genre || tag || ordering);
  const listings = useListings(
    {
      search: q || undefined,
      condition: condition || undefined,
      genre: genre || undefined,
      tag: tag || undefined,
      ordering: ordering || undefined,
      status: 'AVAILABLE',
      page,
      page_size: PAGE_SIZE,
    },
    !!q || hasFilters
  );

  const update = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    if (!('page' in changes)) next.delete('page');
    router.replace(`${pathname}?${next.toString()}`);
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

  const results = listings.data?.results ?? [];
  const totalPages = Math.max(1, Math.ceil((listings.data?.count ?? 0) / PAGE_SIZE));
  const searching = !!q || hasFilters;

  return (
    <div className="mx-auto max-w-3xl">
      <ScreenHeader title="Search" />
      <div className="space-y-5 px-6">
        <div className="flex items-center gap-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(input);
            }}
            className="flex h-12 flex-1 items-center gap-2.5 rounded-3xl bg-white px-4 shadow-search"
          >
            <IoSearchOutline size={20} className="shrink-0 text-muted" />
            <input
              type="search"
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search Books..."
              aria-label="Search books"
              className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-text placeholder:text-muted focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {input && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  setInput('');
                  update({ q: null });
                }}
                className="text-muted"
              >
                <IoCloseCircle size={20} />
              </button>
            )}
          </form>
          <button
            onClick={() => setSheetOpen(true)}
            aria-label="Filters"
            className={cn(
              'relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow-search',
              hasFilters ? 'bg-primary text-white' : 'bg-white text-primary'
            )}
          >
            {hasFilters ? <IoFilter size={20} /> : <IoFilterOutline size={20} />}
            {hasFilters && (
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-app-red" />
            )}
          </button>
        </div>

        {!searching ? (
          recent.length > 0 && (
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-[15px] font-bold text-ink">Recent Searches</h2>
                <button
                  onClick={() => {
                    setRecent([]);
                    writeRecent([]);
                  }}
                  className="font-heading text-xs font-bold text-primary"
                >
                  Clear All
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recent.map((term) => (
                  <button
                    key={term}
                    onClick={() => submit(term)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-text shadow-card"
                  >
                    <IoTimeOutline size={14} className="text-muted" /> {term}
                  </button>
                ))}
              </div>
            </section>
          )
        ) : listings.isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[118px]" />
            ))}
          </div>
        ) : listings.isError ? (
          <ErrorState
            message={getErrorMessage(listings.error)}
            onRetry={() => listings.refetch()}
          />
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center pt-16 text-center">
            <IoSearchOutline size={48} className="text-muted" />
            <h2 className="mt-3 text-lg font-bold text-ink">No Results Found</h2>
            <p className="mt-1 text-sm text-muted">Try adjusting your search terms or filters.</p>
          </div>
        ) : (
          <ul className={cn('space-y-3', listings.isPlaceholderData && 'opacity-60')}>
            {results.map((l) => (
              <li key={l.id}>
                <Link
                  href={`/listings/${l.id}`}
                  className="flex gap-4 rounded-2xl bg-white p-2.5 shadow-card"
                >
                  <span className="h-[96px] w-[70px] shrink-0 overflow-hidden rounded-xl bg-app-bg">
                    <BookCover src={listingCover(l)} alt={l.book.title} />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col justify-between py-1">
                    <span>
                      <span className="font-heading block truncate text-base font-bold text-ink">
                        {l.book.title}
                      </span>
                      <span className="mt-1 flex flex-wrap gap-1.5">
                        {l.book.authors.map((a) => (
                          <span
                            key={a.id}
                            className="truncate rounded-md bg-secondary px-2 py-0.5 text-[11px] font-semibold text-primary"
                          >
                            {a.name}
                          </span>
                        ))}
                      </span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="font-heading text-lg font-bold text-ink">
                        {formatPrice(l.price)}
                      </span>
                      <span
                        className={cn(
                          'rounded px-1.5 py-0.5 text-[10px] font-bold',
                          CONDITION_TEXT[l.condition]
                        )}
                      >
                        {l.condition}
                      </span>
                      {l.distance_km != null && (
                        <span className="inline-flex items-center gap-0.5 text-[11px] text-muted">
                          <IoLocationOutline size={12} /> {l.distance_km.toFixed(1)} km
                        </span>
                      )}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {searching && totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pb-4">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => update({ page: String(page - 1) })}
            >
              Previous
            </Button>
            <span className="text-sm text-muted">
              {page} / {totalPages}
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

      <Modal open={sheetOpen} onClose={() => setSheetOpen(false)} title="Filters & Sort">
        {hasFilters && (
          <button
            onClick={() => update({ condition: null, genre: null, tag: null, ordering: null })}
            className="font-heading absolute right-6 top-6 text-sm font-semibold text-app-red"
          >
            Reset All
          </button>
        )}
        <Accordion title="Condition" active={!!condition}>
          <Chip active={!condition} onClick={() => update({ condition: null })}>
            All Conditions
          </Chip>
          {LISTING_CONDITIONS.map((c) => (
            <Chip key={c} active={condition === c} onClick={() => update({ condition: c })}>
              {conditionLabel(c)}
            </Chip>
          ))}
        </Accordion>
        <Accordion title="Sort By" active={!!ordering}>
          {ORDERINGS.map((o) => (
            <Chip
              key={o.label}
              active={ordering === o.value}
              onClick={() => update({ ordering: o.value || null })}
            >
              {o.label}
            </Chip>
          ))}
        </Accordion>
        <Accordion title="Category" active={!!genre}>
          <Chip active={!genre} onClick={() => update({ genre: null })}>
            All
          </Chip>
          {genres.map((g) => (
            <Chip key={g.id} active={genre === g.slug} onClick={() => update({ genre: g.slug })}>
              {g.name}
            </Chip>
          ))}
        </Accordion>
        {tags.length > 0 && (
          <Accordion title="Tags" active={!!tag}>
            {tags.map((t) => (
              <Chip
                key={t.id}
                active={tag === t.slug}
                onClick={() => update({ tag: tag === t.slug ? null : t.slug })}
              >
                #{t.name}
              </Chip>
            ))}
          </Accordion>
        )}
        <Button className="mt-5 w-full" onClick={() => setSheetOpen(false)}>
          Show Results
        </Button>
      </Modal>
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
