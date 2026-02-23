# Deployment Guide

## Prerequisites

- Supabase account and project
- Google Cloud Console project with OAuth credentials
- Lovable AI API key (or alternative AI service)
- Domain name (for production)
- Node.js 18+ installed locally

## Step 1: Supabase Setup

### Create Supabase Project

1. Go to [Supabase](https://supabase.com/) and create a new project
2. Note your project URL and anon key from Settings → API

### Run Database Migrations

```bash
cd backend
supabase init
supabase link --project-ref your-project-ref
supabase db push
```

### Configure Authentication

1. Go to Authentication → Providers
2. Enable Email provider
3. Enable Google provider:
   - Enter Client ID and Client Secret from Google Cloud Console
   - Configure redirect URLs

### Set Environment Secrets

```bash
supabase secrets set LOVABLE_API_KEY=your-key
supabase secrets set GMAIL_CLIENT_ID=your-client-id
supabase secrets set GMAIL_CLIENT_SECRET=your-client-secret
supabase secrets set GMAIL_REDIRECT_URI=https://your-domain.com/auth/gmail/callback
```

## Step 2: Deploy Edge Functions

```bash
cd backend/supabase/functions

# Deploy each function
supabase functions deploy gmail-oauth-config
supabase functions deploy gmail-auth
supabase functions deploy fetch-gmail-emails
supabase functions deploy parse-email
supabase functions deploy analyze-job-search
```

## Step 3: Frontend Deployment

### Build Frontend

```bash
cd frontend
npm install
npm run build
```

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`
4. Set environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_APP_URL`

### Deploy to Netlify

1. Install Netlify CLI: `npm i -g netlify-cli`
2. Login: `netlify login`
3. Deploy: `netlify deploy --prod`
4. Set environment variables in Netlify dashboard

### Deploy to Other Platforms

For other platforms (AWS Amplify, Cloudflare Pages, etc.), follow their respective deployment guides. Ensure:

- Build command: `cd frontend && npm run build`
- Output directory: `frontend/dist`
- Environment variables are set

## Step 4: Google Cloud Console Configuration

### OAuth Consent Screen

1. Go to APIs & Services → OAuth consent screen
2. Configure:
   - App name: Job Search Activity Tracker
   - User support email
   - Developer contact email
   - Scopes: email, profile, gmail.readonly
   - Authorized domains: your production domain

### OAuth Credentials

1. Create OAuth 2.0 Client ID (Web application)
2. Authorized JavaScript origins:
   - `https://your-domain.com`
   - `https://your-project.supabase.co`
3. Authorized redirect URIs:
   - `https://your-project.supabase.co/auth/v1/callback` (for Google Sign-In)
   - `https://your-domain.com/auth/gmail/callback` (for Gmail import)

## Step 5: Environment Variables

### Frontend (.env.production)

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_URL=https://your-domain.com
VITE_APP_NAME=Job Search Activity Tracker
```

### Backend (Supabase Secrets)

Set via Supabase CLI or dashboard:
- `LOVABLE_API_KEY`
- `GMAIL_CLIENT_ID`
- `GMAIL_CLIENT_SECRET`
- `GMAIL_REDIRECT_URI`

## Step 6: Post-Deployment Checklist

- [ ] Test user authentication (email/password and Google Sign-In)
- [ ] Test activity creation
- [ ] Test Gmail OAuth connection
- [ ] Test email import functionality
- [ ] Verify RLS policies are working
- [ ] Test analytics and insights
- [ ] Check error logging
- [ ] Verify CORS settings
- [ ] Test on mobile devices
- [ ] Set up monitoring and alerts

## Step 7: Monitoring & Maintenance

### Set Up Monitoring

1. **Error Tracking**: Integrate Sentry or similar
2. **Analytics**: Set up Google Analytics or Plausible
3. **Uptime Monitoring**: Use UptimeRobot or similar
4. **Performance Monitoring**: Use Supabase dashboard

### Regular Maintenance

- Monitor database size and performance
- Review edge function logs
- Check API usage and costs
- Update dependencies regularly
- Review and rotate secrets periodically

## Troubleshooting

### Common Issues

#### Authentication Not Working
- Verify OAuth redirect URIs match exactly
- Check Supabase Auth settings
- Verify environment variables

#### Gmail Import Failing
- Check Gmail API is enabled in Google Cloud Console
- Verify OAuth scopes include `gmail.readonly`
- Check edge function logs for errors
- Verify tokens are being stored correctly

#### Database Connection Issues
- Verify Supabase project is active
- Check RLS policies
- Verify connection string format

#### Edge Functions Not Deploying
- Check Deno version compatibility
- Verify function code syntax
- Check Supabase CLI version
- Review function logs

## Rollback Procedure

If deployment fails:

1. **Frontend**: Revert to previous deployment in your hosting platform
2. **Backend**: 
   ```bash
   supabase db reset --version previous-migration
   ```
3. **Edge Functions**: Redeploy previous version
4. **Secrets**: Restore from backup

## Production Best Practices

1. **Security**:
   - Enable HTTPS only
   - Use secure cookies
   - Implement rate limiting
   - Regular security audits

2. **Performance**:
   - Enable CDN for static assets
   - Implement caching strategies
   - Optimize database queries
   - Monitor API response times

3. **Backup**:
   - Regular database backups
   - Version control for all code
   - Document configuration changes

4. **Scaling**:
   - Monitor resource usage
   - Plan for horizontal scaling
   - Optimize expensive operations
   - Use connection pooling



