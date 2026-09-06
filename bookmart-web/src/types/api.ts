import type {
  MockListing,
  MockAuthor,
  BookCondition,
  CartItem,
  WishlistItem,
  Notification,
} from "@/types";

export interface BooksResponse {
  results: MockListing[];
  count: number;
  next: string | null;
  previous: string | null;
}

export interface AuthorResponse {
  results: MockAuthor[];
  count: number;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export type { MockListing, MockAuthor, BookCondition, CartItem, WishlistItem, Notification };
