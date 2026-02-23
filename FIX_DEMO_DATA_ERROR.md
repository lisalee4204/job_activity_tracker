# Fix "Non 2xx Status Code" Error

## The Problem

The edge function is deployed, but it's calling a database function (`seed_my_demo_data`) that doesn't exist yet. This means the migration hasn't been run.

## Solution: Run the Migration

You need to run the database migration to create the `seed_my_demo_data` function.

### Option 1: Via Supabase Dashboard (Easiest)

1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/uiiuwvdqqyybumkasrdz
2. Go to **SQL Editor**
3. Click **New Query**
4. Copy the entire contents of `backend/supabase/migrations/20240107000000_seed_demo_data.sql`
5. Paste it into the SQL Editor
6. Click **Run** (or press Ctrl+Enter)
7. Wait for it to complete

### Option 2: Via Terminal (If Supabase CLI works)

```bash
cd backend
supabase db push
```

## After Running Migration

1. Refresh your app
2. Click "Load Demo Data" button again
3. Should work now!

## Verify Migration Ran

To check if the function exists:
1. Go to Supabase Dashboard → Database → Functions
2. Look for `seed_my_demo_data` in the list
3. If you see it, migration ran successfully

## What the Migration Does

The migration creates:
- `seed_demo_data()` function - Seeds data for a user
- `seed_my_demo_data()` function - Wrapper that uses current user's ID

Both functions are needed for the demo data to work.







