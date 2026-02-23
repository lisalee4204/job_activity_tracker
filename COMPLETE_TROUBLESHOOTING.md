# Complete Troubleshooting Guide

## Issue 1: Google Sign-In - Redirect URI Mismatch

### Exact Steps to Fix

1. **Get Your Exact Supabase Project URL**
   - Go to: https://supabase.com/dashboard/project/uiiuwvdqqyybumkasrdz/settings/general
   - Copy your Project URL
   - Should be: `https://uiiuwvdqqyybumkasrdz.supabase.co`

2. **Google Cloud Console - OAuth Client**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Find the OAuth 2.0 Client ID you're using for Google Sign-In
   - Click Edit
   - Under "Authorized redirect URIs"
   - Make sure you have EXACTLY (copy-paste to avoid typos):
     ```
     https://uiiuwvdqqyybumkasrdz.supabase.co/auth/v1/callback
     ```
   - Click Save

3. **Supabase Dashboard - Google Provider**
   - Go to: https://supabase.com/dashboard/project/uiiuwvdqqyybumkasrdz/auth/providers
   - Click Google
   - Make sure:
     - Enabled = ON
     - Client ID = (exact match from Google Console)
     - Client Secret = (exact match from Google Console)
   - Click Save

4. **OAuth Consent Screen**
   - Go to: https://console.cloud.google.com/apis/credentials/consent
   - Add your email (`alicialee53@gmail.com`) to "Test users"
   - Make sure scopes include: `userinfo.email`, `userinfo.profile`

5. **Test**
   - Wait 2-3 minutes
   - Clear browser cache
   - Try again

## Issue 2: Demo Data - Non-2xx Error

### Check the Actual Error

**Option 1: Browser Console**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Click "Load Demo Data"
4. Look for error message
5. Share the exact error

**Option 2: Supabase Logs**
1. Go to: https://supabase.com/dashboard/project/uiiuwvdqqyybumkasrdz/logs/edge-functions
2. Find `seed-demo-data`
3. Click on it
4. Look at the latest logs
5. Share the error message

### Quick Test

Run this in SQL Editor:
```sql
SELECT seed_my_demo_data();
```

**If it works:** Function exists, issue is with edge function
**If it fails:** Function doesn't exist or has error - share the error message

### Verify Function Exists

1. Go to: https://supabase.com/dashboard/project/uiiuwvdqqyybumkasrdz/database/functions
2. Look for `seed_my_demo_data` in the list
3. If it's not there, run the SQL migration again

## What I Need From You

1. **For Google Sign-In:**
   - What's the EXACT error message? (screenshot or copy-paste)
   - Is your email added as test user?
   - Do Client ID/Secret match exactly?

2. **For Demo Data:**
   - What's the EXACT error in browser console?
   - What do the Supabase logs show?
   - Does `SELECT seed_my_demo_data();` work in SQL Editor?

Share these details and I can give you the exact fix!







