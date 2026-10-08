-- Confidence Card: database schema
-- Run this FIRST in the Supabase dashboard: SQL Editor > New query > paste > Run.
-- Then run seed.sql. Safe to re-run (uses IF NOT EXISTS / DROP POLICY IF EXISTS).

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
-- saved_places: scoped to one device via the x-device-id request header
-- ---------------------------------------------------------------------------
create table if not exists public.saved_places (
  id            uuid primary key default gen_random_uuid(),
  device_id     text not null check (length(device_id) between 8 and 100),
  restaurant_id uuid references public.restaurants (id) on delete set null,
  name          text not null check (length(trim(name)) > 0),
  source_url    text,
  occasions     text[] not null default '{}'
                  check (occasions <@ array['date', 'birthday', 'friends', 'solo']),
  saved_at      timestamptz not null default now()
);

create index if not exists saved_places_device_idx
  on public.saved_places (device_id, saved_at desc);

-- A device can save the same restaurant only once.
create unique index if not exists saved_places_device_restaurant_uniq
  on public.saved_places (device_id, restaurant_id)
  where restaurant_id is not null;

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------
alter table public.restaurants  enable row level security;
alter table public.saved_places enable row level security;

-- Anyone can read restaurants. Nobody can write them from the app.
drop policy if exists "restaurants are readable by everyone" on public.restaurants;
create policy "restaurants are readable by everyone"
  on public.restaurants for select
  to anon, authenticated
  using (true);

-- The app sends a random per-device id in the x-device-id header.
-- A device may only see, add and delete its own saved places.
-- (Prototype-grade privacy: anyone who knows a device id could act as that device.)
create or replace function public.request_device_id()
returns text
language sql
stable
as $$
  select nullif(
    coalesce(current_setting('request.headers', true), '{}')::json ->> 'x-device-id',
    ''
  )
$$;

drop policy if exists "devices read their own saved places" on public.saved_places;
create policy "devices read their own saved places"
  on public.saved_places for select
  to anon, authenticated
  using (device_id = public.request_device_id());

drop policy if exists "devices add their own saved places" on public.saved_places;
create policy "devices add their own saved places"
  on public.saved_places for insert
  to anon, authenticated
  with check (device_id = public.request_device_id());

drop policy if exists "devices delete their own saved places" on public.saved_places;
create policy "devices delete their own saved places"
  on public.saved_places for delete
  to anon, authenticated
  using (device_id = public.request_device_id());

-- No update policy on purpose: saved places are created or removed, never edited.

-- Table privileges for the API roles (RLS above does the row filtering).
grant select on public.restaurants to anon, authenticated;
grant select, insert, delete on public.saved_places to anon, authenticated;
