# PRD Review: Job Search Activity Tracker

## Questions & Clarifications Needed

### 1. Database & Data Management
- **Q1**: What is the data retention policy? Should activities be archived after a certain period?
- **Q2**: Should we implement soft deletes for activities (with restore capability) or hard deletes?
- **Q3**: What happens to Gmail tokens if user disconnects? Should we maintain history?
- **Q4**: Should we track the source of job postings (LinkedIn, Indeed, company website, etc.)?
- **Q5**: What is the expected maximum number of activities per user? (affects pagination strategy)

### 2. Gmail Integration
- **Q6**: How should we handle duplicate email imports? (deduplication strategy)
- **Q7**: What happens when Gmail token expires? Auto-refresh or manual reconnection?
- **Q8**: Should we support incremental imports (only new emails since last import)?
- **Q9**: What is the expected email volume per user? (affects batch processing)
- **Q10**: Should failed AI parsing attempts be retried or logged for manual review?

### 3. Analytics & Performance
- **Q11**: What timezone should be used for weekly goal tracking? (user's local timezone or UTC?)
- **Q12**: Should AI insights be cached? If so, what's the cache invalidation strategy?
- **Q13**: How should we handle analytics for users with thousands of activities?
- **Q14**: Should weekly summaries be pre-computed and stored, or calculated on-demand?

### 4. User Experience
- **Q15**: Should there be a confirmation dialog before deleting activities?
- **Q16**: Should there be an undo mechanism for accidental deletions?
- **Q17**: What should happen if a user exceeds their weekly goal? (celebration, notification?)
- **Q18**: Should users be able to customize activity types or are they fixed?

### 5. Security & Compliance
- **Q19**: What encryption method should be used for Gmail tokens at rest?
- **Q20**: Should we implement audit logging for compliance purposes?
- **Q21**: What is the rate limiting strategy for Gmail API calls?
- **Q22**: Should we support data export for GDPR compliance (user data deletion)?

## Concerns & Risks

### 1. Technical Concerns

#### State Management Scalability
- **Concern**: Using only React hooks (useState, useEffect) may not scale well for complex state management
- **Recommendation**: Consider Zustand or React Query for server state management
- **Impact**: Medium - affects maintainability and performance

#### Gmail API Rate Limits
- **Concern**: Gmail API has strict rate limits (250 quota units per user per second)
- **Recommendation**: Implement exponential backoff, request queuing, and quota monitoring
- **Impact**: High - could break email import functionality

#### AI Parsing Reliability
- **Concern**: AI parsing may fail or produce inaccurate data
- **Recommendation**: 
  - Implement confidence scoring
  - Allow manual review/correction of parsed data
  - Fallback to manual entry if parsing fails
- **Impact**: High - core value proposition depends on this

#### Database Performance
- **Concern**: Missing indexes on frequently queried fields (user_id, date)
- **Recommendation**: Add composite indexes on (user_id, date) and (user_id, activity_type)
- **Impact**: High - affects query performance at scale

#### Background Job Processing
- **Concern**: Email imports could be slow and block user interactions
- **Recommendation**: Implement async job processing with status tracking
- **Impact**: Medium - affects user experience

### 2. Security Concerns

#### Token Storage
- **Concern**: Gmail tokens stored in database need proper encryption
- **Recommendation**: Use Supabase Vault or application-level encryption with AES-256
- **Impact**: High - security risk if compromised

#### OAuth Flow Complexity
- **Concern**: Two separate OAuth flows (Google Sign-In + Gmail) may confuse users
- **Recommendation**: Clear UI messaging explaining the difference
- **Impact**: Medium - affects user adoption

#### Input Validation
- **Concern**: AI endpoints need strict input validation and size limits
- **Recommendation**: Implement request validation, size limits, and sanitization
- **Impact**: High - security and cost risk

### 3. Business/Product Concerns

#### User Onboarding
- **Concern**: Gmail integration is complex - users may abandon during setup
- **Recommendation**: 
  - Provide clear step-by-step instructions
  - Show value immediately (import recent emails)
  - Allow skipping and manual entry
- **Impact**: High - affects user acquisition

#### Cost Management
- **Concern**: AI API calls could be expensive at scale
- **Recommendation**: 
  - Implement caching for insights
  - Batch email parsing where possible
  - Monitor usage and set limits
- **Impact**: Medium - affects profitability

#### Data Accuracy
- **Concern**: Users may rely on automated imports but data may be incomplete
- **Recommendation**: 
  - Show confidence indicators
  - Allow easy editing of imported data
  - Provide manual entry as primary option
- **Impact**: Medium - affects user trust

## Recommended Improvements

### 1. Database Schema Enhancements

```sql
-- Add indexes for performance
CREATE INDEX idx_activities_user_date ON job_search_activities(user_id, date DESC);
CREATE INDEX idx_activities_user_type ON job_search_activities(user_id, activity_type);
CREATE INDEX idx_activities_user_status ON job_search_activities(user_id, status);

-- Add unique constraint for Gmail tokens
ALTER TABLE gmail_tokens ADD CONSTRAINT unique_user_gmail_token UNIQUE (user_id);

-- Add soft delete support
ALTER TABLE job_search_activities ADD COLUMN deleted_at TIMESTAMP NULL;

-- Add source tracking
ALTER TABLE job_search_activities ADD COLUMN source TEXT NULL; -- 'linkedin', 'indeed', 'company_website', etc.

-- Add metadata for AI parsing
ALTER TABLE job_search_activities ADD COLUMN ai_parsed BOOLEAN DEFAULT FALSE;
ALTER TABLE job_search_activities ADD COLUMN ai_confidence DECIMAL(3,2) NULL; -- 0.00 to 1.00

-- Add job posting metadata
ALTER TABLE job_search_activities ADD COLUMN location TEXT NULL;
ALTER TABLE job_search_activities ADD COLUMN salary_range TEXT NULL;
```

### 2. Architecture Improvements

#### State Management
- **Add**: React Query (TanStack Query) for server state management
- **Add**: Zustand for client-side global state (if needed)
- **Benefit**: Better caching, synchronization, and error handling

#### Error Handling
- **Add**: Error boundaries at route level
- **Add**: Toast notifications for user feedback
- **Add**: Retry mechanisms for failed API calls
- **Benefit**: Better user experience and debugging

#### Performance Optimizations
- **Add**: Database query optimization with proper indexes
- **Add**: Pagination for large datasets (cursor-based or offset)
- **Add**: Virtual scrolling for activity table
- **Add**: Memoization for expensive calculations
- **Benefit**: Better performance at scale

#### Background Processing
- **Add**: Job queue system for email imports (using Supabase Edge Functions with cron)
- **Add**: Status tracking for long-running operations
- **Add**: Webhook support for real-time email processing (future)
- **Benefit**: Non-blocking user experience

### 3. Security Enhancements

#### Token Encryption
- **Use**: Supabase Vault for sensitive data or application-level encryption
- **Implement**: Token rotation mechanism
- **Add**: Token expiration monitoring and auto-refresh

#### Input Validation
- **Add**: Zod schemas for all API inputs
- **Add**: Rate limiting middleware
- **Add**: Request size limits and validation
- **Add**: SQL injection prevention (use parameterized queries)

#### Audit Logging
- **Add**: Audit log table for compliance tracking
- **Track**: User actions (create, update, delete activities)
- **Track**: Gmail connection/disconnection events
- **Benefit**: Compliance and debugging

### 4. User Experience Improvements

#### Onboarding
- **Add**: Welcome tour for first-time users
- **Add**: Sample data for demonstration
- **Add**: Clear value proposition messaging

#### Feedback & Confirmation
- **Add**: Confirmation dialogs for destructive actions
- **Add**: Undo functionality (with time limit)
- **Add**: Success/error toast notifications
- **Add**: Loading states for all async operations

#### Data Quality
- **Add**: Validation warnings for incomplete activities
- **Add**: Duplicate detection and warnings
- **Add**: Bulk edit capabilities
- **Add**: Import/export templates

### 5. Monitoring & Observability

#### Logging
- **Add**: Structured logging for all operations
- **Add**: Error tracking (Sentry or similar)
- **Add**: Performance monitoring

#### Analytics
- **Add**: User analytics (feature usage, drop-off points)
- **Add**: Performance metrics (API response times, error rates)
- **Add**: Cost tracking (AI API usage)

### 6. Testing Strategy

#### Unit Tests
- **Add**: Component tests (React Testing Library)
- **Add**: Utility function tests
- **Add**: Edge function tests

#### Integration Tests
- **Add**: API endpoint tests
- **Add**: Database operation tests
- **Add**: OAuth flow tests

#### E2E Tests
- **Add**: Critical user flows (Playwright or Cypress)
- **Add**: Gmail integration flow tests

### 7. Documentation Improvements

#### Technical Documentation
- **Add**: Architecture decision records (ADRs)
- **Add**: API documentation (OpenAPI/Swagger)
- **Add**: Database schema documentation
- **Add**: Deployment guide

#### User Documentation
- **Add**: User guide with screenshots
- **Add**: FAQ section
- **Add**: Troubleshooting guide
- **Add**: Privacy policy and terms of service

## Implementation Priority

### Phase 1: MVP (Core Functionality)
1. Authentication (email/password + Google Sign-In)
2. Manual activity entry
3. Activity table with pagination
4. Basic analytics (weekly summary, charts)
5. CSV export

### Phase 2: Gmail Integration
1. Gmail OAuth flow
2. Email fetching and parsing
3. Batch import functionality
4. Duplicate detection

### Phase 3: Enhanced Analytics
1. AI-powered insights
2. Advanced visualizations
3. PDF export
4. Filtering and search

### Phase 4: Polish & Scale
1. Performance optimizations
2. Error handling improvements
3. User onboarding
4. Monitoring and logging

## Additional Recommendations

1. **Consider**: Using a job queue system (like BullMQ or similar) for email processing
2. **Consider**: Implementing real-time updates using Supabase Realtime
3. **Consider**: Adding a mobile app (React Native) in the future
4. **Consider**: Browser extension for one-click tracking (mentioned in future enhancements)
5. **Consider**: Integration with calendar apps for interview scheduling
6. **Consider**: Email notifications for weekly goal reminders



