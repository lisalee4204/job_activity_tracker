# Gmail Tokens Explained

## What Are Gmail Tokens?

Gmail tokens are **temporary access credentials** that allow our app to read your Gmail emails (with your permission). Think of them like a temporary key card that gives the app limited access to your email inbox.

## Why Do We Need Them?

To automatically import your job application emails, our app needs permission to:
- Read emails from your Gmail account
- Search for job application-related emails
- Extract information from those emails

**We can ONLY do this with your explicit permission** - you have to connect your Gmail account first.

## How Do They Work?

### 1. OAuth Flow (When You Connect Gmail)

```
You → Click "Connect Gmail" 
     → Google asks: "Allow Job Tracker to read your emails?"
     → You click "Allow"
     → Google gives us two tokens:
        - Access Token (short-lived, ~1 hour)
        - Refresh Token (long-lived, can get new access tokens)
```

### 2. Token Types

**Access Token:**
- **Lifespan**: ~1 hour
- **Purpose**: Used to make Gmail API calls
- **Example**: "ya29.a0AfH6SMBx..." (long random string)

**Refresh Token:**
- **Lifespan**: Until revoked (you disconnect)
- **Purpose**: Gets new access tokens when old one expires
- **Example**: "1//0g..." (long random string)

### 3. Token Storage

We store these tokens securely in our database:
- **Encrypted** (should be encrypted - currently a security gap we need to fix)
- **Linked to your user account**
- **Only used to read emails** (never to send or delete)

### 4. Token Expiration & Refresh

**What Happens When Access Token Expires?**
- Gmail API calls start failing
- We use refresh token to get a new access token
- This happens automatically (or should - needs implementation)

**What Happens When Refresh Token Expires?**
- You need to reconnect Gmail
- Google may expire refresh tokens after 6 months of inactivity
- Or if you revoke access in Google Account settings

## Security & Privacy

### What We Can Do With Tokens:
✅ Read your emails (with `gmail.readonly` scope)
✅ Search for specific emails
✅ Extract text from emails

### What We CANNOT Do:
❌ Send emails from your account
❌ Delete emails
❌ Modify emails
❌ Access your contacts
❌ Access other Google services

### Your Control:
- **Disconnect anytime**: Removes tokens, stops access
- **Revoke in Google**: Go to Google Account → Security → Third-party apps
- **See what we access**: Google shows exactly what permissions we have

## Current Implementation Status

### ✅ What's Working:
- OAuth flow to get tokens
- Storing tokens in database
- Using tokens to fetch emails
- Checking if tokens are expired

### ⚠️ What Needs Work:
- **Token encryption**: Currently stored in plain text (security risk!)
- **Auto-refresh**: Checks expiration but doesn't auto-refresh yet
- **Token rotation**: Should rotate refresh tokens periodically

## Why This Matters

**Without tokens**: You'd have to manually copy/paste every job application email
**With tokens**: App automatically finds and imports your applications

**Security concern**: Tokens are like passwords - if someone gets them, they could read your emails. That's why encryption is critical.

## Common Questions

**Q: Can you see all my emails?**
A: No, we only search for job application-related emails using specific keywords.

**Q: What if I disconnect Gmail?**
A: We stop accessing your emails immediately. Tokens are deleted (or marked inactive).

**Q: How long do tokens last?**
A: Access tokens: ~1 hour. Refresh tokens: Until you disconnect or Google revokes them.

**Q: Can I revoke access?**
A: Yes! In Google Account settings → Security → Third-party apps → Remove access.

**Q: Is this safe?**
A: Yes, with proper encryption (which we need to implement). We use Google's official OAuth system, which is industry-standard secure.







