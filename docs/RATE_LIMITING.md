# Rate Limiting & Exponential Backoff

## Overview

This document explains how rate limiting and exponential backoff are implemented to handle API rate limits gracefully, particularly for the Gmail API.

## What is Exponential Backoff?

Exponential backoff is a retry strategy where the wait time between retry attempts increases exponentially:

- **1st retry**: Wait 1 second
- **2nd retry**: Wait 2 seconds  
- **3rd retry**: Wait 4 seconds
- **4th retry**: Wait 8 seconds
- And so on...

This prevents overwhelming the API server and gives it time to recover from high load.

## Gmail API Rate Limits

Gmail API has strict rate limits:
- **250 quota units per user per second**
- Most operations cost **5 quota units** each
- This means approximately **50 requests per second** maximum

### Quota Costs
- List messages: 5 units
- Get message: 5 units
- Search: 5 units

## Implementation

### Rate Limiter (`_shared/rate-limiter.ts`)

The `GmailRateLimiter` class tracks requests and ensures we don't exceed the rate limit:

```typescript
const rateLimiter = new GmailRateLimiter()

// Before each API call
await rateLimiter.waitIfNeeded()
```

### Exponential Backoff (`withRetry`)

The `withRetry` function wraps API calls with automatic retry logic:

```typescript
const result = await withRetry(
  async () => {
    // Your API call here
    return await fetchGmailAPI()
  },
  {
    maxRetries: 3,
    initialDelay: 1000, // Start with 1 second
    maxDelay: 30000,     // Cap at 30 seconds
  }
)
```

## Usage in Edge Functions

### Example: Fetching Gmail Emails

```typescript
import { withRetry, GmailRateLimiter } from '../_shared/rate-limiter.ts'

const rateLimiter = new GmailRateLimiter()

// Search emails with retry
await rateLimiter.waitIfNeeded()
const searchData = await withRetry(async () => {
  const response = await fetch(gmailApiUrl, {
    headers: { Authorization: `Bearer ${token}` }
  })
  
  if (!response.ok) {
    const error: any = new Error('API call failed')
    error.status = response.status
    throw error
  }
  
  return response.json()
}, {
  maxRetries: 3,
  initialDelay: 1000,
})
```

## Error Detection

The rate limiter automatically detects rate limit errors:

- **HTTP 429** status code (Too Many Requests)
- Error messages containing "rate limit"
- Error messages containing "quota exceeded"

## Configuration

### Rate Limiter Options

```typescript
const rateLimiter = new GmailRateLimiter({
  maxRequestsPerSecond: 45, // Conservative limit (default)
  windowMs: 1000,           // 1 second window (default)
})
```

### Retry Options

```typescript
const options = {
  maxRetries: 3,           // Maximum retry attempts
  initialDelay: 1000,      // Initial delay in milliseconds
  maxDelay: 30000,         // Maximum delay cap
  backoffMultiplier: 2,    // Exponential multiplier
}
```

## Monitoring

Rate limit events are logged:

```
Rate limit hit. Retrying in 2000ms (attempt 2/3)
Rate limit: waiting 150ms
```

Monitor these logs to:
- Identify rate limit patterns
- Adjust rate limiter settings
- Optimize API usage

## Best Practices

1. **Always use rate limiter** before Gmail API calls
2. **Use retry logic** for all external API calls
3. **Monitor logs** for rate limit events
4. **Adjust limits** based on actual usage patterns
5. **Batch operations** when possible to reduce API calls

## Troubleshooting

### "Rate limit exceeded after X attempts"

- Check if you're making too many concurrent requests
- Reduce `maxRequestsPerSecond` in rate limiter
- Increase delays between batch operations

### Slow Performance

- Rate limiting adds delays - this is expected
- Consider batching operations
- Use async processing for large imports

### Still Getting Rate Limited

- Verify you're using the rate limiter correctly
- Check for concurrent requests from multiple sources
- Review Gmail API quota usage in Google Cloud Console

## Future Improvements

- [ ] Implement token bucket algorithm for more precise rate limiting
- [ ] Add metrics/telemetry for rate limit events
- [ ] Dynamic rate limit adjustment based on API responses
- [ ] Queue system for large batch operations







