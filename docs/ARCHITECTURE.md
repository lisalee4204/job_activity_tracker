# Architecture Overview

## System Architecture

The Job Search Activity Tracker follows a modern, scalable architecture pattern with clear separation of concerns.

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Auth   │  │ Dashboard│  │ Activities│ │ Analytics│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│  State Management: React Query + Zustand                    │
│  UI Components: shadcn/ui + Tailwind CSS                    │
└──────────────────────┬───────────────────────────────────────┘
                       │ HTTPS/REST API
                       │
┌──────────────────────┴───────────────────────────────────────┐
│                   Supabase Backend                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Auth API   │  │  Database    │  │ Edge Functions│     │
│  │  (Supabase)  │  │ (PostgreSQL) │  │    (Deno)     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Row Level Security (RLS)                 │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────┬───────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
┌───────▼──────┐ ┌─────▼──────┐ ┌─────▼──────┐
│  Gmail API   │ │ Lovable AI │ │ Google OAuth│
│  (OAuth 2.0) │ │    API     │ │   (Sign-In) │
└──────────────┘ └────────────┘ └────────────┘
```

## Frontend Architecture

### Component Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui base components
│   ├── activities/      # Activity-related components
│   ├── analytics/       # Analytics components
│   ├── auth/            # Authentication components
│   └── layout/          # Layout components
├── pages/               # Page-level components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and configurations
│   ├── supabase.ts     # Supabase client
│   ├── api.ts          # API client functions
│   └── utils.ts        # Utility functions
├── store/               # State management
│   ├── authStore.ts    # Auth state (Zustand)
│   └── queryClient.ts  # React Query client
└── types/               # TypeScript definitions
```

### State Management Strategy

1. **Server State**: Managed by React Query
   - Activities data
   - Analytics data
   - User preferences
   - Automatic caching, refetching, and synchronization

2. **Client State**: Managed by Zustand (if needed)
   - UI state (modals, dialogs)
   - Form state (local)
   - Auth state (session)

3. **Form State**: React Hook Form
   - Form validation
   - Form submission
   - Error handling

## Backend Architecture

### Database Schema

See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for detailed schema documentation.

### Edge Functions

1. **gmail-oauth-config**: Returns Gmail OAuth client ID
2. **gmail-auth**: Exchanges OAuth code for tokens
3. **fetch-gmail-emails**: Fetches and imports emails
4. **parse-email**: AI-powered email parsing
5. **analyze-job-search**: AI-powered insights generation

### Security Model

- **Authentication**: Supabase Auth (JWT-based)
- **Authorization**: Row Level Security (RLS) policies
- **Data Encryption**: 
  - Gmail tokens encrypted at rest
  - HTTPS for all communications
- **Input Validation**: Zod schemas for all inputs
- **Rate Limiting**: Implemented at edge function level

## Data Flow

### Activity Creation Flow

```
User Input → Form Validation → API Call → Database Insert → Cache Invalidation → UI Update
```

### Gmail Import Flow

```
User Clicks Import → OAuth Flow → Token Storage → Email Fetch → AI Parsing → 
Batch Insert → Duplicate Detection → Cache Invalidation → UI Update
```

### Analytics Flow

```
User Views Dashboard → React Query Check Cache → If Stale: Fetch from DB → 
Calculate Aggregations → Cache Results → Display Charts
```

## Performance Optimizations

1. **Database**:
   - Indexed queries on frequently accessed fields
   - Pagination for large datasets
   - Query optimization

2. **Frontend**:
   - React Query caching and background refetching
   - Code splitting and lazy loading
   - Memoization of expensive calculations
   - Virtual scrolling for large lists

3. **API**:
   - Response caching where appropriate
   - Batch operations where possible
   - Compression for large payloads

## Scalability Considerations

1. **Horizontal Scaling**: Supabase handles this automatically
2. **Database Scaling**: Connection pooling, read replicas
3. **Caching Strategy**: 
   - Client-side caching (React Query)
   - Server-side caching (if needed)
4. **Background Jobs**: Edge functions with cron triggers

## Error Handling

1. **Frontend**: Error boundaries, toast notifications
2. **Backend**: Structured error responses, logging
3. **API**: Retry mechanisms, exponential backoff
4. **User Feedback**: Clear error messages, recovery suggestions

## Monitoring & Observability

1. **Logging**: Structured logs for all operations
2. **Error Tracking**: Sentry or similar service
3. **Performance Monitoring**: API response times, query performance
4. **User Analytics**: Feature usage tracking



