# Action Plan - Based on Your Requirements

## Immediate Actions Required

### 1. Data Retention Policy ✅ IMPLEMENTED
**Your Answer**: 1 year retention

**Status**: ✅ Implemented
- Default retention: 12 months (1 year)
- Archive table created
- Automatic archival function created
- Migration file: `20240102000000_data_retention_and_caching.sql`

**Remaining Actions**:
- [ ] Create UI for retention settings
- [ ] Add manual archive button
- [ ] Add restore archived functionality
- [ ] Schedule daily archival job (Supabase cron or edge function)

### 2. Enhanced Duplicate Detection ✅ PARTIALLY DONE
**Your Answer**: Match on date + position + employer, keep oldest

**Current Status**: Basic duplicate detection exists but needs verification

**Action Items**:
- [ ] Verify duplicate logic matches: `(date, job_title, company_name)`
- [ ] Ensure oldest record is kept (by `created_at`)
- [ ] Add UI indicator showing duplicate status
- [ ] Test with multiple applications to same company/role

### 3. Gmail Token Auto-Refresh ✅ IMPLEMENTED
**Your Answer**: Auto-refresh if possible

**Status**: ✅ Implemented
- Refresh token exchange logic implemented
- Auto-refresh when expired or within 5 minutes of expiration
- Graceful error handling
- New edge function: `refresh-gmail-token`
- Integrated into `fetch-gmail-emails` function

**Remaining Actions**:
- [ ] Test refresh flow end-to-end
- [ ] Add monitoring/logging for refresh events
- [ ] Consider background refresh job for proactive refreshing

### 4. Incremental Imports ⚠️ NEEDS IMPLEMENTATION
**Your Answer**: Yes, only new emails since last import

**Current Status**: Imports all emails in date range

**Action Items**:
- [ ] Track `last_import_date` in `email_import_history`
- [ ] Filter Gmail search to only fetch emails after last import
- [ ] Update import dialog to show "Import new emails" option
- [ ] Handle first-time imports (no previous import date)

**Implementation Location**: `backend/supabase/functions/fetch-gmail-emails/index.ts`

### 5. Enhanced Email Parsing ⚠️ NEEDS IMPLEMENTATION
**Your Answer**: Parse from field, detect job boards (Indeed/Monster/etc.)

**Current Status**: Basic parsing, doesn't extract sender or detect job boards

**Action Items**:
- [ ] Extract sender email from email headers
- [ ] Parse sender domain to identify employer
- [ ] Detect job board patterns:
  - `noreply@indeed.com` → source: "indeed"
  - `noreply@monster.com` → source: "monster"
  - `careers@company.com` → source: "company_website"
- [ ] Store parsed sender in activity metadata
- [ ] Update `parse-email` edge function

**Implementation Location**: `backend/supabase/functions/parse-email/index.ts`

### 6. Failed Parsing Handling ⚠️ PARTIALLY DONE
**Your Answer**: Both retry and manual review

**Current Status**: Logs errors but no retry queue or manual review UI

**Action Items**:
- [ ] Create `failed_parsing_queue` table
- [ ] Store failed parsing attempts with original email
- [ ] Add retry logic (max 3 attempts)
- [ ] Create UI for manual review of failed imports
- [ ] Show failed imports in dashboard

### 7. Timezone Support ⚠️ NEEDS IMPLEMENTATION
**Your Answer**: User's timezone

**Current Status**: Uses UTC/default

**Action Items**:
- [ ] Add timezone field to `user_preferences` (already exists!)
- [ ] Detect user timezone on signup
- [ ] Calculate weekly summaries in user timezone
- [ ] Display dates/times in user timezone
- [ ] Update `getWeekStart()` and `getWeekEnd()` functions

**Implementation Location**: 
- `frontend/src/lib/utils.ts` (timezone-aware date functions)
- `frontend/src/components/analytics/WeeklySummaryCard.tsx`

### 8. Pre-computed Weekly Summaries ⚠️ NEEDS IMPLEMENTATION
**Your Answer**: Always available, show above/below threshold flag

**Current Status**: Calculated on-demand

**Action Items**:
- [ ] Create `weekly_summaries` materialized view or table
- [ ] Auto-compute on activity create/update/delete
- [ ] Add `meets_goal` boolean flag
- [ ] Add `goal_exceeded` boolean flag
- [ ] Refresh summaries via database trigger or edge function

**Implementation Location**: 
- `backend/supabase/migrations/` (new migration)
- Database trigger function

### 9. Confirmation Dialogs ✅ PARTIALLY DONE
**Your Answer**: Yes

**Current Status**: Using `window.confirm()` - needs styled component

**Action Items**:
- [ ] Create `ConfirmDialog` component
- [ ] Replace `window.confirm()` in `ActivityTable.tsx`
- [ ] Add confirmation for bulk operations
- [ ] Style to match app design

### 10. Undo Functionality ❌ NOT IMPLEMENTED
**Your Answer**: Yes

**Action Items**:
- [ ] Create undo queue system
- [ ] Store deleted activities temporarily (5 minutes)
- [ ] Show undo toast notification after deletion
- [ ] Add "Undo" button in toast
- [ ] Auto-permanent delete after timeout

**Implementation Location**: 
- `frontend/src/store/undoStore.ts` (new Zustand store)
- `frontend/src/components/ui/toast.tsx` (new component)

### 11. Goal Exceeded Celebration ❌ NOT IMPLEMENTED
**Your Answer**: Both celebration and notification

**Action Items**:
- [ ] Detect when weekly goal is exceeded
- [ ] Show celebration animation/confetti
- [ ] Send notification (browser notification or in-app)
- [ ] Track goal achievements in database
- [ ] Show achievement badge

**Implementation Location**: 
- `frontend/src/components/analytics/WeeklySummaryCard.tsx`
- New celebration component

### 12. Custom Activity Types ❌ NOT IMPLEMENTED
**Your Answer**: Users can add to existing prepopulated activities

**Action Items**:
- [ ] Create `custom_activity_types` table
- [ ] Add "Add Custom Type" option in activity form
- [ ] Store user-specific custom types
- [ ] Show custom types in dropdown
- [ ] Allow editing/deleting custom types

**Implementation Location**: 
- `backend/supabase/migrations/` (new table)
- `frontend/src/components/activities/ActivityDialog.tsx`

### 13. Token Encryption ⚠️ CRITICAL SECURITY
**Your Answer**: Best practice, practical, regulatory compliant

**Current Status**: Stored in plain text (security risk!)

**Action Items**:
- [ ] Research Supabase Vault capabilities
- [ ] Implement AES-256 encryption for tokens
- [ ] Encrypt on insert, decrypt on read
- [ ] Store encryption key securely (Supabase secrets)
- [ ] Document encryption method

**Implementation Location**: 
- `backend/supabase/functions/gmail-auth/index.ts`
- New encryption utility function

### 14. Audit Logging Implementation ⚠️ NEEDS IMPLEMENTATION
**Your Answer**: Yes

**Current Status**: Table exists but not logging

**Action Items**:
- [ ] Create database triggers for activity logging
- [ ] Log all create/update/delete operations
- [ ] Log Gmail connection/disconnection events
- [ ] Add IP address and user agent tracking
- [ ] Create audit log view for users

**Implementation Location**: 
- `backend/supabase/migrations/` (trigger functions)

### 15. GDPR Data Export/Deletion ❌ NOT IMPLEMENTED
**Your Answer**: Yes

**Action Items**:
- [ ] Create "Export My Data" function
- [ ] Generate JSON/CSV export of all user data
- [ ] Create "Delete My Account" function
- [ ] Delete all user data (activities, preferences, tokens, etc.)
- [ ] Add confirmation dialogs
- [ ] Log deletion for compliance

**Implementation Location**: 
- New edge function: `export-user-data`
- New edge function: `delete-user-account`
- Settings page UI

### 16. AI Insights Caching ✅ IMPLEMENTED
**Your Answer**: Yes

**Status**: ✅ Implemented
- Cache table created (`ai_insights_cache`)
- Cache check implemented in `analyze-job-search` function
- Auto-invalidation via database triggers
- 24-hour cache expiration
- Cache hit/miss tracking

**Remaining Actions**:
- [ ] Add cache hit/miss metrics to UI
- [ ] Show "Cached" indicator in insights display
- [ ] Add manual cache clear option

## Implementation Priority

### Phase 1: Critical (Security & Compliance) - Week 1
1. Token encryption
2. Audit logging implementation
3. Texas unemployment requirements research
4. GDPR data export/deletion

### Phase 2: Core Features - Week 2-3
5. Gmail token auto-refresh
6. Incremental imports
7. Enhanced email parsing (from field, job boards)
8. Failed parsing retry + manual review
9. Timezone support

### Phase 3: User Experience - Week 4
10. Pre-computed weekly summaries
11. Confirmation dialogs (replace window.confirm)
12. Undo functionality
13. Goal exceeded celebration

### Phase 4: Advanced Features - Week 5+
14. Custom activity types
15. AI insights caching
16. Data retention/archival system

## Notes

- **Pagination**: Current implementation handles 50-100/week fine. May need optimization for 100+/week users.
- **Duplicate Detection**: Verify current logic matches your requirements exactly.
- **Rate Limiting**: Already implemented for Gmail API ✅
- **Composite Indexes**: Already implemented ✅

