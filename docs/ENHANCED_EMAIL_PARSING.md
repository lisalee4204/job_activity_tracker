# Enhanced Email Parsing

## Overview

Enhanced email parsing extracts more information from emails, including sender details and job board detection, improving data quality and source tracking.

## Features

### 1. Sender Extraction

Extracts from email headers:
- **From Email**: `careers@acme.com`
- **From Name**: `Acme Corp Recruiting`
- **Reply-To**: Alternative contact email

### 2. Job Board Detection

Automatically detects job board sources:
- **Indeed**: `noreply@indeed.com`, `indeedapply.com`
- **Monster**: `monster.com`
- **LinkedIn**: `linkedin.com`, `linkedinmail.com`
- **Glassdoor**: `glassdoor.com`
- **ZipRecruiter**: `ziprecruiter.com`
- **CareerBuilder**: `careerbuilder.com`
- **SimplyHired**: `simplyhired.com`

### 3. Company Detection

Identifies company emails:
- Extracts company name from email domain
- Uses sender name if available
- Skips generic domains (gmail, yahoo, etc.)

### 4. Source Classification

Classifies source automatically:
- `indeed` - Indeed job board
- `monster` - Monster job board
- `linkedin` - LinkedIn
- `glassdoor` - Glassdoor
- `company_website` - Direct company email
- `gmail_import` - Generic import (fallback)

## Implementation

### Email Header Parsing

```typescript
// Extract From header
const fromHeader = headers.find(h => h.name === 'From')
// Parse: "Acme Corp <careers@acme.com>" or "careers@acme.com"
```

### Job Board Detection

```typescript
function detectJobSource(fromEmail: string, replyTo: string, body: string) {
  // Check email domain
  // Check body for job board links
  // Return detected source
}
```

### Company Extraction

```typescript
function extractCompanyFromEmail(email: string, name: string) {
  // Extract domain
  // Skip job board domains
  // Return company name
}
```

## Data Stored

### Activity Fields Populated

- `source`: Detected job board or `company_website`
- `contact_person`: Sender name (if available)
- `contact_method`: Sender email address
- `company_name`: Extracted from email or AI parsing

## Examples

### Indeed Email
```
From: noreply@indeed.com
→ source: "indeed"
→ company_name: (from email body via AI)
```

### Company Email
```
From: "Acme Corp" <careers@acme.com>
→ source: "company_website"
→ company_name: "Acme Corp"
→ contact_person: "Acme Corp"
→ contact_method: "careers@acme.com"
```

### LinkedIn Email
```
From: jobs-noreply@linkedin.com
Body: "View on LinkedIn: https://linkedin.com/jobs/..."
→ source: "linkedin"
```

## Fallback Logic

1. **AI Parsing**: Primary method (if available)
2. **Header Extraction**: Extract sender info
3. **Job Board Detection**: Check email/body patterns
4. **Simple Regex**: Fallback parsing

## Benefits

1. **Better Source Tracking**: Know where applications came from
2. **Contact Information**: Store sender details automatically
3. **Company Identification**: Extract company from email domain
4. **Data Quality**: More complete activity records

## Future Enhancements

1. **Domain Database**: Maintain database of company domains
2. **Name Parsing**: Better extraction of contact person names
3. **Email Validation**: Verify company email domains
4. **Source Confidence**: Score confidence of source detection







