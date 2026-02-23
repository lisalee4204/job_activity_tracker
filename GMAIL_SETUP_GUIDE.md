# Gmail Integration Setup - Complete Guide

## Overview

Gmail email import is a core feature. This guide will help you set it up completely.

## Step 1: Google Cloud Console Setup

### 1.1 Create/Select Project
1. Go to https://console.cloud.google.com
2. Create new project: "Job Activity Tracker"
   - Or select existing project

### 1.2 Enable Required APIs
1. Go to **APIs & Services** → **Library**
2. Enable these APIs:
   - ✅ **Gmail API**
   - ✅ **Google+ API** (for authentication)

### 1.3 Configure OAuth Consent Screen
1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** (unless you have Google Workspace)
3. Fill in required fields:
   - App name: `Job Activity Tracker`
   - User support email: Your email
   - Developer contact: Your email
4. Click **Save and Continue**
5. **Scopes** - Add these:
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`
   - `https://www.googleapis.com/auth/gmail.readonly`
6. Click **Save and Continue**
7. **Test users** (if in testing mode):
   - Add your email address
8. Click **Save and Continue**

### 1.4 Create OAuth Credentials

**For Google Sign-In (User Authentication):**
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client ID**
3. Application type: **Web application**
4. Name: `Job Tracker - Web App`
5. **Authorized redirect URIs** - Add:
   ```
   https://uiiuwvdqqyybumkasrdz.supabase.co/auth/v1/callback
   ```
6. Click **Create**
7. **Copy Client ID and Client Secret** - Save these!

**For Gmail API (Email Import):**
1. Create another **OAuth 2.0 Client ID** (or reuse the same one)
2. Application type: **Web application**
3. Name: `Job Tracker - Gmail API`
4. **Authorized redirect URIs** - Add:
   ```
   http://localhost:5173/auth/gmail/callback
   https://your-domain.com/auth/gmail/callback
   ```
   (Replace `your-domain.com` with your production domain when you deploy)
5. Click **Create**
6. **Copy Client ID and Client Secret** - Save these!

## Step 2: Configure Supabase

### 2.1 Set Up Google Sign-In Provider
1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/uiiuwvdqqyybumkasrdz
2. Go to **Authentication** → **Providers**
3. Find **Google** provider
4. Click **Enable**
5. Enter:
   - **Client ID** (from Google Sign-In credentials)
   - **Client Secret** (from Google Sign-In credentials)
6. Click **Save**

### 2.2 Set Gmail API Secrets
Run these commands (use your Gmail API credentials):

```bash
supabase secrets set GMAIL_CLIENT_ID=your-gmail-api-client-id
supabase secrets set GMAIL_CLIENT_SECRET=your-gmail-api-client-secret
supabase secrets set ENCRYPTION_KEY=1/HNJABHYL8l6eqh4E10iwO4OWPWqW0qlWR7B4ZMxYE=
```

## Step 3: Update Frontend Gmail OAuth Config

The frontend needs to know your Gmail Client ID. Let me check the current setup:
<｜tool▁calls▁begin｜><｜tool▁call▁begin｜>
read_file






