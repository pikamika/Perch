# Migrations

`schema.sql` (one level up) always describes the full, current schema for a fresh project.
Files here are upgrade steps for projects created from an older version:

- `001_saved_places_belong_to_users.sql`: saved places belong to a signed-in user instead of a device id.
- For profiles and Discover collections, run the new "profiles" and "collections" sections of `schema.sql`
  (they are safe to re-run), then `seed.sql`.
