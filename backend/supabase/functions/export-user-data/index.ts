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

    const { format = 'json' } = await req.json().catch(() => ({ format: 'json' }))

    // Fetch all user data
    const [
      { data: activities },
      { data: preferences },
      { data: importHistory },
      { data: customTypes },
      { data: auditLogs },
    ] = await Promise.all([
      supabaseClient
        .from('job_search_activities')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false }),
      supabaseClient
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single(),
      supabaseClient
        .from('email_import_history')
        .select('*')
        .eq('user_id', user.id)
        .order('import_date', { ascending: false }),
      supabaseClient
        .from('custom_activity_types')
        .select('*')
        .eq('user_id', user.id),
      supabaseClient
        .from('audit_log')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1000), // Limit audit logs
    ])

    const exportData = {
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
      },
      preferences: preferences || {},
      activities: activities || [],
      import_history: importHistory || [],
      custom_activity_types: customTypes || [],
      audit_logs: auditLogs || [],
      exported_at: new Date().toISOString(),
    }

    if (format === 'csv') {
      // Convert activities to CSV
      const csvHeaders = [
        'Date',
        'Company Name',
        'Job Title',
        'Activity Type',
        'Status',
        'Source',
        'Location',
        'Notes',
      ]
      
      const csvRows = (activities || []).map((a: any) => [
        a.date,
        a.company_name,
        a.job_title,
        a.activity_type,
        a.status || '',
        a.source || '',
        a.location || '',
        (a.notes || '').replace(/"/g, '""'), // Escape quotes
      ])

      const csv = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.map(cell => `"${cell}"`).join(',')),
      ].join('\n')

      return new Response(csv, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="job-search-data-${Date.now()}.csv"`,
        },
        status: 200,
      })
    }

    // Default: JSON format
    return new Response(
      JSON.stringify(exportData, null, 2),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="job-search-data-${Date.now()}.json"`,
        },
        status: 200,
      },
    )
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})







