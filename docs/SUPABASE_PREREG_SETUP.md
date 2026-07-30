# Supabase Setup For English Tech Pre-Registration

Date verified: July 29, 2026

## Goal

Connect `/preregistro` to a dedicated Supabase project and a dedicated table:

- Project credentials:
  - `SUPABASE_PREREG_URL`
  - `SUPABASE_PREREG_KEY`
- Table:
  - `english_tech_preregistrations`

The backend keeps `SUPABASE_URL` / `SUPABASE_KEY` for the rest of the platform and uses the dedicated prereg values only for the English Tech pre-registration endpoints.

## 1. Create or open the new Supabase project

Use a dedicated project for the English Tech course pre-registration.

## 2. Create the new table

Run this SQL in the Supabase SQL editor of the new project:

- [`database/migrations/20260729_create_english_tech_preregistrations.sql`](/Users/cesar/CODE/CURSO_INGLES_TECNICO_CUGDL/database/migrations/20260729_create_english_tech_preregistrations.sql)

## 3. Get the project credentials

From the Supabase dashboard, copy:

- Project URL
- Server-side key for backend use only

For server-side usage, keep the key only in `backend/.env`, never in the frontend.

## 4. Configure the backend

Set these values in `backend/.env`:

```env
SUPABASE_PREREG_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_PREREG_KEY=YOUR_SERVER_SIDE_KEY
SUPABASE_PREREG_TABLE=english_tech_preregistrations
```

If these are empty, the prereg flow falls back to `SUPABASE_URL` / `SUPABASE_KEY`.

## 5. Restart the backend

After changing env vars, restart the API process so the cached settings reload.

## 6. Verify

Submit a test record from `/preregistro` and confirm the row appears in:

- `public.english_tech_preregistrations`

## Notes

- Official references checked on July 29, 2026:
  - [Supabase changelog](https://supabase.com/changelog)
  - [supabase-py insert reference](https://supabase.com/docs/reference/python/insert)
  - [Tables and Data docs](https://supabase.com/docs/guides/database/tables)
  - [supabase-py install / Data API access](https://supabase.com/docs/reference/python/installing)
- The current payment system still assumes its own shared Supabase schema. If you also want payments, scholarships, and surveys moved to the new project, we should migrate those tables together in the next step.
