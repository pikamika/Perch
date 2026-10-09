-- Confidence Card: database schema
-- Run this FIRST in the Supabase dashboard: SQL Editor > New query > paste > Run.
-- Then run seed.sql. Safe to re-run on a fresh project (uses IF NOT EXISTS / DROP POLICY IF EXISTS).
-- Already ran an older version (device-id based saved places)? Run
-- supabase/migrations/001_saved_places_belong_to_users.sql instead.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- restaurants: public, read-only from the app
-- ---------------------------------------------------------------------------
create table if not exists public.restaurants (
  id                       uuid primary key default gen_random_uuid(),
  name                     text not null,
  neighborhood             text not null,
  cuisine                  text not null,
  price_band               text not null check (price_band in ('$', '$$', '$$$')),
  typical_spend_per_person integer not null check (typical_spend_per_person >= 0),
  photos                   text[] not null check (cardinality(photos) between 3 and 5),
  lighting                 text not null check (lighting in ('natural', 'warm', 'dim', 'neon')),
  best_for                 text[] not null default '{}'
                             check (best_for <@ array['date', 'birthday', 'friends', 'solo']),
  vibe_tags                text[] not null default '{}',
  -- array of { "name": text, "note": text (optional) }, 2 to 3 dishes
  what_to_order            jsonb not null check (jsonb_typeof(what_to_order) = 'array'),
  photos_updated_at        date not null,
  source_url               text,
  created_at               timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- saved_places: owned by a signed-in user (Supabase Auth)
-- ---------------------------------------------------------------------------
create table if not exists public.saved_places (
  id            uuid primary key default gen_random_uuid(),
  -- Filled in automatically from the signed-in user's session.
  user_id       uuid not null default auth.uid() references auth.users (id) on delete cascade,
  restaurant_id uuid references public.restaurants (id) on delete set null,
  name          text not null check (length(trim(name)) > 0),
  source_url    text,
  occasions     text[] not null default '{}'
                  check (occasions <@ array['date', 'birthday', 'friends', 'solo']),
  saved_at      timestamptz not null default now()
);

create index if not exists saved_places_user_idx
  on public.saved_places (user_id, saved_at desc);

-- A user can save the same restaurant only once.
create unique index if not exists saved_places_user_restaurant_uniq
  on public.saved_places (user_id, restaurant_id)
  where restaurant_id is not null;

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------
alter table public.restaurants  enable row level security;
alter table public.saved_places enable row level security;

-- Anyone (even signed out) can read restaurants. Nobody can write them from the app.
drop policy if exists "restaurants are readable by everyone" on public.restaurants;
create policy "restaurants are readable by everyone"
  on public.restaurants for select
  to anon, authenticated
  using (true);

-- Signed-in users can only see, add and delete their own saved places.
drop policy if exists "users read their own saved places" on public.saved_places;
create policy "users read their own saved places"
  on public.saved_places for select
  to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "users add their own saved places" on public.saved_places;
create policy "users add their own saved places"
  on public.saved_places for insert
  to authenticated
  with check (user_id = (select auth.uid()));

drop policy if exists "users delete their own saved places" on public.saved_places;
create policy "users delete their own saved places"
  on public.saved_places for delete
  to authenticated
  using (user_id = (select auth.uid()));

-- No update policy on purpose: saved places are created or removed, never edited.

-- Table privileges for the API roles (RLS above does the row filtering).
grant select on public.restaurants to anon, authenticated;
revoke all on public.saved_places from anon;
grant select, insert, delete on public.saved_places to authenticated;
