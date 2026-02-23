# Incremental Gmail Imports

## Overview

Incremental imports only fetch new emails since the last import, making subsequent imports faster and avoiding duplicate processing.

## How It Works

### First Import
- User clicks "Import from Gmail"
- Fetches emails from last 7 days (or specified range)
- Stores import history with date range
- Processes all emails

### Subsequent Imports
- Checks `email_import_history` for last successful import
- Uses `date_range_end` from last import as starting point
- Only fetches emails after that date
- Processes only new emails

## Implementation

### Request Parameters

```typescript
{
  daysAgo: 7,        // Fallback if no previous import
  incremental: true  // Enable incremental import (default: true)
}
```

### Logic Flow

```
1. Check if incremental import requested
2. Query email_import_history for last import
3. If found:
   → Use date_range_end + 1 day as start date
   → Only fetch emails after that date
4. If not found:
   → Use daysAgo parameter (full import)
5. Process emails and store import history
```

## Benefits

1. **Faster Imports**: Only processes new emails
2. **Reduced API Calls**: Fewer Gmail API requests
3. **Lower Costs**: Less AI parsing needed
4. **Better UX**: Quicker import times

## User Experience

### First Time
- "Importing emails from last 7 days..."
- Takes longer (processing all emails)

### Subsequent Times
- "Importing new emails since [last import date]..."
- Much faster (only new emails)

## Manual Override

Users can force full import:
```typescript
{
  incremental: false,  // Force full import
  daysAgo: 30         // Import last 30 days
}
```

## Edge Cases

### No Previous Import
- Falls back to `daysAgo` parameter
- Full import for specified range

### Last Import Failed
- Uses last successful import date
- Skips failed imports

### Gap in Imports
- If gap > 30 days, may miss some emails
- Consider warning user or auto-expanding range

## Database Tracking

### email_import_history Table

```sql
- import_date: When import was performed
- date_range_start: Start of email search range
- date_range_end: End of email search range
- status: 'completed' or 'failed'
```

### Query Pattern

```sql
SELECT date_range_end 
FROM email_import_history
WHERE user_id = ? 
  AND status = 'completed'
ORDER BY import_date DESC
LIMIT 1
```

## Future Enhancements

1. **Smart Range Expansion**: If gap detected, expand range automatically
2. **Import Scheduling**: Auto-import weekly/daily
3. **Conflict Detection**: Detect if emails were deleted from Gmail
4. **Import Preview**: Show how many emails will be imported before processing







