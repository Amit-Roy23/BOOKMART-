'use client';

import { ArrowRight, BookOpen, ClipboardList, MapPin, Plus, Users } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { AuthorCard } from '@/components/author/author-card';
import { ListingGridSkeleton, ListingRow } from '@/components/listing/listing-card';
import { Button, ErrorState } from '@/components/ui/primitives';
import { useAuthors, useHomeFeed } from '@/hooks/use-api';
import { useGeolocation } from '@/hooks/use-geolocation';
import { getErrorMessage } from '@/lib/api';
import { formatCompact } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import type { Listing } from '@/types/api';

export function HomeFeedView() {
  const { profile } = useAuth();
  const { coords, status: geoStatus, locate } = useGeolocation();
  const feed = useHomeFeed(coords);
  const { data: authors = [] } = useAuthors();

  // As in the app, hide the user's own listings from discovery sections.
  const others = useMemo(() => {
    const notMine = (l: Listing) => l.seller.id !== profile?.user_id;
    const f = feed.data;
    return {
      nearby: f?.nearby_books.filter(notMine) ?? [],
      latest: f?.latest_books.filter(notMine) ?? [],
      popular: f?.popular_books.filter(notMine) ?? [],
      recommended: f?.recommended_books.filter(notMine) ?? [],
      featured: f?.featured_books.filter(notMine) ?? [],
    };
  }, [feed.data, profile?.user_id]);

  const sponsored = useMemo(
    () =>
      [...others.latest, ...others.popular].filter(
        (l, i, arr) => l.is_boosted && arr.findIndex((x) => x.id === l.id) === i
      ),
    [others]
  );
  const mostViewed = useMemo(
    () => [...others.popular].sort((a, b) => b.views_count - a.views_count).slice(0, 10),
    [others.popular]
  );

  const firstName = profile?.full_name.split(' ')[0] ?? 'there';
  const completion = feed.data?.profile_completion ?? 100;

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-primary to-brand-dark px-6 py-8 text-white md:px-10 md:py-10">
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-white/80">
              <MapPin className="mr-1 inline h-3.5 w-3.5" />
              {profile?.city_location || profile?.college?.name || 'Campus Area'}
            </p>
            <h1 className="mt-1 text-2xl font-extrabold md:text-3xl">
              Hi {firstName}, find your next read
            </h1>
            <p className="mt-1 text-sm text-white/80">
              Pre-loved books from students and readers around you.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/sell">
              <Button className="bg-white text-brand-dark hover:bg-brand-light">
                <Plus className="h-4 w-4" /> Sell a book
              </Button>
            </Link>
            <Link href="/requests/new">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <ClipboardList className="h-4 w-4" /> Request a book
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
      </section>

      {completion < 100 && (
        <Link
          href="/profile/edit"
          className="flex items-center gap-4 rounded-2xl border border-amber-100 bg-amber-50 px-5 py-4 transition hover:border-amber-200"
        >
          <div className="relative h-12 w-12 shrink-0">
            <svg viewBox="0 0 36 36" className="h-12 w-12 -rotate-90">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="#fde68a" strokeWidth="4" />
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                stroke="#d97706"
                strokeWidth="4"
                strokeDasharray={`${(completion / 100) * 97.4} 97.4`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-amber-700">
              {completion}%
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-900">Complete your profile</p>
            <p className="text-xs text-slate-600">
              Add a photo, phone number and college so buyers can trust and reach you.
            </p>
          </div>
          <ArrowRight className="h-4 w-4 text-amber-700" />
        </Link>
      )}

      {feed.data && feed.data.genres.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-end justify-between">
            <h2 className="text-lg font-bold text-slate-900 md:text-xl">Browse by genre</h2>
            <Link
              href="/categories"
              className="text-sm font-semibold text-brand-primary hover:underline"
            >
              All genres
            </Link>
          </div>
          <div className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
            {feed.data.genres.map((genre) => (
              <Link
                key={genre.id}
                href={`/categories/${genre.slug}`}
                className="flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-primary hover:text-brand-primary"
              >
                {genre.icon && <span aria-hidden>{genre.icon}</span>}
                {genre.name}
                <span className="text-xs text-slate-400">{genre.total_books_count}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {feed.isLoading && <ListingGridSkeleton count={5} />}
      {feed.isError && (
        <ErrorState message={getErrorMessage(feed.error)} onRetry={() => feed.refetch()} />
      )}

      <ListingRow title="Featured" subtitle="Boosted by sellers" listings={sponsored} />

      {others.nearby.length > 0 ? (
        <ListingRow
          title="Nearest to you"
          subtitle="Within 25 km"
          listings={others.nearby}
          href="/nearby"
        />
      ) : (
        geoStatus !== 'granted' &&
        feed.data && (
          <div className="flex flex-col items-start gap-3 rounded-2xl border border-slate-100 bg-white p-5 sm:flex-row sm:items-center">
            <MapPin className="h-6 w-6 text-brand-primary" />
            <p className="flex-1 text-sm text-slate-600">
              Allow location access to see books being sold near you.
            </p>
            <Button
              size="sm"
              variant="secondary"
              onClick={locate}
              loading={geoStatus === 'locating'}
            >
              Use my location
            </Button>
          </div>
        )
      )}

      <ListingRow title="Recommended for you" listings={others.recommended} href="/search" />
      <ListingRow
        title="Recently added"
        listings={others.latest}
        href="/search?ordering=-created_at"
      />
      <ListingRow
        title="Excellent condition"
        subtitle="New, like new and good copies"
        listings={others.featured}
      />
      <ListingRow title="People are viewing" listings={mostViewed} />

      {authors.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-end justify-between">
            <h2 className="text-lg font-bold text-slate-900 md:text-xl">Popular authors</h2>
            <Link
              href="/authors"
              className="text-sm font-semibold text-brand-primary hover:underline"
            >
              See all
            </Link>
          </div>
          <div className="scrollbar-hide -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
            {authors.slice(0, 12).map((author) => (
              <AuthorCard key={author.id} author={author} className="w-36 shrink-0" />
            ))}
          </div>
        </section>
      )}

      {feed.data && (
        <section className="grid gap-3 sm:grid-cols-3">
          {[
            { icon: BookOpen, label: 'Active listings', value: feed.data.stats.active_listings },
            {
              icon: ClipboardList,
              label: 'Open book requests',
              value: feed.data.stats.requirements,
            },
            { icon: Users, label: 'Readers on Bookmart', value: feed.data.stats.users },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-light">
                <Icon className="h-5 w-5 text-brand-primary" />
              </span>
              <div>
                <p className="text-2xl font-extrabold text-slate-900">{formatCompact(value)}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
