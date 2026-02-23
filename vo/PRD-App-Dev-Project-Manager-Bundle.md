# PRD: App Development Project Manager Bundle
## by Journey Analytics | Etsy Digital Product

---

## 1. Product Overview

An Etsy digital download bundle that walks a solopreneur through every step of building and launching an app - from initial idea validation to App Store/production launch. Modeled after the successful **Job Search Activity Tracker Bundle**, this is a project management tool custom-built for solo app developers with prebuilt tasks, an interactive dashboard, and analytics insights.

**Target Customer:** Solopreneurs, indie hackers, bootcamp grads, career switchers, and first-time app builders who need structured guidance from idea to launch.

**Problem:** Solo developers either (a) use generic PM tools like Trello/Notion that require setup from scratch, (b) skip project management entirely and get lost mid-build, or (c) don't know the full scope of what "launching an app" actually requires.

**Solution:** A pre-populated, opinionated project management bundle with every phase, milestone, and task already mapped out - plus analytics to track progress and identify bottlenecks.

---

## 2. Bundle Contents (Etsy Digital Download)

| # | Product | Format | Description |
|---|---------|--------|-------------|
| 1 | **Web App** | Vercel-hosted Next.js app | Interactive dashboard with prebuilt phases/tasks, progress tracking, analytics, and timeline |
| 2 | **Google Sheets Template** | Google Sheets (copy link) | Full spreadsheet version with formulas, charts, Gantt-style timeline |
| 3 | **Excel Template** | .xlsx file | Offline version of the spreadsheet for Microsoft Excel |
| 4 | **Printable Project Roadmap** | PDF | Visual one-page roadmap poster showing all phases from idea to launch |
| 5 | **Printable Weekly Sprint Planner** | PDF | Weekly planning sheet with task slots, blockers, and reflection |
| 6 | **Quick Start Guide** | PDF + live web page (`/quick-start`) | Bundle README with QR code, links, setup instructions, and disclaimer |

---

## 3. Brand Identity

Consistent with the existing Journey Analytics Etsy shop.

### Color Palette (5 colors max)
| Name | Hex | Usage |
|------|-----|-------|
| Forest Green | `#3A6B5A` | Primary brand, headers, CTAs, active states |
| Sand | `#D9C9A8` | Secondary backgrounds, borders, inactive states |
| Warm Brown | `#B36B47` | Accents, warnings, milestone markers |
| Dark Espresso | `#2C2622` | Text, dark backgrounds |
| Light Sage | `#5A9B8A` | Secondary green, progress bars, success states |

### Typography
- **Headings:** Geist (font-sans)
- **Body:** Geist (font-sans)
- **Mono/Code:** Geist Mono (font-mono)

### Design Tokens
Use shadcn/ui design tokens. No direct colors like `text-white` or `bg-black`. Everything themed via CSS variables in `globals.css`.

---

## 4. Web App Architecture

### Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4 + shadcn/ui components
- **Charts:** Recharts via shadcn/ui chart components
- **Data Storage:** localStorage (no backend/auth required - buyer owns their data locally)
- **Data Format:** JSON in localStorage with versioned schema key
- **Export:** CSV + JSON export/import

### Data Model

```typescript
interface Project {
  id: string
  name: string
  description: string
  startDate: string | null
  targetLaunchDate: string | null
  createdAt: string
}

interface Phase {
  id: string
  name: string
  order: number
  description: string
  color: string // hex color for the phase
}

interface Task {
  id: string
  phaseId: string
  title: string
  description: string
  status: "Not Started" | "In Progress" | "Blocked" | "Complete" | "Skipped"
  priority: "Low" | "Medium" | "High" | "Critical"
  estimatedHours: number | null
  actualHours: number | null
  dueDate: string | null
  completedDate: string | null
  notes: string
  order: number
  subtasks: Subtask[]
}

interface Subtask {
  id: string
  title: string
  completed: boolean
}

interface WeeklyLog {
  id: string
  weekStartDate: string
  tasksCompleted: number
  hoursWorked: number
  blockers: string
  wins: string
  nextWeekGoals: string
}
```

### Prebuilt Phases & Tasks (Demo Data)

The app ships preloaded with a complete app development lifecycle. Every phase has 5-10 prebuilt tasks with descriptions explaining what each task involves and why it matters.

#### Phase 1: Idea Validation & Research
- Define the problem statement
- Identify target user persona
- Research competitors (list 5+ competitors)
- Validate demand (surveys, Reddit, communities)
- Define unique value proposition (UVP)
- Decide: MVP features vs. nice-to-haves
- Write one-paragraph product pitch

#### Phase 2: Planning & Scoping
- Define MVP feature list (max 3-5 core features)
- Choose tech stack (frontend, backend, database, hosting)
- Wireframe key screens (hand sketch or Figma)
- Define data model / database schema
- Map user flows (signup, core action, payment)
- Set project timeline with milestones
- Estimate costs (hosting, domains, APIs, tools)

#### Phase 3: Design & Prototyping
- Design brand identity (logo, colors, fonts)
- Create high-fidelity mockups for key screens
- Design responsive layouts (mobile + desktop)
- Build clickable prototype (optional)
- Get feedback from 3-5 target users
- Finalize design system / component library
- Plan onboarding / first-time user experience

#### Phase 4: Development - Foundation
- Set up development environment
- Initialize project repo (Git + GitHub)
- Set up CI/CD pipeline (Vercel, Netlify, etc.)
- Build authentication system
- Build database schema and seed data
- Set up environment variables and secrets
- Configure error tracking (Sentry, etc.)

#### Phase 5: Development - Core Features
- Build core feature #1
- Build core feature #2
- Build core feature #3
- Integrate third-party APIs (if applicable)
- Build admin panel / dashboard (if applicable)
- Implement responsive design
- Write unit tests for critical paths

#### Phase 6: Testing & QA
- Manual testing of all user flows
- Cross-browser testing (Chrome, Firefox, Safari)
- Mobile responsiveness testing
- Performance audit (Lighthouse)
- Accessibility audit (a11y)
- Security review (auth, inputs, API keys)
- Fix all P0/P1 bugs

#### Phase 7: Pre-Launch
- Set up production environment
- Configure custom domain + SSL
- Set up analytics (Vercel Analytics, GA, etc.)
- Create landing page / marketing site
- Write launch copy (App Store description, social posts)
- Set up email collection / waitlist
- Create demo video or screenshots
- Prepare launch channels (Product Hunt, Reddit, Twitter/X, Hacker News)

#### Phase 8: Launch
- Deploy to production
- Submit to App Store / Product Hunt (if applicable)
- Announce on social media channels
- Send to waitlist / email list
- Post in relevant communities
- Monitor for critical bugs (24-48 hrs)
- Respond to initial user feedback

#### Phase 9: Post-Launch & Growth
- Analyze first-week analytics
- Collect and prioritize user feedback
- Fix post-launch bugs
- Plan v1.1 feature updates
- Set up customer support workflow
- Track key metrics (DAU, retention, conversion)
- Write retrospective: what went well, what to improve

### Tab Structure (4 tabs)

| Tab | Mobile Label | Desktop Label | Icon | Description |
|-----|-------------|---------------|------|-------------|
| 1 | Info | Read Me First | FileText | Welcome guide, how to use the tracker |
| 2 | Tasks | Task Board | ListTodo | Main task list grouped by phase, add/edit/complete tasks |
| 3 | Dashboard | Dashboard | LayoutDashboard | Progress analytics, charts, phase completion, timeline |
| 4 | Planner | Weekly Planner | Calendar | Weekly sprint log with hours, blockers, wins |

### Tab 1: Read Me First
Same concept as Job Tracker - explains how to use the tool, how to clear demo data and start fresh, tips for solo app development.

### Tab 2: Task Board
- **View modes:** List view (default) and Kanban board (toggle)
- **Grouped by Phase:** Collapsible sections for each phase
- **Task row shows:** Status badge, priority badge, title, estimated hours, due date, subtask count
- **Filtering:** By phase, status, priority
- **Sorting:** By phase order, due date, priority, status
- **Bulk actions:** Mark phase complete, skip remaining tasks
- **Add Task:** Form dialog with all fields (same pattern as Job Tracker's job form)
- **Edit Task:** Click to open same dialog prepopulated
- **Subtasks:** Expandable checklist within each task

### Tab 3: Dashboard
**Top metrics row (5 cards):**
| Metric | Calculation |
|--------|-------------|
| Overall Progress | (completed tasks / total tasks) * 100% |
| Current Phase | Name of the earliest incomplete phase |
| Tasks Completed | Count of completed tasks |
| Hours Logged | Sum of actual hours |
| Days to Launch | Target launch date - today |

**Charts:**
| Chart | Type | Description |
|-------|------|-------------|
| Phase Completion | Horizontal stacked bar | Each phase shows completed vs remaining tasks |
| Weekly Velocity | Line chart | Tasks completed per week over time |
| Time by Phase | Pie/donut chart | Actual hours distributed across phases |
| Burndown | Line chart | Remaining tasks over time vs ideal line |
| Task Status Distribution | Stacked bar | Not Started / In Progress / Blocked / Complete / Skipped |
| Priority Breakdown | Bar chart | Tasks by priority level |

**Insights section (dynamic text):**
- "You've completed X% of Phase Y - keep going!"
- "You have Z blocked tasks - review them to unblock progress"
- "At your current pace, you'll finish in N weeks"
- "Your most productive phase was X (Y hours)"

### Tab 4: Weekly Planner
- Weekly log entries with: week start date, tasks completed count, hours worked, blockers (text), wins (text), next week goals (text)
- Display as a timeline / journal view
- Add new weekly entry via form dialog
- Summary stats: average tasks/week, average hours/week, total weeks logged

### Header
- App name: "App Dev Project Manager" with Journey Analytics branding
- Three-dot menu (same as Job Tracker): Clear All Data, Load Demo Data, Export (CSV/JSON), Import (JSON)
- Settings gear: Edit project name, target launch date, start date

### Key UX Patterns (Matching Job Tracker)
- **localStorage with versioned key** (e.g., `app-dev-pm-data-v1`)
- **Demo data preloaded** on first visit
- **SWR or custom hook** (`useProjectData`) for data management across tabs
- **Export/Import** for data portability
- **Mobile-first responsive design**
- **Print styles** on all printable pages

---

## 5. Google Sheets / Excel Template

### Sheet Tabs
| Tab | Description |
|-----|-------------|
| Dashboard | Summary metrics, phase progress bars, charts |
| Task List | All tasks in a flat table with columns matching the web app data model |
| Weekly Log | Weekly sprint entries |
| Settings | Project name, start date, target launch date, config |
| Phases | Reference table of all phases with colors |

### Key Formulas
- `=COUNTIFS(TaskList!Status, "Complete")` for progress
- `=SUMIFS(TaskList!ActualHours, TaskList!Phase, "Development")` for time by phase
- Conditional formatting on status columns (color-coded badges)
- Auto-calculated progress percentages per phase
- Gantt-style timeline using conditional formatting (horizontal bars)

---

## 6. Printable PDFs

### Printable Project Roadmap (1 page, landscape)
- Visual flow from Phase 1 to Phase 9
- Each phase as a card/node with name, task count, and key milestone
- Progress checkboxes next to each phase
- Clean, poster-style design suitable for pinning above desk
- Journey Analytics branding + disclaimer at bottom

### Printable Weekly Sprint Planner (1 page, portrait)
- **Top:** Week of _____, Project Name _____
- **This Week's Goals:** 5 checkbox lines
- **Tasks to Complete:** Table with columns: Task, Phase, Priority, Est. Hours, Done checkbox
- **Blockers / Risks:** 3 lines
- **Hours Logged This Week:** Mon-Sun boxes
- **Wins / Progress Notes:** 3 lines
- **Next Week Preview:** 3 lines
- Journey Analytics branding + disclaimer at bottom

### Quick Start Guide (2-3 pages, portrait, same format as Job Tracker)
- Page 1: Title + What's Included (4 cards with QR code on web app card) + Quick Start steps
- Page 2: Feature Highlights (2-col) + Tips for Solo App Development + Status Guide
- Footer: Disclaimer + Journey Analytics branding
- Print-optimized with `@page` rules, `break-inside: avoid`, compact print classes

---

## 7. Disclaimer Text

"This template is designed to help organize your app development project. It is not professional project management advice. Timelines and task lists are suggestions and should be customized to your specific project. Users are responsible for their own technical and business decisions."

---

## 8. URLs & Links

| Asset | URL |
|-------|-----|
| Web App | TBD (Vercel deploy) |
| Google Sheets | TBD (Google Sheets /copy link) |
| QR Code | Points to TinyURL redirect to web app |
| Etsy Shop | journeyanalytics.etsy.com |

Short URLs via TinyURL (not Bitly - Bitly shows interstitial ads).

---

## 9. Development Approach

### Build Order
1. Set up project with globals.css (brand colors, design tokens)
2. Build demo data file with all 9 phases and ~60 prebuilt tasks
3. Build data hook (`useProjectData`) with localStorage persistence
4. Build Tab 2 (Task Board) - this is the core product
5. Build Tab 3 (Dashboard) with charts and insights
6. Build Tab 4 (Weekly Planner)
7. Build Tab 1 (Read Me First)
8. Build Quick Start Guide page (`/quick-start`)
9. Build printable pages (`/printable-roadmap`, `/printable-sprint-planner`)
10. Add export/import functionality
11. Mobile optimization pass
12. Print optimization pass
13. Download printable PDFs, delete printable routes, publish

### Key Patterns to Replicate from Job Tracker
- `lib/demo-data.ts` - All demo data in one file with typed exports
- `hooks/use-job-data.ts` -> `hooks/use-project-data.ts` - Single hook for all CRUD + localStorage
- `lib/export-utils.ts` - CSV and JSON export/import
- `components/job-form-dialog.tsx` -> `components/task-form-dialog.tsx` - Reusable form dialog
- `components/job-log-table.tsx` -> `components/task-board.tsx` - Main data table
- `components/v2-charts.tsx` -> `components/project-charts.tsx` - Dashboard charts
- Status color mapping pattern (status -> hex color)
- Print utility classes (`print:hidden`, `print:text-xs`, etc.)
- Tab structure with mobile/desktop label variants
- Three-dot menu for data management actions

---

## 10. Success Metrics

- Etsy conversion rate comparable to Job Search Tracker
- Positive reviews mentioning "comprehensive" and "easy to follow"
- Web app analytics showing return visitors (buyers using the tool beyond first visit)

---

## 11. Future Bundle Ideas (Same Format)

- Freelance Client Tracker Bundle
- Content Creator Publishing Planner Bundle
- Small Business Launch Checklist Bundle
- Side Hustle Revenue Tracker Bundle

Each follows the same architecture: Web App + Google Sheets + Excel + Printable PDFs + Quick Start Guide.
