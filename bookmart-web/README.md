# Bookmart Web

The web version of Bookmart, built with Next.js 16 (App Router), React 19, Tailwind CSS v4 and
TanStack Query. It talks to the same `bookmart-backend` REST API as the mobile app (`bookmart-app`),
so accounts, listings, favourites and notifications are shared between web and mobile.

## Getting started

```bash
cp .env.example .env.local   # point NEXT_PUBLIC_API_URL at your backend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The backend must allow the web origin in
`CORS_ALLOWED_ORIGINS` (`http://localhost:3000` is allowed by default).

| Variable              | Default                          | Description                                  |
| --------------------- | -------------------------------- | -------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | `http://127.0.0.1:8000/api/v1`   | Backend API base URL, inlined at build time. |

## Features

Everything the mobile app does, against the same endpoints:

- **Auth** — register, email OTP verification, login, forgot password (OTP reset), onboarding
  (role, college, reading preference). JWTs are refreshed automatically on 401.
- **Discover** — personalised home feed (`/home/`), search with condition/genre/tag filters and
  sorting, genres, authors, books near you on a map (`/marketplace/listings/nearby/`).
- **Listing page** — photo gallery, WhatsApp contact (logged to the contacts ledger), favourites,
  book reviews, seller rating, report listing.
- **Selling** — 3-step listing flow with catalog/OpenLibrary lookup, the 4 required photos plus
  damage photos, a map pickup-location picker, and editing existing listings.
- **Seller dashboard** — manage listings (mark sold, delete, boost), analytics, boost plans with
  the payment initiate/confirm flow, sold books with “record a sale”.
- **Account** — profile, edit profile (photo, phone, college), saved address, notifications,
  contacts, favourites, book requests, reports, seller public pages and seller reviews.

## Project structure

```
src/
  app/(auth)/          login, register, verify-email, forgot-password, onboarding
  app/(main)/          public pages (home, categories, authors, requests, info pages)
  app/(main)/(protected)/  pages that require login
  components/          UI primitives, layout, listing, catalog, map components
  hooks/use-api.ts     all React Query hooks for backend reads and writes
  lib/api.ts           axios client, token storage and refresh
  lib/endpoints.ts     endpoint map (mirrors bookmart-app/src/api/endpoints.ts)
  types/api.ts         types mirroring the backend serializers
```

## Scripts

- `npm run dev` — development server
- `npm run build` / `npm start` — production build and server
- `npm run lint` — ESLint
