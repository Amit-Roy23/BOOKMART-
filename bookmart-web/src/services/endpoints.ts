export const BOOK_ENDPOINTS = {
  NEAREST: "/books/nearby",
  COLLEGE_FEED: "/books/college-feed",
  POPULAR_AUTHORS: "/authors/popular",
  CATEGORIES: "/categories",
  SEARCH: "/books/search",
} as const;

export const AUTHOR_ENDPOINTS = {
  POPULAR: "/authors/popular",
  DETAIL: (id: string) => `/authors/${id}`,
} as const;
