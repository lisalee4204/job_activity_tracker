# Texas Unemployment Insurance - Job Search Activity Requirements

## Research Needed

Based on your requirement for 6 months retention, we need to verify Texas-specific requirements. Here's what to research:

### Key Questions to Answer:

1. **Retention Period**: How long must job seekers retain their job search activity logs?
   - Typically: 1-2 years after claim ends
   - Need to verify Texas-specific requirement

2. **Required Information**: What specific information must be logged?
   - Date of contact
   - Company name
   - Job title/position
   - Method of contact
   - Result/response received
   - Contact person (if applicable)

3. **Weekly Requirements**: 
   - Minimum activities per week (you mentioned 5)
   - Types of activities that count
   - Documentation requirements

4. **Audit Process**:
   - How often are audits conducted?
   - What format is required for submission?
   - Can digital records be used?

### Recommended Implementation

Based on standard unemployment requirements:

#### Data Retention Policy
```sql
-- Add retention policy configuration
ALTER TABLE user_preferences ADD COLUMN data_retention_months INTEGER DEFAULT 24;

-- Archive old data instead of deleting
CREATE TABLE job_search_activities_archive (
  -- Same structure as job_search_activities
  -- Add archived_at timestamp
);
```

#### Compliance Features
1. **Export for Audit**: Generate formatted report matching state requirements
2. **Retention Warnings**: Notify users before data is archived
3. **Compliance Mode**: Special view showing only required fields
4. **Weekly Compliance Check**: Flag weeks that don't meet minimum requirements

### Next Steps

1. Research Texas Workforce Commission requirements
2. Contact TWC for clarification on:
   - Digital record acceptance
   - Specific format requirements
   - Retention period
3. Implement compliance features based on findings

### Resources

- Texas Workforce Commission: https://www.twc.texas.gov/
- Unemployment Benefits: https://www.twc.texas.gov/jobseekers/unemployment-benefits-services
- Work Search Requirements: Check TWC website for current requirements







