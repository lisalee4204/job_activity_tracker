# Google OAuth Scopes - Sensitive vs Non-Sensitive

## Two Different OAuth Setups

You have **two separate OAuth configurations**:

### 1. Google Sign-In (User Authentication) - NOT Sensitive ✅

**Scopes used:**
- `email`
- `profile`

**These are NOT sensitive** - no verification needed.

**Redirect URI:**
```
https://uiiuwvdqqyybumkasrdz.supabase.co/auth/v1/callback
```

### 2. Gmail API (Email Import) - IS Sensitive ⚠️

**Scope used:**
- `https://www.googleapis.com/auth/gmail.readonly`

**This IS a sensitive/restricted scope** - requires verification if you want to publish.

## Do You Need Sensitive Scope?

### For Google Sign-In: NO ✅
- Basic email/profile scopes are not sensitive
- Works immediately
- No verification needed

### For Gmail API: YES ⚠️
- `gmail.readonly` is a sensitive scope
- For testing: Works immediately (if you add yourself as test user)
- For production: Requires Google verification (can take weeks)

## Current Status

**If you're just testing:**
- ✅ Google Sign-In: Works without sensitive scope
- ✅ Gmail API: Works in testing mode (add yourself as test user)

**If you want to publish:**
- ✅ Google Sign-In: Still works, no verification needed
- ⚠️ Gmail API: Need to submit for Google verification

## For Now (Testing)

You don't need to mark anything as sensitive for testing. Just:

1. **Google Sign-In OAuth:**
   - Add redirect URI: `https://uiiuwvdqqyybumkasrdz.supabase.co/auth/v1/callback`
   - No sensitive scope needed

2. **Gmail API OAuth:**
   - Add redirect URI: `http://localhost:5173/auth/gmail/callback`
   - Add yourself as test user in OAuth consent screen
   - Works without verification

## Summary

**Answer: NO, you don't need sensitive scope for Google Sign-In.**

Only Gmail API uses sensitive scope, and that works in testing mode without verification.

Just make sure the redirect URI matches exactly!







