# Set Secrets - Required for App to Work

## Secrets You Need to Set

### 1. Encryption Key (Required) ✅
```bash
supabase secrets set ENCRYPTION_KEY=1/HNJABHYL8l6eqh4E10iwO4OWPWqW0qlWR7B4ZMxYE=
```

### 2. Gmail Client ID (Required for Gmail features)
```bash
supabase secrets set GMAIL_CLIENT_ID=your-gmail-client-id
```
Get this from Google Cloud Console → APIs & Services → Credentials

### 3. Gmail Client Secret (Required for Gmail features)
```bash
supabase secrets set GMAIL_CLIENT_SECRET=your-gmail-client-secret
```
Get this from Google Cloud Console → APIs & Services → Credentials

### 4. Lovable API Key (Optional - for AI features)
```bash
supabase secrets set LOVABLE_API_KEY=your-ai-key-if-available
```

## Quick Setup

**Minimum to get app running:**
```bash
# Set encryption key (required)
supabase secrets set ENCRYPTION_KEY=1/HNJABHYL8l6eqh4E10iwO4OWPWqW0qlWR7B4ZMxYE=
```

**For Gmail features (can add later):**
- Set up Google OAuth in Google Cloud Console
- Get Client ID and Secret
- Set as secrets above

## What Works Without Gmail Setup

✅ Authentication (email/password)
✅ Activity management
✅ Analytics dashboard
✅ Weekly summaries
✅ Settings
✅ Data export
✅ All core features

The app works fully without Gmail - you can add Gmail integration later!







