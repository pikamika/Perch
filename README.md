# Confidence Card

A mobile-first prototype that helps NYC food lovers gain confidence in a restaurant in seconds: is the vibe right for my occasion, what does it cost, and what should I order?

This is a class prototype. The front end reads and writes data through a service layer that can run on local mock data or on Supabase; see [Supabase back end](#supabase-back-end).

## Run it

Requires Node 20+.

```bash
npm install
npm run dev          # http://localhost:5173
```

Other scripts:

| Command | What it does |
| --- | --- |
| `npm run typecheck` | TypeScript strict type check |
| `npm run lint` | ESLint (no `any`, a11y rules, no direct mock-data imports in UI code) |
| `npm run build` | Type check and production build into `dist/` |
| `npm run preview` | Serve the production build locally |

## What's in the app

- **Home (`/`)**: pick an occasion and an optional budget; get the top 3 matches. Choices live in the URL (`/?occasion=date&budget=30`).
- **Confidence card (`/place/:id`)**: swipeable photos, best-for chips (your occasion is highlighted), price, what to order, photo freshness, save button.
- **Saved (`/saved`)**: saved places, filterable by occasion, with an empty state.
- **Add a place (`/add`)**: paste a link and a name; creates a saved place through the mock service (no link parsing).

Every screen has loading, empty and error states. The mock service waits 200 to 600 ms so you can see them.

### Seeing the error states

In the browser console:

```js
localStorage.setItem('cc.simulateError', 'true')  // every service call now fails
localStorage.removeItem('cc.simulateError')       // back to normal
```

In mock mode, saved places are stored in `localStorage` (key `cc.savedPlaces.v1`); clear it to reset. In Supabase mode they live in the `saved_places` table.

## Folder structure

```
src/
  types/        Domain types: Restaurant, Dish, Occasion, PriceBand, SavedPlace, filters
  data/         mockRestaurants.ts, 10 FICTIONAL placeholder restaurants (mock fallback + seed source)
  services/     The data access layer
    restaurantService.ts      interface: listRestaurants, getRestaurant
    savedPlaceService.ts      interface: listSavedPlaces, savePlace, removeSavedPlace
    mock/                     in-memory + localStorage implementations, fake latency
    supabase/                 Supabase implementations + row mappers
    index.ts                  picks Supabase (if configured) or mock
  hooks/        useAsync, useRestaurants, useRestaurant, useSavedPlaces, useDocumentTitle
  components/
    layout/     AppShell, BottomNav (mobile), TopNav (tablet/desktop), PageHeader, BackButton
    ui/         Button, Chip, TextField, Skeleton, EmptyState, ErrorState, icons...
    home/       OccasionPicker, BudgetSlider, PicksSkeleton
    restaurant/ RestaurantCardCompact, PhotoStrip, OccasionChips, WhatToOrder, ...
    saved/      SavedItem, OccasionFilter, SavedSkeleton
    add/        AddPlaceForm
  pages/        HomePage, RestaurantPage, SavedPage, AddPlacePage, NotFoundPage
  lib/          format, freshness, occasions, placeholderPhoto
  router.tsx    routes
supabase/            schema.sql (tables + security) and seed.sql (placeholder data)
tailwind.config.ts   design tokens (colors, radii, spacing, type scale, shadows)
```

Components and hooks only talk to `src/services`. They never import `src/data` (ESLint enforces this).

## Changing the look

All design tokens live in `tailwind.config.ts`: the color palette (`cream`, `brand`, `accent`, `ink`...), radii (`rounded-card`, `rounded-chip`), the 44px touch size (`min-h-touch`), the type scale (`text-title`, `text-display`...) and shadows. Change them there and the whole app follows.

## Changing the data

- Edit `src/data/mockRestaurants.ts` (it is marked as placeholder data).
- Photos come from `src/lib/placeholderPhoto.ts` (seeded picsum.photos images, so they are random and not food photos; they need an internet connection). Replace the `photos` arrays with real image URLs whenever you like.

## Supabase back end

The app talks to Supabase when it has a URL and an anon key; without them it silently falls back to the local mock data (handy for offline demos). The switch lives in one file, `src/services/index.ts`.

### One-time setup

1. In the Supabase dashboard open **SQL Editor** and run, in this order:
   1. `supabase/schema.sql`: tables, row level security, policies.
   2. `supabase/seed.sql`: the 10 placeholder restaurants. (Re-running it replaces them.)
2. Copy `.env.example` to `.env.local` and paste your **anon (public) key** from *Project Settings > API Keys*:
   ```bash
   cp .env.example .env.local
   ```
3. Restart `npm run dev`. You should see the 10 seeded places on Home, and saved places appear in the `saved_places` table.

### How it works

- `src/lib/supabaseClient.ts`: creates the client from the env vars (anon key only).
- `src/lib/deviceId.ts`: a random id per browser (`cc.deviceId` in localStorage). It is sent as the `x-device-id` header, and row level security only lets a device read, add and delete its own `saved_places`. Restaurants are read-only to the app.
- `src/services/supabase/`: `supabaseRestaurantService.ts`, `supabaseSavedPlaceService.ts` and `mappers.ts` (snake_case database rows to the app's types).
- `src/data/mockRestaurants.ts` is still the source for `seed.sql`. To change the live data, edit the rows in Supabase (Table Editor) or update `seed.sql`.

### Security notes

- Never put the `service_role` key in this app or in git. Only the anon key belongs in `.env.local`.
- The device id is "prototype privacy": it keeps testers' lists separate, but anyone who learns a device id could act as that device. Real accounts (Supabase Auth) would replace it.
- Photos still use placeholder URLs. When you have real photos, upload them to Supabase Storage and update `restaurants.photos`.

## Accessibility notes

Semantic landmarks and headings, skip link, visible focus ring, 44px minimum tap targets, alt text on all photos, labelled form fields with inline errors, `aria-pressed` on toggle chips, loading/error regions announced to screen readers, and reduced-motion support.
