'use client';

import { Eye, Heart, MapPin, Rocket } from 'lucide-react';
import Link from 'next/link';
import { BookCover, ConditionBadge } from '@/components/ui/primitives';
import { useToggleWishlist } from '@/hooks/use-api';
import { getErrorMessage } from '@/lib/api';
import { cn, formatPrice, listingAuthors, listingCover } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { useToast } from '@/providers/toast-provider';
import type { Listing } from '@/types/api';

export function FavoriteButton({ listing, className }: { listing: Listing; className?: string }) {
  const { profile } = useAuth();
  const toast = useToast();
  const toggle = useToggleWishlist();
  if (profile && listing.seller.id === profile.user_id) return null;

  const saved = toggle.isSaved(listing.id);
  return (
    <button
      type="button"
      aria-label={saved ? 'Remove from favourites' : 'Add to favourites'}
      aria-pressed={saved}
      disabled={toggle.isPending}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle.mutate(listing.id, {
          onSuccess: (added) =>
            toast.success(added ? 'Added to favourites' : 'Removed from favourites'),
          onError: (err) => toast.error(getErrorMessage(err)),
        });
      }}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur transition hover:scale-105',
        className
      )}
    >
      <Heart className={cn('h-4 w-4', saved ? 'fill-rose-500 text-rose-500' : 'text-slate-600')} />
    </button>
  );
}

export function ListingCard({ listing, className }: { listing: Listing; className?: string }) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className={cn(
        'group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs transition hover:-translate-y-0.5 hover:shadow-md',
        className
      )}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
        <BookCover
          src={listingCover(listing)}
          alt={listing.book.title}
          className="transition duration-300 group-hover:scale-105"
        />
        <FavoriteButton listing={listing} className="absolute right-2 top-2" />
        {listing.is_boosted && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-slate-900">
            <Rocket className="h-3 w-3" /> Featured
          </span>
        )}
        {listing.status === 'SOLD' && (
          <span className="absolute inset-x-0 bottom-0 bg-slate-900/75 py-1 text-center text-xs font-bold uppercase tracking-wide text-white">
            Sold
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 className="line-clamp-1 text-sm font-bold text-slate-900">{listing.book.title}</h3>
        <p className="line-clamp-1 text-xs text-slate-500">{listingAuthors(listing)}</p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <span className="text-base font-extrabold text-brand-dark">
            {formatPrice(listing.price)}
          </span>
          <ConditionBadge condition={listing.condition} />
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          {listing.distance_km != null && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {listing.distance_km.toFixed(1)} km
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Eye className="h-3 w-3" /> {listing.views_count}
          </span>
          <span className="inline-flex items-center gap-1">
            <Heart className="h-3 w-3" /> {listing.favorite_count}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function ListingGrid({ listings }: { listings: Listing[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}

export function ListingGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
          <div className="aspect-[3/4] animate-pulse bg-slate-100" />
          <div className="space-y-2 p-3">
            <div className="h-3 w-3/4 animate-pulse rounded bg-slate-100" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Horizontally scrolling row of listings used on the home page. */
export function ListingRow({
  title,
  subtitle,
  listings,
  href,
}: {
  title: string;
  subtitle?: string;
  listings: Listing[];
  href?: string;
}) {
  if (listings.length === 0) return null;
  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 md:text-xl">{title}</h2>
          {subtitle && <p className="text-xs text-slate-500 md:text-sm">{subtitle}</p>}
        </div>
        {href && (
          <Link href={href} className="text-sm font-semibold text-brand-primary hover:underline">
            See all
          </Link>
        )}
      </div>
      <div className="scrollbar-hide -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            className="w-40 shrink-0 snap-start md:w-48"
          />
        ))}
      </div>
    </section>
  );
}
