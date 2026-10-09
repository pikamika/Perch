# Migrations

`schema.sql` (one level up) always describes the full, current schema for a fresh project.
Files here are upgrade steps for projects created from an older version:

- `001_saved_places_belong_to_users.sql`: saved places belong to a signed-in user instead of a device id.
- Profiles and Discover collections: run the "profiles" and "collections" sections of `schema.sql`
  (they are safe to re-run).
- Restaurants to cafes (the product pivot to remote-work cafes): the old `restaurants` and
  `collection_restaurants` tables were replaced by `cafes` and `collection_cafes`, and
  `saved_places.restaurant_id` / `occasions` became `cafe_id` / `purposes`. For a project that has no
  data to keep, the simplest path is to drop the old tables and run `schema.sql` and then `seed.sql`.
