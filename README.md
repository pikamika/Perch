# Confidence Card

A mobile-first prototype that helps NYC food lovers gain confidence in a restaurant in seconds: is the vibe right for my occasion, what does it cost, and what should I order?

This is a **front-end-only** class prototype. All data comes from a local mock layer. Supabase will be the back end later; see [Connecting Supabase](#connecting-supabase).

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

Saved places are stored in `localStorage` (key `cc.savedPlaces.v1`). Clear that key to reset.

## Folder structure

```
src/
  types/        Domain types: Restaurant, Dish, Occasion, PriceBand, SavedPlace, filters
  data/         mockRestaurants.ts, 10 FICTIONAL placeholder restaurants (edit freely)
  services/     The data access layer
    restaurantService.ts      interface: listRestaurants, getRestaurant
    savedPlaceService.ts      interface: listSavedPlaces, savePlace, removeSavedPlace
    mock/                     in-memory + localStorage implementations, fake latency
    index.ts                  picks which implementation the app uses
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
tailwind.config.ts   design tokens (colors, radii, spacing, type scale, shadows)
```

Components and hooks only talk to `src/services`. They never import `src/data` (ESLint enforces this).

## Changing the look

All design tokens live in `tailwind.config.ts`: the color palette (`cream`, `brand`, `accent`, `ink`...), radii (`rounded-card`, `rounded-chip`), the 44px touch size (`min-h-touch`), the type scale (`text-title`, `text-display`...) and shadows. Change them there and the whole app follows.

## Changing the data

- Edit `src/data/mockRestaurants.ts` (it is marked as placeholder data).
- Photos come from `src/lib/placeholderPhoto.ts` (seeded picsum.photos images, so they are random and not food photos; they need an internet connection). Replace the `photos` arrays with real image URLs whenever you like.

## Connecting Supabase

Nothing Supabase-related is installed or called yet. `.env.example` holds the placeholder variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. To connect later, touch **only** these files:

1. **Install** `@supabase/supabase-js` and copy `.env.example` to `.env.local` with your real values.
2. **Add `src/lib/supabaseClient.ts`**: create the client from `import.meta.env.VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. **Add `src/services/supabase/supabaseRestaurantService.ts`**: implement `RestaurantService` (`listRestaurants`, `getRestaurant`; throw `NotFoundError` when a row is missing).
4. **Add `src/services/supabase/supabaseSavedPlaceService.ts`**: implement `SavedPlaceService` (`listSavedPlaces`, `savePlace`, `removeSavedPlace`).
5. **Edit `src/services/index.ts`**: change the two exports to the new Supabase services. This is the only line-level switch.
6. **Clean up**: delete `src/data/mockRestaurants.ts` and `src/services/mock/` when you no longer need them.

No component, hook or page needs to change. If your tables use different column names (for example `photos_updated_at`), map them to the `Restaurant` and `SavedPlace` types inside the Supabase services.

## Accessibility notes

Semantic landmarks and headings, skip link, visible focus ring, 44px minimum tap targets, alt text on all photos, labelled form fields with inline errors, `aria-pressed` on toggle chips, loading/error regions announced to screen readers, and reduced-motion support.
