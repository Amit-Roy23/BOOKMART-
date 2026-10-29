'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { IoAddCircle, IoBookOutline } from 'react-icons/io5';
import { HomeHeader, SearchBarLink } from '@/components/app/home-header';
import {
  EndingSoonSection,
  ExcellentConditionSection,
  MyListingsSection,
  NearestBooksSection,
  PeopleViewingSection,
  RecentlyAddedSection,
  toBookView,
  TrendingSection,
} from '@/components/book/book-cards';
import { AuthorsStrip, CategoriesRow, PromoBanner } from '@/components/home/home-sections';
import { ErrorState, Skeleton } from '@/components/ui/primitives';
import { useAuthors, useAvailableListings } from '@/hooks/use-api';
import { useGeolocation } from '@/hooks/use-geolocation';
import { getErrorMessage } from '@/lib/api';
import { distanceKm } from '@/lib/geo';
import { useAuth } from '@/providers/auth-provider';

const ENDING_WINDOW_MS = 12 * 24 * 60 * 60 * 1000; // the app's 12-day listing window

function timeLeft(createdAt: string) {
  const remaining = ENDING_WINDOW_MS - (Date.now() - new Date(createdAt).getTime());
  if (remaining <= 0) return 'Ending today';
  const days = Math.ceil(remaining / 86_400_000);
  if (days > 1) return `${days}d left`;
  const hours = Math.ceil(remaining / 3_600_000);
  return hours > 1 ? `${hours}h left` : 'Ending today';
}

function HomeSkeleton() {
  return (
    <div className="space-y-5 px-6">
      <Skeleton className="h-[152px]" />
      <div className="flex gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-16 shrink-0" />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-40" />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const { profile } = useAuth();
  const { coords } = useGeolocation({ auto: false });
  const listingsQuery = useAvailableListings();
  const { data: authorsData = [] } = useAuthors();
  const listings = useMemo(() => listingsQuery.data ?? [], [listingsQuery.data]);
  const me = profile?.user_id;

  const sections = useMemo(() => {
    const withDistance = listings.map((l) => {
      if (coords && l.latitude && l.longitude) {
        const d = distanceKm(coords, { lat: parseFloat(l.latitude), lng: parseFloat(l.longitude) });
        return { ...l, distance_km: d };
      }
      return l;
    });
    // Like the app, discovery sections include every available listing (your own too).
    const others = withDistance;
    const view = (arr: typeof listings) => arr.map(toBookView);

    const nearest = coords
      ? [...others].sort((a, b) => (a.distance_km ?? 1e9) - (b.distance_km ?? 1e9))
      : others;
    const byNewest = [...others].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    const activeAuthorIds = new Set(others.flatMap((l) => l.book.authors.map((a) => a.id)));

    return {
      mine: view(withDistance.filter((l) => l.seller.id === me)),
      trending: view(withDistance.filter((l) => l.is_boosted)),
      nearest: view(nearest.slice(0, 6)),
      recent: view(byNewest.slice(0, 6)),
      excellent: view(
        others.filter((l) => l.condition === 'NEW' || l.condition === 'LIKE_NEW').slice(0, 6)
      ),
      viewing: view([...others].sort((a, b) => b.views_count - a.views_count).slice(0, 7)),
      ending: [...others]
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        .slice(0, 6)
        .map((l) => ({ ...toBookView(l), timeLeft: timeLeft(l.created_at) })),
      authors: authorsData.filter((a) => activeAuthorIds.has(a.id)),
    };
  }, [listings, coords, me, authorsData]);

  return (
    <>
      <HomeHeader />
      <SearchBarLink />
      {listingsQuery.isLoading ? (
        <HomeSkeleton />
      ) : listingsQuery.isError ? (
        <div className="px-6">
          <ErrorState
            message={getErrorMessage(listingsQuery.error)}
            onRetry={() => listingsQuery.refetch()}
          />
        </div>
      ) : (
        <>
          <PromoBanner />
          <CategoriesRow />
          <MyListingsSection books={sections.mine} />
          <TrendingSection books={sections.trending} />
          <NearestBooksSection books={sections.nearest} seeAllHref="/nearby" />
          <AuthorsStrip authors={sections.authors} />
          <RecentlyAddedSection books={sections.recent} />
          <ExcellentConditionSection books={sections.excellent} />
          <PeopleViewingSection books={sections.viewing} />
          <EndingSoonSection books={sections.ending} />

          {listings.length === 0 && (
            <div className="mx-6 mt-8 flex flex-col items-center rounded-3xl bg-white px-6 py-12 text-center shadow-card">
              <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-secondary text-primary">
                <IoBookOutline size={36} />
              </span>
              <h2 className="mt-4 text-lg font-bold text-text">No Book Listings Yet</h2>
              <p className="mt-1 max-w-xs text-sm text-muted">
                Be the first in your campus or neighborhood to list a pre-owned book!
              </p>
              <Link
                href="/sell"
                className="font-heading mt-5 inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white"
              >
                <IoAddCircle size={18} /> List a Book
              </Link>
            </div>
          )}
        </>
      )}
    </>
  );
}
