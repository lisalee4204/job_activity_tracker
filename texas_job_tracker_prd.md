# Product Requirements Document (PRD)
## Texas Job Search Tracker - Excel Template

**Product Name:** Journey Analytics Texas Job Search Tracker  
**Version:** 1.0  
**Last Updated:** February 4, 2026  
**Author:** Journey Analytics

---

## 1. Overview

### 1.1 Purpose
A TWC-compliant Excel spreadsheet that helps Texas unemployment benefit recipients track their job search activities, meet weekly work search requirements, and maintain audit-ready records throughout their benefit year.

### 1.2 Target Users
- Texas residents receiving unemployment insurance (UI) benefits
- Job seekers who need to document work search activities for TWC compliance
- Career coaches and workforce development professionals supporting clients

### 1.3 Problem Statement
Texas Workforce Commission (TWC) requires unemployment benefit recipients to complete a minimum number of work search activities each week and maintain detailed records subject to audit. Most job seekers use inconsistent tracking methods, risking benefit denial or overpayment recovery if audited.

---

## 2. Core Features

### 2.1 Dashboard (KPI Cards)
| Metric | Description | Formula-Driven |
|--------|-------------|----------------|
| This Week | Count of activities logged in current week | ✓ |
| Weekly Goal | Progress toward weekly requirement (X/Y format) | ✓ |
| Total Activities | Cumulative count of all logged activities | ✓ |
| Interviews | Count of interview-type activities | ✓ |
| Response Rate | % of applications that received any response | ✓ |

### 2.2 Information Panels

**Weekly Totals (TWC)**
- Displays last 4 weeks of activity counts
- Supports biweekly UI certification reporting
- Color-coded: green (goal met) / terracotta (below goal)

**Insights**
- Best responding industry with response rate
- Remote positions response rate
- Applications this month

**Salary Compliance (TWC)**
- UI claim start date
- Weeks on unemployment
- Minimum acceptable wage (90% first 8 weeks, 75% thereafter)
- Count of applications below wage threshold

### 2.3 Analytics Charts
1. **Weekly Activity Trend** - Line chart showing 12-week history
2. **Activities by Type** - Horizontal bar chart of TWC activity categories
3. **Response Rate by Industry** - Horizontal bar chart
4. **Response Rate by Job Level** - Horizontal bar chart

### 2.4 Activity Log
Full data entry table with dropdown validations for standardized data entry.

---

## 3. Activity Types (TWC-Compliant)

The following activity types align with Texas Workforce Commission acceptable work search activities:

| Activity Type | TWC Category | Description |
|---------------|--------------|-------------|
| **Job Application - Online** | Applying for work | Submitting application through online job portal, company website, or email |
| **Job Application - In Person** | Applying for work | Delivering resume/application in person to employer |
| **Interview - Phone/Video** | Job interview | Remote interview via phone or video conference |
| **Interview - In Person** | Job interview | Face-to-face interview at employer location |
| **Job Fair** | Attending job fair | Career fair, hiring event, or employer showcase |
| **Networking Event** | Networking | Professional association meeting, industry event, or structured networking |
| **Workforce Solutions Visit** | Registering/reporting | In-person visit to local Workforce Solutions office |
| **Met with Workforce Rep** | Registering/reporting | Meeting with TWC representative or career counselor |
| **Skills Training/Course** | Approved training | Completing job-related training, certification, or coursework |
| **Resume/Profile Update** | Work search preparation | Updating resume, LinkedIn profile, or online job profiles |
| **Recruiter Contact** | Applying for work | Direct contact with staffing agency or recruiter |
| **LinkedIn Outreach** | Networking | Professional outreach via LinkedIn for job opportunities |
| **Other** | Other approved activity | Any other TWC-approved work search activity |

### 3.1 Activity Type Validation Rules
- Each activity must have exactly ONE activity type selected
- Activity type is required for all entries
- Dropdown list enforces standardized entries for accurate reporting

### 3.2 Activity Type Groupings (for Charts)
| Chart Category | Includes Activity Types |
|----------------|------------------------|
| Online Apps | Job Application - Online |
| In-Person Apps | Job Application - In Person |
| Interviews | Interview - Phone/Video, Interview - In Person |
| Job Fair | Job Fair |
| Networking | Networking Event, LinkedIn Outreach |
| Workforce Svcs | Workforce Solutions Visit, Met with Workforce Rep |
| Training | Skills Training/Course |
| Resume Update | Resume/Profile Update |
| Recruiter | Recruiter Contact |

---

## 4. Data Fields

### 4.1 Required Fields (TWC Compliance)
| Field | Type | Description |
|-------|------|-------------|
| Date | Date | Date activity was completed |
| Company | Text | Employer or organization name |
| Activity Type | Dropdown | Type of work search activity (see Section 3) |
| Contact Person | Text | Name of person contacted (if applicable) |
| Contact Method | Dropdown | How contact was made |
| Result | Dropdown | Outcome of the activity |

### 4.2 Optional Fields (Analytics & Tracking)
| Field | Type | Description |
|-------|------|-------------|
| Job Title | Text | Position applied for or discussed |
| Industry | Dropdown | Industry sector |
| Job Level | Dropdown | Seniority level (Entry, Mid, Senior, Director, VP+) |
| Emp Type | Dropdown | Employment type (Full-time, Part-time, Contract, etc.) |
| Remote | Dropdown | Work location (Remote, Hybrid, On-site) |
| Location | Text | Job location (city, state) |
| Salary Min | Currency | Minimum salary for position |
| Salary Max | Currency | Maximum salary for position |
| Job URL | URL | Link to job posting |
| Contact Info | Text | Email or phone of contact |
| Stage | Dropdown | Application stage in pipeline |
| Notes | Text | Additional notes |

### 4.3 Dropdown Options

**Industry**
- Tech, Healthcare, Finance, Nonprofit, Government, Consulting, Retail, Manufacturing, Education, Other

**Job Level**
- Entry, Mid, Senior, Director, VP+, C-Suite

**Employment Type**
- Full-time, Part-time, Contract, Contract-to-Hire, Freelance

**Remote Status**
- Remote, Hybrid, On-site

**Contact Method**
- Email, Phone, LinkedIn, In Person, Job Portal, Mail, Other

**Result**
- Application Submitted, Resume Sent, Interview Scheduled, Assessment Received, Offer Received, Hired, Not Selected, No Response, Pending, Withdrew, Other

**Stage**
- Applied, Assessment, HR Screen, Hiring Manager, Final Round, Offer, Rejected, Withdrawn

---

## 5. Settings Sheet

User-configurable settings that drive dashboard calculations:

| Setting | Default | Description |
|---------|---------|-------------|
| Weekly Activity Goal | 3 | Minimum activities required per week (varies by county) |
| UI Claim Start Date | (user enters) | First day of unemployment claim |
| Prior Annual Salary | (user enters) | Last annual salary before unemployment |
| Previous Job Title | (user enters) | Most recent job title (benchmark for targeting) |
| Your State | Texas | State for compliance rules |

---

## 6. TWC Compliance Features

### 6.1 Weekly Goal Tracking
- Default goal: 3 activities/week (configurable based on county requirements)
- Visual indicator when goal is met vs. shortfall
- 4-week rolling view for biweekly certification

### 6.2 Salary Compliance
- **First 8 weeks:** Must accept jobs paying ≥90% of prior wage
- **After 8 weeks:** Must accept jobs paying ≥75% of prior wage
- Dashboard shows current minimum acceptable wage
- Tracks count of applications below threshold

### 6.3 Audit-Ready Records
- All TWC-required fields available (Date, Employer, Activity, Contact, Result)
- Standardized activity types matching TWC categories
- Print-friendly format available

---

## 7. Formula Dependencies

All dashboard metrics are formula-driven and auto-update when users modify data:

| Cell/Range | Depends On |
|------------|------------|
| This Week (A5) | Activity dates in current week |
| Weekly Goal (D5) | Settings!B3 (goal) + This Week count |
| Total Activities (G5) | Count of non-empty date cells |
| Interviews (J5) | Activity Type containing "Interview" |
| Response Rate (M5) | Result column (excludes "No Response" and "Pending") |
| Salary Compliance | Settings!B5 (UI start), Settings!B9 (prior salary) |
| Chart Data | All pull from Activity Log columns |

---

## 8. File Structure

```
Workbook
├── Job Search Tracker (main sheet)
│   ├── Header (Row 1-2)
│   ├── KPI Cards (Row 3-6)
│   ├── Info Panels (Row 7-13)
│   ├── Charts (Row 14-38)
│   ├── Data Header (Row 40)
│   └── Activity Log (Row 41+)
│
└── Settings
    ├── Weekly Goal
    ├── UI Claim Start Date
    ├── Prior Salary
    ├── Previous Job Title
    └── TWC Requirements Reference
```

---

## 9. Color Palette (Journey Analytics Brand)

| Color | Hex | Usage |
|-------|-----|-------|
| Forest Green | #3A6B5A | Primary headers, positive indicators |
| Forest Light | #4A8B72 | Secondary headers |
| Sand | #D9C9A8 | Panel headers, backgrounds |
| Sand Light | #EBE5D6 | Alternating rows, panel backgrounds |
| Earth Terracotta | #A65D3F | Alerts, negative indicators |
| Honey | #B36B47 | Accent, warnings |
| Charcoal | #2C2622 | Text |
| Warm White | #FAF8F5 | Background |

---

## 10. Future Enhancements (v2.0)

- [ ] Google Sheets version with same functionality
- [ ] Conditional formatting for goal status on weekly totals
- [ ] Auto-populate upcoming interview reminders
- [ ] Export to PDF for TWC submission
- [ ] Multi-state support (California EDD, etc.)

---

## 11. Success Metrics

- Users can accurately track weekly activities
- All formulas calculate correctly when demo data is replaced
- Charts display meaningful data with 10+ activities logged
- Passes TWC audit requirements for record-keeping

---

*© 2026 Journey Analytics. All rights reserved.*
