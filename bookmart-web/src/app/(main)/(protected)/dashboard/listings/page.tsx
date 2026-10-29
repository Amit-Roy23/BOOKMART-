'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  IoAdd,
  IoBookOutline,
  IoCheckmark,
  IoCheckmarkCircleOutline,
  IoCreateOutline,
  IoEllipsisHorizontal,
  IoEyeOutline,
  IoFilterOutline,
  IoHeart,
  IoHeartOutline,
  IoRocketOutline,
  IoSearchOutline,
  IoTrashOutline,
} from 'react-icons/io5';
import { ScreenHeader } from '@/components/app/screen-header';
import {
  BookCover,
  Button,
  Chip,
  EmptyState,
  ErrorState,
  Skeleton,
} from '@/components/ui/primitives';
import { useDeleteListing, useMyListings, useUpdateListingStatus } from '@/hooks/use-api';
import { getErrorMessage } from '@/lib/api';
import {
  cn,
  conditionLabel,
  formatDate,
  formatPrice,
  listingAuthors,
  listingCover,
} from '@/lib/utils';
import { useToast } from '@/providers/toast-provider';
import type { Listing } from '@/types/api';

// Combines the app's ManageListings (cards, filters, sort) and MyActiveListings (stats, actions).

const FILTERS = ['All', 'Active', 'Sold'] as const;
const SORTS = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Most Liked'] as const;

function MoreMenu({ listing }: { listing: Listing }) {
  const toast = useToast();
  const updateStatus = useUpdateListingStatus();
  const deleteListing = useDeleteListing();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const sold = listing.status === 'SOLD';
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="font-heading inline-flex items-center gap-1 rounded-lg border border-gray-heavy/70 px-2.5 py-1 text-[11px] font-semibold text-primary"
      >
        <IoEllipsisHorizontal size={14} /> More
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-1 w-52 overflow-hidden rounded-2xl bg-white py-1 shadow-float">
          <button
            className="flex w-full items-center gap-2.5 px-4 py-3 text-left text-sm text-text hover:bg-app-bg"
            onClick={() => {
              setOpen(false);
              updateStatus.mutate(
                { id: listing.id, status: sold ? 'AVAILABLE' : 'SOLD' },
                {
                  onSuccess: () => toast.success(sold ? 'Marked as available' : 'Marked as sold'),
                  onError: (err) => toast.error(getErrorMessage(err)),
                }
              );
            }}
          >
            <IoCheckmarkCircleOutline size={18} /> {sold ? 'Mark as Available' : 'Mark as Sold'}
          </button>
          {!sold && !listing.is_boosted && (
            <Link
              href={`/dashboard/boost?listing=${listing.id}`}
              className="flex items-center gap-2.5 px-4 py-3 text-sm text-text hover:bg-app-bg"
            >
              <IoRocketOutline size={18} /> Boost Listing
            </Link>
          )}
          <button
            className="flex w-full items-center gap-2.5 px-4 py-3 text-left text-sm text-app-red hover:bg-app-red-light"
            onClick={() => {
              setOpen(false);
              if (!confirm('Are you sure you want to delete this listing?')) return;
              deleteListing.mutate(listing.id, {
                onSuccess: () => toast.success('Listing deleted'),
                onError: (err) => toast.error(getErrorMessage(err)),
              });
            }}
          >
            <IoTrashOutline size={18} /> Delete Listing
          </button>
        </div>
      )}
    </div>
  );
}

export default function ManageListingsPage() {
  const { data: listings = [], isLoading, isError, error, refetch } = useMyListings();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');
  const [sort, setSort] = useState<(typeof SORTS)[number]>('Newest');
  const [sortOpen, setSortOpen] = useState(false);
  const [query, setQuery] = useState('');

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = listings.filter((l) => {
      if (filter === 'Active' && l.status !== 'AVAILABLE') return false;
      if (filter === 'Sold' && l.status !== 'SOLD') return false;
      return (
        !q || l.book.title.toLowerCase().includes(q) || listingAuthors(l).toLowerCase().includes(q)
      );
    });
    return [...list].sort((a, b) => {
      if (sort === 'Price: Low to High') return parseFloat(a.price) - parseFloat(b.price);
      if (sort === 'Price: High to Low') return parseFloat(b.price) - parseFloat(a.price);
      if (sort === 'Most Liked') return b.favorite_count - a.favorite_count;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [listings, filter, sort, query]);

  const stats = [
    { label: 'Total Listings', value: listings.length, icon: IoBookOutline },
    {
      label: 'Total Views',
      value: listings.reduce((s, l) => s + l.views_count, 0),
      icon: IoEyeOutline,
    },
    {
      label: 'Interested',
      value: listings.reduce((s, l) => s + l.favorite_count, 0),
      icon: IoHeartOutline,
    },
  ];

  return (
    <>
      <ScreenHeader title="Manage Listings" fallback="/profile" />
      <div className="space-y-4 px-6">
        <div className="grid grid-cols-3 gap-3">
          {stats.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="flex flex-col items-center rounded-2xl bg-white py-3 shadow-card"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-primary">
                <Icon size={18} />
              </span>
              <span className="mt-1 text-[10px] text-muted">{label}</span>
              <span className="font-heading text-lg font-bold text-primary">
                {isLoading ? '–' : value}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex h-11 flex-1 items-center gap-2 rounded-xl bg-white px-3 shadow-card">
            <IoSearchOutline size={18} className="text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or author..."
              aria-label="Search your listings"
              className="h-full flex-1 bg-transparent text-sm focus:outline-none"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setSortOpen((v) => !v)}
              aria-label="Sort listings"
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary"
            >
              <IoFilterOutline size={20} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 z-20 mt-1 w-52 overflow-hidden rounded-2xl bg-white py-1 shadow-float">
                {SORTS.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSort(s);
                      setSortOpen(false);
                    }}
                    className={cn(
                      'flex w-full items-center justify-between px-4 py-2.5 text-left text-sm',
                      sort === s
                        ? 'bg-secondary font-semibold text-primary'
                        : 'text-text hover:bg-app-bg'
                    )}
                  >
                    {s} {sort === s && <IoCheckmark size={16} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>
              {f}
            </Chip>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
        ) : shown.length === 0 ? (
          <EmptyState
            icon={IoBookOutline}
            title="No Listings Yet"
            description="You haven't listed any pre-owned books for sale. List books to get buyers instantly."
            action={
              <Link href="/sell">
                <Button size="md">
                  <IoAdd size={20} /> Create Listing
                </Button>
              </Link>
            }
          />
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {shown.map((l) => (
              <li key={l.id} className="flex gap-3 rounded-2xl bg-white p-2.5 shadow-card">
                <Link
                  href={`/listings/${l.id}`}
                  className="h-[110px] w-20 shrink-0 overflow-hidden rounded-xl bg-app-bg"
                >
                  <BookCover src={listingCover(l)} alt={l.book.title} />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col py-1">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/listings/${l.id}`}
                      className="font-heading truncate text-[15px] font-bold text-ink"
                    >
                      {l.book.title}
                    </Link>
                    <span
                      className={cn(
                        'shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold',
                        l.status === 'AVAILABLE'
                          ? 'bg-app-green-light text-app-green'
                          : 'bg-black/5 text-muted'
                      )}
                    >
                      {l.status === 'AVAILABLE'
                        ? 'Active'
                        : l.status === 'SOLD'
                          ? 'Sold'
                          : 'Pending'}
                    </span>
                  </div>
                  <p className="truncate text-xs font-medium text-muted">by {listingAuthors(l)}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="font-heading text-[17px] font-bold text-ink">
                      {formatPrice(l.price)}
                    </span>
                    <span className="rounded-md border border-gray-heavy/60 px-1.5 py-0.5 text-[10px] font-semibold text-muted">
                      {conditionLabel(l.condition)}
                    </span>
                    {l.is_boosted && (
                      <span className="inline-flex items-center gap-0.5 rounded-md bg-app-green px-1.5 py-0.5 text-[10px] font-bold text-white">
                        <IoRocketOutline size={10} /> Boosted
                      </span>
                    )}
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                    <span className="flex items-center gap-3 text-xs text-ink">
                      <span className="inline-flex items-center gap-1 font-semibold">
                        <IoHeart size={13} className="text-app-red" /> {l.favorite_count} Likes
                      </span>
                      <span className="hidden text-muted sm:inline">
                        <IoEyeOutline size={13} className="mr-0.5 inline" />
                        {l.views_count}
                      </span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Link
                        href={`/sell?edit=${l.id}`}
                        className="font-heading inline-flex items-center gap-1 rounded-lg border border-gray-heavy/70 px-2.5 py-1 text-[11px] font-semibold text-primary"
                      >
                        <IoCreateOutline size={13} /> Edit
                      </Link>
                      <MoreMenu listing={l} />
                    </span>
                  </div>
                  <p className="mt-1 text-right text-[10px] text-muted">
                    Listed {formatDate(l.created_at, { year: undefined })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {listings.length > 0 && (
          <div className="flex items-center gap-3 rounded-2xl bg-secondary p-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-primary">
              <IoRocketOutline size={26} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-heading flex items-center gap-1.5 text-sm font-bold text-ink">
                Boost Your Listing
                <span className="rounded bg-app-yellow px-1 py-px text-[9px] font-bold">PRO</span>
              </p>
              <p className="text-xs text-muted">Get 3x more visibility and reach more buyers.</p>
            </div>
            <Link
              href="/dashboard/boost"
              className="font-heading shrink-0 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white"
            >
              Boost Now
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
