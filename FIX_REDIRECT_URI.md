# Fix Redirect URI - Multiple URIs Are Fine

## Yes, Multiple Redirect URIs Are OK ✅

You can have multiple redirect URIs in Google Cloud Console. That's normal for:
- Development (localhost)
- Production (your domain)
- Different environments

## The Problem

The redirect URI must match **EXACTLY** what Supabase sends to Google.

## What Supabase Sends

When you use `supabase.auth.signInWithOAuth()`, Supabase sends this redirect URI to Google:

```
https://uiiuwvdqqyybumkasrdz.supabase.co/auth/v1/callback
```

**NOT** your app URL like `http://localhost:5173`

## Check Your Google Cloud Console

Go to your OAuth Client ID and check the **Authorized redirect URIs**. You should have:

✅ **Required (for Google Sign-In):**
```
https://uiiuwvdqqyybumkasrdz.supabase.co/auth/v1/callback
```

✅ **Optional (for Gmail API - different OAuth):**
```
http://localhost:5173/auth/gmail/callback
```

❌ **WRONG (don't add this):**
```
http://localhost:5173/auth/v1/callback
```

## Common Mistakes

1. **Adding localhost for Supabase auth** - Supabase handles the callback, not your app
2. **Trailing slash** - `https://.../callback/` ❌ vs `https://.../callback` ✅
3. **HTTP instead of HTTPS** - Must be HTTPS for Supabase URL
4. **Wrong path** - Must be `/auth/v1/callback` exactly

## How to Fix

1. Go to Google Cloud Console → Credentials
2. Edit your OAuth Client ID (the one for Google Sign-In)
3. Under **Authorized redirect URIs**, make sure you have EXACTLY:
   ```
   https://uiiuwvdqqyybumkasrdz.supabase.co/auth/v1/callback
   ```
4. Remove any incorrect ones like:
   - `http://localhost:5173/auth/v1/callback` ❌
   - `https://uiiuwvdqqyybumkasrdz.supabase.co/auth/v1/callback/` ❌ (trailing slash)
5. Click **Save**
6. Wait 1-2 minutes

## Verify It's Correct

The redirect URI should be:
- ✅ HTTPS (not HTTP)
- ✅ No trailing slash
- ✅ Exact path: `/auth/v1/callback`
- ✅ Your Supabase project URL

## After Fixing

Try Google Sign-In again. It should work!

## Note About Multiple URIs

You can have:
- `https://uiiuwvdqqyybumkasrdz.supabase.co/auth/v1/callback` (for Google Sign-In)
- `http://localhost:5173/auth/gmail/callback` (for Gmail API - different OAuth)
- `https://your-domain.com/auth/gmail/callback` (for Gmail API in production)

But make sure the Supabase one is EXACTLY correct!







