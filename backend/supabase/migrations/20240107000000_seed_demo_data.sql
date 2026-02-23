-- Seed Demo Data
-- Creates sample job search activities for testing and demonstration

-- Function to seed demo data for a user
CREATE OR REPLACE FUNCTION seed_demo_data(target_user_id UUID)
RETURNS void AS $$
DECLARE
  activity_id UUID;
  demo_date DATE;
  companies TEXT[] := ARRAY[
    'Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Netflix', 'Tesla', 
    'Salesforce', 'Adobe', 'Oracle', 'IBM', 'Intel', 'NVIDIA', 'AMD',
    'Spotify', 'Uber', 'Airbnb', 'Stripe', 'Shopify', 'Zoom'
  ];
  job_titles TEXT[] := ARRAY[
    'Software Engineer', 'Senior Software Engineer', 'Full Stack Developer',
    'Frontend Developer', 'Backend Developer', 'DevOps Engineer',
    'Product Manager', 'Technical Program Manager', 'Data Engineer',
    'Machine Learning Engineer', 'Site Reliability Engineer', 'QA Engineer'
  ];
  activity_types TEXT[] := ARRAY[
    'application', 'interview', 'phone_call', 'email_inquiry', 
    'networking', 'recruiter_contact', 'resume_submission'
  ];
  statuses TEXT[] := ARRAY[
    'application', 'assessment', 'hr_screen', 'hiring_manager', 
    'final_round', 'offer', 'rejected'
  ];
  sources TEXT[] := ARRAY[
    'linkedin', 'indeed', 'company_website', 'glassdoor', 
    'recruiter_contact', 'referral', 'job_fair'
  ];
  i INTEGER;
  selected_company TEXT;
  selected_title TEXT;
  selected_type TEXT;
  selected_status TEXT;
  selected_source TEXT;
BEGIN
  -- Delete any existing demo data for this user
  DELETE FROM job_search_activities WHERE user_id = target_user_id;
  
  -- Generate activities for the last 8 weeks (to show weekly summaries)
  FOR i IN 1..60 LOOP
    -- Random date within last 8 weeks
    demo_date := CURRENT_DATE - (RANDOM() * 56)::INTEGER;
    
    -- Random selections
    selected_company := companies[1 + FLOOR(RANDOM() * array_length(companies, 1))::INTEGER];
    selected_title := job_titles[1 + FLOOR(RANDOM() * array_length(job_titles, 1))::INTEGER];
    selected_type := activity_types[1 + FLOOR(RANDOM() * array_length(activity_types, 1))::INTEGER];
    selected_source := sources[1 + FLOOR(RANDOM() * array_length(sources, 1))::INTEGER];
    
    -- Status only for applications
    IF selected_type = 'application' THEN
      selected_status := statuses[1 + FLOOR(RANDOM() * array_length(statuses, 1))::INTEGER];
    ELSE
      selected_status := NULL;
    END IF;
    
    -- Insert activity
    INSERT INTO job_search_activities (
      user_id,
      date,
      company_name,
      job_title,
      activity_type,
      status,
      source,
      location,
      job_description_url,
      contact_person,
      contact_method,
      notes,
      ai_parsed,
      created_at
    ) VALUES (
      target_user_id,
      demo_date,
      selected_company,
      selected_title,
      selected_type,
      selected_status,
      selected_source,
      CASE WHEN RANDOM() > 0.5 THEN 
        (ARRAY['San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX', 'Remote'])[1 + FLOOR(RANDOM() * 5)::INTEGER]
      ELSE NULL END,
      CASE WHEN RANDOM() > 0.7 THEN 
        'https://example.com/job/' || i
      ELSE NULL END,
      CASE WHEN RANDOM() > 0.6 THEN 
        (ARRAY['John Smith', 'Jane Doe', 'Mike Johnson', 'Sarah Williams'])[1 + FLOOR(RANDOM() * 4)::INTEGER]
      ELSE NULL END,
      CASE WHEN RANDOM() > 0.6 THEN 
        (ARRAY['email', 'phone', 'linkedin'])[1 + FLOOR(RANDOM() * 3)::INTEGER]
      ELSE NULL END,
      'Demo activity note',  -- Always mark demo data so it can be cleared
      FALSE,
      NOW() - (RANDOM() * 56)::INTEGER * INTERVAL '1 day'
    );
  END LOOP;
  
  -- Ensure we have some activities in the current week
  FOR i IN 1..8 LOOP
    demo_date := CURRENT_DATE - (RANDOM() * 7)::INTEGER;
    selected_company := companies[1 + FLOOR(RANDOM() * array_length(companies, 1))::INTEGER];
    selected_title := job_titles[1 + FLOOR(RANDOM() * array_length(job_titles, 1))::INTEGER];
    selected_type := activity_types[1 + FLOOR(RANDOM() * array_length(activity_types, 1))::INTEGER];
    selected_source := sources[1 + FLOOR(RANDOM() * array_length(sources, 1))::INTEGER];
    
    IF selected_type = 'application' THEN
      selected_status := statuses[1 + FLOOR(RANDOM() * array_length(statuses, 1))::INTEGER];
    ELSE
      selected_status := NULL;
    END IF;
    
    INSERT INTO job_search_activities (
      user_id,
      date,
      company_name,
      job_title,
      activity_type,
      status,
      source,
      location,
      notes,
      ai_parsed,
      created_at
    ) VALUES (
      target_user_id,
      demo_date,
      selected_company,
      selected_title,
      selected_type,
      selected_status,
      selected_source,
      (ARRAY['San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Remote'])[1 + FLOOR(RANDOM() * 4)::INTEGER],
      'Demo activity note',  -- Always mark demo data
      FALSE,
      NOW() - (RANDOM() * 7)::INTEGER * INTERVAL '1 day'
    );
  END LOOP;
  
  RAISE NOTICE 'Demo data seeded for user %', target_user_id;
END;
$$ LANGUAGE plpgsql;

-- Create a function that can be called via SQL or Edge Function
CREATE OR REPLACE FUNCTION seed_my_demo_data()
RETURNS void AS $$
DECLARE
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;
  
  PERFORM seed_demo_data(current_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

