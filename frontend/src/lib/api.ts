import { supabase } from './supabase'
import type {
  JobSearchActivity,
  CreateActivityInput,
  UpdateActivityInput,
  UserPreferences,
  WeeklySummary,
  AIInsight,
} from '../types'

// Activities API
export const activitiesApi = {
  async getAll(page = 1, pageSize = 20) {
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, error, count } = await supabase
      .from('job_search_activities')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)
      .order('date', { ascending: false })
      .range(from, to)

    if (error) throw error
    return { data: data as JobSearchActivity[], count: count || 0 }
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('job_search_activities')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single()

    if (error) throw error
    return data as JobSearchActivity
  },

  async create(input: CreateActivityInput) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('job_search_activities')
      .insert({
        ...input,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) throw error
    return data as JobSearchActivity
  },

  async update(input: UpdateActivityInput) {
    const { id, ...updates } = input
    const { data, error } = await supabase
      .from('job_search_activities')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as JobSearchActivity
  },

  async delete(id: string) {
    // Soft delete
    const { error } = await supabase
      .from('job_search_activities')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error
  },

  async getWeeklySummary(weekStart: Date) {
    const weekStartStr = weekStart.toISOString().split('T')[0]

    // Try to get pre-computed summary first
    const { data: precomputed, error: precomputedError } = await supabase
      .from('weekly_summaries')
      .select('*')
      .eq('week_start', weekStartStr)
      .single()

    // If pre-computed summary exists, use it
    if (!precomputedError && precomputed) {
      return {
        week_start: precomputed.week_start,
        activity_count: precomputed.activity_count,
        unique_companies: precomputed.unique_companies,
        activity_types_count: precomputed.activity_types_count,
        activity_breakdown: precomputed.activity_breakdown as Record<string, number>,
        meets_goal: precomputed.meets_goal,
        goal_exceeded: precomputed.goal_exceeded,
      } as WeeklySummary & { meets_goal: boolean; goal_exceeded: boolean }
    }

    // Fallback to on-demand calculation
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)

    const { data, error } = await supabase
      .from('job_search_activities')
      .select('*')
      .is('deleted_at', null)
      .gte('date', weekStartStr)
      .lte('date', weekEnd.toISOString().split('T')[0])

    if (error) throw error

    const summary: WeeklySummary = {
      week_start: weekStartStr,
      activity_count: data.length,
      unique_companies: new Set(data.map((a) => a.company_name)).size,
      activity_types_count: new Set(data.map((a) => a.activity_type)).size,
      activity_breakdown: data.reduce((acc, activity) => {
        acc[activity.activity_type] = (acc[activity.activity_type] || 0) + 1
        return acc
      }, {} as Record<string, number>),
    }

    return summary
  },
}

// Preferences API
export const preferencesApi = {
  async get() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned
    return data as UserPreferences | null
  },

  async update(updates: Partial<UserPreferences>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data: existing } = await supabase
      .from('user_preferences')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (existing) {
      const { data, error } = await supabase
        .from('user_preferences')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error
      return data as UserPreferences
    } else {
      const { data, error } = await supabase
        .from('user_preferences')
        .insert({
          user_id: user.id,
          ...updates,
        })
        .select()
        .single()

      if (error) throw error
      return data as UserPreferences
    }
  },
}

// Gmail API
export const gmailApi = {
  async getOAuthConfig() {
    const { data, error } = await supabase.functions.invoke('gmail-oauth-config')
    if (error) throw error
    return data
  },

  async connectGmail(authorizationCode: string) {
    const { data, error } = await supabase.functions.invoke('gmail-auth', {
      body: { code: authorizationCode },
    })
    if (error) throw error
    return data
  },

  async importEmails(daysAgo: number) {
    const { data, error } = await supabase.functions.invoke('fetch-gmail-emails', {
      body: { daysAgo },
    })
    if (error) throw error
    return data
  },

  async checkConnection() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { data, error } = await supabase
      .from('gmail_tokens')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (error) {
      console.error('Gmail connection check error:', error)
      return false
    }
    // Return true as long as a token row exists — fetch-gmail-emails handles refresh automatically
    return !!data
  },
}

// Analytics API
export const analyticsApi = {
  async getInsights() {
    const { data, error } = await supabase.functions.invoke('analyze-job-search')
    if (error) throw error
    return data.insights as AIInsight[]
  },
}

// Demo Data API
export const demoApi = {
  async seedDemoData() {
    const { data, error } = await supabase.functions.invoke('seed-demo-data')
    if (error) throw error
    return data
  },

  async clearDemoData() {
    // Call the database function that handles RLS properly
    const { data, error } = await supabase.rpc('clear_demo_data')
    
    if (error) throw error
    return { deletedCount: data || 0 }
  },
}

// Custom Activity Types API
export const customActivityTypesApi = {
  async getAll() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('custom_activity_types')
      .select('*')
      .eq('user_id', user.id)
      .order('name', { ascending: true })

    if (error) throw error
    return data
  },

  async create(name: string, description?: string, icon?: string, color?: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('custom_activity_types')
      .insert({
        user_id: user.id,
        name,
        description,
        icon,
        color,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('custom_activity_types')
      .delete()
      .eq('id', id)

    if (error) throw error
  },
}



