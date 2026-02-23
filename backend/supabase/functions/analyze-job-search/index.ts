import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      throw new Error('Unauthorized')
    }

    // Check cache first
    const { data: cachedInsights, error: cacheError } = await supabaseClient
      .from('ai_insights_cache')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // Check if cache is valid
    if (!cacheError && cachedInsights) {
      const now = new Date()
      const expiresAt = new Date(cachedInsights.expires_at)
      
      // Cache is still valid
      if (expiresAt > now) {
        // Verify no new activities since cache
        const { count: activityCount } = await supabaseClient
          .from('job_search_activities')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .is('deleted_at', null)

        // If activity count matches, cache is still valid
        if (activityCount === cachedInsights.last_activity_count) {
          return new Response(
            JSON.stringify({
              insights: cachedInsights.insights,
              cached: true,
              cachedAt: cachedInsights.cached_at,
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200,
            },
          )
        }
      }
    }

    // Fetch user's activities
    const { data: activities, error } = await supabaseClient
      .from('job_search_activities')
      .select('*')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .order('date', { ascending: false })
      .limit(1000)

    if (error) {
      throw new Error(`Failed to fetch activities: ${error.message}`)
    }

    if (!activities || activities.length === 0) {
      const emptyInsights = {
        insights: [{
          title: 'Get Started',
          description: 'Start logging your job search activities to receive personalized insights.',
          category: 'improvement',
          priority: 'high',
        }],
      }
      
      // Cache empty insights
      await cacheInsights(supabaseClient, user.id, emptyInsights.insights, activities.length, null)
      
      return new Response(
        JSON.stringify(emptyInsights),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    // Get latest activity ID for cache tracking
    const latestActivityId = activities[0]?.id || null

    // Use AI to analyze activities
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')

    let insights: any[]

    if (!lovableApiKey) {
      // Fallback to rule-based insights
      const response = await generateRuleBasedInsights(activities)
      const responseData = await response.json()
      insights = responseData.insights || []
    } else {
      // Call AI API
      const aiResponse = await fetch('https://api.lovable.ai/v1/analyze-job-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${lovableApiKey}`,
        },
        body: JSON.stringify({
          activities: activities.slice(0, 1000), // Limit size
        }),
      })

      if (aiResponse.ok) {
        const aiData = await aiResponse.json()
        insights = aiData.insights || []
      } else {
        // Fallback to rule-based insights
        const response = await generateRuleBasedInsights(activities)
        const responseData = await response.json()
        insights = responseData.insights || []
      }
    }

    // Cache the insights
    await cacheInsights(supabaseClient, user.id, insights, activities.length, latestActivityId)

    return new Response(
      JSON.stringify({ insights, cached: false }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})

// Helper function to cache insights
async function cacheInsights(
  supabaseClient: any,
  userId: string,
  insights: any[],
  activityCount: number,
  lastActivityId: string | null
) {
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 24) // Cache for 24 hours

  await supabaseClient
    .from('ai_insights_cache')
    .upsert({
      user_id: userId,
      insights: insights,
      last_activity_count: activityCount,
      last_activity_id: lastActivityId,
      expires_at: expiresAt.toISOString(),
    }, {
      onConflict: 'user_id',
    })
}

function generateRuleBasedInsights(activities: any[]) {
  const insights = []

  // Analyze activity distribution
  const activityTypes = activities.reduce((acc, a) => {
    acc[a.activity_type] = (acc[a.activity_type] || 0) + 1
    return acc
  }, {})

  const applications = activityTypes.application || 0
  const interviews = activityTypes.interview || 0
  const total = activities.length

  // Insight 1: Application to interview ratio
  if (applications > 0) {
    const ratio = interviews / applications
    if (ratio < 0.1) {
      insights.push({
        title: 'Low Interview Rate',
        description: `Only ${Math.round(ratio * 100)}% of your applications are leading to interviews. Consider tailoring your resume and cover letters more specifically to each role.`,
        category: 'improvement',
        priority: 'high',
      })
    }
  }

  // Insight 2: Activity frequency
  const recentActivities = activities.filter(a => {
    const activityDate = new Date(a.date)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return activityDate >= weekAgo
  })

  if (recentActivities.length < 5) {
    insights.push({
      title: 'Increase Activity Frequency',
      description: `You've logged ${recentActivities.length} activities this week. Aim for at least 5-10 activities per week to maximize your job search effectiveness.`,
      category: 'strategy',
      priority: 'medium',
    })
  }

  // Insight 3: Status distribution
  const statuses = activities.filter(a => a.status).reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1
    return acc
  }, {})

  const rejected = statuses.rejected || 0
  if (rejected > 0 && rejected / total > 0.5) {
    insights.push({
      title: 'High Rejection Rate',
      description: 'Consider seeking feedback on your applications or adjusting your target roles to better match your qualifications.',
      category: 'improvement',
      priority: 'medium',
    })
  }

  // Insight 4: Company diversity
  const uniqueCompanies = new Set(activities.map(a => a.company_name)).size
  if (uniqueCompanies < total * 0.7) {
    insights.push({
      title: 'Expand Your Network',
      description: `You're applying to ${uniqueCompanies} different companies. Consider diversifying your applications across more companies and industries.`,
      category: 'strategy',
      priority: 'low',
    })
  }

  return new Response(
    JSON.stringify({ insights }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    },
  )
}



