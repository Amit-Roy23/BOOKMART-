'use client';

import {
  BookOpen,
  CheckCircle2,
  Eye,
  Heart,
  MoreHorizontal,
  Pencil,
  Plus,
  Rocket,
  Search,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BookCover,
  Button,
  Chip,
  ConditionBadge,
  EmptyState,
  ErrorState,
  PageHeader,
  Skeleton,
} from '@/components/ui/primitives';
import { useDeleteListing, useMyListings, useUpdateListingStatus } from '@/hooks/use-api';
import { getErrorMessage } from '@/lib/api';
import { cn, formatDate, formatPrice, listingAuthors, listingCover } from '@/lib/utils';
import { useToast } from '@/providers/toast-provider';
import type { Listing } from '@/types/api';

const FILTERS = ['All', 'Active', 'Sold'] as const;
const SORTS = {
  newest: 'Newest',
  price_asc: 'Price: low to high',
  price_desc: 'Price: high to low',
  liked: 'Most liked',
  viewed: 'Most viewed',
} as const;

function RowMenu({ listing }: { listing: Listing }) {
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
  const boosted = listing.is_boosted;

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen((v) => !v)}
        aria-label="More actions"
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>
      {open && (
        <div className="absolute right-0 z-20 mt-1 w-48 overflow-hidden rounded-xl border border-slate-100 bg-white py-1 shadow-lg">
          <button
            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-slate-50"
            onClick={() => {
              setOpen(false);
              updateStatus.mutate(
                { id: listing.id, status: sold ? 'AVAILABLE' : 'SOLD' },
                {
                  onSuccess: () =>
                    toast.success(sold ? 'Listing is available again' : 'Marked as sold'),
                  onError: (err) => toast.error(getErrorMessage(err)),
                }
              );
            }}
          >
            <CheckCircle2 className="h-4 w-4 text-slate-400" />{' '}
            {sold ? 'Mark as available' : 'Mark as sold'}
          </button>
          {!sold && !boosted && (
            <Link
              href={`/dashboard/boost?listing=${listing.id}`}
              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50"
            >
              <Rocket className="h-4 w-4 text-slate-400" /> Boost listing
            </Link>
          )}
          <button
            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
            onClick={() => {
              setOpen(false);
              if (!confirm(`Delete “${listing.book.title}”? This cannot be undone.`)) return;
              deleteListing.mutate(listing.id, {
                onSuccess: () => toast.success('Listing deleted'),
                onError: (err) => toast.error(getErrorMessage(err)),
              });
            }}
          >
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default function ManageListingsPage() {
  const { data: listings = [], isLoading, isError, error, refetch } = useMyListings();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');
  const [sort, setSort] = useState<keyof typeof SORTS>('newest');
  const [query, setQuery] = useState('');

  const stats = useMemo(
    () => ({
      total: listings.length,
      active: listings.filter((l) => l.status === 'AVAILABLE').length,
      views: listings.reduce((s, l) => s + l.views_count, 0),
      likes: listings.reduce((s, l) => s + l.favorite_count, 0),
    }),
    [listings]
  );

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = listings.filter((l) => {
      if (filter === 'Active' && l.status !== 'AVAILABLE') return false;
      if (filter === 'Sold' && l.status !== 'SOLD') return false;
      if (!q) return true;
      return l.book.title.toLowerCase().includes(q) || listingAuthors(l).toLowerCase().includes(q);
    });
    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'price_asc':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price_desc':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'liked':
          return b.favorite_count - a.favorite_count;
        case 'viewed':
          return b.views_count - a.views_count;
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
    return list;
  }, [listings, filter, sort, query]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage listings"
        description="Edit, mark as sold, boost or delete the books you’ve listed."
        action={
          <Link href="/sell">
            <Button>
              <Plus className="h-4 w-4" /> New listing
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: 'Total listings', value: stats.total, icon: BookOpen },
          { label: 'Active', value: stats.active, icon: CheckCircle2 },
          { label: 'Total views', value: stats.views, icon: Eye },
          { label: 'Interested', value: stats.likes, icon: Heart },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-slate-100 bg-white p-4">
            <Icon className="h-5 w-5 text-brand-primary" />
            <p className="mt-2 text-2xl font-extrabold text-slate-900">{isLoading ? '–' : value}</p>
            <p className="text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your listings"
            aria-label="Search your listings"
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm focus:border-brand-primary focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>
              {f}
            </Chip>
          ))}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as keyof typeof SORTS)}
          aria-label="Sort listings"
          className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm"
        >
          {Object.entries(SORTS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
      ) : listings.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No listings yet"
          description="You haven’t listed any books for sale. List one to reach buyers instantly."
          action={
            <Link href="/sell">
              <Button>
                <Plus className="h-4 w-4" /> Create listing
              </Button>
            </Link>
          }
        />
      ) : shown.length === 0 ? (
        <EmptyState icon={Search} title="No listings match your filters" />
      ) : (
        <ul className="space-y-3">
          {shown.map((listing) => (
            <li
              key={listing.id}
              className={cn(
                'flex gap-4 rounded-2xl border border-slate-100 bg-white p-3 md:p-4',
                listing.status === 'SOLD' && 'opacity-75'
              )}
            >
              <Link
                href={`/listings/${listing.id}`}
                className="h-28 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100"
              >
                <BookCover src={listingCover(listing)} alt={listing.book.title} />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link
                      href={`/listings/${listing.id}`}
                      className="line-clamp-1 font-bold text-slate-900 hover:text-brand-primary"
                    >
                      {listing.book.title}
                    </Link>
                    <p className="line-clamp-1 text-xs text-slate-500">
                      by {listingAuthors(listing)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold',
                      listing.status === 'AVAILABLE' && 'bg-emerald-50 text-emerald-700',
                      listing.status === 'SOLD' && 'bg-slate-100 text-slate-500',
                      listing.status === 'PENDING' && 'bg-amber-50 text-amber-700'
                    )}
                  >
                    {listing.status === 'AVAILABLE'
                      ? 'Active'
                      : listing.status === 'SOLD'
                        ? 'Sold'
                        : 'Pending'}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="font-extrabold text-brand-dark">
                    {formatPrice(listing.price)}
                  </span>
                  <ConditionBadge condition={listing.condition} />
                  {listing.is_boosted && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                      <Rocket className="h-3 w-3" /> Boosted
                      {listing.boost_expires_at &&
                        ` until ${formatDate(listing.boost_expires_at, { year: undefined })}`}
                    </span>
                  )}
                </div>
                <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                  <div className="flex gap-3 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" /> {listing.views_count}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Heart className="h-3.5 w-3.5" /> {listing.favorite_count}
                    </span>
                    <span className="hidden sm:inline">
                      Listed {formatDate(listing.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Link href={`/sell?edit=${listing.id}`}>
                      <Button variant="outline" size="sm">
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </Button>
                    </Link>
                    <RowMenu listing={listing} />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {listings.length > 0 && (
        <div className="flex flex-col items-start gap-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 p-5 sm:flex-row sm:items-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
            <Rocket className="h-6 w-6 text-amber-600" />
          </span>
          <div className="flex-1">
            <p className="font-bold text-slate-900">Boost your listing</p>
            <p className="text-sm text-slate-600">
              Get featured at the top of the feed and reach more buyers.
            </p>
          </div>
          <Link href="/dashboard/boost">
            <Button className="bg-amber-500 hover:bg-amber-600">Boost now</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
