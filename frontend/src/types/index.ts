export type ActivityType =
  | 'application'
  | 'interview'
  | 'networking'
  | 'job_fair'
  | 'resume_submission'
  | 'phone_call'
  | 'email_inquiry'
  | 'recruiter_contact'
  | 'other'

export type ActivityStatus =
  | 'application'
  | 'assessment'
  | 'hr_screen'
  | 'hiring_manager'
  | 'final_round'
  | 'offer'
  | 'rejected'

export type JobSource =
  | 'linkedin'
  | 'indeed'
  | 'company_website'
  | 'glassdoor'
  | 'monster'
  | 'other'
  | 'gmail_import'

export interface JobSearchActivity {
  id: string
  user_id: string
  date: string
  company_name: string
  job_title: string
  activity_type: ActivityType
  status?: ActivityStatus | null
  job_description_url?: string | null
  contact_person?: string | null
  contact_method?: string | null
  notes?: string | null
  source?: JobSource | null
  location?: string | null
  salary_range?: string | null
  ai_parsed?: boolean
  ai_confidence?: number | null
  created_at: string
  updated_at: string
}

export interface UserPreferences {
  id: string
  user_id: string
  weekly_goal: number
  timezone?: string
  email_notifications?: boolean
  created_at: string
  updated_at: string
}

export interface WeeklySummary {
  week_start: string
  activity_count: number
  unique_companies: number
  activity_types_count: number
  activity_breakdown: Record<ActivityType, number>
  meets_goal?: boolean
  goal_exceeded?: boolean
}

export interface AIInsight {
  title: string
  description: string
  category: 'strategy' | 'trend' | 'opportunity' | 'improvement'
  priority: 'high' | 'medium' | 'low'
}

export interface GmailToken {
  id: string
  user_id: string
  expires_at: string
  created_at: string
  updated_at: string
}

export interface CreateActivityInput {
  date: string
  company_name: string
  job_title: string
  activity_type: ActivityType
  status?: ActivityStatus
  job_description_url?: string
  contact_person?: string
  contact_method?: string
  notes?: string
  source?: JobSource
  location?: string
  salary_range?: string
}

export interface UpdateActivityInput extends Partial<CreateActivityInput> {
  id: string
}



