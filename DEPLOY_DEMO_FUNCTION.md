# Deploy Demo Data Function - Quick Fix

## The Issue

You're getting "failed to send request to edge function" because the `seed-demo-data` function hasn't been deployed yet.

## Quick Fix

Run these commands in your terminal (where Supabase CLI works):

```bash
# Navigate to backend folder
cd backend

# Deploy the seed-demo-data function
supabase functions deploy seed-demo-data
```

That's it! After deployment, the "Load Demo Data" button will work.

## Verify It's Deployed

After deploying, you can verify:
1. Go to Supabase Dashboard → Edge Functions
2. You should see `seed-demo-data` in the list
3. Try clicking "Load Demo Data" button again

## If You Get Errors

**"Function not found":**
- Make sure you're in the `backend` folder
- Check that `backend/supabase/functions/seed-demo-data/index.ts` exists

**"Migration not applied":**
- Run `supabase db push` first to add the database function
- Then deploy the edge function

## After Deployment

Once deployed:
1. Refresh your app
2. Click "Load Demo Data" button
3. Should work! You'll see 60+ activities populate







