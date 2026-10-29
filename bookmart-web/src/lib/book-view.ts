import { listingAuthors, listingCover } from '@/lib/utils';
import type { Listing } from '@/types/api';

/** Flat book card model, like the app's mapListingToBook. */
export interface BookView {
  id: number;
  title: string;
  author: string;
  price: number;
  cover: string;
  condition: string;
  distance: string;
  views: number;
  sellerId: number;
  createdAt: string;
}

export function toBookView(listing: Listing): BookView {
  return {
    id: listing.id,
    title: listing.book.title || 'Untitled Book',
    author: listingAuthors(listing),
    price: parseFloat(listing.price) || 0,
    cover: listingCover(listing),
    condition: listing.condition,
    distance: listing.distance_km != null ? `${listing.distance_km.toFixed(1)}km` : 'Nearby',
    views: listing.views_count,
    sellerId: listing.seller.id,
    createdAt: listing.created_at,
  };
}
