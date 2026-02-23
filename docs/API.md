# API Documentation

## Overview

The Job Search Activity Tracker uses Supabase for backend services, including:
- Supabase REST API for database operations
- Supabase Edge Functions for serverless functions
- Supabase Auth for authentication

## Authentication

All API requests (except public endpoints) require authentication via Supabase Auth.

### Getting Auth Token

```typescript
const { data: { session } } = await supabase.auth.getSession()
const token = session?.access_token
```

### Using Auth Token

Include in request headers:
```
Authorization: Bearer <token>
```

## Database API

### Activities

#### Get All Activities

```typescript
GET /rest/v1/job_search_activities?select=*&order=date.desc
```

**Query Parameters:**
- `select`: Fields to return (default: `*`)
- `order`: Sort order (e.g., `date.desc`)
- `limit`: Number of results (default: 100)
- `offset`: Pagination offset

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "date": "2024-01-15",
    "company_name": "Acme Corp",
    "job_title": "Software Engineer",
    "activity_type": "application",
    "status": "application",
    ...
  }
]
```

#### Create Activity

```typescript
POST /rest/v1/job_search_activities
Content-Type: application/json
Authorization: Bearer <token>

{
  "date": "2024-01-15",
  "company_name": "Acme Corp",
  "job_title": "Software Engineer",
  "activity_type": "application",
  "status": "application",
  ...
}
```

#### Update Activity

```typescript
PATCH /rest/v1/job_search_activities?id=eq.<activity_id>
Content-Type: application/json
Authorization: Bearer <token>

{
  "status": "hr_screen",
  "notes": "Updated notes"
}
```

#### Delete Activity (Soft Delete)

```typescript
PATCH /rest/v1/job_search_activities?id=eq.<activity_id>
Content-Type: application/json
Authorization: Bearer <token>

{
  "deleted_at": "2024-01-15T10:00:00Z"
}
```

### User Preferences

#### Get Preferences

```typescript
GET /rest/v1/user_preferences?user_id=eq.<user_id>&select=*
```

#### Update Preferences

```typescript
PATCH /rest/v1/user_preferences?user_id=eq.<user_id>
Content-Type: application/json

{
  "weekly_goal": 10,
  "timezone": "America/New_York"
}
```

## Edge Functions

### gmail-oauth-config

Returns Gmail OAuth client ID for frontend OAuth flow.

**Endpoint:**
```
POST /functions/v1/gmail-oauth-config
```

**Request:**
```typescript
// No body required
```

**Response:**
```json
{
  "clientId": "your-client-id.apps.googleusercontent.com"
}
```

### gmail-auth

Exchanges OAuth authorization code for access tokens.

**Endpoint:**
```
POST /functions/v1/gmail-auth
Authorization: Bearer <user-token>
```

**Request:**
```json
{
  "code": "authorization-code-from-google"
}
```

**Response:**
```json
{
  "success": true
}
```

### fetch-gmail-emails

Fetches and imports job application emails from Gmail.

**Endpoint:**
```
POST /functions/v1/fetch-gmail-emails
Authorization: Bearer <user-token>
```

**Request:**
```json
{
  "daysAgo": 7
}
```

**Response:**
```json
{
  "success": true,
  "emailsProcessed": 25,
  "activitiesCreated": 20,
  "duplicatesSkipped": 5
}
```

### parse-email

AI-powered email parsing to extract job application details.

**Endpoint:**
```
POST /functions/v1/parse-email
Authorization: Bearer <user-token>
```

**Request:**
```json
{
  "email": {
    "payload": { ... },
    "id": "email-id"
  }
}
```

**Response:**
```json
{
  "company_name": "Acme Corp",
  "job_title": "Software Engineer",
  "date": "2024-01-15",
  "job_description_url": "https://...",
  "ai_confidence": 0.85
}
```

### analyze-job-search

Generates AI-powered insights based on user's job search activities.

**Endpoint:**
```
POST /functions/v1/analyze-job-search
Authorization: Bearer <user-token>
```

**Request:**
```typescript
// No body required - uses user's activities from database
```

**Response:**
```json
{
  "insights": [
    {
      "title": "Low Interview Rate",
      "description": "Only 10% of your applications are leading to interviews...",
      "category": "improvement",
      "priority": "high"
    },
    ...
  ]
}
```

## Error Handling

All API endpoints return standard error responses:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### Common Error Codes

- `401`: Unauthorized - Invalid or missing auth token
- `403`: Forbidden - User doesn't have permission
- `404`: Not Found - Resource doesn't exist
- `422`: Validation Error - Invalid input data
- `500`: Internal Server Error - Server error

## Rate Limiting

- Database queries: Limited by Supabase plan
- Edge functions: 500 invocations per day (free tier)
- Gmail API: 250 quota units per user per second

## Best Practices

1. **Use React Query**: For caching and automatic refetching
2. **Handle Errors**: Always implement error handling
3. **Validate Input**: Validate data before sending to API
4. **Use Pagination**: For large datasets
5. **Cache Responses**: Use React Query caching
6. **Retry Logic**: Implement retry for failed requests

## Examples

### Using Supabase Client

```typescript
import { supabase } from './lib/supabase'

// Get activities
const { data, error } = await supabase
  .from('job_search_activities')
  .select('*')
  .order('date', { ascending: false })
  .limit(20)

// Create activity
const { data, error } = await supabase
  .from('job_search_activities')
  .insert({
    date: '2024-01-15',
    company_name: 'Acme Corp',
    job_title: 'Software Engineer',
    activity_type: 'application',
  })
```

### Using Edge Functions

```typescript
const { data, error } = await supabase.functions.invoke('analyze-job-search', {
  body: {},
})
```



