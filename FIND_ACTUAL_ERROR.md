# Find the Actual Error Message

## The logs show 500 but we need the error details

In Supabase Dashboard → Logs → Edge Functions:

1. **Click on `seed-demo-data`** (not just view the list)
2. **Click on the specific failed invocation** (the one with 500 error)
3. Look for:
   - **"Response"** section
   - **"Error"** section  
   - **"Logs"** or **"Output"** tab
   - **"Response body"** or error message

The error message should be something like:
- "function seed_my_demo_data() does not exist"
- "permission denied"
- "column X does not exist"
- Or a SQL error message

## Alternative: Check Function Logs Tab

1. Go to Edge Functions → `seed-demo-data`
2. Click **"Logs"** tab (at the top)
3. Look for `console.error` messages
4. Should show the actual error

## What I Need

The **exact error message** from the logs, not just "500". 

It should look something like:
```
Database function error: function seed_my_demo_data() does not exist
```

Or:
```
Database function error: permission denied for function seed_my_demo_data
```

Share that exact error message and I can fix it!







