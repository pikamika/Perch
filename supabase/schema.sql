-- Perch: database schema
-- Run this FIRST in the Supabase dashboard: SQL Editor > New query > paste > Run.
-- Then run seed.sql. Safe to re-run on a fresh project (uses IF NOT EXISTS / DROP POLICY IF EXISTS).
-- Upgrading an older project? See supabase/migrations/README.md.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- cafes: public, read-only from the app
-- ---------------------------------------------------------------------------
create table if not exists public.cafes (
  id                       uuid primary key default gen_random_uuid(),
  name                     text not null,
  neighborhood             text not null,
  specialty                text not null,
  chain_name               text,
  price_band               text not null check (price_band in ('$', '$$', '$$$')),
  typical_spend_per_person integer not null check (typical_spend_per_person >= 0),
  photos                   text[] not null check (cardinality(photos) between 3 and 5),
  lighting                 text not null check (lighting in ('natural', 'warm', 'dim', 'neon')),
  best_for                 text[] not null default '{}'
                             check (best_for <@ array['focus', 'calls', 'sprint', 'walk']),
  vibe_tags                text[] not null default '{}',
  -- array of { "name": text, "note": text (optional) }
  what_to_order            jsonb not null check (jsonb_typeof(what_to_order) = 'array'),
  photos_updated_at        date not null,
  source_url               text,
  -- Work details
  wifi                     text not null check (wifi in ('free', 'free-with-purchase', 'paid', 'none')),
  wifi_speed               text check (wifi_speed in ('fast', 'ok', 'slow')),
  wifi_secured             boolean not null default false,
  outlets                  text not null check (outlets in ('plenty', 'some', 'few', 'none')),
  seating                  text not null check (seating in ('plenty', 'some', 'limited')),
  noise                    text not null check (noise in ('quiet', 'moderate', 'loud')),
  laptop_friendly          boolean not null default true,
  best_time_to_work        text not null default '',
  busiest_times            text not null default '',
  work_info_updated_at     date not null,
  created_at               timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- saved_places: owned by a signed-in user (Supabase Auth)
-- ---------------------------------------------------------------------------
create table if not exists public.saved_places (
  id         uuid primary key default gen_random_uuid(),
  -- Filled in automatically from the signed-in user's session.
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  cafe_id    uuid references public.cafes (id) on delete set null,
  name       text not null check (length(trim(name)) > 0),
  source_url text,
  purposes   text[] not null default '{}'
               check (purposes <@ array['focus', 'calls', 'sprint', 'walk']),
  saved_at   timestamptz not null default now()
);

create index if not exists saved_places_user_idx
  on public.saved_places (user_id, saved_at desc);
create index if not exists saved_places_cafe_idx
  on public.saved_places (cafe_id);

-- A user can save the same cafe only once.
create unique index if not exists saved_places_user_cafe_uniq
  on public.saved_places (user_id, cafe_id)
  where cafe_id is not null;

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------
alter table public.cafes        enable row level security;
alter table public.saved_places enable row level security;

-- Anyone (even signed out) can read cafes. Nobody can write them from the app.
drop policy if exists "cafes are readable by everyone" on public.cafes;
create policy "cafes are readable by everyone"
  on public.cafes for select
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
grant select on public.cafes to anon, authenticated;
revoke all on public.saved_places from anon;
grant select, insert, delete on public.saved_places to authenticated;

-- ---------------------------------------------------------------------------
-- profiles: one row per user (first name, last name, city)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id           uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  first_name   text not null check (length(trim(first_name)) between 1 and 60),
  last_name    text not null default '' check (length(last_name) <= 60),
  city         text not null default '' check (length(city) <= 100),
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

-- Create the profile automatically when someone signs up. The app sends first_name, last_name
-- and city as sign-up metadata, so this also works when email confirmation
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
begin
  insert into public.profiles (id, first_name, last_name, city)
  values (
    new.id,
    left(coalesce(fname, nullif(split_part(coalesce(new.email, ''), '@', 1), ''), 'Friend'), 60),
    left(trim(coalesce(meta ->> 'last_name', '')), 60),
    left(trim(coalesce(meta ->> 'city', '')), 100)
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

create table if not exists public.collection_cafes (
  collection_id uuid not null references public.collections (id) on delete cascade,
  cafe_id       uuid not null references public.cafes (id) on delete cascade,
  position      integer not null default 0,
  primary key (collection_id, cafe_id)
);

create index if not exists collection_cafes_cafe_idx on public.collection_cafes (cafe_id);

alter table public.collections enable row level security;
alter table public.collection_cafes enable row level security;

drop policy if exists "collections are readable by everyone" on public.collections;
create policy "collections are readable by everyone"
  on public.collections for select
  to anon, authenticated
  using (true);

drop policy if exists "collection items are readable by everyone" on public.collection_cafes;
create policy "collection items are readable by everyone"
  on public.collection_cafes for select
  to anon, authenticated
  using (true);

grant select on public.collections to anon, authenticated;
grant select on public.collection_cafes to anon, authenticated;
