import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Encryption utilities (inline for Deno edge functions)
const ALGORITHM = 'AES-GCM'
const KEY_LENGTH = 256
const IV_LENGTH = 12

function getEncryptionKey(): string {
  const key = Deno.env.get('ENCRYPTION_KEY')
  if (!key) {
    console.warn('ENCRYPTION_KEY not set, using default (NOT SECURE FOR PRODUCTION)')
    return 'default-key-change-in-production-32-chars!!'
  }
  return key
}

async function deriveKey(password: string): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  )

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('gmail-token-salt'),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    {
      name: ALGORITHM,
      length: KEY_LENGTH,
    },
    false,
    ['encrypt', 'decrypt']
  )
}

async function encryptToken(token: string): Promise<string> {
  try {
    const key = await deriveKey(getEncryptionKey())
    const encoder = new TextEncoder()
    const data = encoder.encode(token)
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH))
    const encrypted = await crypto.subtle.encrypt(
      { name: ALGORITHM, iv: iv },
      key,
      data
    )
    const combined = new Uint8Array(iv.length + encrypted.byteLength)
    combined.set(iv)
    combined.set(new Uint8Array(encrypted), iv.length)
    return btoa(String.fromCharCode(...combined))
  } catch (error) {
    console.error('Encryption error:', error)
    throw new Error('Failed to encrypt token')
  }
}

async function decryptToken(encryptedToken: string): Promise<string> {
  try {
    const key = await deriveKey(getEncryptionKey())
    const combined = Uint8Array.from(atob(encryptedToken), c => c.charCodeAt(0))
    const iv = combined.slice(0, IV_LENGTH)
    const encrypted = combined.slice(IV_LENGTH)
    const decrypted = await crypto.subtle.decrypt(
      { name: ALGORITHM, iv: iv },
      key,
      encrypted
    )
    const decoder = new TextDecoder()
    return decoder.decode(decrypted)
  } catch (error) {
    console.error('Decryption error:', error)
    throw new Error('Failed to decrypt token')
  }
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

/**
 * Refreshes Gmail access token using refresh token
 * Can be called directly or internally by other functions
 */
export async function refreshGmailToken(
  supabaseClient: any,
  userId: string
): Promise<{ access_token: string; expires_at: Date }> {
  // Get current tokens
  const { data: tokenData, error: tokenError } = await supabaseClient
    .from('gmail_tokens')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (tokenError || !tokenData) {
    throw new Error('Gmail not connected')
  }

  if (!tokenData.refresh_token) {
    throw new Error('No refresh token available. Please reconnect Gmail.')
  }

  // Decrypt refresh token
  let refreshToken: string
  try {
    refreshToken = await decryptToken(tokenData.refresh_token)
  } catch (error) {
    throw new Error('Failed to decrypt refresh token. Please reconnect Gmail.')
  }

  const gmailClientId = Deno.env.get('GMAIL_CLIENT_ID')
  const gmailClientSecret = Deno.env.get('GMAIL_CLIENT_SECRET')

  if (!gmailClientId || !gmailClientSecret) {
    throw new Error('Gmail OAuth credentials not configured')
  }

  // Exchange refresh token for new access token
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
    
    // If refresh token is invalid, user needs to reconnect
    if (refreshResponse.status === 400) {
      throw new Error('Refresh token expired. Please reconnect Gmail.')
    }
    
    throw new Error(`Token refresh failed: ${errorText}`)
  }

  const newTokens = await refreshResponse.json()

  // Calculate new expiration time
  const expiresAt = new Date()
  expiresAt.setSeconds(expiresAt.getSeconds() + (newTokens.expires_in || 3600))

  // Encrypt new tokens before storing
  const encryptedAccessToken = await encryptToken(newTokens.access_token)
  const encryptedRefreshToken = newTokens.refresh_token
    ? await encryptToken(newTokens.refresh_token)
    : tokenData.refresh_token // Keep existing if no new one

  // Update tokens in database
  const updateData: any = {
    access_token: encryptedAccessToken,
    refresh_token: encryptedRefreshToken,
    expires_at: expiresAt.toISOString(),
    updated_at: new Date().toISOString(),
  }

  const { error: updateError } = await supabaseClient
    .from('gmail_tokens')
    .update(updateData)
    .eq('user_id', userId)

  if (updateError) {
    throw new Error(`Failed to update tokens: ${updateError.message}`)
  }

  return {
    access_token: newTokens.access_token,
    expires_at: expiresAt,
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      throw new Error('Unauthorized')
    }

    // Refresh the token
    const refreshed = await refreshGmailToken(supabaseClient, user.id)

    return new Response(
      JSON.stringify({
        success: true,
        expires_at: refreshed.expires_at.toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})

