-- Perch: PLACEHOLDER seed data (15 fictional cafes and 6 Discover collections)
-- Run this AFTER schema.sql. Replace with real places later.
-- Re-running clears and re-inserts cafes and collections (saved places pointing at them become unlinked).

delete from public.collections;
delete from public.cafes;

insert into public.cafes
  (name, neighborhood, specialty, chain_name, price_band, typical_spend_per_person,
   photos, lighting, best_for, vibe_tags, what_to_order,
   photos_updated_at, source_url,
   wifi, wifi_speed, wifi_secured, outlets, seating, noise, laptop_friendly,
   best_time_to_work, busiest_times, work_info_updated_at)
values
  ('Matcha Mood', 'Williamsburg', 'Matcha bar', null, '$$', 9, array['https://picsum.photos/seed/matcha-mood-1/900/700', 'https://picsum.photos/seed/matcha-mood-2/900/700', 'https://picsum.photos/seed/matcha-mood-3/900/700', 'https://picsum.photos/seed/matcha-mood-4/900/700'], 'natural', array['walk', 'sprint'], array['matcha', 'pastel', 'photogenic'], '[{"name":"Ceremonial matcha latte","note":"Ask for it iced in the glass cup"},{"name":"Strawberry mochi donut"}]'::jsonb, '2026-09-28', 'https://www.tiktok.com/@example/video/0000000001', 'free-with-purchase', 'ok', false, 'few', 'limited', 'moderate', false, 'Weekdays before 10am', 'Weekends all day, line out the door', '2026-09-20'),
  ('Oat & Orchid', 'East Village', 'Plant-filled coffee shop', null, '$$', 10, array['https://picsum.photos/seed/oat-orchid-1/900/700', 'https://picsum.photos/seed/oat-orchid-2/900/700', 'https://picsum.photos/seed/oat-orchid-3/900/700', 'https://picsum.photos/seed/oat-orchid-4/900/700', 'https://picsum.photos/seed/oat-orchid-5/900/700'], 'natural', array['focus', 'calls', 'sprint'], array['plants', 'sunny', 'calm'], '[{"name":"Oat flat white"},{"name":"Cardamom bun","note":"Gone by noon on weekends"}]'::jsonb, '2026-10-02', 'https://www.tiktok.com/@example/video/0000000002', 'free', 'fast', true, 'plenty', 'plenty', 'quiet', true, 'Weekdays, any time', 'Saturday brunch, 11am to 2pm', '2026-10-02'),
  ('Sunday Bun Bakery Café', 'Greenpoint', 'Bakery café', null, '$', 7, array['https://picsum.photos/seed/sunday-bun-1/900/700', 'https://picsum.photos/seed/sunday-bun-2/900/700', 'https://picsum.photos/seed/sunday-bun-3/900/700', 'https://picsum.photos/seed/sunday-bun-4/900/700'], 'warm', array['focus', 'sprint'], array['cozy', 'carb heaven', 'neighborhood'], '[{"name":"Brown butter cinnamon bun"},{"name":"Drip coffee","note":"Free refills with a pastry"}]'::jsonb, '2026-09-15', 'https://www.tiktok.com/@example/video/0000000003', 'free-with-purchase', 'ok', false, 'some', 'some', 'moderate', true, 'Weekday mornings', 'Weekends, 9am to noon', '2026-09-15'),
  ('The Long Table', 'Bushwick', 'Co-working style café', null, '$$', 10, array['https://picsum.photos/seed/long-table-1/900/700', 'https://picsum.photos/seed/long-table-2/900/700', 'https://picsum.photos/seed/long-table-3/900/700', 'https://picsum.photos/seed/long-table-4/900/700'], 'warm', array['focus', 'calls', 'sprint'], array['spacious', 'productive', 'communal tables'], '[{"name":"Cortado"},{"name":"Egg and cheddar sandwich","note":"Good all-day fuel"}]'::jsonb, '2026-10-04', null, 'free', 'fast', true, 'plenty', 'plenty', 'moderate', true, 'Any weekday', 'Friday afternoons', '2026-10-04'),
  ('Kiln Coffee Co.', 'Lower East Side', 'Espresso bar', null, '$', 5, array['https://picsum.photos/seed/kiln-coffee-1/900/700', 'https://picsum.photos/seed/kiln-coffee-2/900/700', 'https://picsum.photos/seed/kiln-coffee-3/900/700'], 'dim', array['walk'], array['tiny', 'standing room', 'serious espresso'], '[{"name":"Double espresso"},{"name":"Cortado"}]'::jsonb, '2026-08-30', null, 'none', null, false, 'none', 'limited', 'loud', false, 'Not a work spot: grab and go', 'Mornings, 8 to 10am', '2026-08-30'),
  ('Paper Moon Café', 'West Village', 'Quiet café and wine bar', null, '$$$', 16, array['https://picsum.photos/seed/paper-moon-1/900/700', 'https://picsum.photos/seed/paper-moon-2/900/700', 'https://picsum.photos/seed/paper-moon-3/900/700', 'https://picsum.photos/seed/paper-moon-4/900/700', 'https://picsum.photos/seed/paper-moon-5/900/700'], 'dim', array['calls', 'focus'], array['hushed', 'candlelit', 'bookish'], '[{"name":"Lavender oat latte"},{"name":"Olive oil cake","note":"Pairs well with a long call"}]'::jsonb, '2026-09-10', null, 'free-with-purchase', 'fast', true, 'some', 'some', 'quiet', true, 'Weekday afternoons', 'Thursday to Saturday evenings', '2026-09-10'),
  ('Dumbo Daybreak', 'DUMBO', 'Waterfront coffee window', null, '$', 6, array['https://picsum.photos/seed/dumbo-daybreak-1/900/700', 'https://picsum.photos/seed/dumbo-daybreak-2/900/700', 'https://picsum.photos/seed/dumbo-daybreak-3/900/700', 'https://picsum.photos/seed/dumbo-daybreak-4/900/700'], 'natural', array['walk'], array['waterfront', 'golden hour', 'grab and go'], '[{"name":"Iced oat latte","note":"Walk it to the pier"},{"name":"Everything croissant"}]'::jsonb, '2026-09-25', 'https://www.tiktok.com/@example/video/0000000007', 'none', null, false, 'none', 'limited', 'moderate', false, 'Early mornings (takeaway only)', 'Sunny weekends', '2026-09-25'),
  ('Lantern Tea & Coffee', 'Flushing', 'Tea and coffee house', null, '$', 7, array['https://picsum.photos/seed/lantern-tea-1/900/700', 'https://picsum.photos/seed/lantern-tea-2/900/700', 'https://picsum.photos/seed/lantern-tea-3/900/700', 'https://picsum.photos/seed/lantern-tea-4/900/700'], 'warm', array['focus', 'sprint'], array['big tables', 'tea menu', 'unhurried'], '[{"name":"Jasmine milk tea"},{"name":"Pineapple bun with butter"}]'::jsonb, '2026-09-18', null, 'free', 'ok', false, 'some', 'plenty', 'moderate', true, 'Weekday afternoons', 'Weekend evenings', '2026-09-18'),
  ('Stoop Café', 'Harlem', 'Neighborhood café', null, '$', 8, array['https://picsum.photos/seed/stoop-cafe-1/900/700', 'https://picsum.photos/seed/stoop-cafe-2/900/700', 'https://picsum.photos/seed/stoop-cafe-3/900/700', 'https://picsum.photos/seed/stoop-cafe-4/900/700'], 'natural', array['focus', 'calls', 'sprint'], array['sunny', 'friendly', 'regulars'], '[{"name":"Honey lavender latte"},{"name":"Banana walnut loaf"}]'::jsonb, '2026-10-06', null, 'free', 'fast', true, 'plenty', 'plenty', 'quiet', true, 'Weekdays, 9am to 2pm', 'Saturday mornings', '2026-10-06'),
  ('Cobalt Cold Brew', 'Long Island City', 'Cold brew bar', null, '$', 6, array['https://picsum.photos/seed/cobalt-cold-brew-1/900/700', 'https://picsum.photos/seed/cobalt-cold-brew-2/900/700', 'https://picsum.photos/seed/cobalt-cold-brew-3/900/700'], 'neon', array['walk', 'sprint'], array['blue neon', 'minimal', 'waterfront-adjacent'], '[{"name":"Nitro cold brew"},{"name":"Salted caramel cold foam"}]'::jsonb, '2026-08-20', 'https://www.tiktok.com/@example/video/00000000010', 'none', null, false, 'few', 'some', 'moderate', true, 'Weekday mornings', 'Lunch rush', '2026-08-20'),
  ('Brewline Coffee, Union Square', 'Union Square', 'Coffee chain', 'Brewline Coffee', '$', 7, array['https://picsum.photos/seed/brewline-union-1/900/700', 'https://picsum.photos/seed/brewline-union-2/900/700', 'https://picsum.photos/seed/brewline-union-3/900/700'], 'warm', array['sprint', 'focus'], array['reliable', 'big space', 'two floors'], '[{"name":"Drip coffee"},{"name":"Breakfast sandwich","note":"Upstairs is quieter"}]'::jsonb, '2026-09-05', null, 'free', 'ok', false, 'some', 'plenty', 'moderate', true, 'Mid-morning on weekdays', 'Lunch and after work', '2026-09-05'),
  ('Brewline Coffee, Midtown', 'Midtown', 'Coffee chain', 'Brewline Coffee', '$', 7, array['https://picsum.photos/seed/brewline-midtown-1/900/700', 'https://picsum.photos/seed/brewline-midtown-2/900/700', 'https://picsum.photos/seed/brewline-midtown-3/900/700'], 'warm', array['sprint', 'walk'], array['reliable', 'fast', 'commuter crowd'], '[{"name":"Cold brew"},{"name":"Almond croissant"}]'::jsonb, '2026-09-05', null, 'free', 'ok', false, 'few', 'limited', 'loud', true, 'After 2pm', 'Mornings, 7 to 10am', '2026-09-05'),
  ('Juno & Juice, SoHo', 'SoHo', 'Juice and coffee bar', 'Juno & Juice', '$$', 11, array['https://picsum.photos/seed/juno-juice-1/900/700', 'https://picsum.photos/seed/juno-juice-2/900/700', 'https://picsum.photos/seed/juno-juice-3/900/700', 'https://picsum.photos/seed/juno-juice-4/900/700'], 'natural', array['sprint', 'walk'], array['bright', 'healthy-ish', 'quick'], '[{"name":"Green juice"},{"name":"Oat cappuccino"}]'::jsonb, '2026-08-28', null, 'free-with-purchase', 'ok', false, 'few', 'some', 'moderate', true, 'Weekday mornings', 'Lunch', '2026-08-28'),
  ('Hearth Bakehouse, Chelsea', 'Chelsea', 'Bakery chain', 'Hearth Bakehouse', '$$', 9, array['https://picsum.photos/seed/hearth-chelsea-1/900/700', 'https://picsum.photos/seed/hearth-chelsea-2/900/700', 'https://picsum.photos/seed/hearth-chelsea-3/900/700', 'https://picsum.photos/seed/hearth-chelsea-4/900/700'], 'warm', array['focus', 'sprint'], array['spacious', 'bread smell', 'steady'], '[{"name":"Almond latte"},{"name":"Pain au chocolat"}]'::jsonb, '2026-09-22', null, 'free', 'fast', false, 'plenty', 'plenty', 'moderate', true, 'Weekdays, 2pm to 5pm', 'Weekend brunch', '2026-09-22'),
  ('Corner Cup, Brooklyn Heights', 'Brooklyn Heights', 'Coffee chain', 'Corner Cup', '$', 5, array['https://picsum.photos/seed/corner-cup-1/900/700', 'https://picsum.photos/seed/corner-cup-2/900/700', 'https://picsum.photos/seed/corner-cup-3/900/700'], 'warm', array['sprint'], array['no-frills', 'cheap', 'neighborhood'], '[{"name":"Large drip"},{"name":"Blueberry muffin"}]'::jsonb, '2026-07-30', null, 'free', 'slow', false, 'few', 'some', 'moderate', true, 'Mid-afternoon', 'Mornings', '2026-07-30');

insert into public.collections (title, subtitle, sort_order) values ('Solid backups', 'Chains that almost always have Wi-Fi and a seat', 0);
insert into public.collection_cafes (collection_id, cafe_id, position)
select (select id from public.collections where title = 'Solid backups'), k.id, p.pos
from (values ('Hearth Bakehouse, Chelsea', 0), ('Brewline Coffee, Union Square', 1), ('Corner Cup, Brooklyn Heights', 2), ('Juno & Juice, SoHo', 3), ('Brewline Coffee, Midtown', 4)) as p(name, pos)
join public.cafes k on k.name = p.name;

insert into public.collections (title, subtitle, sort_order) values ('TikTok found it first', 'Trending before the lines get long', 1);
insert into public.collection_cafes (collection_id, cafe_id, position)
select (select id from public.collections where title = 'TikTok found it first'), k.id, p.pos
from (values ('Matcha Mood', 0), ('Oat & Orchid', 1), ('Dumbo Daybreak', 2), ('Sunday Bun Bakery Café', 3), ('Cobalt Cold Brew', 4)) as p(name, pos)
join public.cafes k on k.name = p.name;

insert into public.collections (title, subtitle, sort_order) values ('Outlets everywhere', 'Bring the laptop, skip the charger anxiety', 2);
insert into public.collection_cafes (collection_id, cafe_id, position)
select (select id from public.collections where title = 'Outlets everywhere'), k.id, p.pos
from (values ('Oat & Orchid', 0), ('The Long Table', 1), ('Stoop Café', 2), ('Hearth Bakehouse, Chelsea', 3), ('Lantern Tea & Coffee', 4)) as p(name, pos)
join public.cafes k on k.name = p.name;

insert into public.collections (title, subtitle, sort_order) values ('Quiet enough for calls', 'Soft music, soft voices', 3);
insert into public.collection_cafes (collection_id, cafe_id, position)
select (select id from public.collections where title = 'Quiet enough for calls'), k.id, p.pos
from (values ('Stoop Café', 0), ('Oat & Orchid', 1), ('Paper Moon Café', 2)) as p(name, pos)
join public.cafes k on k.name = p.name;

insert into public.collections (title, subtitle, sort_order) values ('Always a seat', 'Big rooms and long tables', 4);
insert into public.collection_cafes (collection_id, cafe_id, position)
select (select id from public.collections where title = 'Always a seat'), k.id, p.pos
from (values ('The Long Table', 0), ('Stoop Café', 1), ('Hearth Bakehouse, Chelsea', 2), ('Lantern Tea & Coffee', 3), ('Brewline Coffee, Union Square', 4)) as p(name, pos)
join public.cafes k on k.name = p.name;

insert into public.collections (title, subtitle, sort_order) values ('Matcha and a walk', 'Order, then wander', 5);
insert into public.collection_cafes (collection_id, cafe_id, position)
select (select id from public.collections where title = 'Matcha and a walk'), k.id, p.pos
from (values ('Matcha Mood', 0), ('Dumbo Daybreak', 1), ('Cobalt Cold Brew', 2), ('Kiln Coffee Co.', 3), ('Juno & Juice, SoHo', 4)) as p(name, pos)
join public.cafes k on k.name = p.name;
