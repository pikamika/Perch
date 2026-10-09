-- Upgrade for projects created with the older, device-id based schema.sql.
-- saved_places now belong to a signed-in user (Supabase Auth).
-- Applied to the live project. Only run on a table you can afford to clear of old rows:
-- existing rows have no user and the NOT NULL column below will fail if any exist.

drop policy if exists "devices read their own saved places" on public.saved_places;
drop policy if exists "devices add their own saved places" on public.saved_places;
drop policy if exists "devices delete their own saved places" on public.saved_places;
drop function if exists public.request_device_id();

drop index if exists public.saved_places_device_idx;
drop index if exists public.saved_places_device_restaurant_uniq;
alter table public.saved_places drop column device_id;

alter table public.saved_places
  add column user_id uuid not null default auth.uid() references auth.users (id) on delete cascade;

create index saved_places_user_idx on public.saved_places (user_id, saved_at desc);

create unique index saved_places_user_restaurant_uniq
  on public.saved_places (user_id, restaurant_id)
  where restaurant_id is not null;

create policy "users read their own saved places"
  on public.saved_places for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy "users add their own saved places"
  on public.saved_places for insert
  to authenticated
  with check (user_id = (select auth.uid()));

create policy "users delete their own saved places"
  on public.saved_places for delete
  to authenticated
  using (user_id = (select auth.uid()));

revoke all on public.saved_places from anon;
grant select, insert, delete on public.saved_places to authenticated;
