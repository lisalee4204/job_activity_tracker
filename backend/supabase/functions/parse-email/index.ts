import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email } = await req.json()

    if (!email) {
      throw new Error('Email is required')
    }

    // Extract email content
    const payload = email.payload
    let emailBody = ''
    let subject = ''

    // Extract headers (subject, from, etc.)
    let fromEmail = ''
    let fromName = ''
    let replyTo = ''
    
    if (payload.headers) {
      const subjectHeader = payload.headers.find((h: any) => h.name === 'Subject')
      subject = subjectHeader?.value || ''
      
      const fromHeader = payload.headers.find((h: any) => h.name === 'From')
      if (fromHeader?.value) {
        // Parse "Name <email@domain.com>" or "email@domain.com"
        const fromMatch = fromHeader.value.match(/(?:.*<)?([^<>@]+@[^<>@]+)(?:>)?/)
        if (fromMatch) {
          fromEmail = fromMatch[1]
          const nameMatch = fromHeader.value.match(/^(.+?)\s*</)
          if (nameMatch) {
            fromName = nameMatch[1].replace(/"/g, '').trim()
          }
        }
      }
      
      const replyToHeader = payload.headers.find((h: any) => h.name === 'Reply-To')
      if (replyToHeader?.value) {
        const replyMatch = replyToHeader.value.match(/(?:.*<)?([^<>@]+@[^<>@]+)(?:>)?/)
        if (replyMatch) {
          replyTo = replyMatch[1]
        }
      }
    }

    // Extract body (handle multipart emails)
    const extractBody = (part: any): string => {
      if (part.body?.data) {
        return atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'))
      }
      if (part.parts) {
        return part.parts.map(extractBody).join('\n')
      }
      return ''
    }

    emailBody = extractBody(payload)

    // Detect job board and source from email address
    const detectedSource = detectJobSource(fromEmail, replyTo, emailBody)
    
    // Extract company name from sender if it's a company email
    const companyFromEmail = extractCompanyFromEmail(fromEmail, fromName)

    // Use Claude AI to parse email
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY')

    if (!anthropicApiKey) {
      // Fallback to simple regex parsing
      return parseEmailSimple(subject, emailBody, fromEmail, fromName, detectedSource, companyFromEmail)
    }

    // Call Claude API for parsing
    const aiResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 512,
        messages: [
          {
            role: 'user',
            content: `Extract job search information from this email. Return ONLY a JSON object with these exact fields:
- company_name: string (company name, or "Unknown Company" if unclear)
- job_title: string (job/position title, or "Unknown Position" if unclear)
- activity_type: one of exactly: "application", "interview", "phone_call", "recruiter_contact", "networking", "other"
- date: string in YYYY-MM-DD format (date of the email or today if unknown)
- source: one of exactly: "linkedin", "indeed", "company_website", "glassdoor", "monster", "other", "gmail_import"
- confidence: number 0.0-1.0

Email Subject: ${subject}
Email Body (first 3000 chars): ${emailBody.substring(0, 3000)}`,
          },
        ],
      }),
    })

    if (aiResponse.ok) {
      const aiResult = await aiResponse.json()
      try {
        const rawText = aiResult.content?.[0]?.text || ''
        const jsonMatch = rawText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])
          const validActivityTypes = ['application', 'interview', 'phone_call', 'recruiter_contact', 'networking', 'other']
          const validSources = ['linkedin', 'indeed', 'company_website', 'glassdoor', 'monster', 'other', 'gmail_import']
          return new Response(
            JSON.stringify({
              company_name: parsed.company_name || companyFromEmail || 'Unknown Company',
              job_title: parsed.job_title || 'Unknown Position',
              activity_type: validActivityTypes.includes(parsed.activity_type) ? parsed.activity_type : 'application',
              date: parsed.date || new Date().toISOString().split('T')[0],
              source: validSources.includes(parsed.source) ? parsed.source : (detectedSource || 'gmail_import'),
              contact_person: fromName || null,
              contact_method: fromEmail || null,
              ai_confidence: parsed.confidence || 0.7,
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
          )
        }
      } catch (_parseErr) {
        // Fall through to simple parsing
      }
    }

    // Fallback to simple parsing
    return parseEmailSimple(subject, emailBody, fromEmail, fromName, detectedSource, companyFromEmail)
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

// Detect activity type from subject/body
function detectActivityType(subject: string, body: string): string {
  const text = (subject + ' ' + body).toLowerCase()
  if (text.includes('interview') || text.includes('scheduled a call') || text.includes('meet with')) {
    return 'interview'
  }
  if (text.includes('phone screen') || text.includes('phone call') || text.includes('phone interview')) {
    return 'phone_call'
  }
  if (text.includes('recruiter') || text.includes('talent acquisition') || text.includes('job opportunity') || text.includes('exciting opportunity')) {
    return 'recruiter_contact'
  }
  if (text.includes('networking') || text.includes('connect with') || text.includes('coffee chat')) {
    return 'networking'
  }
  // Default: application-related emails
  return 'application'
}

// Detect job board source from email address
function detectJobSource(fromEmail: string, replyTo: string, body: string): string | null {
  const email = (replyTo || fromEmail).toLowerCase()

  // Job board patterns — only include values allowed by the DB CHECK constraint
  const jobBoards: Record<string, string[]> = {
    'indeed': ['indeed.com', 'indeedapply.com'],
    'monster': ['monster.com', 'monster.co.uk'],
    'linkedin': ['linkedin.com', 'linkedinmail.com'],
    'glassdoor': ['glassdoor.com'],
    // ziprecruiter, careerbuilder, simplyhired are not in the DB constraint → map to 'other'
    'other': ['ziprecruiter.com', 'careerbuilder.com', 'simplyhired.com'],
  }

  for (const [source, domains] of Object.entries(jobBoards)) {
    if (domains.some(domain => email.includes(domain))) {
      return source
    }
  }

  // Check body for job board links
  const bodyLower = body.toLowerCase()
  if (bodyLower.includes('indeed.com')) return 'indeed'
  if (bodyLower.includes('monster.com')) return 'monster'
  if (bodyLower.includes('linkedin.com')) return 'linkedin'
  if (bodyLower.includes('glassdoor.com')) return 'glassdoor'

  // If it's a company email (not a no-reply address), treat as company website
  if (email && !email.includes('noreply') && !email.includes('no-reply')) {
    return 'company_website'
  }

  return null
}

// Extract company name from email address
function extractCompanyFromEmail(email: string, name: string): string | null {
  if (!email) return null
  
  // Extract domain
  const domainMatch = email.match(/@([^.]+)/)
  if (!domainMatch) return null
  
  const domain = domainMatch[1]
  
  // Skip common job board domains
  const skipDomains = ['gmail', 'yahoo', 'hotmail', 'outlook', 'icloud', 'indeed', 'monster', 'linkedin']
  if (skipDomains.includes(domain.toLowerCase())) {
    return null
  }
  
  // Use name if available, otherwise use domain
  if (name && name !== email) {
    return name
  }
  
  // Capitalize domain name
  return domain.charAt(0).toUpperCase() + domain.slice(1)
}

function parseEmailSimple(
  subject: string,
  body: string,
  fromEmail: string = '',
  fromName: string = '',
  detectedSource: string | null = null,
  companyFromEmail: string | null = null
) {
  // Simple regex-based parsing as fallback
  const companyMatch = subject.match(/(?:from|at|@)\s+([A-Z][a-zA-Z\s&]+)/i) ||
    body.match(/(?:company|employer):\s*([A-Z][a-zA-Z\s&]+)/i)

  const jobTitleMatch = subject.match(/(?:position|role|job):\s*([A-Z][a-zA-Z\s]+)/i) ||
    body.match(/(?:position|role|job):\s*([A-Z][a-zA-Z\s]+)/i)

  const urlMatch = body.match(/https?:\/\/[^\s]+/i)

  return new Response(
    JSON.stringify({
      company_name: companyMatch?.[1]?.trim() || companyFromEmail || 'Unknown Company',
      job_title: jobTitleMatch?.[1]?.trim() || 'Unknown Position',
      activity_type: detectActivityType(subject, body),
      date: new Date().toISOString().split('T')[0],
      job_description_url: urlMatch?.[0] || null,
      source: detectedSource || 'gmail_import',
      contact_person: fromName || null,
      contact_method: fromEmail || null,
      ai_confidence: 0.3,
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    },
  )
}



