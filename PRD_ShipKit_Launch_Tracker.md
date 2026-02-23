# PRD: ShipKit (0 → 1 Launch Tracker Bundle)

## Product Overview

**Product Name:** ShipKit (working title) or "Launch Tracker by Journey Analytics"

**One-Liner:** A project tracker built for solo builders - every phase from idea to launch, pre-loaded with tasks, tools, and a dashboard to see your progress.

**Version:** MVP (v1.0)

**Author:** Journey Analytics

**Last Updated:** February 2026

---

## Problem Statement

Generic project management tools (Notion, Trello, Asana) aren't built for solo app builders. They start with a blank page. Builders need a structured, opinionated roadmap with pre-built tasks for every phase of launching an app.

**Current Pain Points:**
- Start with a blank page every time
- Don't know what they don't know (missing critical steps)
- No app-development-specific task templates
- Can't see progress across the full journey
- Lose momentum without structure
- Forget to set up analytics, legal, pre-launch marketing

---

## Target User

### Primary Persona: "First-Time Builder"
- Using Lovable, Cursor, Bolt, or Replit to build
- Building their first web app or mobile app
- Doesn't have a PM background
- Needs guidance on what to do, not just where to track it
- Nights and weekends builder

### Secondary Persona: "Experienced Builder Who Wants Structure"
- Has shipped before but inconsistently
- Wants a repeatable framework
- Skips steps and regrets it later
- Values checklists and accountability

---

## Core Value Proposition

**Stop starting from scratch. Get a pre-loaded launch roadmap with every task, tool recommendation, and progress tracking built in.**

---

## MVP Features

### Feature 1: Project Setup

| Field | Type | Required |
|-------|------|----------|
| Project name | Text | Yes |
| One-liner description | Text | Yes |
| Target launch date | Date picker | Yes |
| Track | Dropdown: Web App / Mobile App | Yes |
| Primary build tool | Dropdown: Lovable / Cursor / Bolt / Replit / v0 / Other | Yes |
| GitHub repo URL | URL | No |

**Track Selection:**
- **Web App Track** → Tasks for Vercel, web hosting, landing pages
- **Mobile App Track** → Tasks for App Store, Play Store, TestFlight, signed builds

---

### Feature 2: Pre-Built Phases (13 Total)

#### Phase 1: Setup & Capture
| Task | Tool Suggestion |
|------|-----------------|
| Create builder hub (docs, notes, research) | Notion, Google Drive, Obsidian |
| Define MVP goal and success metric | - |
| Write problem statement | - |
| Define target user | - |
| Log model versions used (Claude, GPT, etc.) | - |
| Set one KPI per phase | - |

#### Phase 2: Validation & Research
| Task | Tool Suggestion |
|------|-----------------|
| Define target persona | - |
| Conduct 5 user interviews | Zoom, Google Meet |
| Create validation survey | Typeform, Google Forms |
| Collect 20+ survey responses | - |
| Document pain points | - |
| Google Trends analysis | Google Trends |
| Reddit/Twitter sentiment search | - |
| List 3-5 competitors | - |
| Analyze competitor pricing | - |
| Analyze competitor features | - |
| Check Product Hunt for similar products | Product Hunt |
| Make Go/No-Go decision | - |

#### Phase 3: Product Strategy
| Task | Tool Suggestion |
|------|-----------------|
| Write positioning statement | - |
| Define "For whom / Unlike / We" | - |
| List MVP features (Must/Should/Could) | - |
| Prioritize features for v1 | - |
| Define success metrics (Week 1 targets) | - |
| Choose pricing model | - |
| Set price points | - |
| Define free vs paid features | - |
| Identify key differentiator | - |
| Write one-page product brief | - |

#### Phase 4: Legal & Compliance
| Task | Tool Suggestion |
|------|-----------------|
| Register business entity (if needed) | Stripe Atlas, ZenBusiness |
| Create Privacy Policy | Termly, PrivacyPolicies.com |
| Create Terms of Service | Termly, RocketLawyer |
| Audit API/IP compliance | - |
| Check 3rd-party license requirements | - |
| Pay platform fees (Play Store $25, App Store $99) | Google Play Console, App Store Connect |

#### Phase 5: Design & UX
| Task | Tool Suggestion |
|------|-----------------|
| Map user flows | Whimsical, FigJam |
| Create sitemap / screen list | - |
| Define navigation structure | - |
| Create wireframes for key screens | Figma, Whimsical |
| Choose color palette | Coolors |
| Choose typography | Fontpair |
| Design logo (if needed) | Canva, Figma |
| Define tone of voice | - |
| Design high-fidelity screens | Figma |
| Create clickable prototype | Figma |
| Conduct user testing (3-5 users) | Maze, UsabilityHub |
| Incorporate feedback | - |
| Accessibility audit (contrast, font size) | Stark, Lighthouse |
| Mobile responsiveness check | - |

#### Phase 6: Technical Planning
| Task | Tool Suggestion |
|------|-----------------|
| Choose frontend framework | React, Next.js, etc. |
| Choose backend/database | Supabase, Firebase |
| Choose hosting platform | Vercel, Netlify |
| Choose auth solution | Supabase Auth, Clerk |
| Choose payment processor | Stripe, Lemon Squeezy |
| Choose analytics platform | PostHog, Mixpanel |
| Choose error tracking | Sentry |
| Define data model / schema | - |
| Create GitHub repo | GitHub |
| Set up branching strategy | - |
| Document API integrations needed | - |
| Version prompts and dependencies | - |

#### Phase 7: Build
| Task | Tool Suggestion |
|------|-----------------|
| Set up development environment | - |
| Build core feature 1 | Lovable, Cursor, Bolt |
| Build core feature 2 | - |
| Build core feature 3 | - |
| Implement authentication | - |
| Implement database | - |
| Connect payment processing | Stripe |
| AI code audit (check for shortcuts, non-scalable patterns) | Claude, GPT |
| Validate UI consistency | - |
| Check copy tone | - |

#### Phase 8: QA & Testing
| Task | Tool Suggestion |
|------|-----------------|
| Smoke test: success paths | - |
| Smoke test: failure paths | - |
| Smoke test: edge cases | - |
| Test on Chrome desktop | - |
| Test on Safari desktop | - |
| Test on Firefox | - |
| Test on iOS mobile | - |
| Test on Android mobile | - |
| Test on tablet | - |
| Scalability test (10-50 users) | - |
| API security audit | - |
| Environment variable hygiene (.env) | - |
| Verify AI outputs for bias/edge cases | - |
| Performance test (Lighthouse) | Lighthouse |
| Beta user testing (3-5 users) | - |
| Document and fix bugs | - |

#### Phase 9: Analytics Setup
| Task | Tool Suggestion |
|------|-----------------|
| Set up product analytics | PostHog, Mixpanel |
| Set up traffic analytics | Google Analytics, Plausible |
| Set up session recording | Hotjar, PostHog |
| Set up error tracking | Sentry |
| Define events to track | - |
| Implement: Sign up event | - |
| Implement: Activation event | - |
| Implement: Core feature used event | - |
| Implement: Upgrade/purchase event | - |
| Create analytics dashboard | - |

#### Phase 10: Pre-Launch
| Task | Tool Suggestion |
|------|-----------------|
| Build landing page | Carrd, Lovable, Framer |
| Write headline and subhead | - |
| Add feature highlights | - |
| Add screenshots/demo | - |
| Add pricing section | - |
| Add CTA (signup/waitlist) | - |
| Add social proof (if any) | - |
| Set up SEO meta tags | - |
| Create OG image for social sharing | Canva |
| Set up privacy policy page | - |
| Set up terms of service page | - |
| Set up cookie consent | - |
| Create welcome email | Resend, Mailchimp |
| Create onboarding email sequence | - |
| Set up transactional emails | - |
| Test Stripe in live mode | Stripe |
| Create app store listing (mobile) | Play Console, App Store Connect |
| Generate signed build (mobile) | Android Studio, Expo |
| Create store screenshots | - |
| Create preview video (15-30 sec) | CapCut, Descript |
| Draft launch tweets/posts | - |
| Draft email to network | - |
| Prepare Product Hunt assets (if using) | Product Hunt |

#### Phase 11: Launch
| Task | Tool Suggestion |
|------|-----------------|
| Final smoke test | - |
| Verify payments working | - |
| Verify analytics tracking | - |
| Verify error tracking | - |
| Set up support email | - |
| Launch on primary platform | - |
| Post on Product Hunt | Product Hunt |
| Post on Twitter/X | - |
| Post on LinkedIn | - |
| Post on Reddit (relevant subs) | - |
| Post on Indie Hackers | Indie Hackers |
| Post on Hacker News (if relevant) | - |
| Email your network | - |
| Monitor for issues (first 24 hrs) | - |

#### Phase 12: Post-Launch
| Task | Tool Suggestion |
|------|-----------------|
| Review Week 1 metrics vs targets | - |
| Collect user feedback | Google Forms, Typeform |
| Categorize feedback by theme | - |
| Respond to support requests | - |
| Create FAQ / help doc | Notion, Loom |
| Fix critical bugs | - |
| Document lessons learned | - |
| Run retrospective | - |
| Plan iteration backlog | - |
| Write "build in public" update | Twitter, LinkedIn |

#### Phase 13: Growth & Scale
| Task | Tool Suggestion |
|------|-----------------|
| Enable crash monitoring | Crashlytics, Sentry |
| Analyze retention metrics | - |
| Analyze activation funnel | - |
| Test monetization tweaks | - |
| Plan technical debt sprint | - |
| Refactor repetitive code | - |
| Remove debug artifacts | - |
| Test project portability | - |
| Plan v2 features | - |
| Re-evaluate KPIs | - |

**Total: ~130 pre-loaded tasks**

---

### Feature 3: Task Structure

Each task includes:

| Field | Type | Description |
|-------|------|-------------|
| Task name | Text | Pre-filled, editable |
| Status | Dropdown | To Do / In Progress / Done / Skipped |
| Tool suggestion | Text | Recommended tool (pre-filled) |
| Link | URL | Link to resource (Figma file, GitHub, etc.) |
| Notes | Text | User notes |
| Blocked | Toggle + Text | Mark as blocked with reason |
| Phase | Auto | Which phase it belongs to |

---

### Feature 4: Dashboard

| Metric | Display Type |
|--------|--------------|
| Project name | Header |
| One-liner | Subheader |
| Current phase | Highlighted badge |
| Days since kickoff | Counter |
| Days until target launch | Countdown (red if overdue) |
| Overall progress | Percentage + progress bar |
| Tasks complete | X / Y total |
| Tasks in current phase | X / Y |
| Open blockers | Count (red badge if > 0) |
| Phase progress | Mini progress bar per phase |
| Launch readiness score | 0-100 score |
| Tools used | Tag cloud |

**Launch Readiness Score Calculation:**
```
Weighted completion of critical tasks:
- Legal & Compliance: 15%
- Core Build: 25%
- Testing: 20%
- Analytics: 10%
- Pre-Launch: 20%
- Launch prep: 10%
```

---

### Feature 5: Build Journal

| Field | Type |
|-------|------|
| Date | Auto-filled |
| Session title | Text |
| What I worked on | Text (multi-line) |
| Tool used | Dropdown |
| Time spent | Number (optional) |
| Wins | Text |
| Blockers encountered | Text |
| Mood | Emoji picker (optional) |

**Purpose:** Track your build journey, identify patterns, create "build in public" content.

---

### Feature 6: Blocker Log

| Field | Type |
|-------|------|
| Blocker description | Text |
| Related task | Dropdown |
| Date raised | Auto |
| Severity | Low / Medium / High / Critical |
| Status | Open / Resolved |
| Resolution notes | Text |
| Date resolved | Auto when status = Resolved |

---

### Feature 7: Tool Logger

Track which tools you're using:

| Tool | Category | Notes |
|------|----------|-------|
| Lovable | Build | Primary UI |
| Cursor | Build | Code editing |
| Claude | AI | Debugging, copy |
| Figma | Design | - |
| Supabase | Backend | - |
| Vercel | Hosting | - |
| Custom... | - | - |

---

### Feature 8: Export & Share

| Export Option | Format |
|---------------|--------|
| Progress summary | PDF |
| Full task list | CSV / Markdown |
| Build journal | Markdown |
| "Build in public" update | Pre-formatted for Twitter/LinkedIn |
| Shareable progress link | Public URL (optional) |

**Build in Public Generator:**
```
🚀 Day 14 of building [Project Name]

✅ Completed this week:
- Finished user authentication
- Built dashboard UI
- Connected Stripe

📊 Progress: 65% complete
🎯 Target launch: March 1

🔥 Biggest win: Got first beta user feedback!
😤 Biggest blocker: Supabase RLS policies

#buildinpublic #indiehacker
```

---

## Out of Scope (v2+)

| Feature | Version |
|---------|---------|
| AI chat assistant ("What should I do next?") | v2 |
| AI-generated task suggestions | v2 |
| GitHub integration (auto-log commits) | v2 |
| Vercel integration (deploy status) | v2 |
| Multiple projects | v2 |
| Team collaboration | v2 |
| Stripe/revenue dashboard | v2 |
| Prompt vault (save prompts that worked) | v2 |
| Time tracking with charts | v2 |
| Integration with ShipOrSkip (Idea Validator) | v2 |

---

## Technical Architecture

### Tech Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Frontend | React / Next.js | Built with v0, fast iteration |
| Hosting | Vercel | Free tier, instant deploys |
| Database | Supabase | Postgres, auth, real-time |
| Auth | Supabase Auth | Simple, free tier |
| Storage | Supabase | Store projects, journals |

### Data Model

```sql
-- Users
users (
  id UUID PRIMARY KEY,
  email TEXT,
  created_at TIMESTAMP
)

-- Projects
projects (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users,
  name TEXT,
  one_liner TEXT,
  target_launch_date DATE,
  track TEXT, -- 'web' or 'mobile'
  primary_tool TEXT,
  github_url TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Tasks
tasks (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects,
  phase INTEGER,
  name TEXT,
  status TEXT, -- 'todo', 'in_progress', 'done', 'skipped'
  tool_suggestion TEXT,
  link TEXT,
  notes TEXT,
  is_blocked BOOLEAN,
  blocked_reason TEXT,
  order_index INTEGER,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Journal Entries
journal_entries (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects,
  title TEXT,
  content TEXT,
  tool_used TEXT,
  time_spent INTEGER,
  wins TEXT,
  blockers TEXT,
  mood TEXT,
  created_at TIMESTAMP
)

-- Blockers
blockers (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects,
  task_id UUID REFERENCES tasks,
  description TEXT,
  severity TEXT,
  status TEXT, -- 'open', 'resolved'
  resolution TEXT,
  created_at TIMESTAMP,
  resolved_at TIMESTAMP
)

-- Tools Used
tools_used (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects,
  name TEXT,
  category TEXT,
  notes TEXT
)
```

---

## User Interface

### Screen 1: Home / Projects List

```
┌─────────────────────────────────────────────────┐
│  🚀 ShipKit                        [+ New Project]│
│  ─────────────────────────────────────────────  │
│                                                 │
│  Your Projects                                  │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │ 📱 PokerSense                           │    │
│  │    Mobile App • 72% complete            │    │
│  │    Target: Feb 15 (8 days left)         │    │
│  │    [Open →]                             │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │ 💼 Job Search Tracker                   │    │
│  │    Web App • 100% complete ✅           │    │
│  │    Launched: Feb 1                      │    │
│  │    [Open →]                             │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Screen 2: Dashboard

```
┌─────────────────────────────────────────────────┐
│  📱 PokerSense                    [Settings ⚙️]  │
│  AI-powered poker hand analysis                │
│  ─────────────────────────────────────────────  │
│                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │ Day 23   │ │ 8 days   │ │ 72%      │        │
│  │ building │ │ to launch│ │ complete │        │
│  └──────────┘ └──────────┘ └──────────┘        │
│                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │ 94/130   │ │ 2        │ │ 78/100   │        │
│  │ tasks ✓  │ │ blockers │ │ ready    │        │
│  └──────────┘ └──────────┘ └──────────┘        │
│                                                 │
│  📍 Current Phase: Build (Phase 7)             │
│  ████████████████████░░░░░░░░░░ 65%            │
│                                                 │
│  Phase Progress:                               │
│  1. Setup      ████████████████████ 100%       │
│  2. Validation ████████████████████ 100%       │
│  3. Strategy   ████████████████████ 100%       │
│  4. Legal      ████████████████████ 100%       │
│  5. Design     ████████████████████ 100%       │
│  6. Tech Plan  ████████████████████ 100%       │
│  7. Build      █████████████░░░░░░░ 65%  ← YOU │
│  8. Testing    ░░░░░░░░░░░░░░░░░░░░ 0%         │
│  ...                                           │
│                                                 │
│  [View All Tasks]  [Journal]  [Blockers]       │
└─────────────────────────────────────────────────┘
```

### Screen 3: Phase / Task View

```
┌─────────────────────────────────────────────────┐
│  Phase 7: Build                    [← Dashboard] │
│  ─────────────────────────────────────────────  │
│  Progress: 5/8 tasks complete                   │
│  ████████████████████████░░░░░░░░ 62%          │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │ ✅ Set up development environment       │    │
│  │    Tool: Cursor                         │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │ ✅ Build core feature 1 (hand input)    │    │
│  │    Tool: Lovable                        │    │
│  │    Link: lovable.dev/project/xyz        │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │ 🔄 Build core feature 2 (analysis)      │    │
│  │    Status: In Progress                  │    │
│  │    Tool: Cursor                         │    │
│  │    ⚠️ BLOCKED: API rate limits          │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │ ○ Build core feature 3 (history)        │    │
│  │    Tool suggestion: Lovable             │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  [+ Add Custom Task]                           │
└─────────────────────────────────────────────────┘
```

### Screen 4: Build Journal

```
┌─────────────────────────────────────────────────┐
│  📓 Build Journal                  [+ New Entry] │
│  ─────────────────────────────────────────────  │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │ Feb 7, 2026 • 2.5 hours                 │    │
│  │ "Finally got hand analysis working"     │    │
│  │                                         │    │
│  │ Worked on: Connected Claude API for     │    │
│  │ hand analysis. Took forever to get      │    │
│  │ the prompt right.                       │    │
│  │                                         │    │
│  │ 🏆 Win: Analysis accuracy is 90%+       │    │
│  │ 😤 Blocker: API costs higher than       │    │
│  │    expected                             │    │
│  │                                         │    │
│  │ Tool: Cursor                            │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │ Feb 6, 2026 • 1 hour                    │    │
│  │ "UI polish day"                         │    │
│  │ ...                                     │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  [Export Journal]  [Generate "Build in Public"] │
└─────────────────────────────────────────────────┘
```

---

## Bundle Offering

Like the Job Search Tracker, offer multiple formats:

| Format | What's Included |
|--------|-----------------|
| **Web App** | Full interactive tracker |
| **Google Sheets** | Spreadsheet version with all phases/tasks |
| **Excel (.xlsx)** | Offline spreadsheet version |
| **Printable PDF** | Checklist version (like your existing PDF) |
| **Quick Start Guide** | How to use everything |

---

## Success Metrics

### MVP Launch Targets (First 30 Days)

| Metric | Target |
|--------|--------|
| Projects created | 50 |
| Tasks completed | 500 |
| Journal entries | 100 |
| Users who reach Phase 7 (Build) | 30% |
| Users who reach Phase 11 (Launch) | 10% |
| Bundle sales (Etsy/Gumroad) | 20 |

### North Star Metric
**Projects that reach Launch phase** - indicates the product actually helps people ship

---

## Pricing Strategy

### Web App
| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | 1 project, all features |
| Pro | $9/mo | Unlimited projects, cloud sync |
| Lifetime | $39 | Pro forever |

### Bundle (Etsy/Gumroad)
| Platform | Price |
|----------|-------|
| Etsy | $12.99 |
| Gumroad | $14.99 |

### Future Bundle
"Ultimate Builder Bundle" = ShipOrSkip + ShipKit for $24.99

---

## Go-to-Market

### Launch Channels
| Channel | Approach |
|---------|----------|
| Etsy | Bundle listing (like Job Tracker) |
| Gumroad | Bundle + web app upsell |
| Product Hunt | Launch day |
| Indie Hackers | "Show IH" |
| Reddit | r/SideProject, r/nocode, r/indiehackers |
| Twitter/X | Build in public thread |
| LinkedIn | Your network |

### Positioning
"The launch checklist for solo builders. Stop forgetting critical steps."

---

## Timeline

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| Build web app in v0 | 5-7 days | Working app |
| Create spreadsheet versions | 2-3 days | Sheets + Excel |
| Create printable PDF | 1 day | Checklist PDF |
| Create Quick Start Guide | 1 day | Branded PDF |
| Polish + test | 2-3 days | Bug fixes |
| Soft launch | Day 14 | Share with network |
| Etsy/Gumroad listing | Day 16 | Bundle live |
| Product Hunt | Day 21 | Public launch |

**Total: ~3 weeks to launch**

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Too many tasks overwhelms users | Medium | High | Allow hiding/skipping, show progress |
| Users don't complete phases | High | Medium | Celebrate milestones, send reminders |
| Notion templates are "good enough" | Medium | Medium | Differentiate with structure + dashboard |
| Spreadsheet version cannibalizes web app | Low | Low | Web app has more features |

---

## Open Questions

1. Should AI assistant be in MVP or v2?
2. Should we gate unlimited projects behind paid tier?
3. Partner with Lovable/Cursor for distribution?
4. Build community (Discord) for accountability?

---

## Connection to ShipOrSkip

Future integration:
1. User validates idea in **ShipOrSkip**
2. Clicks "Start Building"
3. Idea auto-populates into new **ShipKit** project
4. Seamless flow from validation → execution

---

*Document Version: 1.0*
*Last Updated: February 2026*
*Owner: Journey Analytics*
