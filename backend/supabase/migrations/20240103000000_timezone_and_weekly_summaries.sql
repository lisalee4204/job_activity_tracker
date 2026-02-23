-- Add timezone support and pre-computed weekly summaries

-- Ensure timezone column exists in user_preferences (already added in initial schema)
-- Add timezone detection helper function

-- Create weekly summaries table for pre-computed analytics
CREATE TABLE IF NOT EXISTS weekly_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  activity_count INTEGER DEFAULT 0,
  unique_companies INTEGER DEFAULT 0,
  activity_types_count INTEGER DEFAULT 0,
  activity_breakdown JSONB DEFAULT '{}'::jsonb,
  meets_goal BOOLEAN DEFAULT FALSE,
  goal_exceeded BOOLEAN DEFAULT FALSE,
  weekly_goal INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

CREATE INDEX IF NOT EXISTS idx_weekly_summaries_user_week ON weekly_summaries(user_id, week_start DESC);
CREATE INDEX IF NOT EXISTS idx_weekly_summaries_week_start ON weekly_summaries(week_start DESC);

-- RLS Policies
ALTER TABLE weekly_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own weekly summaries"
  ON weekly_summaries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weekly summaries"
  ON weekly_summaries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weekly summaries"
  ON weekly_summaries FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to compute weekly summary
CREATE OR REPLACE FUNCTION compute_weekly_summary(
  p_user_id UUID,
  p_week_start DATE,
  p_timezone TEXT DEFAULT 'UTC'
)
RETURNS weekly_summaries AS $$
DECLARE
  v_week_end DATE;
  v_activity_count INTEGER;
  v_unique_companies INTEGER;
  v_activity_types_count INTEGER;
  v_activity_breakdown JSONB;
  v_weekly_goal INTEGER;
  v_meets_goal BOOLEAN;
  v_goal_exceeded BOOLEAN;
  v_summary weekly_summaries;
BEGIN
  -- Calculate week end (6 days after start)
  v_week_end := p_week_start + INTERVAL '6 days';
  
  -- Get user's weekly goal
  SELECT COALESCE(weekly_goal, 5) INTO v_weekly_goal
  FROM user_preferences
  WHERE user_id = p_user_id;
  
  -- Count activities in week
  SELECT 
    COUNT(*)::INTEGER,
    COUNT(DISTINCT company_name)::INTEGER,
    COUNT(DISTINCT activity_type)::INTEGER,
    jsonb_object_agg(activity_type, type_count)
  INTO 
    v_activity_count,
    v_unique_companies,
    v_activity_types_count,
    v_activity_breakdown
  FROM (
    SELECT 
      activity_type,
      COUNT(*) as type_count
    FROM job_search_activities
    WHERE user_id = p_user_id
      AND date >= p_week_start
      AND date <= v_week_end
      AND deleted_at IS NULL
    GROUP BY activity_type
  ) subquery;
  
  -- Set defaults if no activities
  v_activity_count := COALESCE(v_activity_count, 0);
  v_unique_companies := COALESCE(v_unique_companies, 0);
  v_activity_types_count := COALESCE(v_activity_types_count, 0);
  v_activity_breakdown := COALESCE(v_activity_breakdown, '{}'::jsonb);
  
  -- Check if meets/exceeds goal
  v_meets_goal := v_activity_count >= v_weekly_goal;
  v_goal_exceeded := v_activity_count > v_weekly_goal;
  
  -- Upsert summary
  INSERT INTO weekly_summaries (
    user_id,
    week_start,
    week_end,
    activity_count,
    unique_companies,
    activity_types_count,
    activity_breakdown,
    meets_goal,
    goal_exceeded,
    weekly_goal
  ) VALUES (
    p_user_id,
    p_week_start,
    v_week_end,
    v_activity_count,
    v_unique_companies,
    v_activity_types_count,
    v_activity_breakdown,
    v_meets_goal,
    v_goal_exceeded,
    v_weekly_goal
  )
  ON CONFLICT (user_id, week_start) 
  DO UPDATE SET
    activity_count = EXCLUDED.activity_count,
    unique_companies = EXCLUDED.unique_companies,
    activity_types_count = EXCLUDED.activity_types_count,
    activity_breakdown = EXCLUDED.activity_breakdown,
    meets_goal = EXCLUDED.meets_goal,
    goal_exceeded = EXCLUDED.goal_exceeded,
    weekly_goal = EXCLUDED.weekly_goal,
    updated_at = NOW()
  RETURNING * INTO v_summary;
  
  RETURN v_summary;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-compute weekly summary when activities change
CREATE OR REPLACE FUNCTION trigger_update_weekly_summary()
RETURNS TRIGGER AS $$
DECLARE
  v_activity_date DATE;
  v_week_start DATE;
BEGIN
  -- Get activity date (from NEW or OLD)
  v_activity_date := COALESCE(NEW.date, OLD.date);
  
  -- Calculate week start (Monday)
  v_week_start := DATE_TRUNC('week', v_activity_date)::DATE;
  
  -- Recompute weekly summary
  PERFORM compute_weekly_summary(
    COALESCE(NEW.user_id, OLD.user_id),
    v_week_start
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS update_weekly_summary_on_insert ON job_search_activities;
CREATE TRIGGER update_weekly_summary_on_insert
  AFTER INSERT ON job_search_activities
  FOR EACH ROW
  WHEN (NEW.deleted_at IS NULL)
  EXECUTE FUNCTION trigger_update_weekly_summary();

DROP TRIGGER IF EXISTS update_weekly_summary_on_update ON job_search_activities;
CREATE TRIGGER update_weekly_summary_on_update
  AFTER UPDATE ON job_search_activities
  FOR EACH ROW
  WHEN (NEW.deleted_at IS NULL OR OLD.deleted_at IS NULL)
  EXECUTE FUNCTION trigger_update_weekly_summary();

DROP TRIGGER IF EXISTS update_weekly_summary_on_delete ON job_search_activities;
CREATE TRIGGER update_weekly_summary_on_delete
  AFTER UPDATE ON job_search_activities
  FOR EACH ROW
  WHEN (NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL)
  EXECUTE FUNCTION trigger_update_weekly_summary();







