/**
 * Exponential backoff utility for handling rate limits
 * 
 * Exponential backoff means: if a request fails due to rate limiting,
 * wait progressively longer before retrying:
 * - 1st retry: wait 1 second
 * - 2nd retry: wait 2 seconds  
 * - 3rd retry: wait 4 seconds
 * - 4th retry: wait 8 seconds
 * etc.
 */

export interface RetryOptions {
  maxRetries?: number
  initialDelay?: number
  maxDelay?: number
  backoffMultiplier?: number
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 30000, // 30 seconds
  backoffMultiplier: 2,
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Check if error is a rate limit error
 */
function isRateLimitError(error: any): boolean {
  if (!error) return false
  
  const status = error.status || error.statusCode || error.response?.status
  if (status === 429) return true // HTTP 429 Too Many Requests
  
  const message = error.message?.toLowerCase() || ''
  return message.includes('rate limit') || 
         message.includes('quota exceeded') ||
         message.includes('too many requests')
}

/**
 * Execute function with exponential backoff retry logic
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  let lastError: any
  
  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error: any) {
      lastError = error
      
      // If it's not a rate limit error, don't retry
      if (!isRateLimitError(error)) {
        throw error
      }
      
      // If we've exhausted retries, throw
      if (attempt >= opts.maxRetries) {
        throw new Error(
          `Rate limit exceeded after ${opts.maxRetries + 1} attempts. ` +
          `Last error: ${error.message}`
        )
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(
        opts.initialDelay * Math.pow(opts.backoffMultiplier, attempt),
        opts.maxDelay
      )
      
      console.log(
        `Rate limit hit. Retrying in ${delay}ms (attempt ${attempt + 1}/${opts.maxRetries})`
      )
      
      await sleep(delay)
    }
  }
  
  throw lastError
}

/**
 * Rate limiter for Gmail API
 * Gmail API allows 250 quota units per user per second
 * Most operations cost 5 quota units, so ~50 requests/second max
 */
export class GmailRateLimiter {
  private requests: number[] = []
  private readonly maxRequestsPerSecond = 45 // Conservative limit
  private readonly windowMs = 1000 // 1 second window
  
  /**
   * Wait if necessary to respect rate limits
   */
  async waitIfNeeded(): Promise<void> {
    const now = Date.now()
    
    // Remove requests older than 1 second
    this.requests = this.requests.filter(
      timestamp => now - timestamp < this.windowMs
    )
    
    // If we're at the limit, wait until we can make another request
    if (this.requests.length >= this.maxRequestsPerSecond) {
      const oldestRequest = this.requests[0]
      const waitTime = this.windowMs - (now - oldestRequest) + 10 // Add 10ms buffer
      
      if (waitTime > 0) {
        console.log(`Rate limit: waiting ${waitTime}ms`)
        await sleep(waitTime)
        // Clean up again after waiting
        this.requests = this.requests.filter(
          timestamp => Date.now() - timestamp < this.windowMs
        )
      }
    }
    
    // Record this request
    this.requests.push(Date.now())
  }
}







