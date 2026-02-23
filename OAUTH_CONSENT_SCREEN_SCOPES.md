# OAuth Consent Screen - Required Scopes

## Yes, You Need to Add Scopes

In Google Cloud Console → OAuth consent screen, you need to add scopes.

## Required Scopes

### For Google Sign-In (User Authentication)

Add these scopes:
- ✅ `.../auth/userinfo.email` (or `email`)
- ✅ `.../auth/userinfo.profile` (or `profile`)

These are **non-sensitive** scopes - no verification needed.

### For Gmail API (Email Import)

Add this scope:
- ⚠️ `https://www.googleapis.com/auth/gmail.readonly`

This is a **sensitive/restricted** scope - works in testing mode.

## How to Add Scopes

1. Go to Google Cloud Console
2. **APIs & Services** → **OAuth consent screen**
3. Click **Edit App**
4. Go to **Scopes** section
5. Click **Add or Remove Scopes**
6. Search for and add:
   - `userinfo.email`
   - `userinfo.profile`
   - `gmail.readonly` (for Gmail API)
7. Click **Update**
8. Click **Save and Continue**

## Quick Reference

**Non-Sensitive Scopes (for Google Sign-In):**
- `https://www.googleapis.com/auth/userinfo.email`
- `https://www.googleapis.com/auth/userinfo.profile`

**Sensitive Scope (for Gmail API):**
- `https://www.googleapis.com/auth/gmail.readonly`

## Summary

**Yes, add the scopes** in OAuth consent screen:
- Email and profile scopes (non-sensitive) - for Google Sign-In
- Gmail readonly scope (sensitive) - for Gmail import

Without these scopes, OAuth won't work!







