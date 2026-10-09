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

-- ---------------------------------------------------------------------------
-- profiles: one row per user (first name, city, avatar)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id           uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  first_name   text not null check (length(trim(first_name)) between 1 and 60),
  city         text not null default '' check (length(city) <= 100),
  avatar_emoji text not null check (length(avatar_emoji) between 1 and 32),
  avatar_color text not null check (avatar_color in ('red', 'orange', 'yellow', 'green', 'blue', 'purple', 'black')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "users read their own profile" on public.profiles;
create policy "users read their own profile"
  on public.profiles for select
  to authenticated
  using (id = (select auth.uid()));

drop policy if exists "users create their own profile" on public.profiles;
create policy "users create their own profile"
  on public.profiles for insert
  to authenticated
  with check (id = (select auth.uid()));

drop policy if exists "users update their own profile" on public.profiles;
create policy "users update their own profile"
  on public.profiles for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

revoke all on public.profiles from anon;
grant select, insert, update on public.profiles to authenticated;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Create the profile automatically when someone signs up. The app sends first_name, city,
-- avatar_emoji and avatar_color as sign-up metadata, so this also works when email confirmation
-- is on (no session yet). Never blocks sign-up: anything missing or invalid falls back to a default.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta  jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  fname text  := nullif(trim(coalesce(meta ->> 'first_name', '')), '');
  color text  := coalesce(meta ->> 'avatar_color', '');
begin
  insert into public.profiles (id, first_name, city, avatar_emoji, avatar_color)
  values (
    new.id,
    left(coalesce(fname, nullif(split_part(coalesce(new.email, ''), '@', 1), ''), 'Friend'), 60),
    left(trim(coalesce(meta ->> 'city', '')), 100),
    left(coalesce(nullif(trim(coalesce(meta ->> 'avatar_emoji', '')), ''), '🍜'), 32),
    case when color in ('red', 'orange', 'yellow', 'green', 'blue', 'purple', 'black') then color else 'orange' end
  );
  return new;
end
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- collections: editorial sections on the Discover screen ("Trending on TikTok", ...)
-- ---------------------------------------------------------------------------
create table if not exists public.collections (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  subtitle   text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.collection_restaurants (
  collection_id uuid not null references public.collections (id) on delete cascade,
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  position      integer not null default 0,
  primary key (collection_id, restaurant_id)
);

create index if not exists collection_restaurants_restaurant_idx on public.collection_restaurants (restaurant_id);

alter table public.collections enable row level security;
alter table public.collection_restaurants enable row level security;

drop policy if exists "collections are readable by everyone" on public.collections;
create policy "collections are readable by everyone"
  on public.collections for select
  to anon, authenticated
  using (true);

drop policy if exists "collection items are readable by everyone" on public.collection_restaurants;
create policy "collection items are readable by everyone"
  on public.collection_restaurants for select
  to anon, authenticated
  using (true);

grant select on public.collections to anon, authenticated;
grant select on public.collection_restaurants to anon, authenticated;
