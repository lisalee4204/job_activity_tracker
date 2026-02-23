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

    // Use AI to parse email (using Lovable AI API or similar)
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')
    
    if (!lovableApiKey) {
      // Fallback to simple regex parsing
      return parseEmailSimple(subject, emailBody)
    }

    // Call AI API for parsing
    const aiResponse = await fetch('https://api.lovable.ai/v1/parse-job-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${lovableApiKey}`,
      },
      body: JSON.stringify({
        subject,
        body: emailBody.substring(0, 50000), // Limit size
      }),
    })

    if (aiResponse.ok) {
      const parsed = await aiResponse.json()
      return new Response(
        JSON.stringify({
          company_name: parsed.company_name || companyFromEmail || 'Unknown',
          job_title: parsed.job_title || 'Unknown',
          date: parsed.date || new Date().toISOString().split('T')[0],
          job_description_url: parsed.job_url || null,
          source: detectedSource || parsed.source || 'gmail_import',
          contact_person: fromName || parsed.contact_person || null,
          contact_method: fromEmail || parsed.contact_method || null,
          ai_confidence: parsed.confidence || 0.5,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
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

// Detect job board source from email address
function detectJobSource(fromEmail: string, replyTo: string, body: string): string | null {
  const email = (replyTo || fromEmail).toLowerCase()
  
  // Job board patterns
  const jobBoards: Record<string, string[]> = {
    'indeed': ['indeed.com', 'indeedapply.com'],
    'monster': ['monster.com', 'monster.co.uk'],
    'linkedin': ['linkedin.com', 'linkedinmail.com'],
    'glassdoor': ['glassdoor.com'],
    'ziprecruiter': ['ziprecruiter.com'],
    'careerbuilder': ['careerbuilder.com'],
    'simplyhired': ['simplyhired.com'],
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
  
  // If it's a company email (not job board), return company_website
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



