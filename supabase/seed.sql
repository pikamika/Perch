-- Confidence Card: PLACEHOLDER seed data (14 fictional restaurants and 5 Discover collections)
-- Run this AFTER schema.sql. Replace with real places later.
-- Re-running clears and re-inserts restaurants and collections (saved places pointing at them become unlinked).

delete from public.collections;
delete from public.restaurants;

insert into public.restaurants
  (name, neighborhood, cuisine, price_band, typical_spend_per_person, photos, lighting,
   best_for, vibe_tags, what_to_order, photos_updated_at, source_url)
values
  ('Noodle & Nectar', 'East Village', 'Hand-pulled noodles', '$', 18, array['https://picsum.photos/seed/noodle-nectar-1/900/700', 'https://picsum.photos/seed/noodle-nectar-2/900/700', 'https://picsum.photos/seed/noodle-nectar-3/900/700', 'https://picsum.photos/seed/noodle-nectar-4/900/700'], 'warm', array['friends', 'solo'], array['cozy', 'lively', 'steamy bowls'], '[{"name":"Chili oil biang biang","note":"Ask for extra scallions"},{"name":"Cucumber smash"},{"name":"Honey sesame tea","note":"Great flat-lay colors"}]'::jsonb, '2026-09-20', 'https://www.tiktok.com/@example/video/0000000001'),
  ('Little Fig Cantina', 'Williamsburg', 'Modern Mexican', '$$', 32, array['https://picsum.photos/seed/little-fig-1/900/700', 'https://picsum.photos/seed/little-fig-2/900/700', 'https://picsum.photos/seed/little-fig-3/900/700', 'https://picsum.photos/seed/little-fig-4/900/700', 'https://picsum.photos/seed/little-fig-5/900/700'], 'natural', array['date', 'birthday', 'friends'], array['aesthetic', 'sunny', 'plant-filled'], '[{"name":"Fig & queso fundido","note":"Shareable and photogenic"},{"name":"Pescado tacos"}]'::jsonb, '2026-08-14', null),
  ('Moonlit Dumpling Bar', 'Chinatown', 'Dumplings', '$', 15, array['https://picsum.photos/seed/moonlit-dumpling-1/900/700', 'https://picsum.photos/seed/moonlit-dumpling-2/900/700', 'https://picsum.photos/seed/moonlit-dumpling-3/900/700'], 'neon', array['friends', 'solo', 'birthday'], array['neon', 'late night', 'casual'], '[{"name":"Soup dumplings","note":"Order a double basket"},{"name":"Pan-fried pork buns"},{"name":"Lychee soda"}]'::jsonb, '2026-07-30', null),
  ('Saffron & Sage', 'West Village', 'Mediterranean', '$$$', 68, array['https://picsum.photos/seed/saffron-sage-1/900/700', 'https://picsum.photos/seed/saffron-sage-2/900/700', 'https://picsum.photos/seed/saffron-sage-3/900/700', 'https://picsum.photos/seed/saffron-sage-4/900/700', 'https://picsum.photos/seed/saffron-sage-5/900/700'], 'dim', array['date', 'birthday'], array['romantic', 'candlelit', 'intimate'], '[{"name":"Whipped feta with honeycomb","note":"Best shot is from above"},{"name":"Saffron risotto"},{"name":"Olive oil cake"}]'::jsonb, '2026-05-02', null),
  ('Corner Slice Collective', 'Bushwick', 'Pizza by the slice', '$', 12, array['https://picsum.photos/seed/corner-slice-1/900/700', 'https://picsum.photos/seed/corner-slice-2/900/700', 'https://picsum.photos/seed/corner-slice-3/900/700', 'https://picsum.photos/seed/corner-slice-4/900/700'], 'neon', array['solo', 'friends'], array['street art', 'grab-and-go', 'lively'], '[{"name":"Hot honey pepperoni slice"},{"name":"Vodka-sauce square","note":"Sells out by 9 pm"}]'::jsonb, '2026-10-01', null),
  ('Basil Blossom Café', 'Greenpoint', 'Brunch & café', '$$', 26, array['https://picsum.photos/seed/basil-blossom-1/900/700', 'https://picsum.photos/seed/basil-blossom-2/900/700', 'https://picsum.photos/seed/basil-blossom-3/900/700', 'https://picsum.photos/seed/basil-blossom-4/900/700', 'https://picsum.photos/seed/basil-blossom-5/900/700'], 'natural', array['solo', 'date', 'friends'], array['aesthetic', 'bright', 'quiet'], '[{"name":"Ricotta pancakes","note":"Window seats for best light"},{"name":"Lavender latte"},{"name":"Smashed avocado toast"}]'::jsonb, '2026-09-05', null),
  ('Ember Yakitori Den', 'Lower East Side', 'Japanese yakitori', '$$', 38, array['https://picsum.photos/seed/ember-yakitori-1/900/700', 'https://picsum.photos/seed/ember-yakitori-2/900/700', 'https://picsum.photos/seed/ember-yakitori-3/900/700', 'https://picsum.photos/seed/ember-yakitori-4/900/700'], 'dim', array['date', 'friends', 'birthday'], array['smoky', 'intimate', 'counter seats'], '[{"name":"Chicken thigh skewers"},{"name":"Tsukune with egg yolk","note":"Dip it slowly for the shot"}]'::jsonb, '2026-06-12', null),
  ('Sweet Tooth Atelier', 'SoHo', 'Dessert & pastry', '$$', 24, array['https://picsum.photos/seed/sweet-tooth-1/900/700', 'https://picsum.photos/seed/sweet-tooth-2/900/700', 'https://picsum.photos/seed/sweet-tooth-3/900/700', 'https://picsum.photos/seed/sweet-tooth-4/900/700', 'https://picsum.photos/seed/sweet-tooth-5/900/700'], 'warm', array['birthday', 'date', 'solo'], array['pastel', 'aesthetic', 'treat yourself'], '[{"name":"Pistachio rose croissant"},{"name":"Birthday cake slice","note":"They add a candle if you ask"},{"name":"Matcha soft serve"}]'::jsonb, '2026-09-28', null),
  ('Tandoor Tales', 'Jackson Heights', 'Indian', '$', 22, array['https://picsum.photos/seed/tandoor-tales-1/900/700', 'https://picsum.photos/seed/tandoor-tales-2/900/700', 'https://picsum.photos/seed/tandoor-tales-3/900/700'], 'warm', array['friends', 'birthday'], array['family-style', 'colorful', 'lively'], '[{"name":"Butter chicken with garlic naan"},{"name":"Paneer tikka","note":"Arrives sizzling"}]'::jsonb, '2026-03-18', null),
  ('Rooftop Rosé & Rolls', 'Long Island City', 'Sushi & sake', '$$$', 55, array['https://picsum.photos/seed/rooftop-rose-1/900/700', 'https://picsum.photos/seed/rooftop-rose-2/900/700', 'https://picsum.photos/seed/rooftop-rose-3/900/700', 'https://picsum.photos/seed/rooftop-rose-4/900/700', 'https://picsum.photos/seed/rooftop-rose-5/900/700'], 'natural', array['date', 'birthday'], array['skyline view', 'sunset', 'celebration'], '[{"name":"Spicy tuna crispy rice"},{"name":"Omakase roll flight","note":"Golden hour is the time to go"},{"name":"Yuzu spritz"}]'::jsonb, '2026-08-30', null),
  ('Lantern Hot Pot House', 'Flushing', 'Sichuan hot pot', '$$', 34, array['https://picsum.photos/seed/lantern-hotpot-1/900/700', 'https://picsum.photos/seed/lantern-hotpot-2/900/700', 'https://picsum.photos/seed/lantern-hotpot-3/900/700', 'https://picsum.photos/seed/lantern-hotpot-4/900/700', 'https://picsum.photos/seed/lantern-hotpot-5/900/700'], 'warm', array['friends', 'birthday'], array['steamy', 'shareable', 'lively'], '[{"name":"Split spicy and mushroom broth","note":"Best color contrast for photos"},{"name":"Hand-cut lamb"},{"name":"Fried milk buns"}]'::jsonb, '2026-09-12', null),
  ('Jade Bubble Tea Lab', 'Flushing', 'Bubble tea & snacks', '$', 9, array['https://picsum.photos/seed/jade-bubble-tea-1/900/700', 'https://picsum.photos/seed/jade-bubble-tea-2/900/700', 'https://picsum.photos/seed/jade-bubble-tea-3/900/700', 'https://picsum.photos/seed/jade-bubble-tea-4/900/700'], 'natural', array['solo', 'friends'], array['pastel', 'photogenic', 'grab-and-go'], '[{"name":"Brown sugar boba milk tea","note":"Hold it up to the window light"},{"name":"Taro cream puff"}]'::jsonb, '2026-09-30', null),
  ('Skewer Alley', 'Flushing', 'Xinjiang skewers', '$', 19, array['https://picsum.photos/seed/skewer-alley-1/900/700', 'https://picsum.photos/seed/skewer-alley-2/900/700', 'https://picsum.photos/seed/skewer-alley-3/900/700', 'https://picsum.photos/seed/skewer-alley-4/900/700'], 'neon', array['friends', 'solo'], array['smoky', 'late night', 'street food'], '[{"name":"Cumin lamb skewers"},{"name":"Hand-pulled laghman","note":"Share one between two"}]'::jsonb, '2026-08-25', null),
  ('Golden Scallion Pancakes', 'Flushing', 'Taiwanese breakfast', '$', 14, array['https://picsum.photos/seed/golden-scallion-1/900/700', 'https://picsum.photos/seed/golden-scallion-2/900/700', 'https://picsum.photos/seed/golden-scallion-3/900/700'], 'natural', array['solo', 'friends'], array['crispy', 'cozy', 'quick bite'], '[{"name":"Scallion pancake with egg"},{"name":"Hot sweet soy milk"}]'::jsonb, '2026-10-03', null);

insert into public.collections (title, subtitle, sort_order) values ('Trending on TikTok', 'Spots blowing up on your feed', 0);
insert into public.collection_restaurants (collection_id, restaurant_id, position)
select (select id from public.collections where title = 'Trending on TikTok'), r.id, p.pos
from (values ('Noodle & Nectar', 0), ('Corner Slice Collective', 1), ('Sweet Tooth Atelier', 2), ('Jade Bubble Tea Lab', 3), ('Moonlit Dumpling Bar', 4)) as p(name, pos)
join public.restaurants r on r.name = p.name;

insert into public.collections (title, subtitle, sort_order) values ('Flushing food crawl eats', 'Eat your way down Main Street', 1);
insert into public.collection_restaurants (collection_id, restaurant_id, position)
select (select id from public.collections where title = 'Flushing food crawl eats'), r.id, p.pos
from (values ('Lantern Hot Pot House', 0), ('Skewer Alley', 1), ('Jade Bubble Tea Lab', 2), ('Golden Scallion Pancakes', 3)) as p(name, pos)
join public.restaurants r on r.name = p.name;

insert into public.collections (title, subtitle, sort_order) values ('Date night under $40', 'Low lights, high chemistry', 2);
insert into public.collection_restaurants (collection_id, restaurant_id, position)
select (select id from public.collections where title = 'Date night under $40'), r.id, p.pos
from (values ('Little Fig Cantina', 0), ('Ember Yakitori Den', 1), ('Basil Blossom Café', 2)) as p(name, pos)
join public.restaurants r on r.name = p.name;

insert into public.collections (title, subtitle, sort_order) values ('Photo-ready spots', 'Great light, even better plates', 3);
insert into public.collection_restaurants (collection_id, restaurant_id, position)
select (select id from public.collections where title = 'Photo-ready spots'), r.id, p.pos
from (values ('Little Fig Cantina', 0), ('Basil Blossom Café', 1), ('Sweet Tooth Atelier', 2), ('Rooftop Rosé & Rolls', 3), ('Saffron & Sage', 4)) as p(name, pos)
join public.restaurants r on r.name = p.name;

insert into public.collections (title, subtitle, sort_order) values ('Cheap eats under $20', 'Big flavor, small bill', 4);
insert into public.collection_restaurants (collection_id, restaurant_id, position)
select (select id from public.collections where title = 'Cheap eats under $20'), r.id, p.pos
from (values ('Moonlit Dumpling Bar', 0), ('Corner Slice Collective', 1), ('Noodle & Nectar', 2), ('Skewer Alley', 3), ('Golden Scallion Pancakes', 4), ('Jade Bubble Tea Lab', 5)) as p(name, pos)
join public.restaurants r on r.name = p.name;
