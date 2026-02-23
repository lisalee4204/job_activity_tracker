# Data Retention Policy

## Overview

Job search activity data is retained for **1 year (12 months)** from the date of each activity. After the retention period, activities are automatically archived.

## Retention Period

- **Default**: 12 months
- **Configurable**: Users can adjust retention period in settings (if needed)
- **Archive**: Old data is moved to archive table, not deleted
- **Recovery**: Archived data can be restored if needed

## How It Works

### Automatic Archival

1. **Daily Job**: Runs automatically to check for old activities
2. **Cutoff Date**: Activities older than retention period are archived
3. **Archive Table**: Moved to `job_search_activities_archive` table
4. **Preservation**: Archived data includes `archived_at` timestamp

### Manual Archival

Users can also manually archive old data:
- Go to Settings → Data Management
- Click "Archive Old Activities"
- Review what will be archived
- Confirm archival

## Compliance

### Texas Unemployment Requirements

- **Retention**: 1 year minimum (meets Texas requirements)
- **Audit Support**: Archived data available for audit purposes
- **Export**: Can export archived data for unemployment claims

### Data Export

- **Full Export**: Includes all activities (active + archived)
- **Date Range Export**: Export specific time periods
- **Format**: CSV or PDF for easy submission

## User Control

### Settings

- **View Retention Period**: See current retention setting
- **Change Retention**: Adjust retention period (minimum 6 months)
- **Archive Now**: Manually trigger archival
- **Restore Archived**: Restore archived activities if needed

### Data Deletion

- **Delete Account**: Permanently deletes all data (active + archived)
- **Delete Activities**: Soft delete (can be restored for 30 days)
- **Permanent Delete**: After 30 days, soft-deleted items are permanently removed

## Technical Implementation

### Database Tables

- **`job_search_activities`**: Active activities
- **`job_search_activities_archive`**: Archived activities
- **`user_preferences`**: Stores retention period preference

### Archival Process

```sql
-- Automatic archival function
SELECT archive_old_activities();

-- Moves activities older than retention period to archive
-- Preserves all data with archived_at timestamp
```

### Accessing Archived Data

Archived activities are:
- Still accessible via API (with `include_archived=true` parameter)
- Included in full data exports
- Searchable and filterable
- Can be restored if needed

## Best Practices

1. **Regular Exports**: Export data monthly for backup
2. **Review Before Archive**: Check what will be archived
3. **Keep Exports**: Save exports for unemployment claims
4. **Compliance**: Ensure retention meets your state's requirements

## FAQ

**Q: Can I change the retention period?**
A: Yes, in Settings → Data Management. Minimum is 6 months.

**Q: What happens to archived data?**
A: It's preserved in the archive table and can be restored or exported.

**Q: Can I delete archived data?**
A: Yes, but it's permanent. Use "Delete Account" to remove everything.

**Q: Does archival affect my analytics?**
A: Archived data is excluded from current analytics but included in historical reports.

**Q: How do I restore archived activities?**
A: Go to Settings → Data Management → Restore Archived, select date range, and restore.







