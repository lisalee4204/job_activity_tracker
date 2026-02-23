# GDPR Compliance Features

## Overview

The application includes features to comply with GDPR (General Data Protection Regulation) requirements for data protection and user rights.

## Implemented Features

### 1. Data Export (Right to Data Portability)

Users can export all their data in JSON or CSV format:

**Features**:
- Complete data export (all activities, preferences, history)
- CSV export for activities (spreadsheet-friendly)
- JSON export (complete data structure)
- One-click download

**Access**: Settings → Export My Data

**What's Included**:
- All job search activities
- User preferences and settings
- Email import history
- Custom activity types
- Recent audit logs (last 1000 entries)

### 2. Account Deletion (Right to Erasure)

Users can permanently delete their account and all associated data:

**Features**:
- Complete data deletion
- Confirmation required (type "DELETE")
- Permanent removal (cannot be undone)
- Automatic logout after deletion

**Access**: Settings → Delete Account

**What Gets Deleted**:
- All job search activities (active + archived)
- User preferences
- Gmail tokens and connection
- Email import history
- Failed parsing queue
- Custom activity types
- Weekly summaries
- AI insights cache
- Audit logs
- User profile
- Auth account

### 3. Data Minimization

- Only collect necessary data
- Optional fields clearly marked
- No unnecessary data collection

### 4. Data Retention

- 1-year retention policy (configurable)
- Automatic archival after retention period
- Users can export before archival

### 5. Security Measures

- Row Level Security (RLS) on all tables
- Encrypted token storage
- Secure authentication
- Input validation

## User Rights Under GDPR

### Right to Access
- ✅ Users can view all their data in the app
- ✅ Export functionality provides complete data access

### Right to Rectification
- ✅ Users can edit/update all their activities
- ✅ Preferences can be modified

### Right to Erasure
- ✅ Complete account deletion available
- ✅ All data permanently removed

### Right to Data Portability
- ✅ Export in machine-readable formats (JSON, CSV)
- ✅ Complete data export

### Right to Object
- ✅ Users can disconnect Gmail integration
- ✅ Can delete individual activities

### Right to Restrict Processing
- ✅ Users can stop using features
- ✅ Can disconnect integrations

## Implementation Details

### Export Function

**Endpoint**: `POST /functions/v1/export-user-data`

**Parameters**:
```json
{
  "format": "json" | "csv"
}
```

**Response**: File download (JSON or CSV)

### Deletion Function

**Endpoint**: `POST /functions/v1/delete-user-account`

**Parameters**:
```json
{
  "confirm": "DELETE"
}
```

**Process**:
1. Validates confirmation
2. Deletes all user data (in order)
3. Deletes auth account
4. Logs deletion event
5. Logs out user

## Privacy Policy Requirements

Your privacy policy should include:

1. **Data Collection**: What data is collected and why
2. **Data Usage**: How data is used
3. **Data Storage**: Where data is stored (Supabase)
4. **Data Retention**: 1-year retention policy
5. **User Rights**: How to exercise GDPR rights
6. **Contact**: How to contact for data requests

## Compliance Checklist

- [x] Data export functionality
- [x] Account deletion functionality
- [x] Data retention policy
- [x] Security measures (encryption, RLS)
- [x] User consent for data collection
- [ ] Privacy policy document (you need to create)
- [ ] Terms of service document (you need to create)
- [ ] Cookie consent (if using cookies)
- [ ] Data processing agreement with Supabase

## Next Steps

1. **Create Privacy Policy**: Document data collection and usage
2. **Create Terms of Service**: Legal terms for app usage
3. **Add Privacy Policy Link**: In footer and signup page
4. **Cookie Consent**: If using analytics cookies
5. **Data Processing Agreement**: With Supabase (check their GDPR compliance)

## Notes

- Supabase is GDPR compliant
- Data is stored in EU/US (depending on Supabase region)
- Encryption at rest and in transit
- Regular backups (Supabase handles)

## User Instructions

### How to Export Data

1. Go to Settings
2. Click "Export My Data"
3. Choose format (JSON or CSV)
4. Click "Export Data"
5. File downloads automatically

### How to Delete Account

1. Go to Settings
2. Scroll to "Danger Zone"
3. Click "Delete Account"
4. Type "DELETE" to confirm
5. Click "Delete Account"
6. Account and all data permanently deleted







