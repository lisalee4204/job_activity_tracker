# Fix 406 and 500 Errors

## Error 1: Demo Data - 500 Internal Server Error

The edge function is failing. Check the logs:

1. Go to: https://supabase.com/dashboard/project/uiiuwvdqqyybumkasrdz/logs/edge-functions
2. Find `seed-demo-data`
3. Click on it
4. Look at the latest invocation
5. Check the error message

**Common causes:**
- Function `seed_my_demo_data()` doesn't exist
- Permission error
- SQL error in the function

**Quick test:**
Run in SQL Editor:
```sql
SELECT seed_my_demo_data();
```

If this fails, share the error message.

## Error 2: Gmail Tokens - 406 Not Acceptable

The 406 error means the API request format is wrong. I've fixed this by changing `.single()` to `.maybeSingle()`.

**The fix is in the code** - the function will now handle missing tokens better.

## Next Steps

1. **Check Supabase Logs** for seed-demo-data error
2. **Test the SQL function** directly
3. **Refresh your app** - the Gmail tokens fix should work now

What does the Supabase log show for the seed-demo-data error?







