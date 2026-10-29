/** Types that mirror the bookmart-backend DRF serializers. */

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type Condition = 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR' | 'POOR';
export type ListingStatus = 'AVAILABLE' | 'PENDING' | 'SOLD';
export type ImageLabel =
  | 'FRONT_COVER'
  | 'BACK_COVER'
  | 'SPINE'
  | 'MIDDLE_PAGE'
  | 'DAMAGE_1'
  | 'DAMAGE_2';

export interface Tokens {
  access: string;
  refresh: string;
}

export interface College {
  id: number;
  name: string;
  district: string;
  state: string;
}

export interface Profile {
  id: number;
  user_id: number;
  full_name: string;
  email: string;
  image: string | null;
  phone_number: string | null;
  date_of_birth: string | null;
  college: College | null;
  city_location: string | null;
  profile_views: number;
  whatsapp_contacts: number;
  active_listings_count: number;
}

export interface AuthUser {
  id: number;
  email: string;
  full_name: string;
  provider: string;
  email_verified: boolean;
  created_at: string;
  profile: Profile | null;
}

export interface LoginResponse {
  user: AuthUser;
  tokens: Tokens;
}

export interface Genre {
  id: number;
  name: string;
  slug: string;
  subtitle: string;
  icon: string;
  total_books_count: number;
  created_at: string;
}

export interface Author {
  id: number;
  name: string;
  designation: string;
  bio: string;
  image_url: string;
  rating: string;
  created_at: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface Seller {
  id: number;
  full_name: string;
  email: string;
  profile_image: string | null;
  phone_number: string | null;
}

export interface ListingImage {
  id: number;
  book_listing: number;
  image_url: string | null;
  label: ImageLabel;
  created_at: string;
}

export interface ListingBook {
  id: number;
  title: string;
  authors: { id: number; name: string }[];
  cover_url: string;
  isbn_13: string | null;
  isbn_10: string | null;
  openlibrary_key: string | null;
  genres: string[];
  description: string;
  publisher: string;
  published_date: string | null;
  language: string;
}

export interface Listing {
  id: number;
  book: ListingBook;
  seller: Seller;
  price: string;
  condition: Condition;
  condition_notes: string;
  status: ListingStatus;
  listing_images: ListingImage[];
  latitude: string | null;
  longitude: string | null;
  favorite_count: number;
  is_favorited: boolean;
  is_boosted: boolean;
  boost_expires_at: string | null;
  views_count: number;
  tags: string[];
  created_at: string;
  updated_at: string;
  distance_km?: number;
}

export interface RankedListing {
  id: number;
  price: string;
  condition: Condition;
  condition_notes: string;
  seller: { id: number; full_name: string; profile_image: string | null };
  cover_image_url: string | null;
}

export interface CatalogBook {
  id: number;
  title: string;
  cover_url: string | null;
  authors: string[];
  isbn_13: string | null;
  lowest_price: string | null;
  discount_percentage: number | null;
  total_listings_count: number;
  cheapest_listing: RankedListing | null;
  listings: RankedListing[];
}

export interface GenreDetail extends Genre {
  books: CatalogBook[];
}

export interface BookSearchResult {
  id?: number | null;
  openlibrary_key?: string | null;
  title: string;
  authors: string[];
  isbn13?: string | null;
  published_year?: number | null;
  cover_url?: string | null;
  genres: string[];
  is_local: boolean;
}

export interface BookCreatedResponse {
  created: boolean;
  book_id: number;
  title: string;
  cover_url: string | null;
  published_year: number | null;
  authors: string[];
  genres: string[];
  is_local: boolean;
}

export interface BookReview {
  id: number;
  book: number;
  user: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface WishlistEntry {
  id: number;
  listing: Listing;
  created_at: string;
}

export type NotificationType = 'PRICE_DROP' | 'BUYER_INTEREST' | 'NEW_LISTING';

export interface PlatformNotification {
  id: number;
  notification_type: NotificationType;
  title: string;
  body: string;
  related_listing: Listing | null;
  action_trigger_user: Seller | null;
  is_read: boolean;
  created_at: string;
}

export interface ContactLedgerEntry {
  id: number;
  contact_person_name: string;
  book_title: string;
  deal_type: 'BOUGHT' | 'SOLD';
  price_recorded: string;
  transaction_date: string;
}

export interface BoostPlan {
  id: number;
  name: string;
  duration_days: number;
  price: string;
  is_active: boolean;
}

export interface BoostInitiateResponse {
  order_id: number;
  listing_id: number;
  plan: BoostPlan;
  amount: string;
  payment_method: string;
  payment_session: Record<string, unknown> & { gateway_order_id?: string };
}

export interface BoostConfirmResponse {
  detail: string;
  listing_id: number;
  is_boosted: boolean;
  boost_expires_at: string | null;
}

export type RequirementCondition = 'NEW' | 'LIKE_NEW' | 'GOOD' | 'ACCEPTABLE';
export type RequirementStatus = 'ACTIVE' | 'FULFILLED' | 'CANCELLED';

export interface Requirement {
  id: number;
  user: { id: number; full_name: string; profile_image: string | null };
  book: { id: number; title: string; cover_url: string; author: string | null } | null;
  book_title: string;
  preferred_condition: RequirementCondition;
  min_price: string | null;
  max_price: string | null;
  notes: string;
  status: RequirementStatus;
  matching_count: number;
  created_at: string;
  updated_at: string;
}

export interface SellerReview {
  id: number;
  reviewer: { id: number; full_name: string; email: string; profile_image: string | null };
  seller: { id: number; full_name: string; email: string; profile_image: string | null };
  listing: number;
  rating: number;
  review: string;
  created_at: string;
}

export interface RatingSummary {
  average_rating: number;
  rating_count: number;
  rating_distribution: Record<string, number>;
}

export type ReportType = 'LISTING' | 'USER';

export interface Report {
  id: number;
  report_type: ReportType;
  reason: string;
  details: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED';
  created_at: string;
  reported_listing: { id: number; book: { title: string } } | null;
  reported_user: { id: number; full_name: string } | null;
}
