# Database Schema Documentation

## Overview

The database uses PostgreSQL via Supabase with Row Level Security (RLS) enabled on all tables.

## Tables

### `profiles`

Stores user profile information linked to Supabase Auth users.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_profiles_email ON profiles(email);
```

**RLS Policies**:
- Users can only SELECT, UPDATE their own profile
- Users can INSERT their own profile on signup

### `user_preferences`

Stores user-specific settings and preferences.

```sql
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  weekly_goal INTEGER NOT NULL DEFAULT 5,
  timezone TEXT DEFAULT 'UTC',
  email_notifications BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
```

**RLS Policies**:
- Users can only SELECT, INSERT, UPDATE their own preferences

### `job_search_activities`

Main table storing all job search activities.

```sql
CREATE TABLE job_search_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN (
    'application', 'interview', 'networking', 'job_fair', 
    'resume_submission', 'phone_call', 'email_inquiry', 
    'recruiter_contact', 'other'
  )),
  status TEXT CHECK (status IN (
    'application', 'assessment', 'hr_screen', 'hiring_manager', 
    'final_round', 'offer', 'rejected'
  )),
  job_description_url TEXT,
  contact_person TEXT,
  contact_method TEXT,
  notes TEXT,
  source TEXT CHECK (source IN (
    'linkedin', 'indeed', 'company_website', 'glassdoor', 
    'monster', 'other', 'gmail_import'
  )),
  location TEXT,
  salary_range TEXT,
  ai_parsed BOOLEAN DEFAULT FALSE,
  ai_confidence DECIMAL(3,2),
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_activities_user_date ON job_search_activities(user_id, date DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_activities_user_type ON job_search_activities(user_id, activity_type) WHERE deleted_at IS NULL;
CREATE INDEX idx_activities_user_status ON job_search_activities(user_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_activities_date ON job_search_activities(date DESC) WHERE deleted_at IS NULL;
```

**RLS Policies**:
- Users can only SELECT, INSERT, UPDATE, DELETE their own activities
- Soft delete: Set `deleted_at` instead of hard delete

### `gmail_tokens`

Stores encrypted Gmail OAuth tokens for email import functionality.

```sql
CREATE TABLE gmail_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL, -- Encrypted
  refresh_token TEXT, -- Encrypted
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  token_type TEXT DEFAULT 'Bearer',
  scope TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX idx_gmail_tokens_user_id ON gmail_tokens(user_id);
CREATE INDEX idx_gmail_tokens_expires ON gmail_tokens(expires_at);
```

**RLS Policies**:
- Users can only SELECT, INSERT, UPDATE, DELETE their own tokens
- Tokens are encrypted at rest using Supabase Vault or application-level encryption

### `email_import_history`

Tracks Gmail import operations for deduplication and auditing.

```sql
CREATE TABLE email_import_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  import_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  emails_processed INTEGER DEFAULT 0,
  activities_created INTEGER DEFAULT 0,
  duplicates_skipped INTEGER DEFAULT 0,
  errors INTEGER DEFAULT 0,
  date_range_start DATE,
  date_range_end DATE,
  status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_email_import_user_date ON email_import_history(user_id, import_date DESC);
```

**RLS Policies**:
- Users can only SELECT their own import history

### `audit_log`

Tracks user actions for compliance and debugging (optional but recommended).

```sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- 'create', 'update', 'delete', 'import', etc.
  resource_type TEXT NOT NULL, -- 'activity', 'preference', 'gmail_token', etc.
  resource_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_log_user_date ON audit_log(user_id, created_at DESC);
CREATE INDEX idx_audit_log_resource ON audit_log(resource_type, resource_id);
```

**RLS Policies**:
- Users can only SELECT their own audit logs
- System can INSERT logs for all users

## Functions

### `update_updated_at_column()`

Automatically updates the `updated_at` timestamp.

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Triggers

```sql
-- Apply to all tables with updated_at column
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_search_activities_updated_at BEFORE UPDATE ON job_search_activities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gmail_tokens_updated_at BEFORE UPDATE ON gmail_tokens
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Views

### `weekly_activity_summary`

Pre-computed weekly summaries for performance.

```sql
CREATE VIEW weekly_activity_summary AS
SELECT 
  user_id,
  DATE_TRUNC('week', date)::DATE as week_start,
  COUNT(*) as activity_count,
  COUNT(DISTINCT company_name) as unique_companies,
  COUNT(DISTINCT activity_type) as activity_types_count,
  jsonb_object_agg(activity_type, type_count) as activity_breakdown
FROM (
  SELECT 
    user_id,
    date,
    company_name,
    activity_type,
    COUNT(*) OVER (PARTITION BY user_id, DATE_TRUNC('week', date), activity_type) as type_count
  FROM job_search_activities
  WHERE deleted_at IS NULL
) subquery
GROUP BY user_id, DATE_TRUNC('week', date);
```

## Row Level Security (RLS)

All tables have RLS enabled with policies ensuring users can only access their own data:

```sql
-- Example policy for job_search_activities
CREATE POLICY "Users can view own activities"
  ON job_search_activities FOR SELECT
  USING (auth.uid() = user_id AND deleted_at IS NULL);

CREATE POLICY "Users can insert own activities"
  ON job_search_activities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own activities"
  ON job_search_activities FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own activities"
  ON job_search_activities FOR DELETE
  USING (auth.uid() = user_id);
```

Similar policies are applied to all user-scoped tables.



