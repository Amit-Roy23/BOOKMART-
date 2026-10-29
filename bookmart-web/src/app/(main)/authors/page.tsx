'use client';

/* eslint-disable @next/next/no-img-element -- author photos from external hosts */
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { IoArrowBack, IoClose, IoSearchOutline } from 'react-icons/io5';
import { useBack } from '@/components/app/screen-header';
import { Skeleton } from '@/components/ui/primitives';
import { useAuthors } from '@/hooks/use-api';
import { cn, initials } from '@/lib/utils';

/** The app's AuthorListScreen. */
export default function AuthorsPage() {
  const goBack = useBack('/');
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [tab, setTab] = useState('All');

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  const { data: authors = [], isLoading } = useAuthors(debounced);
  const tabs = useMemo(
    () => ['All', ...Array.from(new Set(authors.map((a) => a.designation).filter(Boolean))).sort()],
    [authors]
  );
  const shown = tab === 'All' ? authors : authors.filter((a) => a.designation === tab);

  return (
    <div className="mx-auto max-w-3xl">
      <header className="flex items-center justify-between gap-3 px-6 pt-5">
        <button onClick={goBack} aria-label="Go back" className="text-ink">
          <IoArrowBack size={26} />
        </button>
        {searchOpen ? (
          <div className="flex h-11 flex-1 items-center gap-2 rounded-full bg-white px-4 shadow-card">
            <IoSearchOutline size={18} className="text-muted" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search authors..."
              aria-label="Search authors"
              className="h-full flex-1 bg-transparent text-sm focus:outline-none"
            />
            <button
              onClick={() => {
                setQuery('');
                setSearchOpen(false);
              }}
              aria-label="Close search"
              className="text-muted"
            >
              <IoClose size={18} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search authors"
            className="text-ink"
          >
            <IoSearchOutline size={24} />
          </button>
        )}
      </header>

      <div className="px-6 pt-5">
        <p className="text-base text-muted">Check the</p>
        <h1 className="text-3xl font-bold text-primary">Authors</h1>
        <div className="scrollbar-hide mt-4 flex gap-5 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'font-heading shrink-0 border-b-2 pb-1 text-base font-bold',
                tab === t ? 'border-ink text-ink' : 'border-transparent text-muted'
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-5 pb-10">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
          ) : shown.length === 0 ? (
            <p className="mt-16 text-center font-medium text-muted">No authors found.</p>
          ) : (
            <ul className="grid gap-4 md:grid-cols-2">
              {shown.map((a) => (
                <li key={a.id}>
                  <Link
                    href={`/authors/${a.id}`}
                    className="flex items-center gap-4 rounded-2xl bg-white p-3 shadow-card"
                  >
                    {a.image_url ? (
                      <img
                        src={a.image_url}
                        alt={a.name}
                        className="h-20 w-20 shrink-0 rounded-2xl object-cover"
                      />
                    ) : (
                      <span className="font-heading flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-secondary text-xl font-bold text-primary">
                        {initials(a.name)}
                      </span>
                    )}
                    <span className="min-w-0">
                      <span className="font-heading block truncate text-base font-bold text-ink">
                        {a.name}
                      </span>
                      <span className="mt-1 line-clamp-2 text-xs text-muted">
                        {a.bio || a.designation || 'Author'}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
