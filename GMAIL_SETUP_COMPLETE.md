# Gmail Integration - Complete Setup Guide

## ✅ What I Just Added

I've added a **Gmail Connection Card** to your dashboard that allows users to:
- Connect their Gmail account
- Import emails automatically
- See connection status
- Import last 7 or 30 days of emails

## Quick Setup Steps

### 1. Set Supabase Secrets

```bash
# Encryption key (required)
supabase secrets set ENCRYPTION_KEY=1/HNJABHYL8l6eqh4E10iwO4OWPWqW0qlWR7B4ZMxYE=

# Gmail API credentials (get from Google Cloud Console)
supabase secrets set GMAIL_CLIENT_ID=your-gmail-client-id
supabase secrets set GMAIL_CLIENT_SECRET=your-gmail-client-secret
```

### 2. Set Up Google OAuth

**In Google Cloud Console:**
1. Enable **Gmail API**
2. Create **OAuth 2.0 Client ID** (Web application)
3. Add redirect URI: `http://localhost:5173/auth/gmail/callback`
4. Copy Client ID and Secret
5. Set as Supabase secrets (see Step 1)

**In Supabase Dashboard:**
1. Authentication → Providers → Google
2. Enable Google provider
3. Enter Client ID and Secret (can be same as Gmail API or different)

### 3. Test It

1. Start app: `cd frontend && npm run dev`
2. Sign in
3. Look for "Gmail Integration" card on dashboard
4. Click "Connect Gmail"
5. Authorize in Google
6. Import emails!

## What the Gmail Card Does

✅ **Connection Status** - Shows if Gmail is connected
✅ **Connect Button** - Initiates OAuth flow
✅ **Import Buttons** - Import last 7 or 30 days
✅ **Auto-redirect** - Handles OAuth callback
✅ **Error Handling** - Shows helpful error messages

## Features

- **Automatic Parsing** - AI extracts job details from emails
- **Job Board Detection** - Identifies Indeed, LinkedIn, etc.
- **Contact Extraction** - Gets sender name and email
- **Deduplication** - Prevents duplicate activities
- **Incremental Imports** - Only imports new emails

## Troubleshooting

**"Gmail OAuth not configured":**
- Set `GMAIL_CLIENT_ID` in Supabase secrets

**"Redirect URI mismatch":**
- Make sure redirect URI in Google Console matches exactly:
  - `http://localhost:5173/auth/gmail/callback`

**Connection fails:**
- Check Supabase Edge Functions logs
- Verify Gmail API is enabled
- Check OAuth consent screen is configured

Your Gmail integration is ready! 🎉







