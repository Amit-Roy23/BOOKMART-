'use client';

import Link from 'next/link';
import { IoHeartDislikeOutline } from 'react-icons/io5';
import { ScreenHeader } from '@/components/app/screen-header';
import { BookCardSkeleton, MasonryBookCard, toBookView } from '@/components/book/book-cards';
import { Button, EmptyState, ErrorState } from '@/components/ui/primitives';
import { useWishlist } from '@/hooks/use-api';
import { getErrorMessage } from '@/lib/api';

/** “My Interests” — the app's FavouritesScreen. */
export default function FavouritesPage() {
  const { data: wishlist = [], isLoading, isError, error, refetch } = useWishlist();

  return (
    <>
      <ScreenHeader title="My Interests" fallback="/profile" />
      <div className="px-6">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
        ) : wishlist.length === 0 ? (
          <div className="pt-[18vh]">
            <EmptyState
              icon={IoHeartDislikeOutline}
              title="No Favourites Yet"
              description="You haven't added any books to your interests yet. Start exploring and save your favourites!"
              action={
                <Link href="/">
                  <Button size="md">Explore Books</Button>
                </Link>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
            {wishlist.map((w) => (
              <MasonryBookCard key={w.id} book={toBookView(w.listing)} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
