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

Everything except Log in and Create account needs an account; the navigation bar only appears once you are logged in.

- **Log in / Create account (`/login`, `/signup`)**: email and password. Sign-up also asks for first name and city. The button stays disabled until every field is filled; the eye icon inside the password field shows or hides it.
- **Discover (`/`)**: "Hi {first name}", your city, round occasion shortcuts, an optional budget, your top 3 picks, then swipeable sections like "Trending on TikTok" and "Flushing food crawl eats". The occasion and budget filter every section. Choices live in the URL (`/?occasion=date&budget=30`).
- **Confidence card (`/place/:id`)**: swipeable photos, best-for chips (your occasion is highlighted), price, what to order, photo freshness, save button.
- **Saved (`/saved`)**: your saved places, filterable by occasion, with an empty state.
- **Add a place (`/add`)**: paste a link and a name; saves it to your list (no link parsing).
- **Account (`/account`)**: edit your first name (cannot be empty), location and profile picture (any emoji on one of 7 background colors; new accounts start with a random food emoji on a background that contrasts with it). Email is shown but cannot be changed. Log out lives here.

Your city is saved and shown, but it does not filter results yet: restaurants only have a neighborhood, so there is nothing to match it against.

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
    discover/   OccasionPicker, BudgetSlider, RestaurantRow, RowSkeleton
    restaurant/ RestaurantCardCompact, PhotoStrip, OccasionChips, WhatToOrder, ...
    saved/      SavedItem, OccasionFilter, SavedSkeleton
    add/        AddPlaceForm
  pages/        DiscoverPage, RestaurantPage, SavedPage, AddPlacePage, LoginPage, SignupPage, AccountPage, NotFoundPage
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
   2. `supabase/seed.sql`: the 14 placeholder restaurants and the 5 Discover collections. (Re-running it replaces them.)
   (Project created with the older device-id version? See `supabase/migrations/README.md`.)
2. Copy `.env.example` to `.env.local` and paste your **anon (public) key** from *Project Settings > API Keys*:
   ```bash
   cp .env.example .env.local
   ```
3. Set up email login (below), then restart `npm run dev`.

### Accounts and email login

Accounts use Supabase Auth with email and password. Created users appear in the dashboard under **Authentication > Users**.

**Confirm email** (Authentication > Providers > Email) can be on or off, and the app works either way:

- **Off** (current setup): signing up logs the person in straight away and no email is sent. Anyone can register with an address they don't own, so turn it on before real users arrive.
- **On**: new people see "Check your email" and must click the link before they can log in. Then you also need, in the dashboard:
  - **Authentication > URL Configuration**: set **Site URL** to where the app runs (`http://localhost:5173` while developing, your real address once deployed) and add the same address under **Redirect URLs**. Otherwise the link in the email opens a broken page.
  - **Authentication > SMTP Settings**: Supabase's built-in email sender is for testing only and allows just a few emails per hour. Use your own SMTP provider for a real site.

The app requires passwords of 8+ characters; you can raise the minimum under **Authentication > Sign In / Providers**.

With no Supabase variables set (mock mode), login accepts any email and password and nothing is verified or stored remotely.

### How it works

- `src/lib/supabaseClient.ts`: creates the client from the env vars (anon key only). The session is kept in localStorage and refreshed automatically.
- `src/services/authService.ts` plus `supabase/supabaseAuthService.ts` and `mock/mockAuthService.ts`: sign up, log in, log out, current user. `src/components/auth/AuthProvider.tsx` and `src/hooks/useAuth.ts` expose it to the UI; `RequireAuth.tsx` guards the account-only routes.
- `src/services/supabase/`: restaurant, saved place, profile, collection and auth services plus `mappers.ts` (snake_case database rows to the app's types).
- `profiles` table: first name, city, avatar emoji and color. A database trigger creates the row at sign-up from the details the sign-up form sends, so it works whether or not email confirmation is on. The Account page edits it (row level security: users only touch their own row).
- `collections` and `collection_restaurants` tables: the editorial sections on Discover. Edit them in the Supabase Table Editor to change what shows up and in what order (`sort_order`, `position`).
- `saved_places` rows belong to a user (`user_id` fills itself from the session). Row level security lets a signed-in user read, add and delete only their own rows; signed-out visitors have no access. Restaurants are readable by everyone and read-only to the app.
- `src/data/mockRestaurants.ts` is still the source for `seed.sql`. To change the live data, edit the rows in Supabase (Table Editor) or update `seed.sql`.

### Security notes

- Never put the `service_role` key in this app or in git. Only the anon key belongs in `.env.local`.
- Passwords are handled entirely by Supabase Auth; the app never stores them.
- Not built yet: password reset ("forgot password"), changing email or password, deleting an account, social login.
- Photos still use placeholder URLs. When you have real photos, upload them to Supabase Storage and update `restaurants.photos`.

## Accessibility notes

Semantic landmarks and headings, skip link, visible focus ring, 44px minimum tap targets, alt text on all photos, labelled form fields with inline errors, `aria-pressed` on toggle chips, loading/error regions announced to screen readers, and reduced-motion support.
