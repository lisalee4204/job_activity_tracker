# Check Errors - Step by Step

## Error 1: Demo Data - 500 Error (FIXED in code)

I've improved the error logging. Now:

1. **Redeploy the edge function** with better error handling:
   - Go to Supabase Dashboard → Edge Functions → `seed-demo-data`
   - Replace the code with the updated version (from the file)
   - Click "Deploy"

2. **Check Supabase Logs**:
   - Go to: https://supabase.com/dashboard/project/uiiuwvdqqyybumkasrdz/logs/edge-functions
   - Find `seed-demo-data`
   - Click on latest invocation
   - Look for error message

3. **Test the function directly**:
   - Go to SQL Editor
   - Run: `SELECT seed_my_demo_data();`
   - Does it work or give an error?

## Error 2: Gmail Tokens - 406 Error (FIXED)

I've fixed this by changing `.single()` to `.maybeSingle()`. 

**To apply the fix:**
- Refresh your browser
- The error should be gone

## What to Do Now

1. **Redeploy seed-demo-data function** (with improved error logging)
2. **Refresh your app** (fixes 406 error)
3. **Try "Load Demo Data" again**
4. **Check the logs** for the actual error message
5. **Share the error** from the logs

The improved logging will show exactly what's wrong!







