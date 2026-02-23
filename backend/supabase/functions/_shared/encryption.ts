/**
 * Token Encryption Utility
 * Uses Web Crypto API (available in Deno) for AES-256-GCM encryption
 * 
 * IMPORTANT: Store encryption key securely in Supabase secrets
 * Never commit encryption keys to version control
 */

const ALGORITHM = 'AES-GCM'
const KEY_LENGTH = 256
const IV_LENGTH = 12 // 96 bits for GCM

/**
 * Get encryption key from environment
 * Falls back to a default for development (should be set in production)
 */
function getEncryptionKey(): string {
  const key = Deno.env.get('ENCRYPTION_KEY')
  if (!key) {
    console.warn('ENCRYPTION_KEY not set, using default (NOT SECURE FOR PRODUCTION)')
    return 'default-key-change-in-production-32-chars!!' // 32 bytes
  }
  return key
}

/**
 * Derive encryption key from password
 */
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
      salt: encoder.encode('gmail-token-salt'), // Should be random in production
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

/**
 * Encrypt token
 */
export async function encryptToken(token: string): Promise<string> {
  try {
    const key = await deriveKey(getEncryptionKey())
    const encoder = new TextEncoder()
    const data = encoder.encode(token)

    // Generate random IV
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH))

    // Encrypt
    const encrypted = await crypto.subtle.encrypt(
      {
        name: ALGORITHM,
        iv: iv,
      },
      key,
      data
    )

    // Combine IV and encrypted data, encode as base64
    const combined = new Uint8Array(iv.length + encrypted.byteLength)
    combined.set(iv)
    combined.set(new Uint8Array(encrypted), iv.length)

    return btoa(String.fromCharCode(...combined))
  } catch (error) {
    console.error('Encryption error:', error)
    throw new Error('Failed to encrypt token')
  }
}

/**
 * Decrypt token
 */
export async function decryptToken(encryptedToken: string): Promise<string> {
  try {
    const key = await deriveKey(getEncryptionKey())
    
    // Decode base64
    const combined = Uint8Array.from(atob(encryptedToken), c => c.charCodeAt(0))

    // Extract IV and encrypted data
    const iv = combined.slice(0, IV_LENGTH)
    const encrypted = combined.slice(IV_LENGTH)

    // Decrypt
    const decrypted = await crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv: iv,
      },
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







