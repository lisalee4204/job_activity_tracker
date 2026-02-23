# Setup Instructions - Manual Steps Required

## Status

✅ **Frontend dependencies** - Installed
✅ **Environment variables** - Configured
❌ **Supabase CLI** - Needs to be installed
❌ **Database migrations** - Need to run
❌ **Edge functions** - Need to deploy
❌ **Secrets** - Need to set

## Step 1: Install Supabase CLI

### Option A: Using npm (Recommended)
```bash
npm install -g supabase
```

### Option B: Using Scoop (Windows)
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### Option C: Download Binary
1. Go to https://github.com/supabase/cli/releases
2. Download latest Windows binary
3. Add to PATH

## Step 2: Login to Supabase
```bash
supabase login
```
This will open your browser to authenticate.

## Step 3: Link Project
```bash
cd backend
supabase link --project-ref uiiuwvdqqyybumkasrdz
```

## Step 4: Run Migrations
```bash
supabase db push
```

## Step 5: Deploy Functions
```bash
supabase functions deploy gmail-oauth-config
supabase functions deploy gmail-auth
supabase functions deploy fetch-gmail-emails
supabase functions deploy parse-email
supabase functions deploy analyze-job-search
supabase functions deploy refresh-gmail-token
supabase functions deploy export-user-data
supabase functions deploy delete-user-account
```

## Step 6: Generate Encryption Key

### Using Node.js (if OpenSSL not available):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Using PowerShell:
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

Copy the output - you'll need it for the next step.

## Step 7: Set Secrets

You'll need:
1. **Encryption key** (from Step 6)
2. **Gmail Client ID** (from Google Cloud Console)
3. **Gmail Client Secret** (from Google Cloud Console)
4. **Lovable API Key** (optional, if you have one)

```bash
supabase secrets set ENCRYPTION_KEY=your-generated-key-here
supabase secrets set GMAIL_CLIENT_ID=your-gmail-client-id
supabase secrets set GMAIL_CLIENT_SECRET=your-gmail-client-secret
supabase secrets set LOVABLE_API_KEY=your-ai-key-if-available
```

## Step 8: Start Development Server
```bash
cd frontend
npm run dev
```

Open http://localhost:5173

## Alternative: Use Supabase Dashboard

If CLI installation is problematic, you can:

1. **Run migrations via SQL Editor**:
   - Go to Supabase Dashboard → SQL Editor
   - Copy/paste SQL from `backend/supabase/migrations/*.sql` files
   - Run each migration in order

2. **Deploy functions via Dashboard**:
   - Go to Supabase Dashboard → Edge Functions
   - Upload each function manually
   - Or use the Supabase CLI once installed

3. **Set secrets via Dashboard**:
   - Go to Supabase Dashboard → Settings → Edge Functions → Secrets
   - Add each secret manually

## Quick Test

Once setup is complete:
1. Start dev server: `npm run dev`
2. Open http://localhost:5173
3. Try signing up
4. Create an activity

## Need Help?

- Supabase CLI docs: https://supabase.com/docs/guides/cli
- Supabase Dashboard: https://supabase.com/dashboard/project/uiiuwvdqqyybumkasrdz







