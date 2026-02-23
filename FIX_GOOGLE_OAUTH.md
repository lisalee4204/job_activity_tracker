# Fix Google OAuth Redirect URI Error

## The Error

**Error 400: redirect_uri_mismatch**

This means the redirect URI in your Google Cloud Console doesn't match what your app is sending.

## Fix: Update Google Cloud Console

### Step 1: Check What Redirect URI Your App Uses

Your app uses this redirect URI for Google Sign-In:
```
https://uiiuwvdqqyybumkasrdz.supabase.co/auth/v1/callback
```

### Step 2: Add This to Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Go to **APIs & Services** → **Credentials**
3. Find your OAuth 2.0 Client ID (the one for Google Sign-In)
4. Click **Edit** (pencil icon)
5. Under **Authorized redirect URIs**, make sure you have EXACTLY:
   ```
   https://uiiuwvdqqyybumkasrdz.supabase.co/auth/v1/callback
   ```
6. **Important**: 
   - Must match EXACTLY (no trailing slash, no extra spaces)
   - Must be HTTPS (not HTTP)
   - Case-sensitive
7. Click **Save**

### Step 3: For Local Development

If you're testing locally, you might also need:
```
http://localhost:5173/auth/v1/callback
```

But Supabase handles the OAuth callback, so the main one should be the Supabase URL.

## Common Mistakes

❌ **Wrong**: `https://uiiuwvdqqyybumkasrdz.supabase.co/auth/v1/callback/` (trailing slash)
❌ **Wrong**: `http://uiiuwvdqqyybumkasrdz.supabase.co/auth/v1/callback` (HTTP instead of HTTPS)
✅ **Correct**: `https://uiiuwvdqqyybumkasrdz.supabase.co/auth/v1/callback`

## Verify

After updating:
1. Wait 1-2 minutes for changes to propagate
2. Try signing in with Google again
3. Should work now!

## For Gmail API (Different OAuth)

Note: Gmail API uses a different redirect URI:
```
http://localhost:5173/auth/gmail/callback
```

Make sure you have a separate OAuth Client ID for Gmail API with this redirect URI.







