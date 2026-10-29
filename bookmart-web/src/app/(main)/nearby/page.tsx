'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  IoArrowBack,
  IoGrid,
  IoLocationOutline,
  IoMap,
  IoOptionsOutline,
  IoSearchOutline,
} from 'react-icons/io5';
import { useBack } from '@/components/app/screen-header';
import { HeartButton } from '@/components/book/heart-button';
import {
  BookCover,
  Chip,
  EmptyState,
  ErrorState,
  Modal,
  Skeleton,
} from '@/components/ui/primitives';
import { useGenres, useNearbyListings } from '@/hooks/use-api';
import { useGeolocation } from '@/hooks/use-geolocation';
import { getErrorMessage } from '@/lib/api';
import { cn, conditionLabel, formatPrice, LISTING_CONDITIONS, listingCover } from '@/lib/utils';

// Mirrors the app's NearestBooksScreen (grid) and NearestBooksMapScreen (map + list).

const NearbyMap = dynamic(() => import('@/components/nearby/nearby-map'), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full rounded-none" />,
});

const DEFAULT_CENTER = { lat: 22.8943, lng: 88.4239 }; // the app's fallback location
const RADII = [2, 5, 10, 25, 50];

export default function NearbyPage() {
  const goBack = useBack('/');
  const { coords, status, locate } = useGeolocation();
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [view, setView] = useState<'grid' | 'map'>('grid');
  const [radius, setRadius] = useState(10);
  const [genre, setGenre] = useState('');
  const [condition, setCondition] = useState('');
  const [ordering, setOrdering] = useState('distance');
  const [maxPrice, setMaxPrice] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { data: genres = [] } = useGenres();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- follow the browser location once known
    if (coords) setCenter(coords);
    else if (status === 'denied' || status === 'unsupported') setCenter((c) => c ?? DEFAULT_CENTER);
  }, [coords, status]);

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

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
  const distance = (km?: number) =>
    km == null ? 'Nearby' : km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)} km`;

  const topBar = (
    <div className="flex items-center gap-3 px-6 pt-5">
      <button onClick={goBack} aria-label="Go back" className="text-ink">
        <IoArrowBack size={26} />
      </button>
      <div className="flex h-12 flex-1 items-center gap-2 rounded-full border border-gray-heavy/70 bg-white px-4">
        <IoSearchOutline size={18} className="text-ink" />
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search books..."
          aria-label="Search nearby books"
          className="h-full flex-1 bg-transparent text-sm focus:outline-none"
        />
      </div>
      <button onClick={() => setFiltersOpen(true)} aria-label="Filters" className="text-primary">
        <IoOptionsOutline size={28} />
      </button>
    </div>
  );

  const chips = (
    <div className="scrollbar-hide flex items-center gap-2 overflow-x-auto px-6 py-4">
      <button
        onClick={() => setView((v) => (v === 'grid' ? 'map' : 'grid'))}
        aria-label={view === 'grid' ? 'Show map' : 'Show grid'}
        className="flex h-10 w-[70px] shrink-0 items-center justify-center rounded-full border border-gray-heavy/70 bg-white text-primary"
      >
        {view === 'grid' ? <IoMap size={20} /> : <IoGrid size={18} />}
      </button>
      <Chip
        active={ordering === 'distance' && radius === 10}
        onClick={() => {
          setOrdering('distance');
          setRadius(10);
        }}
      >
        Nearest To You
      </Chip>
      {RADII.filter((r) => r !== 10).map((r) => (
        <Chip key={r} active={radius === r} onClick={() => setRadius(r)}>
          &lt; {r} km
        </Chip>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-white md:bg-app-bg">
      {topBar}
      {chips}

      {(status === 'denied' || status === 'unsupported') && (
        <div className="mx-6 mb-4 flex items-center gap-2 rounded-2xl bg-app-yellow-light px-4 py-3 text-xs text-text">
          <IoLocationOutline size={16} className="shrink-0 text-[#c49a00]" />
          <span className="flex-1">Location is off, so we&apos;re showing a default area.</span>
          <button onClick={locate} className="font-heading font-bold text-primary">
            Enable
          </button>
        </div>
      )}

      {nearby.isError && (
        <div className="px-6">
          <ErrorState message={getErrorMessage(nearby.error)} onRetry={() => nearby.refetch()} />
        </div>
      )}

      {view === 'map' ? (
        <div className="md:grid md:grid-cols-[1fr_380px] md:gap-4 md:px-6">
          <div className="h-[55vh] overflow-hidden md:rounded-3xl">
            {center ? (
              <NearbyMap
                center={center}
                radiusKm={radius}
                listings={listings}
                onCenterChange={(lat, lng) => setCenter({ lat, lng })}
              />
            ) : (
              <Skeleton className="h-full w-full rounded-none" />
            )}
          </div>
          <div className="-mt-6 rounded-t-3xl bg-white px-6 pb-8 pt-3 shadow-float md:mt-0 md:max-h-[55vh] md:overflow-y-auto md:rounded-3xl md:pt-4">
            <span className="mx-auto mb-4 block h-1 w-10 rounded-full bg-gray-heavy md:hidden" />
            {listings.length === 0 && !nearby.isLoading ? (
              <p className="py-8 text-center text-sm text-muted">
                No books in this area. Try a bigger radius.
              </p>
            ) : (
              <ul className="space-y-3">
                {listings.map((l) => (
                  <li key={l.id}>
                    <Link
                      href={`/listings/${l.id}`}
                      className="flex gap-4 rounded-2xl bg-white p-2.5 shadow-card"
                    >
                      <span className="h-[90px] w-[70px] shrink-0 overflow-hidden rounded-xl bg-app-bg">
                        <BookCover src={listingCover(l)} alt={l.book.title} />
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col justify-between py-1">
                        <span>
                          <span className="font-heading block truncate text-base font-semibold text-ink">
                            {l.book.title}
                          </span>
                          <span className="block text-xs text-muted">
                            {l.book.genres[0] ?? 'General'}
                          </span>
                        </span>
                        <span className="flex items-center justify-between">
                          <span className="font-heading text-lg font-bold text-primary">
                            {formatPrice(l.price)}
                          </span>
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-app-bg px-2 py-0.5 text-[11px] font-semibold text-ink">
                            <IoLocationOutline size={12} className="text-primary" />{' '}
                            {distance(l.distance_km)}
                          </span>
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : nearby.isLoading || !center ? (
        <div className="grid grid-cols-2 gap-4 px-6 md:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-60" />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <EmptyState
          icon={IoLocationOutline}
          title="No books nearby"
          description="Try a bigger radius or different filters."
        />
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 px-6 pb-10 md:grid-cols-4 lg:grid-cols-5">
          {listings.map((l) => (
            <Link
              key={l.id}
              href={`/listings/${l.id}`}
              className="relative rounded-2xl bg-white p-2 pb-6 shadow-card"
            >
              <div className="h-[150px] overflow-hidden rounded-xl bg-app-bg md:h-[190px]">
                <BookCover src={listingCover(l)} alt={l.book.title} />
              </div>
              <p className="mt-3 truncate text-center text-sm font-medium text-ink">
                {l.book.title}
              </p>
              <div className="mt-1 flex items-center justify-between px-1 text-sm">
                <span className="font-semibold text-primary">{distance(l.distance_km)}</span>
                <span className="font-semibold text-primary">{formatPrice(l.price)}</span>
              </div>
              <span className="absolute -bottom-4 left-1/2 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border-[3px] border-white bg-primary shadow-md [&_svg]:!text-white">
                <HeartButton listingId={l.id} sellerId={l.seller.id} size={18} />
              </span>
            </Link>
          ))}
        </div>
      )}

      <Modal open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filters">
        <div className="space-y-5">
          <div>
            <p className="font-heading mb-2 text-sm font-semibold text-ink">Category</p>
            <div className="flex flex-wrap gap-2">
              <Chip active={!genre} onClick={() => setGenre('')}>
                All
              </Chip>
              {genres.map((g) => (
                <Chip key={g.id} active={genre === g.slug} onClick={() => setGenre(g.slug)}>
                  {g.name}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <p className="font-heading mb-2 text-sm font-semibold text-ink">Condition</p>
            <div className="flex flex-wrap gap-2">
              <Chip active={!condition} onClick={() => setCondition('')}>
                Any
              </Chip>
              {LISTING_CONDITIONS.map((c) => (
                <Chip key={c} active={condition === c} onClick={() => setCondition(c)}>
                  {conditionLabel(c)}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <p className="font-heading mb-2 text-sm font-semibold text-ink">Sort</p>
            <div className="flex flex-wrap gap-2">
              {[
                ['distance', 'Nearest'],
                ['price', 'Price: Low to High'],
                ['-price', 'Price: High to Low'],
                ['-created_at', 'Newest'],
              ].map(([value, label]) => (
                <Chip key={value} active={ordering === value} onClick={() => setOrdering(value)}>
                  {label}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <p className="font-heading mb-2 text-sm font-semibold text-ink">Max Price (₹)</p>
            <input
              type="number"
              min={0}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Any"
              aria-label="Maximum price"
              className={cn(
                'h-12 w-full rounded-2xl border border-gray-heavy px-4 text-sm focus:border-primary focus:outline-none'
              )}
            />
          </div>
          <button
            onClick={() => setFiltersOpen(false)}
            className="font-heading h-14 w-full rounded-full bg-primary text-base font-semibold text-white"
          >
            Apply
          </button>
        </div>
      </Modal>
    </div>
  );
}
