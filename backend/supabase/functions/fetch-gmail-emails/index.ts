import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Encryption utilities (inline for Deno edge functions)
const ALGORITHM = 'AES-GCM'
const KEY_LENGTH = 256
const IV_LENGTH = 12

function getEncryptionKey(): string {
  const key = Deno.env.get('ENCRYPTION_KEY')
  if (!key) {
    console.warn('ENCRYPTION_KEY not set, tokens will not be encrypted')
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

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Rate limiting utilities (inline for Deno edge functions)
class GmailRateLimiter {
  private requests: number[] = []
  private readonly maxRequestsPerSecond = 45
  private readonly windowMs = 1000

  async waitIfNeeded(): Promise<void> {
    const now = Date.now()
    this.requests = this.requests.filter(
      timestamp => now - timestamp < this.windowMs
    )
    
    if (this.requests.length >= this.maxRequestsPerSecond) {
      const oldestRequest = this.requests[0]
      const waitTime = this.windowMs - (now - oldestRequest) + 10
      
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime))
        this.requests = this.requests.filter(
          timestamp => Date.now() - timestamp < this.windowMs
        )
      }
    }
    
    this.requests.push(Date.now())
  }
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function isRateLimitError(error: any): boolean {
  if (!error) return false
  const status = error.status || error.statusCode || error.response?.status
  if (status === 429) return true
  const message = error.message?.toLowerCase() || ''
  return message.includes('rate limit') || 
         message.includes('quota exceeded') ||
         message.includes('too many requests')
}

async function withRetry<T>(
  fn: () => Promise<T>,
  options: { maxRetries?: number; initialDelay?: number; maxDelay?: number; backoffMultiplier?: number } = {}
): Promise<T> {
  const maxRetries = options.maxRetries || 3
  const initialDelay = options.initialDelay || 1000
  const maxDelay = options.maxDelay || 30000
  const backoffMultiplier = options.backoffMultiplier || 2
  let lastError: any
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error: any) {
      lastError = error
      
      if (!isRateLimitError(error)) {
        throw error
      }
      
      if (attempt >= maxRetries) {
        throw new Error(
          `Rate limit exceeded after ${maxRetries + 1} attempts. ` +
          `Last error: ${error.message}`
        )
      }
      
      const delay = Math.min(
        initialDelay * Math.pow(backoffMultiplier, attempt),
        maxDelay
      )
      
      await sleep(delay)
    }
  }
  
  throw lastError
}

// Token refresh function (inline for Deno edge functions)
async function refreshGmailToken(
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
      refresh_token: tokenData.refresh_token,
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

  // Update tokens in database
  const updateData: any = {
    access_token: newTokens.access_token,
    expires_at: expiresAt.toISOString(),
    updated_at: new Date().toISOString(),
  }

  // If Google returned a new refresh token, update it
  if (newTokens.refresh_token) {
    updateData.refresh_token = newTokens.refresh_token
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

    const { daysAgo = 7, incremental = false } = await req.json()  // Default to full import

    // Get last import date for incremental imports
    let lastImportDate: Date | null = null
    if (incremental) {
      const { data: lastImport } = await supabaseClient
        .from('email_import_history')
        .select('import_date, date_range_end')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('import_date', { ascending: false })
        .limit(1)
        .single()

      if (lastImport?.date_range_end) {
        // Use the end date of last import as starting point
        lastImportDate = new Date(lastImport.date_range_end)
        // Add 1 day to avoid duplicate (start from day after last import)
        lastImportDate.setDate(lastImportDate.getDate() + 1)
      }
    }

    // Get Gmail tokens
    const { data: tokenData, error: tokenError } = await supabaseClient
      .from('gmail_tokens')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (tokenError || !tokenData) {
      throw new Error('Gmail not connected')
    }

    // Decrypt access token
    let accessToken: string
    try {
      accessToken = await decryptToken(tokenData.access_token)
    } catch (error) {
      throw new Error('Failed to decrypt Gmail token. Please reconnect Gmail.')
    }

    // Check if token is expired or about to expire (within 5 minutes)
    const expiresAt = new Date(tokenData.expires_at)
    const now = new Date()
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000)

    // Refresh if expired or expiring soon
    if (expiresAt <= fiveMinutesFromNow) {
      try {
        // Import refresh function (inline for Deno edge functions)
        const refreshResponse = await refreshGmailToken(supabaseClient, user.id)
        accessToken = refreshResponse.access_token
        console.log(`Token refreshed. New expiration: ${refreshResponse.expires_at}`)
      } catch (refreshError: any) {
        // If refresh fails, throw error asking user to reconnect
        throw new Error(
          `Gmail token expired and refresh failed: ${refreshError.message}. Please reconnect Gmail.`
        )
      }
    }

    // Calculate date range
    const endDate = new Date()
    let startDate: Date
    
    if (incremental && lastImportDate) {
      // Use last import date as start (incremental import)
      startDate = lastImportDate
      console.log(`Incremental import: fetching emails from ${startDate.toISOString()}`)
    } else {
      // Use daysAgo parameter (full import)
      startDate = new Date()
      startDate.setDate(startDate.getDate() - daysAgo)
      console.log(`Full import: fetching emails from last ${daysAgo} days`)
    }

    // Initialize rate limiter
    const rateLimiter = new GmailRateLimiter()

    // Search for job application emails with retry logic
    // Gmail uses YYYY/MM/DD format for date searches, not Unix timestamps!
    const formatGmailDate = (date: Date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}/${month}/${day}`
    }
    
    const startDateStr = formatGmailDate(startDate)
    const endDateStr = formatGmailDate(endDate)
    
    // Broader query to catch more job-related emails (universal - works for any inbox)
    const query = `after:${startDateStr} before:${endDateStr} (applying OR application OR applied OR interview OR "received your resume" OR "your resume" OR "thank you for applying" OR "application received" OR "we received" OR candidate OR recruiter OR hiring OR "job opportunity" OR "position at" OR "role at" OR "next steps" OR "unfortunately" OR "we regret" OR "move forward")`
    
    console.log('Gmail search query:', query)
    console.log('Date range:', startDateStr, 'to', endDateStr)
    
    await rateLimiter.waitIfNeeded()
    const searchData = await withRetry(async () => {
      const searchResponse = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=100`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      if (!searchResponse.ok) {
        const errorText = await searchResponse.text()
        const error: any = new Error(`Failed to fetch emails from Gmail: ${errorText}`)
        error.status = searchResponse.status
        throw error
      }

      return searchResponse.json()
    }, {
      maxRetries: 3,
      initialDelay: 1000,
    })

    const messageIds = searchData.messages?.map((m: any) => m.id) || []

    // Fetch full email content with rate limiting
    const emails = await Promise.all(
      messageIds.slice(0, 50).map(async (id: string) => {
        await rateLimiter.waitIfNeeded()
        
        return withRetry(async () => {
          const emailResponse = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=full`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          
          if (!emailResponse.ok) {
            const error: any = new Error(`Failed to fetch email ${id}`)
            error.status = emailResponse.status
            throw error
          }
          
          return emailResponse.json()
        }, {
          maxRetries: 2,
          initialDelay: 1000,
        })
      })
    )

    // Parse emails with AI
    const parseEmailFunction = supabaseClient.functions.invoke('parse-email')
    const parsedActivities = []

    let failedParsing = 0

    for (const email of emails) {
      try {
        const { data: parsed, error: parseError } = await supabaseClient.functions.invoke(
          'parse-email',
          {
            body: { email: email },
          }
        )

        if (!parseError && parsed) {
          parsedActivities.push({
            ...parsed,
            user_id: user.id,
            source: parsed.source || 'gmail_import',
            ai_parsed: true,
          })
        } else {
          // Store failed parsing for manual review
          failedParsing++
          const subject = email.payload?.headers?.find((h: any) => h.name === 'Subject')?.value || ''
          const fromHeader = email.payload?.headers?.find((h: any) => h.name === 'From')?.value || ''
          const fromEmail = fromHeader.match(/(?:.*<)?([^<>@]+@[^<>@]+)(?:>)?/)?.[1] || ''
          
          await supabaseClient.from('failed_email_parsing').insert({
            user_id: user.id,
            email_data: email,
            email_id: email.id,
            subject: subject,
            from_email: fromEmail,
            error_message: parseError?.message || 'Failed to parse email',
            status: 'pending',
          }).catch(err => {
            console.error('Failed to store failed parsing:', err)
          })
        }
      } catch (error: any) {
        console.error('Error parsing email:', error)
        failedParsing++
        
        // Store failed parsing
        const subject = email.payload?.headers?.find((h: any) => h.name === 'Subject')?.value || ''
        const fromHeader = email.payload?.headers?.find((h: any) => h.name === 'From')?.value || ''
        const fromEmail = fromHeader.match(/(?:.*<)?([^<>@]+@[^<>@]+)(?:>)?/)?.[1] || ''
        
        await supabaseClient.from('failed_email_parsing').insert({
          user_id: user.id,
          email_data: email,
          email_id: email.id,
          subject: subject,
          from_email: fromEmail,
          error_message: error.message || 'Unknown error',
          status: 'pending',
        }).catch(err => {
          console.error('Failed to store failed parsing:', err)
        })
      }
    }

    // Insert activities (with duplicate detection)
    let created = 0
    let duplicates = 0

    for (const activity of parsedActivities) {
      // Check for duplicates based on company name, job title, and date
      const { data: existing } = await supabaseClient
        .from('job_search_activities')
        .select('id')
        .eq('user_id', user.id)
        .eq('company_name', activity.company_name)
        .eq('job_title', activity.job_title)
        .eq('date', activity.date)
        .is('deleted_at', null)
        .single()

      if (!existing) {
        const { error: insertError } = await supabaseClient
          .from('job_search_activities')
          .insert(activity)

        if (!insertError) {
          created++
        }
      } else {
        duplicates++
      }
    }

    // Log import history
    await supabaseClient.from('email_import_history').insert({
      user_id: user.id,
      emails_processed: emails.length,
      activities_created: created,
      duplicates_skipped: duplicates,
      errors: failedParsing,
      date_range_start: startDate.toISOString().split('T')[0],
      date_range_end: endDate.toISOString().split('T')[0],
      status: 'completed',
    })

    return new Response(
      JSON.stringify({
        success: true,
        emailsProcessed: emails.length,
        activitiesCreated: created,
        duplicatesSkipped: duplicates,
        failedParsing: failedParsing,
        hasFailedParsing: failedParsing > 0,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})



