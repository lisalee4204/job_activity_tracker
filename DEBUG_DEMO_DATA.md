# Debug Demo Data Error

## Check Edge Function Logs

The error details should be in the Supabase logs. Let's check:

1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/uiiuwvdqqyybumkasrdz/logs/edge-functions
2. Look for `seed-demo-data` function logs
3. Check the error message - it will tell us what's wrong

## Common Issues

### Issue 1: Function doesn't exist
**Error**: "function seed_my_demo_data() does not exist"

**Fix**: Make sure you ran the SQL migration. Check:
- Go to Database → Functions
- Look for `seed_my_demo_data` in the list
- If it's not there, run the SQL again

### Issue 2: Permission denied
**Error**: "permission denied" or "insufficient privileges"

**Fix**: The function needs SECURITY DEFINER. Make sure the SQL included:
```sql
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Issue 3: User not authenticated
**Error**: "User must be authenticated"

**Fix**: Make sure you're signed in to the app

## Quick Test

Try calling the function directly in SQL Editor:

```sql
SELECT seed_my_demo_data();
```

If this works, the function exists and the issue is with the edge function.
If this fails, check the error message.

## Next Steps

1. Check the edge function logs (most important!)
2. Share the error message you see
3. We can fix it from there

The logs will tell us exactly what's wrong!







