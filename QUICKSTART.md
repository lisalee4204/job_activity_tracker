# Quick Start Guide

Get the Job Search Activity Tracker up and running in minutes!

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] npm/yarn/pnpm installed
- [ ] Supabase account (free tier works)
- [ ] Google Cloud Console account
- [ ] Git installed

## Step 1: Clone and Setup (5 minutes)

```bash
# Navigate to project directory
cd "job activity tracker"

# Install frontend dependencies
cd frontend
npm install

# Copy environment template
cp .env.example .env
```

## Step 2: Supabase Setup (10 minutes)

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Wait for database to initialize

2. **Get Your Credentials**
   - Go to Settings → API
   - Copy `Project URL` and `anon public` key
   - Update `frontend/.env`:
     ```env
     VITE_SUPABASE_URL=https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key
     ```

3. **Run Database Migrations**
   ```bash
   # Install Supabase CLI (if not installed)
   npm install -g supabase

   # Login to Supabase
   supabase login

   # Link to your project
   cd ../backend
   supabase init
   supabase link --project-ref your-project-ref

   # Run migrations
   supabase db push
   ```

## Step 3: Google Cloud Setup (15 minutes)

1. **Create OAuth Credentials**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create new project or select existing
   - Enable "Gmail API" and "Google+ API"

2. **Configure OAuth Consent Screen**
   - Go to APIs & Services → OAuth consent screen
   - Choose "External"
   - Fill in app name: "Job Search Activity Tracker"
   - Add scopes: `email`, `profile`, `gmail.readonly`
   - Add test users (your email)

3. **Create OAuth Credentials**
   - Go to APIs & Services → Credentials
   - Create OAuth 2.0 Client ID (Web application)
   - Authorized redirect URIs:
     - `http://localhost:5173/auth/gmail/callback` (development)
     - `https://your-project.supabase.co/auth/v1/callback` (Supabase)

4. **Configure Supabase Auth**
   - In Supabase Dashboard → Authentication → Providers
   - Enable Google provider
   - Enter Client ID and Client Secret

5. **Set Edge Function Secrets**
   ```bash
   supabase secrets set GMAIL_CLIENT_ID=your-client-id
   supabase secrets set GMAIL_CLIENT_SECRET=your-client-secret
   ```

## Step 4: Deploy Edge Functions (5 minutes)

```bash
cd backend/supabase/functions

# Deploy all functions
supabase functions deploy gmail-oauth-config
supabase functions deploy gmail-auth
supabase functions deploy fetch-gmail-emails
supabase functions deploy parse-email
supabase functions deploy analyze-job-search
```

## Step 5: Start Development Server (1 minute)

```bash
cd ../../frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser!

## Step 6: Test the Application

1. **Sign Up**
   - Click "Sign up"
   - Create account with email/password
   - Or use "Sign in with Google"

2. **Add Activity**
   - Click "Add Activity"
   - Fill in the form
   - Submit

3. **View Dashboard**
   - See your activities in the table
   - Check weekly progress
   - View analytics

## Troubleshooting

### "Cannot connect to Supabase"
- Check `.env` file has correct URL and key
- Verify Supabase project is active
- Check network connection

### "Migration failed"
- Ensure Supabase CLI is logged in
- Check project ref is correct
- Verify database is initialized

### "Gmail OAuth not working"
- Verify redirect URIs match exactly
- Check OAuth consent screen is configured
- Ensure Gmail API is enabled
- Verify credentials in Supabase secrets

### "Edge functions not deploying"
- Check Deno version compatibility
- Verify function code syntax
- Check Supabase CLI version
- Review function logs in dashboard

## Next Steps

1. **Customize Settings**
   - Set your weekly goal
   - Configure preferences

2. **Connect Gmail** (Optional)
   - Click "Connect Gmail"
   - Authorize access
   - Import recent applications

3. **Explore Features**
   - Add more activities
   - View analytics
   - Export data

4. **Deploy to Production**
   - See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for details

## Need Help?

- 📖 Read [CONFIGURATION.md](./docs/CONFIGURATION.md) for detailed setup
- 📚 Check [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for system overview
- 🐛 Review [PRD_REVIEW.md](./PRD_REVIEW.md) for questions/concerns
- 💬 Open an issue for bugs or questions

## Common Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Deploy functions
supabase functions deploy <function-name>

# View logs
supabase functions logs <function-name>
```

---

**Estimated Total Setup Time**: 30-45 minutes

**Ready to track your job search! 🚀**



