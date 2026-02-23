-- Audit Logging Triggers
-- Automatically log all create, update, delete operations

-- Function to log activity changes
CREATE OR REPLACE FUNCTION log_activity_changes()
RETURNS TRIGGER AS $$
DECLARE
  v_action TEXT;
  v_user_id UUID;
BEGIN
  -- Determine action type
  IF TG_OP = 'INSERT' THEN
    v_action := 'create';
    v_user_id := NEW.user_id;
  ELSIF TG_OP = 'UPDATE' THEN
    v_action := 'update';
    v_user_id := NEW.user_id;
    
    -- Check if it's a soft delete
    IF NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL THEN
      v_action := 'delete';
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    v_action := 'delete';
    v_user_id := OLD.user_id;
  END IF;

  -- Insert audit log
  INSERT INTO audit_log (
    user_id,
    action,
    resource_type,
    resource_id,
    details
  ) VALUES (
    v_user_id,
    v_action,
    'activity',
    COALESCE(NEW.id, OLD.id),
    jsonb_build_object(
      'company_name', COALESCE(NEW.company_name, OLD.company_name),
      'job_title', COALESCE(NEW.job_title, OLD.job_title),
      'activity_type', COALESCE(NEW.activity_type, OLD.activity_type),
      'date', COALESCE(NEW.date, OLD.date)
    )
  );

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
DROP TRIGGER IF EXISTS audit_activity_insert ON job_search_activities;
CREATE TRIGGER audit_activity_insert
  AFTER INSERT ON job_search_activities
  FOR EACH ROW
  WHEN (NEW.deleted_at IS NULL)
  EXECUTE FUNCTION log_activity_changes();

DROP TRIGGER IF EXISTS audit_activity_update ON job_search_activities;
CREATE TRIGGER audit_activity_update
  AFTER UPDATE ON job_search_activities
  FOR EACH ROW
  EXECUTE FUNCTION log_activity_changes();

DROP TRIGGER IF EXISTS audit_activity_delete ON job_search_activities;
CREATE TRIGGER audit_activity_delete
  AFTER DELETE ON job_search_activities
  FOR EACH ROW
  EXECUTE FUNCTION log_activity_changes();

-- Function to log Gmail token changes
CREATE OR REPLACE FUNCTION log_gmail_token_changes()
RETURNS TRIGGER AS $$
DECLARE
  v_action TEXT;
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_action := 'gmail_connected';
  ELSIF TG_OP = 'UPDATE' THEN
    v_action := 'gmail_token_refreshed';
  ELSIF TG_OP = 'DELETE' THEN
    v_action := 'gmail_disconnected';
  END IF;

  INSERT INTO audit_log (
    user_id,
    action,
    resource_type,
    resource_id,
    details
  ) VALUES (
    COALESCE(NEW.user_id, OLD.user_id),
    v_action,
    'gmail_token',
    COALESCE(NEW.id, OLD.id),
    jsonb_build_object(
      'expires_at', COALESCE(NEW.expires_at, OLD.expires_at)
    )
  );

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for Gmail tokens
DROP TRIGGER IF EXISTS audit_gmail_token_insert ON gmail_tokens;
CREATE TRIGGER audit_gmail_token_insert
  AFTER INSERT ON gmail_tokens
  FOR EACH ROW
  EXECUTE FUNCTION log_gmail_token_changes();

DROP TRIGGER IF EXISTS audit_gmail_token_update ON gmail_tokens;
CREATE TRIGGER audit_gmail_token_update
  AFTER UPDATE ON gmail_tokens
  FOR EACH ROW
  EXECUTE FUNCTION log_gmail_token_changes();

DROP TRIGGER IF EXISTS audit_gmail_token_delete ON gmail_tokens;
CREATE TRIGGER audit_gmail_token_delete
  AFTER DELETE ON gmail_tokens
  FOR EACH ROW
  EXECUTE FUNCTION log_gmail_token_changes();







