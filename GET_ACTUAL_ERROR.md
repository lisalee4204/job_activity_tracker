# Get the Actual Error Message

## The logs show 500 but not the error details

You need to see the **actual error message** from the function. Here's how:

### Option 1: Check Function Invocation Details

In Supabase Dashboard → Logs → Edge Functions → `seed-demo-data`:

1. Click on the specific invocation (the one that failed)
2. Look for a section showing:
   - **Response body** or
   - **Error message** or
   - **Logs** or
   - **Output**

The error message should be there.

### Option 2: Check Function Logs Tab

1. Go to Edge Functions → `seed-demo-data`
2. Click on **Logs** tab (not just the list)
3. Look for console.error or error messages
4. Should show the actual error

### Option 3: Test Function Directly

Run this in SQL Editor:
```sql
SELECT seed_my_demo_data();
```

This will show the exact error if the function has an issue.

### Option 4: Check Browser Console

When you click "Load Demo Data", check browser console (F12) for the error response body. It should show the error message.

## What to Look For

Common errors:
- "function seed_my_demo_data() does not exist"
- "permission denied"
- "column does not exist"
- SQL syntax error

Share the actual error message and I can fix it!







