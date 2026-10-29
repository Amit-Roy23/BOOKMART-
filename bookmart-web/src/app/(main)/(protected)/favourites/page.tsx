'use client';

import { Heart } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ListingGrid, ListingGridSkeleton } from '@/components/listing/listing-card';
import { Button, Chip, EmptyState, ErrorState, PageHeader } from '@/components/ui/primitives';
import { useWishlist } from '@/hooks/use-api';
import { getErrorMessage } from '@/lib/api';

export default function FavouritesPage() {
  const { data: wishlist = [], isLoading, isError, error, refetch } = useWishlist();
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const listings = useMemo(
    () => wishlist.map((w) => w.listing).filter((l) => !onlyAvailable || l.status === 'AVAILABLE'),
    [wishlist, onlyAvailable]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="My favourites"
        description={`${wishlist.length} saved book${wishlist.length === 1 ? '' : 's'}`}
        action={
          wishlist.length > 0 && (
            <div className="flex gap-2">
              <Chip active={!onlyAvailable} onClick={() => setOnlyAvailable(false)}>
                All
              </Chip>
              <Chip active={onlyAvailable} onClick={() => setOnlyAvailable(true)}>
                Still available
              </Chip>
            </div>
          )
        }
      />
      {isLoading ? (
        <ListingGridSkeleton count={5} />
      ) : isError ? (
        <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
      ) : listings.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No favourites yet"
          description="Tap the heart on any book to save it here for later."
          action={
            <Link href="/search">
              <Button>Explore books</Button>
            </Link>
          }
        />
      ) : (
        <ListingGrid listings={listings} />
      )}
    </div>
  );
}
