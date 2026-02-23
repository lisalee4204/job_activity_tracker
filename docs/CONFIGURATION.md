# Configuration Guide

## Environment Variables

### Frontend (.env)

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# App Configuration
VITE_APP_URL=http://localhost:5173
VITE_APP_NAME=Job Search Activity Tracker
```

### Backend (Supabase Secrets)

Set these in Supabase Dashboard → Settings → Edge Functions → Secrets:

```env
# AI Service
LOVABLE_API_KEY=your-lovable-api-key

# Gmail OAuth (for email imports)
GMAIL_CLIENT_ID=your-gmail-client-id.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=your-gmail-client-secret

# Optional: Encryption key for Gmail tokens
ENCRYPTION_KEY=your-32-byte-encryption-key
```

## Google Cloud Console Setup

### Step 1: Create OAuth 2.0 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable APIs:
   - Gmail API
   - Google+ API (for user info)

### Step 2: Configure OAuth Consent Screen

1. Navigate to **APIs & Services** → **OAuth consent screen**
2. Choose **External** user type
3. Fill in required information:
   - App name: Job Search Activity Tracker
   - User support email
   - Developer contact email
4. Add scopes:
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`
   - `https://www.googleapis.com/auth/gmail.readonly` (for Gmail imports)
5. Add test users (for development)
6. Submit for verification (for production)

### Step 3: Create OAuth 2.0 Credentials

#### For Google Sign-In (User Authentication)

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client ID**
3. Choose **Web application**
4. Configure authorized JavaScript origins:
   - `http://localhost:5173` (development)
   - `https://your-production-domain.com`
   - `https://your-project.supabase.co` (Supabase callback)
5. Configure authorized redirect URIs:
   - `https://your-project.supabase.co/auth/v1/callback`
6. Copy **Client ID** and **Client Secret**

#### For Gmail API (Email Imports)

1. Create a separate OAuth 2.0 Client ID (or reuse the same one)
2. Configure authorized redirect URIs:
   - `https://your-production-domain.com/auth/gmail/callback`
   - `http://localhost:5173/auth/gmail/callback` (development)
3. Copy **Client ID** and **Client Secret**

### Step 4: Configure Supabase Auth

1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Enable **Google** provider
3. Enter:
   - **Client ID**: From Step 3
   - **Client Secret**: From Step 3
4. Save configuration

## Supabase Setup

### Step 1: Create Project

1. Go to [Supabase](https://supabase.com/)
2. Create a new project
3. Note your project URL and anon key

### Step 2: Run Migrations

```bash
cd backend
supabase init
supabase link --project-ref your-project-ref
supabase db push
```

### Step 3: Configure RLS Policies

RLS policies are included in migrations. Verify they're enabled:

```sql
-- Check RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

### Step 4: Deploy Edge Functions

```bash
supabase functions deploy gmail-oauth-config
supabase functions deploy gmail-auth
supabase functions deploy fetch-gmail-emails
supabase functions deploy parse-email
supabase functions deploy analyze-job-search
```

### Step 5: Set Secrets

```bash
supabase secrets set LOVABLE_API_KEY=your-key
supabase secrets set GMAIL_CLIENT_ID=your-client-id
supabase secrets set GMAIL_CLIENT_SECRET=your-client-secret
```

## Local Development Setup

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- Supabase CLI

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your values
npm run dev
```

### Backend (Local Supabase)

```bash
# Start local Supabase
supabase start

# Run migrations
supabase db reset

# Deploy functions locally
supabase functions serve
```

## Production Deployment

### Frontend Deployment

#### Vercel

1. Connect your repository
2. Set environment variables
3. Deploy

#### Netlify

1. Connect your repository
2. Build command: `cd frontend && npm run build`
3. Publish directory: `frontend/dist`
4. Set environment variables

### Backend Deployment

Supabase handles backend deployment automatically. Ensure:

1. Migrations are applied
2. Edge functions are deployed
3. Secrets are set
4. RLS policies are enabled

## Security Checklist

- [ ] RLS enabled on all tables
- [ ] Environment variables set securely
- [ ] OAuth credentials configured correctly
- [ ] HTTPS enabled in production
- [ ] CORS configured properly
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] Gmail tokens encrypted at rest
- [ ] Error messages don't leak sensitive info

## Troubleshooting

### Gmail OAuth Issues

- Verify redirect URIs match exactly
- Check OAuth consent screen configuration
- Ensure Gmail API is enabled
- Verify scopes are correct

### Supabase Connection Issues

- Verify project URL and keys
- Check network connectivity
- Verify RLS policies allow access
- Check Supabase project status

### Edge Function Errors

- Check function logs in Supabase dashboard
- Verify secrets are set correctly
- Check function timeout settings
- Review function code for errors



