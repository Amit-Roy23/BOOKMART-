'use client';

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, fetchAllPages } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { useAuth } from '@/providers/auth-provider';
import type {
  Author,
  BoostPlan,
  BookReview,
  CatalogBook,
  College,
  ContactLedgerEntry,
  Genre,
  GenreDetail,
  Listing,
  Paginated,
  PlatformNotification,
  RatingSummary,
  Requirement,
  SellerReview,
  Tag,
  WishlistEntry,
} from '@/types/api';

const toList = <T>(data: Paginated<T> | T[]): T[] => (Array.isArray(data) ? data : data.results);

// ── Home feed ───────────────────────────────────────────────

export interface HomeFeed {
  profile_completion: number;
  nearby_books: Listing[];
  latest_books: Listing[];
  popular_books: Listing[];
  recommended_books: Listing[];
  featured_books: Listing[];
  genres: Genre[];
  stats: { active_listings: number; requirements: number; users: number };
}

export function useHomeFeed(coords?: { lat: number; lng: number } | null) {
  return useQuery({
    queryKey: ['home-feed', coords?.lat, coords?.lng],
    queryFn: async () =>
      (
        await api.get<HomeFeed>(ENDPOINTS.HOME_FEED, {
          params: {
            page_size: 15,
            ...(coords ? { lat: coords.lat, lng: coords.lng, radius: 25 } : {}),
          },
        })
      ).data,
  });
}

// ── Listings ────────────────────────────────────────────────

export interface ListingQuery {
  search?: string;
  condition?: string;
  genre?: string;
  tag?: string;
  ordering?: string;
  status?: string;
  page?: number;
  page_size?: number;
}

export function useListings(params: ListingQuery, enabled = true) {
  return useQuery({
    queryKey: ['listings', params],
    queryFn: async () =>
      (await api.get<Paginated<Listing>>(ENDPOINTS.MARKETPLACE.LISTINGS, { params })).data,
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useListing(id?: string | number) {
  return useQuery({
    queryKey: ['listing', String(id)],
    queryFn: async () => (await api.get<Listing>(ENDPOINTS.MARKETPLACE.LISTING_DETAIL(id!))).data,
    enabled: !!id,
  });
}

/** All listings of one seller. The backend has no seller filter, so filter client side. */
export function useSellerListings(sellerId?: number) {
  return useQuery({
    queryKey: ['seller-listings', sellerId],
    queryFn: async () => {
      const all = await fetchAllPages<Listing>(ENDPOINTS.MARKETPLACE.LISTINGS);
      return all.filter((l) => l.seller.id === sellerId);
    },
    enabled: !!sellerId,
  });
}

export function useMyListings() {
  const { profile } = useAuth();
  return useSellerListings(profile?.user_id);
}

export interface NearbyQuery {
  lat: number;
  lng: number;
  radius?: number;
  genre?: string;
  condition?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
  ordering?: string;
  page_size?: number;
}

export function useNearbyListings(params: NearbyQuery | null) {
  return useQuery({
    queryKey: ['nearby', params],
    queryFn: async () =>
      (await api.get<Paginated<Listing>>(ENDPOINTS.MARKETPLACE.NEARBY, { params: params! })).data,
    enabled: !!params,
    placeholderData: keepPreviousData,
  });
}

function invalidateListings(qc: ReturnType<typeof useQueryClient>) {
  for (const key of [
    'listings',
    'listing',
    'seller-listings',
    'home-feed',
    'nearby',
    'wishlist',
    'genre',
  ]) {
    qc.invalidateQueries({ queryKey: [key] });
  }
}

export function useUpdateListingStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) =>
      (await api.patch(ENDPOINTS.MARKETPLACE.LISTING_DETAIL(id), { status })).data,
    onSuccess: () => invalidateListings(qc),
  });
}

export function useDeleteListing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => api.delete(ENDPOINTS.MARKETPLACE.LISTING_DETAIL(id)),
    onSuccess: () => {
      invalidateListings(qc);
      qc.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
}

export function useSaveListing(editId?: string | number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (form: FormData) => {
      const res = editId
        ? await api.patch<Listing>(ENDPOINTS.MARKETPLACE.LISTING_DETAIL(editId), form)
        : await api.post<Listing>(ENDPOINTS.MARKETPLACE.LISTINGS, form);
      return res.data;
    },
    onSuccess: () => {
      invalidateListings(qc);
      qc.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
}

// ── Wishlist (favourites) ───────────────────────────────────

export function useWishlist(enabled = true) {
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: () => fetchAllPages<WishlistEntry>(ENDPOINTS.MARKETPLACE.WISHLIST),
    enabled,
  });
}

/** Add/remove a listing from the wishlist, resolving the wishlist entry id as the app does. */
export function useToggleWishlist() {
  const qc = useQueryClient();
  const { status } = useAuth();
  const { data: wishlist } = useWishlist(status === 'authenticated');
  const mutation = useMutation({
    mutationFn: async (listingId: number) => {
      const entry = wishlist?.find((w) => w.listing.id === listingId);
      if (entry) {
        await api.delete(ENDPOINTS.MARKETPLACE.WISHLIST_DETAIL(entry.id));
        return false;
      }
      await api.post(ENDPOINTS.MARKETPLACE.WISHLIST, { listing: listingId });
      return true;
    },
    // Not invalidating ['listing']: re-fetching a listing detail counts as a new view on the backend.
    onSuccess: () => qc.invalidateQueries({ queryKey: ['wishlist'] }),
  });
  const isSaved = (listingId: number) => !!wishlist?.some((w) => w.listing.id === listingId);
  return { ...mutation, isSaved };
}

// ── Catalog: genres, authors, tags, reviews ─────────────────

export function useGenres() {
  return useQuery({
    queryKey: ['genres'],
    queryFn: () => fetchAllPages<Genre>(ENDPOINTS.BOOKS.GENRES),
    staleTime: 5 * 60 * 1000,
  });
}

export function useGenre(slug?: string) {
  return useQuery({
    queryKey: ['genre', slug],
    queryFn: async () => (await api.get<GenreDetail>(ENDPOINTS.BOOKS.GENRE_DETAIL(slug!))).data,
    enabled: !!slug,
  });
}

export function useCatalogBooks(
  params: { search?: string; genres__slug?: string },
  enabled = true
) {
  return useQuery({
    queryKey: ['catalog-books', params],
    queryFn: () => fetchAllPages<CatalogBook>(ENDPOINTS.BOOKS.LIST, params, 5),
    enabled,
  });
}

export function useAuthors(search = '') {
  return useQuery({
    queryKey: ['authors', search],
    queryFn: () => fetchAllPages<Author>(ENDPOINTS.BOOKS.AUTHORS, search ? { search } : {}),
    placeholderData: keepPreviousData,
  });
}

export function useAuthor(id?: string) {
  return useQuery({
    queryKey: ['author', id],
    queryFn: async () => (await api.get<Author>(ENDPOINTS.BOOKS.AUTHOR_DETAIL(id!))).data,
    enabled: !!id,
  });
}

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: async () =>
      toList(
        (await api.get<Paginated<Tag>>(ENDPOINTS.TAGS.LIST, { params: { page_size: 50 } })).data
      ),
    staleTime: 5 * 60 * 1000,
  });
}

/** Reviews of a catalog book. The endpoint has no book filter, so filter client side. */
export function useBookReviews(bookId?: number) {
  return useQuery({
    queryKey: ['book-reviews', bookId],
    queryFn: async () => {
      const all = await fetchAllPages<BookReview>(ENDPOINTS.BOOKS.REVIEWS, { book: bookId });
      return all.filter((r) => r.book === bookId);
    },
    enabled: !!bookId,
  });
}

export function useAddBookReview(bookId?: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { rating: number; comment: string }) =>
      api.post(ENDPOINTS.BOOKS.REVIEWS, { book: bookId, ...payload }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['book-reviews', bookId] }),
  });
}

// ── Sellers: ratings & reviews ──────────────────────────────

export function useSellerRating(sellerId?: number) {
  return useQuery({
    queryKey: ['seller-rating', sellerId],
    queryFn: async () =>
      (await api.get<RatingSummary>(ENDPOINTS.REVIEWS.SELLER_RATING_SUMMARY(sellerId!))).data,
    enabled: !!sellerId,
  });
}

export function useSellerReviews(sellerId?: number) {
  return useQuery({
    queryKey: ['seller-reviews', sellerId],
    queryFn: () => fetchAllPages<SellerReview>(ENDPOINTS.REVIEWS.SELLER_REVIEWS(sellerId!)),
    enabled: !!sellerId,
  });
}

export function useAddSellerReview(sellerId?: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { listing: number; rating: number; review: string }) =>
      api.post(ENDPOINTS.REVIEWS.CREATE, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['seller-reviews', sellerId] });
      qc.invalidateQueries({ queryKey: ['seller-rating', sellerId] });
    },
  });
}

// ── Notifications ───────────────────────────────────────────

export function useNotifications(enabled = true) {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => fetchAllPages<PlatformNotification>(ENDPOINTS.MARKETPLACE.NOTIFICATIONS, {}, 5),
    enabled,
    refetchInterval: 60 * 1000,
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) =>
      api.patch(ENDPOINTS.MARKETPLACE.NOTIFICATION_DETAIL(id), { is_read: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => api.post(ENDPOINTS.MARKETPLACE.NOTIFICATIONS_READ_ALL),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

// ── Contacts ledger ─────────────────────────────────────────

export function useContacts() {
  return useQuery({
    queryKey: ['contacts-ledger'],
    queryFn: () => fetchAllPages<ContactLedgerEntry>(ENDPOINTS.MARKETPLACE.CONTACTS),
  });
}

export function useLogContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      contact_person_name: string;
      book_title: string;
      deal_type: 'BOUGHT' | 'SOLD';
      price_recorded: string | number;
    }) => api.post(ENDPOINTS.MARKETPLACE.CONTACTS, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contacts-ledger'] }),
  });
}

// ── Boost ───────────────────────────────────────────────────

export function useBoostPlans() {
  return useQuery({
    queryKey: ['boost-plans'],
    queryFn: async () =>
      toList((await api.get<BoostPlan[]>(ENDPOINTS.MARKETPLACE.BOOST_PLANS)).data),
  });
}

// ── Requirements (book requests) ────────────────────────────

export function useRequirements(params: { search?: string; page?: number } = {}) {
  return useQuery({
    queryKey: ['requirements', params],
    queryFn: async () =>
      (await api.get<Paginated<Requirement>>(ENDPOINTS.REQUIREMENTS.LIST, { params })).data,
    placeholderData: keepPreviousData,
  });
}

export function useMyRequirements(enabled = true) {
  return useQuery({
    queryKey: ['my-requirements'],
    queryFn: () => fetchAllPages<Requirement>(ENDPOINTS.REQUIREMENTS.ME),
    enabled,
  });
}

function invalidateRequirements(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: ['requirements'] });
  qc.invalidateQueries({ queryKey: ['my-requirements'] });
}

export function useCreateRequirement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) =>
      (await api.post<Requirement>(ENDPOINTS.REQUIREMENTS.LIST, payload)).data,
    onSuccess: () => invalidateRequirements(qc),
  });
}

export function useUpdateRequirement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: number; status?: string }) =>
      (await api.patch<Requirement>(ENDPOINTS.REQUIREMENTS.DETAIL(id), payload)).data,
    onSuccess: () => invalidateRequirements(qc),
  });
}

export function useDeleteRequirement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => api.delete(ENDPOINTS.REQUIREMENTS.DETAIL(id)),
    onSuccess: () => invalidateRequirements(qc),
  });
}

// ── Colleges ────────────────────────────────────────────────

export function useColleges(search: string, enabled = true) {
  return useQuery({
    queryKey: ['colleges', search],
    queryFn: async () =>
      toList(
        (
          await api.get<Paginated<College>>(ENDPOINTS.CORE.COLLEGES, {
            params: { search: search || undefined, page_size: 20 },
          })
        ).data
      ),
    enabled,
    placeholderData: keepPreviousData,
  });
}
