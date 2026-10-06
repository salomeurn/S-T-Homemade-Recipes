# Our Recipe Book

A recipe-book web app designed for GitHub Pages + Supabase.

## Current prototype
- Search recipes
- Browse by cuisine/category
- Slide-out Browse panel
- Slide-out What Can I Make panel
- Ingredient matching
- Add Recipe form
- Responsive/mobile layout

## Production architecture
GitHub Pages hosts the frontend. Supabase provides authentication and the Postgres database. Two authorised accounts will have editor access; visitors are read-only.

See the Supabase documentation for Auth and Row Level Security:
https://supabase.com/docs/guides/auth
https://supabase.com/docs/guides/database/overview
