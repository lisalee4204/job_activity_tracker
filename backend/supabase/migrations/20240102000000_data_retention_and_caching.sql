-- Data Retention Policy
-- Set default retention to 1 year (12 months)
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS data_retention_months INTEGER DEFAULT 12;

-- Archive table for old activities
CREATE TABLE IF NOT EXISTS job_search_activities_archive (
  LIKE job_search_activities INCLUDING ALL
);

-- Add archived_at timestamp
ALTER TABLE job_search_activities_archive ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Index for archive queries
CREATE INDEX IF NOT EXISTS idx_archive_user_date ON job_search_activities_archive(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_archive_archived_at ON job_search_activities_archive(archived_at);

-- AI Insights Cache Table
CREATE TABLE IF NOT EXISTS ai_insights_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  insights JSONB NOT NULL,
  last_activity_id UUID REFERENCES job_search_activities(id),
  last_activity_count INTEGER DEFAULT 0,
  cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_insights_cache_user ON ai_insights_cache(user_id);
CREATE INDEX IF NOT EXISTS idx_insights_cache_expires ON ai_insights_cache(expires_at);

-- RLS Policies for cache
ALTER TABLE ai_insights_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own insights cache"
  ON ai_insights_cache FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own insights cache"
  ON ai_insights_cache FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own insights cache"
  ON ai_insights_cache FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own insights cache"
  ON ai_insights_cache FOR DELETE
  USING (auth.uid() = user_id);

-- Function to archive old activities
CREATE OR REPLACE FUNCTION archive_old_activities()
RETURNS void AS $$
DECLARE
  retention_months INTEGER;
  cutoff_date DATE;
BEGIN
  -- Get retention period (default 12 months)
  SELECT COALESCE(MAX(data_retention_months), 12) INTO retention_months
  FROM user_preferences;
  
  -- Calculate cutoff date
  cutoff_date := CURRENT_DATE - (retention_months || ' months')::INTERVAL;
  
  -- Move old activities to archive
  INSERT INTO job_search_activities_archive
  SELECT *, NOW() as archived_at
  FROM job_search_activities
  WHERE date < cutoff_date
    AND deleted_at IS NULL;
  
  -- Delete archived activities from main table
  DELETE FROM job_search_activities
  WHERE date < cutoff_date
    AND deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to invalidate AI insights cache
CREATE OR REPLACE FUNCTION invalidate_insights_cache(target_user_id UUID)
RETURNS void AS $$
BEGIN
  DELETE FROM ai_insights_cache
  WHERE user_id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to invalidate cache when activities change
CREATE OR REPLACE FUNCTION trigger_invalidate_insights_cache()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM invalidate_insights_cache(COALESCE(NEW.user_id, OLD.user_id));
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for activity changes
DROP TRIGGER IF EXISTS invalidate_cache_on_insert ON job_search_activities;
CREATE TRIGGER invalidate_cache_on_insert
  AFTER INSERT ON job_search_activities
  FOR EACH ROW
  EXECUTE FUNCTION trigger_invalidate_insights_cache();

DROP TRIGGER IF EXISTS invalidate_cache_on_update ON job_search_activities;
CREATE TRIGGER invalidate_cache_on_update
  AFTER UPDATE ON job_search_activities
  FOR EACH ROW
  EXECUTE FUNCTION trigger_invalidate_insights_cache();

DROP TRIGGER IF EXISTS invalidate_cache_on_delete ON job_search_activities;
CREATE TRIGGER invalidate_cache_on_delete
  AFTER DELETE ON job_search_activities
  FOR EACH ROW
  EXECUTE FUNCTION trigger_invalidate_insights_cache();

-- RLS Policies for archive table
ALTER TABLE job_search_activities_archive ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own archived activities"
  ON job_search_activities_archive FOR SELECT
  USING (auth.uid() = user_id);







