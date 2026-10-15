# Perch

Find a cafe you can actually work from.

Remote workers want to work from cafes, but Google Maps does not say whether a cafe has Wi-Fi, outlets or open seats. Finding out means digging through reviews and betting it is not packed. Too often they walk in, find no seat, and give up and go home.

Perch answers that before you leave home: how good the Wi-Fi is (and whether you must buy something for the password), how many outlets there are, whether there are seats, how loud it is, and when it is busiest, all on one glanceable page.

**Persona: Miyuki**, mid to late 20s, a remote product designer in New York. She loves TikTok-trendy cafes and walks with a coffee or matcha in hand, and wants to use her remote-work flexibility to work from cafes. Her pain points: no seats, no Wi-Fi, no outlets, too expensive, Wi-Fi that needs a purchase, slow or insecure Wi-Fi. She has a phone hotspot, but free Wi-Fi is still preferable.

This is a class prototype. The front end reads and writes data through a service layer that can run on local mock data or on Supabase; see [Supabase back end](#supabase-back-end). The product name lives in one place: `src/lib/brand.ts`.

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

- **Log in / Create account (`/login`, `/signup`)**: email and password. Sign-up also asks for first name, last name and city. The button stays disabled until every field is filled; the eye icon inside the password field shows or hides it.
- **Discover (`/`)**: "Hi {first name}", your city, four purpose shortcuts (Focus time, Calls, Quick sprint, Coffee walk), must-have toggles (Free Wi-Fi, Outlets, Easy seating, Quiet) and a budget for a drink plus a snack. Below are your top 3 and swipeable sections: "Solid backups" (chains that almost always have Wi-Fi), "TikTok found it first", "Outlets everywhere", "Quiet enough for calls", "Always a seat" and "Matcha and a walk". Every filter applies to every section. Choices live in the URL (`/?purpose=focus&needs=wifi,outlets&budget=10`).
- **Cafe page (`/place/:id`)**: swipeable photos, a one-glance verdict ("Great for working", "Works in a pinch", "Better for a quick stop"), and a **Work check** with Wi-Fi (free, with purchase or none, plus speed and whether the network is password-protected), outlets, seating, noise, laptop policy, best time to work, busiest times, and how recently those details were checked. Then what to order, what it costs, vibe, and a save button.
- **Saved (`/saved`)**: your saved cafes, filterable by purpose, with an empty state.
- **Add a cafe (`/add`)**: paste a TikTok, Instagram or Google Maps link and a name; saves it to your list (no link parsing).
- **Account (`/account`)**: edit your first name (cannot be empty) and location. Email is shown but cannot be changed. Everyone's profile picture is the same coffee cup. Log out lives here.

Your city is saved and shown, but it does not filter results yet: cafes only have a neighborhood, so there is nothing to match it against.

The ranking of "top 3" is a simple work score (Wi-Fi, outlets, seating, quiet, laptop-friendly) in `src/lib/work.ts`; Coffee walk skips the work details and favors grab-and-go places.

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
  types/        Domain types: Cafe, Dish, Purpose, Need, PriceBand, SavedPlace, Profile, Collection, filters
  data/         mockCafes.ts and mockCollections.ts: 15 FICTIONAL placeholder cafes (mock fallback + seed source)
  services/     The data access layer
    cafeService.ts            interface: listCafes, getCafe
    savedPlaceService.ts      interface: listSavedPlaces, savePlace, removeSavedPlace
    mock/                     in-memory + localStorage implementations, fake latency
    supabase/                 Supabase implementations + row mappers
    index.ts                  picks Supabase (if configured) or mock
  hooks/        useAsync, useCafes, useCafe, useCollections, useSavedPlaces, useProfile, useAuth
  components/
    layout/     AppShell, BottomNav (mobile), TopNav (tablet/desktop), PageHeader, BackButton
    ui/         Button, Chip, TextField, Skeleton, EmptyState, ErrorState, icons...
    discover/   PurposePicker, NeedsFilter, BudgetSlider, CafeRow, RowSkeleton
    cafe/       CafeTile, WorkCheck, WorkChips, WorkVerdictBadge, PhotoStrip, PurposeChips, WhatToOrder, ...
    saved/      SavedItem, PurposeFilter, SavedSkeleton
    add/        AddPlaceForm
  pages/        DiscoverPage, CafePage, SavedPage, AddPlacePage, LoginPage, SignupPage, AccountPage, NotFoundPage
  lib/          brand, work (ranking + labels), filterCafes, freshness, purposes, placeholderPhoto
  router.tsx    routes
supabase/            schema.sql (tables + security) and seed.sql (placeholder data)
tailwind.config.ts   design tokens (colors, radii, spacing, type scale, shadows)
```

Components and hooks only talk to `src/services`. They never import `src/data` (ESLint enforces this).

## Changing the look

All design tokens live in `tailwind.config.ts`: the coffee-earthtone color palette (`cream`, `brand`, `accent`, `ink`...), radii (`rounded-card`, `rounded-chip`), the 44px touch size (`min-h-touch`), the type scale (`text-title`, `text-display`...) and shadows. Change them there and the whole app follows.

Fonts: headings use Fraunces (its rounded "soft" variant, bundled via `@fontsource-variable/fraunces`, so no external font requests); body text uses a clean sans-serif (Inter if installed, otherwise the system font). The font families are set in `tailwind.config.ts` and applied to headings in `src/index.css`.

## Changing the data

- Edit `src/data/mockCafes.ts` and `src/data/mockCollections.ts` (both are marked as placeholder data). Every cafe is fictional, including the chains.
- Photos come from `src/lib/placeholderPhoto.ts` (seeded picsum.photos images, so they are random landscapes rather than cafe photos; they need an internet connection). Replace the `photos` arrays with real image URLs whenever you like.

## Supabase back end

The app talks to Supabase when it has a URL and an anon key; without them it silently falls back to the local mock data (handy for offline demos). The switch lives in one file, `src/services/index.ts`.

### One-time setup

1. In the Supabase dashboard open **SQL Editor** and run, in this order:
   1. `supabase/schema.sql`: tables, row level security, policies.
   2. `supabase/seed.sql`: the 15 placeholder cafes and the 6 Discover collections. (Re-running it replaces them.)
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
- `src/services/supabase/`: cafe, saved place, profile, collection and auth services plus `mappers.ts` (snake_case database rows to the app's types).
- `profiles` table: first name, last name and city. A database trigger creates the row at sign-up from the details the sign-up form sends, so it works whether or not email confirmation is on. The Account page edits it (row level security: users only touch their own row).
- `collections` and `collection_cafes` tables: the editorial sections on Discover. Edit them in the Supabase Table Editor to change what shows up and in what order (`sort_order`, `position`).
- `saved_places` rows belong to a user (`user_id` fills itself from the session). Row level security lets a signed-in user read, add and delete only their own rows; signed-out visitors have no access. `cafes` are readable by everyone and read-only to the app.
- `src/data/mockCafes.ts` and `mockCollections.ts` are still the source for `seed.sql`. To change the live data, edit the rows in Supabase (Table Editor) or update `seed.sql`.

### Security notes

- Never put the `service_role` key in this app or in git. Only the anon key belongs in `.env.local`.
- Passwords are handled entirely by Supabase Auth; the app never stores them.
- Work details (Wi-Fi, outlets, seats, noise) are hand-entered placeholder data. Real cafes will need a source for them: see the notes below.
- Not built yet: password reset ("forgot password"), changing email or password, deleting an account, social login.
- Photos still use placeholder URLs. When you have real photos, upload them to Supabase Storage and update `cafes.photos`.

## Where real cafe data could come from

Nothing here is connected yet; these are notes for when the placeholder cafes get replaced.

- **Google Places API (New)** is the usual source for real cafes (names, addresses, photos, hours, ratings). It is not free-unlimited: Google gives a monthly free allowance per billing SKU (roughly 10,000 calls for the basic "Essentials" SKUs, 5,000 for "Pro" and 1,000 for "Enterprise" fields at the time of writing; check Google's pricing page), and billing must be enabled. As far as we know it has no Wi-Fi or outlet field, so it cannot answer the main question by itself.
- **OpenStreetMap** is free and has `internet_access=wlan` and `internet_access:fee` tags for Wi-Fi, but coverage is patchy and outlets are rarely tagged. The public Overpass server expects light, polite use.
- **Foursquare Places** has a free developer tier; whether its Wi-Fi attribute is included in the free fields should be checked in their docs.
- **Crowdsourcing** is the realistic answer for outlets, seats and "do I need to buy something for the password": let people report and confirm those details, and show how recently they were checked (the "Work details checked" line is already there for that).

## Accessibility notes

Semantic landmarks and headings, skip link, visible focus ring, 44px minimum tap targets, alt text on all photos, labelled form fields with inline errors, `aria-pressed` on toggle chips, loading/error regions announced to screen readers, and reduced-motion support.
