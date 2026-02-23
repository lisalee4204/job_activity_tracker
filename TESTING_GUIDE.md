# Testing Guide

## Quick Start Testing

### Prerequisites
- Node.js 18+ installed
- Supabase account
- Google Cloud Console account (for Gmail OAuth)

## Step 1: Local Setup (5 minutes)

### 1.1 Install Dependencies
```bash
cd frontend
npm install
```

### 1.2 Set Up Environment Variables
```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_URL=http://localhost:5173
```

### 1.3 Start Development Server
```bash
cd frontend
npm run dev
```

Open http://localhost:5173 in your browser.

## Step 2: Backend Setup (10 minutes)

### 2.1 Supabase Setup

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Create new project
   - Wait for database to initialize

2. **Get Credentials**
   - Settings → API
   - Copy Project URL and anon key
   - Update `frontend/.env`

3. **Run Migrations**
   ```bash
   cd backend
   npm install -g supabase
   supabase login
   supabase link --project-ref your-project-ref
   supabase db push
   ```

### 2.2 Deploy Edge Functions
```bash
cd backend/supabase/functions

# Deploy each function
supabase functions deploy gmail-oauth-config
supabase functions deploy gmail-auth
supabase functions deploy fetch-gmail-emails
supabase functions deploy parse-email
supabase functions deploy analyze-job-search
supabase functions deploy refresh-gmail-token
supabase functions deploy export-user-data
supabase functions deploy delete-user-account
```

### 2.3 Set Secrets
```bash
# Generate encryption key first
openssl rand -base64 32

# Set all secrets
supabase secrets set GMAIL_CLIENT_ID=your-client-id
supabase secrets set GMAIL_CLIENT_SECRET=your-client-secret
supabase secrets set LOVABLE_API_KEY=your-ai-key
supabase secrets set ENCRYPTION_KEY=your-generated-key
```

## Step 3: Google Cloud Setup (15 minutes)

### 3.1 Create OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create project or select existing
3. Enable APIs:
   - Gmail API
   - Google+ API

### 3.2 Configure OAuth Consent Screen

1. APIs & Services → OAuth consent screen
2. Choose "External"
3. Fill in app information
4. Add scopes:
   - `email`
   - `profile`
   - `gmail.readonly`

### 3.3 Create OAuth Credentials

**For Google Sign-In (User Auth)**:
1. Create OAuth 2.0 Client ID (Web application)
2. Authorized redirect URIs:
   - `https://your-project.supabase.co/auth/v1/callback`
3. Copy Client ID and Secret
4. Configure in Supabase Dashboard:
   - Authentication → Providers → Google
   - Enter Client ID and Secret

**For Gmail API (Email Import)**:
1. Create OAuth 2.0 Client ID (Web application)
2. Authorized redirect URIs:
   - `http://localhost:5173/auth/gmail/callback` (development)
   - `https://your-domain.com/auth/gmail/callback` (production)
3. Copy Client ID and Secret
4. Set as Supabase secrets (see Step 2.3)

## Step 4: Test Features

### 4.1 Authentication
- [ ] Sign up with email/password
- [ ] Sign in with email/password
- [ ] Sign in with Google
- [ ] Sign out

### 4.2 Activity Management
- [ ] Add activity manually
- [ ] View activities in table
- [ ] Delete activity (with confirmation)
- [ ] Undo deletion (within 5 minutes)
- [ ] Edit activity (via AI review dialog if AI-parsed)

### 4.3 Gmail Integration
- [ ] Connect Gmail account
- [ ] Import emails (first time - full import)
- [ ] Import emails again (incremental - only new)
- [ ] Verify job board detection
- [ ] Check sender extraction

### 4.4 Analytics
- [ ] View weekly summary
- [ ] Check goal compliance
- [ ] See goal exceeded celebration
- [ ] View AI insights

### 4.5 Custom Features
- [ ] Add custom activity type
- [ ] Use custom type in activity
- [ ] View custom types in dropdown

### 4.6 Settings
- [ ] Change weekly goal
- [ ] Export data (JSON)
- [ ] Export data (CSV)
- [ ] Test account deletion (use test account!)

## Step 5: Test Edge Cases

### 5.1 Error Handling
- [ ] Invalid email format
- [ ] Missing required fields
- [ ] Gmail token expiration
- [ ] Network errors
- [ ] Rate limit handling

### 5.2 Data Validation
- [ ] Duplicate activity detection
- [ ] Date validation
- [ ] URL validation
- [ ] Text length limits

### 5.3 Performance
- [ ] Large activity lists (100+)
- [ ] Multiple rapid imports
- [ ] Concurrent operations

## Troubleshooting

### "Cannot connect to Supabase"
- Check `.env` file has correct URL and key
- Verify Supabase project is active
- Check network connection

### "Gmail OAuth not working"
- Verify redirect URIs match exactly
- Check OAuth consent screen is configured
- Ensure Gmail API is enabled
- Verify credentials in Supabase secrets

### "Token encryption errors"
- Check `ENCRYPTION_KEY` is set
- Verify key is base64 encoded
- Check key length (should be 32+ bytes)

### "Edge functions not deploying"
- Check Deno version compatibility
- Verify function code syntax
- Review function logs in Supabase dashboard

## Testing Checklist

Print this checklist and check off as you test:

```
Authentication
[ ] Email sign up
[ ] Email sign in
[ ] Google sign in
[ ] Sign out

Activities
[ ] Create activity
[ ] View activities
[ ] Delete activity
[ ] Undo deletion
[ ] Edit activity

Gmail
[ ] Connect Gmail
[ ] Import emails
[ ] Incremental import
[ ] Job board detection

Analytics
[ ] Weekly summary
[ ] Goal tracking
[ ] AI insights

Settings
[ ] Change goal
[ ] Export data
[ ] Delete account (test only!)
```

## Next: Deploy to Production

Once testing is complete, see `docs/DEPLOYMENT.md` for production deployment.







