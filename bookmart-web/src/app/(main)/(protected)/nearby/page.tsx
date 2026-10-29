'use client';

import { LayoutGrid, LocateFixed, Map as MapIcon, MapPin, Search } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ListingGrid, ListingGridSkeleton } from '@/components/listing/listing-card';
import {
  BookCover,
  Button,
  Chip,
  EmptyState,
  ErrorState,
  PageHeader,
  Skeleton,
} from '@/components/ui/primitives';
import { useGenres, useNearbyListings } from '@/hooks/use-api';
import { useGeolocation } from '@/hooks/use-geolocation';
import { getErrorMessage } from '@/lib/api';
import { cn, conditionLabel, formatPrice, LISTING_CONDITIONS, listingCover } from '@/lib/utils';

const NearbyMap = dynamic(() => import('@/components/nearby/nearby-map'), {
  ssr: false,
  loading: () => <Skeleton className="h-full min-h-[420px] w-full" />,
});

// Same fallback the app uses when location is unavailable.
const DEFAULT_CENTER = { lat: 22.8943, lng: 88.4239 };
const RADII = [2, 5, 10, 25, 50, 100];

export default function NearbyPage() {
  const { coords, status, locate } = useGeolocation();
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [view, setView] = useState<'map' | 'grid'>('map');
  const [radius, setRadius] = useState(10);
  const [genre, setGenre] = useState('');
  const [condition, setCondition] = useState('');
  const [ordering, setOrdering] = useState('distance');
  const [maxPrice, setMaxPrice] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const { data: genres = [] } = useGenres();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- follow the browser location once it arrives
    if (coords) setCenter(coords);
    else if (status === 'denied' || status === 'unsupported') setCenter((c) => c ?? DEFAULT_CENTER);
  }, [coords, status]);

  const nearby = useNearbyListings(
    center
      ? {
          lat: center.lat,
          lng: center.lng,
          radius,
          genre: genre || undefined,
          condition: condition || undefined,
          max_price: maxPrice ? Number(maxPrice) : undefined,
          search: search || undefined,
          ordering,
          page_size: 100,
        }
      : null
  );
  const listings = nearby.data?.results ?? [];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Books near you"
        description={
          center
            ? `${nearby.data?.count ?? 0} books within ${radius} km${status !== 'granted' ? ' of the selected area' : ''}`
            : 'Finding your location…'
        }
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={locate} loading={status === 'locating'}>
              <LocateFixed className="h-4 w-4" /> My location
            </Button>
            <div className="flex rounded-xl border border-slate-200 bg-white p-0.5">
              {(['map', 'grid'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  aria-pressed={view === v}
                  className={cn(
                    'flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold',
                    view === v ? 'bg-brand-primary text-white' : 'text-slate-600'
                  )}
                >
                  {v === 'map' ? (
                    <MapIcon className="h-3.5 w-3.5" />
                  ) : (
                    <LayoutGrid className="h-3.5 w-3.5" />
                  )}
                  {v === 'map' ? 'Map' : 'List'}
                </button>
              ))}
            </div>
          </div>
        }
      />

      {(status === 'denied' || status === 'unsupported') && (
        <p className="flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <MapPin className="h-4 w-4 shrink-0" />
          Location access is off, so we’re showing a default area. Click anywhere on the map to
          search there.
        </p>
      )}

      <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-4">
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setSearch(searchInput.trim());
          }}
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Title or author"
              aria-label="Search nearby books"
              className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm focus:border-brand-primary focus:outline-none"
            />
          </div>
          <Button size="sm" type="submit" className="h-10">
            Search
          </Button>
        </form>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Radius</span>
          {RADII.map((r) => (
            <Chip key={r} active={radius === r} onClick={() => setRadius(r)}>
              {r} km
            </Chip>
          ))}
        </div>
        <div className="grid gap-2 sm:grid-cols-4">
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            aria-label="Genre"
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm"
          >
            <option value="">All genres</option>
            {genres.map((g) => (
              <option key={g.id} value={g.slug}>
                {g.name}
              </option>
            ))}
          </select>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            aria-label="Condition"
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm"
          >
            <option value="">Any condition</option>
            {LISTING_CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {conditionLabel(c)}
              </option>
            ))}
          </select>
          <input
            type="number"
            min={0}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max price (₹)"
            aria-label="Maximum price"
            className="h-10 rounded-xl border border-slate-200 px-3 text-sm"
          />
          <select
            value={ordering}
            onChange={(e) => setOrdering(e.target.value)}
            aria-label="Sort by"
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm"
          >
            <option value="distance">Nearest first</option>
            <option value="price">Price: low to high</option>
            <option value="-price">Price: high to low</option>
            <option value="-created_at">Newest first</option>
          </select>
        </div>
      </div>

      {nearby.isError && (
        <ErrorState message={getErrorMessage(nearby.error)} onRetry={() => nearby.refetch()} />
      )}

      {view === 'map' ? (
        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="h-[60vh] min-h-[420px] overflow-hidden rounded-2xl border border-slate-100">
            {center ? (
              <NearbyMap
                center={center}
                radiusKm={radius}
                listings={listings}
                onCenterChange={(lat, lng) => setCenter({ lat, lng })}
              />
            ) : (
              <Skeleton className="h-full w-full" />
            )}
          </div>
          <div className="max-h-[60vh] space-y-2 overflow-y-auto">
            {listings.length === 0 && !nearby.isLoading && (
              <EmptyState
                icon={MapPin}
                title="No books in this area"
                description="Try a bigger radius."
              />
            )}
            {listings.map((l) => (
              <Link
                key={l.id}
                href={`/listings/${l.id}`}
                className="flex gap-3 rounded-xl border border-slate-100 bg-white p-2 transition hover:border-brand-border"
              >
                <div className="h-20 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  <BookCover src={listingCover(l)} alt={l.book.title} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-900">{l.book.title}</p>
                  <p className="truncate text-xs text-slate-500">{l.seller.full_name}</p>
                  <p className="mt-1 text-sm font-extrabold text-brand-dark">
                    {formatPrice(l.price)}
                  </p>
                  {l.distance_km != null && (
                    <p className="text-xs text-slate-400">{l.distance_km.toFixed(1)} km away</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : nearby.isLoading || !center ? (
        <ListingGridSkeleton />
      ) : listings.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No books in this area"
          description="Try a bigger radius or other filters."
        />
      ) : (
        <ListingGrid listings={listings} />
      )}
    </div>
  );
}
