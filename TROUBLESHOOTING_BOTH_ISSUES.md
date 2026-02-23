# Troubleshooting Both Issues

## Issue 1: Google Sign-In Redirect Error

### Step-by-Step Fix

1. **Verify Supabase Project URL**
   - Your project: `uiiuwvdqqyybumkasrdz`
   - Correct redirect URI: `https://uiiuwvdqqyybumkasrdz.supabase.co/auth/v1/callback`

2. **Check Google Cloud Console**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Find your OAuth 2.0 Client ID (the one configured in Supabase)
   - Click Edit
   - Under "Authorized redirect URIs", verify you have EXACTLY:
     ```
     https://uiiuwvdqqyybumkasrdz.supabase.co/auth/v1/callback
     ```
   - No trailing slash, no spaces, HTTPS (not HTTP)

3. **Check Supabase Dashboard**
   - Go to: https://supabase.com/dashboard/project/uiiuwvdqqyybumkasrdz/auth/providers
   - Click on Google provider
   - Verify:
     - ✅ Enabled = ON
     - ✅ Client ID matches Google Cloud Console EXACTLY
     - ✅ Client Secret matches Google Cloud Console EXACTLY
   - Save if you made changes

4. **Check OAuth Consent Screen**
   - Go to: https://console.cloud.google.com/apis/credentials/consent
   - Verify:
     - ✅ Publishing status: Testing (or Published)
     - ✅ Your email (`alicialee53@gmail.com`) is in "Test users" list
     - ✅ Scopes include: `userinfo.email`, `userinfo.profile`

5. **Test Again**
   - Wait 2-3 minutes after making changes
   - Clear browser cache (Ctrl+Shift+Delete)
   - Try Google Sign-In again

## Issue 2: Demo Data Error (Non-2xx Status)

### Check Edge Function Logs

1. **Go to Supabase Dashboard**
   - https://supabase.com/dashboard/project/uiiuwvdqqyybumkasrdz/logs/edge-functions
   - Find `seed-demo-data` function
   - Click on it to see logs
   - Look for the error message

### Common Errors and Fixes

**Error: "function seed_my_demo_data() does not exist"**
- Fix: Run the SQL migration again in SQL Editor

**Error: "permission denied"**
- Fix: Make sure the function has `SECURITY DEFINER`

**Error: "User must be authenticated"**
- Fix: Make sure you're signed in to the app

### Test Database Function Directly

Run this in SQL Editor to test:
```sql
SELECT seed_my_demo_data();
```

If this works, the function exists. If it fails, check the error message.

### Redeploy Edge Function

1. Go to: https://supabase.com/dashboard/project/uiiuwvdqqyybumkasrdz/functions
2. Click on `seed-demo-data`
3. Make sure the code matches the file (with improved error handling)
4. Click "Deploy"

## Quick Diagnostic

**For Google Sign-In:**
- [ ] Redirect URI matches exactly
- [ ] Client ID matches in both places
- [ ] Client Secret matches in both places
- [ ] Your email is test user
- [ ] Scopes are added

**For Demo Data:**
- [ ] Function exists (check Database → Functions)
- [ ] Edge function is deployed
- [ ] You're signed in
- [ ] Check logs for actual error

## Next Steps

1. Check Supabase Edge Function logs for demo data error
2. Verify Google OAuth configuration matches exactly
3. Share the exact error messages you see

What do the logs show for the demo data error?







