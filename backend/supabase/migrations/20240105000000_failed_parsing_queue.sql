-- Failed Parsing Queue
-- Store emails that failed to parse for manual review and retry

CREATE TABLE IF NOT EXISTS failed_email_parsing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_data JSONB NOT NULL, -- Full email data from Gmail API
  email_id TEXT NOT NULL, -- Gmail message ID
  subject TEXT,
  from_email TEXT,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  status TEXT CHECK (status IN ('pending', 'retrying', 'manual_review', 'resolved', 'failed')) DEFAULT 'pending',
  parsed_activity_id UUID REFERENCES job_search_activities(id), -- If manually resolved
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_failed_parsing_user ON failed_email_parsing(user_id);
CREATE INDEX IF NOT EXISTS idx_failed_parsing_status ON failed_email_parsing(status);
CREATE INDEX IF NOT EXISTS idx_failed_parsing_created ON failed_email_parsing(created_at DESC);

-- RLS Policies
ALTER TABLE failed_email_parsing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own failed parsing"
  ON failed_email_parsing FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own failed parsing"
  ON failed_email_parsing FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own failed parsing"
  ON failed_email_parsing FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own failed parsing"
  ON failed_email_parsing FOR DELETE
  USING (auth.uid() = user_id);







