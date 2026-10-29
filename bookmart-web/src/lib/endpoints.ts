/**
 * Centralized API endpoints for the Bookmart web app.
 * Mirrors bookmart-app/src/api/endpoints.ts — all paths are relative to the
 * API base URL (e.g. http://localhost:8000/api/v1).
 */
type Id = string | number;

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login/',
    REGISTER: '/auth/register/',
    REFRESH: '/auth/refresh/',
    LOGOUT: '/auth/logout/',
    FORGOT_PASSWORD: '/auth/forgot-password/',
    VERIFY_REGISTER_OTP: '/otp/verify-register-otp/',
    RESEND_OTP: '/otp/resend-otp/',
    VERIFY_RESET_OTP: '/otp/verify-reset-otp/',
  },

  CORE: {
    COLLEGES: '/core/colleges/',
    PROFILE_ME: '/core/profile/me/',
    PROFILE_ONBOARDING: '/core/profile/onboarding',
  },

  BOOKS: {
    LIST: '/book/books/',
    SEARCH: '/book/search/',
    IMPORT_OPENLIBRARY: '/book/import-openlibrary/',
    MANUAL_CREATE: '/book/manual/',
    GENRES: '/book/genres/',
    GENRE_DETAIL: (idOrSlug: Id) => `/book/genres/${idOrSlug}/`,
    AUTHORS: '/book/authors/',
    AUTHOR_DETAIL: (id: Id) => `/book/authors/${id}/`,
    REVIEWS: '/book/reviews/',
    RECOMMENDATIONS: '/book/recommendations/',
  },

  MARKETPLACE: {
    LISTINGS: '/marketplace/listings/',
    LISTING_DETAIL: (id: Id) => `/marketplace/listings/${id}/`,
    NEARBY: '/marketplace/listings/nearby/',
    BOOST_INITIATE: (id: Id) => `/marketplace/listings/${id}/boost/initiate/`,
    BOOST_PLANS: '/marketplace/boost-plans/',
    BOOST_CONFIRM: (orderId: Id) => `/marketplace/boost-orders/${orderId}/confirm/`,
    WISHLIST: '/marketplace/wishlist/',
    WISHLIST_DETAIL: (id: Id) => `/marketplace/wishlist/${id}/`,
    NOTIFICATIONS: '/marketplace/notifications/',
    NOTIFICATION_DETAIL: (id: Id) => `/marketplace/notifications/${id}/`,
    NOTIFICATIONS_READ_ALL: '/marketplace/notifications/read-all/',
    CONTACTS: '/marketplace/contacts/',
  },

  REQUIREMENTS: {
    LIST: '/requirements/',
    ME: '/requirements/me/',
    DETAIL: (id: Id) => `/requirements/${id}/`,
  },

  HOME_FEED: '/home/',

  REVIEWS: {
    CREATE: '/reviews/',
    SELLER_REVIEWS: (sellerId: Id) => `/sellers/${sellerId}/reviews/`,
    SELLER_RATING_SUMMARY: (sellerId: Id) => `/sellers/${sellerId}/rating-summary/`,
  },

  TAGS: {
    LIST: '/tags/',
  },

  REPORTS: {
    LIST: '/reports/',
    ME: '/reports/me/',
  },
} as const;
