# Supabase Shared Sync Setup

This repo now includes the database groundwork for shared cross-phone sync.

## What is included

- Supabase client dependency
- Environment variable contract in `.env.example`
- Database schema in `supabase/migrations/20260317_create_shared_household_tables.sql`
- Typed Supabase helpers in `lib/supabase/*`
- A repository layer in `lib/supabase/repository.ts`

## What you need to do in Supabase

1. Create a new Supabase project.
2. In Supabase, open the SQL editor.
3. Run the SQL from:
   - `supabase/migrations/20260317_create_shared_household_tables.sql`
4. In Project Settings -> API, copy:
   - `Project URL`
   - `Publishable key`
   - `service_role key`

## What you need to do locally / in Netlify

Set these environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

For Netlify:

1. Open the site.
2. Go to Site configuration -> Environment variables.
3. Add the three variables above.
4. Redeploy the site.

## Current scope

This is infrastructure only. The app is not yet switched over from local browser storage to Supabase-backed sync.

Tomorrow's implementation work should wire these shared tables into the app store and add a low-friction household join flow.
