# Project status

**Last reviewed: 2026-09-20. Read this before the other 50+ markdown files at the repo root — they are debugging notes from February–March 2026 and most describe problems that are now either fixed or misdiagnosed.**

## Where this stands

Not deployed. No users. No hosting or CI configuration exists in the repo. The last substantive commit was February 2026; the only one since was a `.gitignore` change in March.

The code is roughly feature-complete for a v1 and does not work end to end, for reasons that are mostly external to the code (see Blockers).

## What this is, versus the Etsy product

There are two job trackers in these repos, and they overlap heavily:

| | `job_activity_tracker` (this one) | `v0-job-tracker-spreadsheet` |
|---|---|---|
| Status | Never shipped | **Selling on Etsy** as Journey Analytics |
| Stack | React 18 + Vite, Supabase | Next.js on Vercel |
| Storage | Postgres, with accounts | The customer's own browser |
| Unique capability | Gmail auto-import | — |
| Running cost | ~$25/mo (free tier pauses when idle) | $0 |

The only thing this app does that the shipped one cannot is **import job emails from Gmail** — which is also the single feature carrying an annual compliance obligation. Everything else here (analytics, weekly goals, custom activity types, export) is UI that could be ported to the shipped product far more cheaply than this backend can be operated.

**If you are deciding whether to revive this: the question is only whether Gmail auto-import is worth an annual security assessment.** Nothing else here justifies the backend.

## Blockers

These are in the order that matters.

### 1. `gmail.readonly` is a restricted OAuth scope

Google's strictest tier. Publishing an app that uses it requires OAuth verification and, for restricted scopes, an annual independent security assessment (CASA). That is weeks-to-months of process, real recurring cost, and it never goes away.

*Verify the current terms with Google directly — these requirements change, and the figures circulating in older write-ups are out of date.*

### 2. In Testing mode, Google expires refresh tokens after 7 days

This is independent of any bug in this codebase. While the OAuth consent screen is in "Testing", every user's Gmail connection dies after a week and they must reconnect. It is also limited to 100 test users.

Much of the February–March "reconnect Gmail" debugging in the root markdown files was chasing this without naming it. Redirect URIs and client secrets were not the whole problem.

### 3. The AI parsing endpoint is unverified

`parse-email` calls `https://api.lovable.ai/v1/parse-job-email`. Nobody has confirmed that endpoint exists or that `LOVABLE_API_KEY` is valid. Without a working key, parsing silently degrades to `parseEmailSimple`, a thin regex fallback — imports would appear to work while producing poor records. Confirm this before trusting any import results.

### 4. Secrets are not set

`ENCRYPTION_KEY`, `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, and optionally `LOVABLE_API_KEY` must be set as Supabase secrets. See `SET_SECRETS.md`.

**`ENCRYPTION_KEY` must never change once tokens are stored.** Every stored Gmail token is encrypted with a key derived from it; changing it makes all of them undecryptable and forces every user to reconnect.

## What was fixed, and not yet deployed

Branch `claude/epic-davinci-wy4wcc` carries a fix for a real bug in the Gmail import:

`fetch-gmail-emails` had its own copy of the token refresh logic that sent the stored refresh token to Google **still encrypted** and wrote new tokens back **in plaintext**. Google answered `400 invalid_grant`, and the next read failed to decrypt. The symptom was that import worked for about an hour after connecting and then failed permanently with "please reconnect Gmail" — where reconnecting only restarted the same hour.

The correct implementation already existed in `refresh-gmail-token`. It now lives in `_shared/gmail-token.ts` and both functions use it; `gmail-auth` uses the shared encryption helpers too. All three former copies were byte-identical in behaviour, so **tokens stored by the old code still decrypt**.

Accounts already broken by this recover on their own — an undecryptable access token now triggers a refresh rather than an error.

Tests cover the refresh path:

```bash
deno test --allow-env backend/supabase/functions/_shared/gmail-token.test.ts
```

The two tests that target the bug fail against the old implementation and pass against the new one.

**To deploy, all three functions need redeploying**, since they now share a module:

```bash
supabase functions deploy fetch-gmail-emails
supabase functions deploy refresh-gmail-token
supabase functions deploy gmail-auth
```

Note that deploying this does **not** make Gmail import usable — blockers 1–3 still apply. It makes the code correct for whenever those are resolved.

## Also worth knowing

- **Mobile** (`mobile/`) is a Capacitor 5 shell. Capacitor is several majors ahead now; assume it needs upgrading, not just building.
- **`chatgpt/`, `claude/`, `vo/`** hold earlier prototypes and CSV templates. They are not part of the app.
- **The root markdown files** are a debugging trail, not documentation. `FIX_406_500_ERRORS.md` describes a `.single()` → `.maybeSingle()` fix that did land (`frontend/src/lib/api.ts`). The OAuth redirect-URI files describe configuration in Google Cloud and Supabase that cannot be verified from this repo. Treat all of them as history.

## If you come back to this

1. Decide the Gmail question first (Blocker 1). Everything else is downstream of it.
2. If yes: verify Blocker 3, get the consent screen out of Testing, then deploy the branch above.
3. If no: archive this repo and port the UI features you want into the product that is already selling.
