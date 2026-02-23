-- Custom Activity Types
-- Allow users to add custom activity types in addition to predefined ones

CREATE TABLE IF NOT EXISTS custom_activity_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT, -- Optional icon identifier
  color TEXT, -- Optional color for UI
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, name)
);

CREATE INDEX IF NOT EXISTS idx_custom_activity_types_user ON custom_activity_types(user_id);

-- RLS Policies
ALTER TABLE custom_activity_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own custom activity types"
  ON custom_activity_types FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own custom activity types"
  ON custom_activity_types FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own custom activity types"
  ON custom_activity_types FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own custom activity types"
  ON custom_activity_types FOR DELETE
  USING (auth.uid() = user_id);

-- Update activity_type check constraint to allow custom types
-- Note: We'll handle custom types in application logic since PostgreSQL
-- doesn't support dynamic check constraints easily

-- Function to get all activity types for a user (predefined + custom)
CREATE OR REPLACE FUNCTION get_user_activity_types(p_user_id UUID)
RETURNS TABLE (
  name TEXT,
  is_custom BOOLEAN,
  description TEXT,
  icon TEXT,
  color TEXT
) AS $$
BEGIN
  RETURN QUERY
  -- Predefined types
  SELECT 
    'application'::TEXT as name,
    FALSE as is_custom,
    'Job application submitted'::TEXT as description,
    NULL::TEXT as icon,
    NULL::TEXT as color
  UNION ALL
  SELECT 'interview'::TEXT, FALSE, 'Interview scheduled or completed', NULL, NULL
  UNION ALL
  SELECT 'networking'::TEXT, FALSE, 'Networking event or contact', NULL, NULL
  UNION ALL
  SELECT 'job_fair'::TEXT, FALSE, 'Job fair attendance', NULL, NULL
  UNION ALL
  SELECT 'resume_submission'::TEXT, FALSE, 'Resume submitted', NULL, NULL
  UNION ALL
  SELECT 'phone_call'::TEXT, FALSE, 'Phone call with recruiter/employer', NULL, NULL
  UNION ALL
  SELECT 'email_inquiry'::TEXT, FALSE, 'Email inquiry sent', NULL, NULL
  UNION ALL
  SELECT 'recruiter_contact'::TEXT, FALSE, 'Contacted by recruiter', NULL, NULL
  UNION ALL
  SELECT 'other'::TEXT, FALSE, 'Other activity type', NULL, NULL
  -- Custom types
  UNION ALL
  SELECT 
    cat.name,
    TRUE as is_custom,
    cat.description,
    cat.icon,
    cat.color
  FROM custom_activity_types cat
  WHERE cat.user_id = p_user_id
  ORDER BY is_custom, name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;







