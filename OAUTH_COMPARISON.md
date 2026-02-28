# OAuth Handling Comparison

## Repos Compared

| | This repo (`main` / initial commit `77a96dd`) | Fixed version (`claude/review-changes-mlzk4xle3omkv4r5-zhSvT`) |
|---|---|---|
| Commit | `77a96dd` — "Initial commit: Job Activity Tracker" | `811479d` — "fix: resolve Gmail OAuth and email import bugs" |
| Files changed | baseline | `fetch-gmail-emails/index.ts`, `parse-email/index.ts`, `frontend/src/lib/api.ts` |

---

## Difference 1 — Refresh token sent **encrypted** to Google

**File:** `backend/supabase/functions/fetch-gmail-emails/index.ts` (~line 207)

**Original (broken):**
```ts
body: new URLSearchParams({
  client_id: gmailClientId,
  client_secret: gmailClientSecret,
  refresh_token: tokenData.refresh_token,   // ← still AES-GCM encrypted bytes
  grant_type: 'refresh_token',
}),
```

**Fixed:**
```ts
// Decrypt refresh token before sending to Google
let decryptedRefreshToken: string
try {
  decryptedRefreshToken = await decryptToken(tokenData.refresh_token)
} catch (error) {
  throw new Error('Failed to decrypt refresh token. Please reconnect Gmail.')
}

body: new URLSearchParams({
  client_id: gmailClientId,
  client_secret: gmailClientSecret,
  refresh_token: decryptedRefreshToken,     // ← plaintext, what Google expects
  grant_type: 'refresh_token',
}),
```

**Impact:** Every token refresh attempt returned a `400 invalid_grant` from Google, causing email imports to always fail after the initial access token expired (~1 hour).

---

## Difference 2 — New tokens stored **plaintext** after refresh

**File:** `backend/supabase/functions/fetch-gmail-emails/index.ts` (~line 231)

**Original (broken):**
```ts
const updateData: any = {
  access_token: newTokens.access_token,     // ← plaintext stored in DB
  expires_at: expiresAt.toISOString(),
  updated_at: new Date().toISOString(),
}
if (newTokens.refresh_token) {
  updateData.refresh_token = newTokens.refresh_token  // ← also plaintext
}
```

**Fixed:**
```ts
// Encrypt new tokens before storing
const encryptedNewAccessToken = await encryptToken(newTokens.access_token)
const encryptedNewRefreshToken = newTokens.refresh_token
  ? await encryptToken(newTokens.refresh_token)
  : tokenData.refresh_token  // keep existing encrypted refresh token if no new one

const updateData: any = {
  access_token: encryptedNewAccessToken,    // ← encrypted
  refresh_token: encryptedNewRefreshToken,  // ← always updated, encrypted
  expires_at: expiresAt.toISOString(),
  updated_at: new Date().toISOString(),
}
```

**Impact:** After the first successful refresh, the DB held plaintext tokens. The next call to `decryptToken()` on a plaintext string would throw, permanently breaking the integration until the user reconnected Gmail.

Also note: the original code conditionally set `refresh_token` only when Google returned a new one. The fix always writes it (keeping the existing encrypted value when Google doesn't rotate it), ensuring the column never gets cleared.

---

## Difference 3 — Connection check incorrectly returns `false` when token is expired

**File:** `frontend/src/lib/api.ts` (`gmailApi.checkConnection`)

**Original (broken):**
```ts
const { data, error } = await supabase
  .from('gmail_tokens')
  .select('id, expires_at')
  .eq('user_id', user.id)
  .maybeSingle()

if (!data) return false
return new Date(data.expires_at) > new Date()  // ← false once access token expires
```

**Fixed:**
```ts
const { data, error } = await supabase
  .from('gmail_tokens')
  .select('id')
  .eq('user_id', user.id)
  .maybeSingle()

// Return true as long as a token row exists — fetch-gmail-emails handles refresh automatically
return !!data
```

**Impact:** The `fetch-gmail-emails` edge function already auto-refreshes the access token before each API call. The UI checking `expires_at` on its own would show "Gmail not connected" to the user after ~1 hour even though the connection was fully valid. This caused unnecessary reconnect prompts.

---

## Difference 4 — Unawaited dangling Promise

**File:** `backend/supabase/functions/fetch-gmail-emails/index.ts` (~line 434)

**Original (broken):**
```ts
// Parse emails with AI
const parseEmailFunction = supabaseClient.functions.invoke('parse-email')  // ← unawaited
const parsedActivities = []
```

**Fixed:**
```ts
// Parse emails with AI
const parsedActivities = []
```

**Impact:** `supabaseClient.functions.invoke('parse-email')` was called but its Promise was never awaited or used. This caused a fire-and-forget invocation with no arguments and wasted a function invocation per batch. The real `parse-email` calls happen later in the loop.

---

## Summary

| # | Location | Bug | Effect |
|---|---|---|---|
| 1 | `fetch-gmail-emails` — `refreshGmailToken()` | Encrypted refresh token sent directly to Google | All token refreshes fail with `400 invalid_grant`; imports stop working after ~1 hour |
| 2 | `fetch-gmail-emails` — `refreshGmailToken()` | Plaintext tokens stored back to DB after refresh | Subsequent `decryptToken()` calls throw; integration permanently broken until user reconnects |
| 3 | `frontend/src/lib/api.ts` — `checkConnection()` | UI returns "not connected" when access token is expired | Users see false "Gmail not connected" state; prompted to reconnect unnecessarily |
| 4 | `fetch-gmail-emails` — main handler | Unawaited dangling Promise invoking `parse-email` | Wasted invocation with no args on every import run |

Bugs 1 and 2 are the root cause of "zero emails imported" — token encryption/decryption was implemented in `gmail-auth` (initial token storage) but the `refresh` path inside `fetch-gmail-emails` bypassed both decrypt-before-use and encrypt-before-store.
