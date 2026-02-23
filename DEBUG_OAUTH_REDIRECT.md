# Debug OAuth Redirect Error - You Have Correct URI

## Since You Have the Correct URI

If you have `https://uiiuwvdqqyybumkasrdz.supabase.co/auth/v1/callback` in Google Cloud Console, the issue is likely:

## Common Issues

### 1. Client ID/Secret Mismatch

**Check:** The Client ID and Secret in Supabase Dashboard must match Google Cloud Console EXACTLY.

**Fix:**
1. Go to Supabase Dashboard → Authentication → Providers → Google
2. Copy the Client ID and Secret from Google Cloud Console
3. Paste them into Supabase (no extra spaces!)
4. Save

### 2. Trailing Space or Typo

**Check:** In Google Cloud Console, make sure the redirect URI has:
- ✅ No trailing space
- ✅ No leading space
- ✅ Exact match: `https://uiiuwvdqqyybumkasrdz.supabase.co/auth/v1/callback`

**Fix:** Delete and re-add the redirect URI to be sure

### 3. Wrong OAuth Client ID

**Check:** Are you using the SAME OAuth Client ID in:
- Google Cloud Console (for the redirect URI)
- Supabase Dashboard (for Google provider)

**Fix:** Make sure they match!

### 4. OAuth Consent Screen Not Published

**Check:** In Google Cloud Console → OAuth consent screen:
- Is it in "Testing" mode?
- Did you add your email as a test user?

**Fix:** Add your email (`alicialee53@gmail.com`) as a test user

### 5. Scopes Not Added

**Check:** OAuth consent screen → Scopes section:
- Do you have `userinfo.email` and `userinfo.profile`?

**Fix:** Add them if missing

## Quick Checklist

- [ ] Redirect URI matches exactly (no spaces, correct project)
- [ ] Client ID in Supabase matches Google Cloud Console
- [ ] Client Secret in Supabase matches Google Cloud Console
- [ ] Your email is added as test user in OAuth consent screen
- [ ] Scopes are added (email, profile)
- [ ] Saved changes in both Google Console and Supabase Dashboard

## Test

After checking all above:
1. Wait 2-3 minutes for changes to propagate
2. Try Google Sign-In again
3. Check browser console (F12) for any error details

What's the exact error message you're seeing now?







