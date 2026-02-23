# Next Steps After Functions Deploy

## What's Done ✅

✅ Database migrations - All tables created
✅ Edge functions - Deploying now...

## After Functions Deploy

### 1. Set Required Secrets

You'll need to set these secrets in Supabase:

```bash
# Encryption key (already generated)
supabase secrets set ENCRYPTION_KEY=1/HNJABHYL8l6eqh4E10iwO4OWPWqW0qlWR7B4ZMxYE=

# Gmail OAuth credentials (get from Google Cloud Console)
supabase secrets set GMAIL_CLIENT_ID=your-gmail-client-id
supabase secrets set GMAIL_CLIENT_SECRET=your-gmail-client-secret

# AI API key (optional)
supabase secrets set LOVABLE_API_KEY=your-ai-key-if-available
```

### 2. Set Up Google OAuth

**For Google Sign-In**:
1. Go to Google Cloud Console
2. Create OAuth 2.0 Client ID
3. Add redirect URI: `https://uiiuwvdqqyybumkasrdz.supabase.co/auth/v1/callback`
4. Copy Client ID and Secret
5. In Supabase Dashboard → Authentication → Providers → Google
6. Enable and enter credentials

**For Gmail API**:
1. Create another OAuth 2.0 Client ID (or reuse)
2. Add redirect URI: `http://localhost:5173/auth/gmail/callback` (dev)
3. Set as secrets (see above)

### 3. Start the App

```bash
cd frontend
npm run dev
```

Open http://localhost:5173

### 4. Test Basic Features

- Sign up with email/password
- Create an activity
- View dashboard
- Test weekly summary

### 5. Test Gmail Integration (After OAuth Setup)

- Connect Gmail account
- Import emails
- Verify parsing works

## What Works Without Gmail Setup

✅ Authentication (email/password)
✅ Activity management
✅ Analytics dashboard
✅ Weekly summaries
✅ Settings
✅ Data export
✅ All core features

## What Needs Gmail Setup

⚠️ Gmail email import
⚠️ Auto-parsing job applications
⚠️ Gmail OAuth connection

You can use the app fully without Gmail - it's optional!

## Quick Test Checklist

- [ ] Sign up
- [ ] Create activity
- [ ] View activities table
- [ ] Check weekly summary
- [ ] Test delete with undo
- [ ] View settings page
- [ ] Export data (JSON/CSV)

Your app is ready to use! 🚀







