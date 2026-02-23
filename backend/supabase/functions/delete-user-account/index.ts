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

    const { confirm } = await req.json()

    if (confirm !== 'DELETE') {
      throw new Error('Confirmation required. Send { confirm: "DELETE" } to delete account.')
    }

    // Delete all user data (CASCADE will handle related records)
    // Order matters due to foreign key constraints
    
    // 1. Delete custom activity types
    await supabaseClient
      .from('custom_activity_types')
      .delete()
      .eq('user_id', user.id)

    // 2. Delete email import history
    await supabaseClient
      .from('email_import_history')
      .delete()
      .eq('user_id', user.id)

    // 3. Delete failed email parsing
    await supabaseClient
      .from('failed_email_parsing')
      .delete()
      .eq('user_id', user.id)

    // 4. Delete Gmail tokens
    await supabaseClient
      .from('gmail_tokens')
      .delete()
      .eq('user_id', user.id)

    // 5. Delete activities (including archived)
    await supabaseClient
      .from('job_search_activities')
      .delete()
      .eq('user_id', user.id)

    await supabaseClient
      .from('job_search_activities_archive')
      .delete()
      .eq('user_id', user.id)

    // 6. Delete weekly summaries
    await supabaseClient
      .from('weekly_summaries')
      .delete()
      .eq('user_id', user.id)

    // 7. Delete AI insights cache
    await supabaseClient
      .from('ai_insights_cache')
      .delete()
      .eq('user_id', user.id)

    // 8. Delete user preferences
    await supabaseClient
      .from('user_preferences')
      .delete()
      .eq('user_id', user.id)

    // 9. Delete profile
    await supabaseClient
      .from('profiles')
      .delete()
      .eq('id', user.id)

    // 10. Log deletion (before deleting user)
    await supabaseClient
      .from('audit_log')
      .insert({
        user_id: user.id,
        action: 'account_deleted',
        resource_type: 'user',
        resource_id: user.id,
        details: { deleted_at: new Date().toISOString() },
      })

    // 11. Delete auth user (this will cascade delete all related data)
    // Note: This requires admin client, so we'll use the service role
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id)

    if (deleteError) {
      throw new Error(`Failed to delete user: ${deleteError.message}`)
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Account and all data deleted successfully' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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







