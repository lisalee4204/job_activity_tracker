# Enable Demo Data - Step by Step

## Where to Run Commands

Run these commands in **your terminal** (PowerShell or Command Prompt) where you have Supabase CLI installed and working.

## Step 1: Navigate to Backend Folder

Open your terminal and navigate to the backend folder:

```bash
cd "C:\Users\alici\Downloads\apps\job activity tracker\backend"
```

Or if you're already in the project root:
```bash
cd backend
```

## Step 2: Run Migration

This adds the demo data seed function to your database:

```bash
supabase db push
```

This will apply the new migration `20240107000000_seed_demo_data.sql` which creates the seed function.

## Step 3: Deploy the Edge Function

This deploys the function that calls the seed function:

```bash
supabase functions deploy seed-demo-data
```

## Step 4: Test It

1. Start your frontend (if not running):
   ```bash
   cd ../frontend
   npm run dev
   ```

2. Open http://localhost:5173
3. Sign in to your account
4. If you have no activities, you'll see a **"Load Demo Data"** button
5. Click it to populate your dashboard!

## Troubleshooting

**"supabase: command not found"**
- Make sure you're in a terminal where Supabase CLI works
- You successfully ran migrations earlier, so use that same terminal

**"Migration already applied"**
- That's fine! The function is already deployed
- Just deploy the edge function: `supabase functions deploy seed-demo-data`

**"Function not found"**
- Make sure you're in the `backend` folder
- The function file should be at: `backend/supabase/functions/seed-demo-data/index.ts`

## Quick Reference

```bash
# Navigate to backend
cd backend

# Run migration (adds seed function to database)
supabase db push

# Deploy edge function (makes it callable from frontend)
supabase functions deploy seed-demo-data

# Done! Now use the app and click "Load Demo Data" button
```

That's it! The demo data button will appear automatically when you have no activities.







