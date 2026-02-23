# Gmail Token Auto-Refresh

## Overview

Gmail access tokens automatically refresh when they expire or are about to expire, ensuring seamless email imports without requiring users to manually reconnect.

## How It Works

### Token Lifecycle

1. **Initial Connection**: User connects Gmail → receives access token (1 hour) + refresh token (long-lived)
2. **Token Usage**: Access token used for Gmail API calls
3. **Auto-Refresh**: When token expires or is within 5 minutes of expiring, automatically refreshed
4. **Seamless Experience**: User never sees "token expired" errors

### Refresh Timing

Tokens are refreshed when:
- **Expired**: Token expiration time has passed
- **Expiring Soon**: Token expires within 5 minutes (proactive refresh)

### Refresh Process

```
1. Check token expiration
2. If expired/expiring soon:
   → Use refresh token to get new access token
   → Update database with new token and expiration
   → Continue with email import
3. If refresh fails:
   → Ask user to reconnect Gmail
```

## Implementation

### Automatic Refresh

The `fetch-gmail-emails` function automatically refreshes tokens before making API calls:

```typescript
// Check if token needs refresh
if (expiresAt <= fiveMinutesFromNow) {
  const refreshed = await refreshGmailToken(supabaseClient, user.id)
  accessToken = refreshed.access_token
}
```

### Manual Refresh

Users can also manually refresh tokens via the `refresh-gmail-token` edge function:

```typescript
POST /functions/v1/refresh-gmail-token
Authorization: Bearer <user-token>
```

## Error Handling

### Refresh Token Expired

If the refresh token itself is expired (rare, usually after 6+ months of inactivity):
- Error: "Refresh token expired. Please reconnect Gmail."
- User must reconnect Gmail account
- New tokens issued

### Refresh Failures

If refresh fails for other reasons:
- Error logged for debugging
- User notified to reconnect
- Graceful degradation (manual entry still works)

## Security

### Token Storage

- Tokens stored in `gmail_tokens` table
- **Note**: Should be encrypted (pending implementation)
- Only accessible by the user who owns them (RLS policies)

### Refresh Token Security

- Refresh tokens are long-lived but can be revoked
- User can revoke in Google Account settings
- Revoked tokens cannot be refreshed

## Benefits

1. **Seamless Experience**: Users don't need to reconnect frequently
2. **Reliability**: Email imports work even after token expiration
3. **Proactive**: Refreshes before expiration (5-minute buffer)
4. **Error Recovery**: Handles refresh failures gracefully

## Monitoring

### Logs

Token refresh events are logged:
- Successful refreshes: New expiration time logged
- Failed refreshes: Error details logged
- Refresh token expiration: User notified

### Metrics to Track

- Refresh success rate
- Average time between refreshes
- Refresh failures requiring reconnection

## User Experience

### What Users See

**Normal Operation**: 
- No interruption
- Email imports work seamlessly
- No "token expired" errors

**If Refresh Fails**:
- Clear error message
- Instructions to reconnect Gmail
- Manual entry still available

### Reconnection Flow

If refresh fails:
1. User sees: "Gmail connection expired. Please reconnect."
2. Click "Connect Gmail" button
3. OAuth flow completes
4. New tokens stored
5. Email imports resume

## Technical Details

### Refresh Token Exchange

Uses Google OAuth 2.0 refresh token endpoint:
```
POST https://oauth2.googleapis.com/token
Content-Type: application/x-www-form-urlencoded

client_id=<CLIENT_ID>
client_secret=<CLIENT_SECRET>
refresh_token=<REFRESH_TOKEN>
grant_type=refresh_token
```

### Response

```json
{
  "access_token": "ya29.new...",
  "expires_in": 3600,
  "token_type": "Bearer",
  "scope": "https://www.googleapis.com/auth/gmail.readonly"
}
```

### Database Update

After successful refresh:
- `access_token`: Updated with new token
- `expires_at`: Updated with new expiration time
- `updated_at`: Timestamp of refresh
- `refresh_token`: Updated if Google returns new one (rare)

## Future Improvements

1. **Background Refresh**: Refresh tokens proactively via scheduled job
2. **Token Rotation**: Rotate refresh tokens periodically
3. **Encryption**: Encrypt tokens at rest (critical security improvement)
4. **Monitoring Dashboard**: Show token status and refresh history







