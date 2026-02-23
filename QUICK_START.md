# Quick Start - Get Running in 30 Minutes

## Prerequisites Check

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Supabase account (free tier works)
- [ ] Google Cloud Console account (free)

## Step 1: Frontend Setup (5 min)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your Supabase credentials (you'll get these in Step 2)
```

## Step 2: Supabase Setup (10 min)

### 2.1 Create Project
1. Go to https://supabase.com
2. Click "New Project"
3. Fill in:
   - Name: "Job Activity Tracker"
   - Database Password: (save this!)
   - Region: Choose closest to you
4. Wait ~2 minutes for setup

### 2.2 Get Credentials
1. In Supabase Dashboard → Settings → API
2. Copy:
   - **Project URL** → `VITE_SUPABASE_URL` in `.env`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY` in `.env`

### 2.3 Run Migrations
```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
cd ../backend
supabase init
supabase link --project-ref YOUR_PROJECT_REF
# (Find PROJECT_REF in Supabase URL: https://YOUR_PROJECT_REF.supabase.co)

# Run all migrations
supabase db push
```

### 2.4 Deploy Functions
```bash
# Deploy all edge functions
supabase functions deploy gmail-oauth-config
supabase functions deploy gmail-auth
supabase functions deploy fetch-gmail-emails
supabase functions deploy parse-email
supabase functions deploy analyze-job-search
supabase functions deploy refresh-gmail-token
supabase functions deploy export-user-data
supabase functions deploy delete-user-account
```

### 2.5 Set Secrets
```bash
# Generate encryption key
openssl rand -base64 32
# Copy the output

# Set secrets (you'll get Gmail credentials in Step 3)
supabase secrets set ENCRYPTION_KEY=your-generated-key-here
supabase secrets set LOVABLE_API_KEY=your-ai-key-if-you-have-one
# Gmail secrets will be set after Step 3
```

## Step 3: Google Cloud Setup (10 min)

### 3.1 Create Project
1. Go to https://console.cloud.google.com
2. Create new project: "Job Activity Tracker"

### 3.2 Enable APIs
1. APIs & Services → Library
2. Enable:
   - **Gmail API**
   - **Google+ API**

### 3.3 OAuth Consent Screen
1. APIs & Services → OAuth consent screen
2. Choose "External"
3. Fill in:
   - App name: Job Activity Tracker
   - User support email: your email
   - Developer contact: your email
4. Add scopes:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `https://www.googleapis.com/auth/gmail.readonly`
5. Save

### 3.4 Create OAuth Credentials

**For Google Sign-In**:
1. APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID
2. Application type: Web application
3. Authorized redirect URIs:
   ```
   https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
   ```
4. Copy Client ID and Secret
5. In Supabase Dashboard:
   - Authentication → Providers → Google
   - Enable Google provider
   - Enter Client ID and Secret
   - Save

**For Gmail API**:
1. Create another OAuth 2.0 Client ID (or reuse same one)
2. Authorized redirect URIs:
   ```
   http://localhost:5173/auth/gmail/callback
   ```
3. Copy Client ID and Secret
4. Set as Supabase secrets:
   ```bash
   supabase secrets set GMAIL_CLIENT_ID=your-client-id
   supabase secrets set GMAIL_CLIENT_SECRET=your-client-secret
   ```

## Step 4: Start Development Server (1 min)

```bash
cd frontend
npm run dev
```

Open http://localhost:5173

## Step 5: Test Basic Features

### Test Authentication
1. Click "Sign up"
2. Create account with email/password
3. Should redirect to dashboard

### Test Activity Creation
1. Click "Add Activity"
2. Fill in form:
   - Date: Today
   - Company: "Test Company"
   - Job Title: "Test Position"
   - Activity Type: Application
3. Click "Save Activity"
4. Should appear in table

### Test Weekly Summary
1. Check dashboard
2. Should show weekly progress
3. Add more activities to see progress bar fill

## Common Issues

### "Cannot connect to Supabase"
- ✅ Check `.env` file exists and has correct values
- ✅ Verify Supabase project is active
- ✅ Check browser console for errors

### "Functions not found"
- ✅ Make sure you deployed all functions
- ✅ Check function names match exactly
- ✅ Verify you're linked to correct project

### "Gmail OAuth error"
- ✅ Check redirect URIs match exactly (no trailing slashes)
- ✅ Verify OAuth consent screen is configured
- ✅ Ensure Gmail API is enabled

## Next Steps

Once basic testing works:
1. Test Gmail connection
2. Test email import
3. Test all features from checklist
4. Deploy to production (see DEPLOYMENT.md)

## Need Help?

- Check `docs/CONFIGURATION.md` for detailed setup
- Review `TESTING_GUIDE.md` for comprehensive testing
- Check Supabase logs: Dashboard → Edge Functions → Logs
- Check browser console for frontend errors







