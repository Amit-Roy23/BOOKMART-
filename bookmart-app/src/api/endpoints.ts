/**
 * Centralized API endpoints for Bookmart mobile application.
 * All paths are relative to the baseURL (e.g. /api/v1).
 */
export const ENDPOINTS = {
  // Authentication & User Account
  AUTH: {
    LOGIN: "/auth/login/",
    REGISTER: "/auth/register/",
    REFRESH: "/auth/refresh/",
    LOGOUT: "/auth/logout/",
    FORGOT_PASSWORD: "/auth/forgot-password/",
    VERIFY_REGISTER_OTP: "/otp/verify-register-otp/",
    RESEND_OTP: "/otp/resend-otp/",
    VERIFY_RESET_OTP: "/otp/verify-reset-otp/",
    SOCIAL_LOGIN: "/auth/social-login/",
    ME: "/user/me/",
  },

  // Core & Profile
  CORE: {
    HEALTH: "/core/health",
    COLLEGES: "/core/colleges/",
    PROFILE: "/core/profile/",
    PROFILE_ME: "/core/profile/me/",
    PROFILE_ONBOARDING: "/core/profile/onboarding",
  },

  // Books Catalogue
  BOOKS: {
    LIST: "/book/books/",
    DETAIL: (id: string | number) => `/book/books/${id}/`,
    SEARCH: "/book/search/",
    IMPORT_OPENLIBRARY: "/book/import-openlibrary/",
    MANUAL_CREATE: "/book/manual/",
    GENRES: "/book/genres/",
    AUTHORS: "/book/authors/",
    REVIEWS: "/book/reviews/",
    RECOMMENDATIONS: "/book/recommendations/",
  },

  // Marketplace & Listings
  MARKETPLACE: {
    LISTINGS: "/marketplace/listings/",
    LISTING_DETAIL: (id: string | number) => `/marketplace/listings/${id}/`,
    WISHLIST: "/marketplace/wishlist/",
    WISHLIST_DETAIL: (id: string | number) => `/marketplace/wishlist/${id}/`,
    NOTIFICATIONS: "/marketplace/notifications/",
    CONTACTS: "/marketplace/contacts/",
    BOOST: (id: string | number) => `/marketplace/listings/${id}/boost/`,
  },

  // Book Requirements & Requests
  REQUIREMENTS: {
    LIST: "/requirements/",
    ME: "/requirements/me/",
    NEARBY: "/requirements/nearby/",
    DETAIL: (id: string | number) => `/requirements/${id}/`,
  },

  // Favorites
  FAVORITES: {
    LIST: "/favorites/",
    CHECK: (listingId: string | number) => `/favorites/check/${listingId}/`,
    COUNT: (listingId: string | number) => `/favorites/count/${listingId}/`,
    DELETE: (listingId: string | number) => `/favorites/${listingId}/`,
    ADMIN: "/favorites/admin/",
  },

  // Home Feed
  HOME_FEED: {
    FEED: "/home/",
  },

  // User & Push Notifications
  NOTIFICATIONS: {
    LIST: "/notifications/",
    MARK_READ: (id: string | number) => `/notifications/${id}/read/`,
    MARK_ALL_READ: "/notifications/read-all/",
    UNREAD_COUNT: "/notifications/unread-count/",
    DELETE: (id: string | number) => `/notifications/${id}/`,
    DEVICES: "/notifications/devices/",
  },

  // Reviews & Seller Ratings
  REVIEWS: {
    LIST: "/reviews/",
    DETAIL: (id: string | number) => `/reviews/${id}/`,
    SELLER_REVIEWS: (sellerId: string | number) => `/sellers/${sellerId}/reviews/`,
    SELLER_RATING_SUMMARY: (sellerId: string | number) => `/sellers/${sellerId}/rating-summary/`,
  },

  // Tags
  TAGS: {
    LIST: "/tags/",
  },

  // Reports
  REPORTS: {
    LIST: "/reports/",
    ME: "/reports/me/",
    DETAIL: (id: string | number) => `/reports/${id}/`,
  },
} as const;
