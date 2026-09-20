/**
 * Gmail token refresh, shared by every function that talks to the Gmail API.
 *
 * Tokens are stored encrypted (see ./encryption.ts). That means the refresh
 * token has to be decrypted before it goes to Google, and whatever Google
 * returns has to be encrypted again before it goes back to the database.
 * Getting either half wrong is silent: Google answers 400 invalid_grant, or
 * the next read fails to decrypt, and both surface to the user as an endless
 * "please reconnect Gmail". Keep this in one place so it stays right.
 */

import { decryptToken, encryptToken } from './encryption.ts'

export interface RefreshedToken {
  access_token: string
  expires_at: Date
}

export async function refreshGmailToken(
  supabaseClient: any,
  userId: string,
): Promise<RefreshedToken> {
  const { data: tokenData, error: tokenError } = await supabaseClient
    .from('gmail_tokens')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (tokenError || !tokenData) {
    throw new Error('Gmail not connected')
  }

  if (!tokenData.refresh_token) {
    throw new Error('No refresh token available. Please reconnect Gmail.')
  }

  let refreshToken: string
  try {
    refreshToken = await decryptToken(tokenData.refresh_token)
  } catch {
    throw new Error('Failed to decrypt refresh token. Please reconnect Gmail.')
  }

  const gmailClientId = Deno.env.get('GMAIL_CLIENT_ID')
  const gmailClientSecret = Deno.env.get('GMAIL_CLIENT_SECRET')

  if (!gmailClientId || !gmailClientSecret) {
    throw new Error('Gmail OAuth credentials not configured')
  }

  const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: gmailClientId,
      client_secret: gmailClientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })

  if (!refreshResponse.ok) {
    const errorText = await refreshResponse.text()
    console.error('Token refresh failed:', errorText)

    // Google returns 400 for a revoked or expired refresh token; there is
    // nothing to retry, the user has to authorize again.
    if (refreshResponse.status === 400) {
      throw new Error('Refresh token expired. Please reconnect Gmail.')
    }

    throw new Error(`Token refresh failed: ${errorText}`)
  }

  const newTokens = await refreshResponse.json()

  const expiresAt = new Date()
  expiresAt.setSeconds(expiresAt.getSeconds() + (newTokens.expires_in || 3600))

  const encryptedAccessToken = await encryptToken(newTokens.access_token)
  // Google only returns a refresh token on the first authorization, so keep
  // the stored one (already encrypted) when this response omits it.
  const encryptedRefreshToken = newTokens.refresh_token
    ? await encryptToken(newTokens.refresh_token)
    : tokenData.refresh_token

  const { error: updateError } = await supabaseClient
    .from('gmail_tokens')
    .update({
      access_token: encryptedAccessToken,
      refresh_token: encryptedRefreshToken,
      expires_at: expiresAt.toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)

  if (updateError) {
    throw new Error(`Failed to update tokens: ${updateError.message}`)
  }

  // The plaintext token is returned for immediate use; only the encrypted
  // copy is persisted.
  return {
    access_token: newTokens.access_token,
    expires_at: expiresAt,
  }
}
