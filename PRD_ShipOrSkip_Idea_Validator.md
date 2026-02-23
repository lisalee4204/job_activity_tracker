# PRD: ShipOrSkip (Idea Validator)

## Product Overview

**Product Name:** ShipOrSkip (working title) or "Idea Validator by Journey Analytics"

**One-Liner:** An AI-powered tool that researches, scores, and ranks your app ideas so you know which one to build first.

**Version:** MVP (v1.0)

**Author:** Journey Analytics

**Last Updated:** February 2026

---

## Problem Statement

Solo builders waste weeks or months on ideas that were doomed from the start - too complex, no market, too crowded, or they just lose motivation. They don't have a framework to objectively evaluate ideas before committing.

**Current Pain Points:**
- No structured way to compare multiple ideas
- Manual market research takes hours/days
- Gut feeling leads to wrong choices
- Complexity and cold-start problems discovered too late
- Excitement fades when reality hits

---

## Target User

### Primary Persona: "First-Time Builder"
- Using Lovable, Cursor, Bolt, or Replit
- Has 3-5 app ideas floating around
- Limited time (nights/weekends)
- Non-technical or semi-technical
- Wants to build something real but doesn't know where to start

### Secondary Persona: "Serial Indie Hacker"
- Has built before but struggles to pick winners
- Wants data-driven decision making
- Values speed over perfection

---

## Core Value Proposition

**Stop guessing. Let AI research your idea and tell you if it's worth building - in 2 minutes, not 2 weeks.**

---

## MVP Features

### Feature 1: Idea Input

User enters basic information about their idea:

| Field | Type | Required |
|-------|------|----------|
| Idea name | Text | Yes |
| One-line description | Text (< 280 chars) | Yes |
| Problem it solves | Text | Yes |
| Target user | Text | Yes |
| How it makes money | Dropdown | Yes |

**Monetization Dropdown Options:**
- Subscription (SaaS)
- One-time purchase
- Freemium
- Ads
- Marketplace/transaction fee
- Unsure

---

### Feature 2: AI Auto-Research

AI automatically researches and scores these factors using web search:

| Factor | AI Output | Source |
|--------|-----------|--------|
| TAM / Market Size | Dollar estimate + growth rate | Industry reports, Statista |
| Competition Level | Top 5 competitors + brief analysis | App Store, Product Hunt, web search |
| Demand Signals | Trend direction + volume | Google Trends, Reddit, Twitter |
| Competitor Pricing | Price range in market | Competitor websites |

**AI Research Display:**
```
📊 Market Size: $4.2B (growing 12% annually)
   Source: IBISWorld 2025 Report

🏆 Top Competitors:
   1. Competitor A - 50K downloads, $9.99/mo
   2. Competitor B - 120K downloads, Free + ads
   3. Competitor C - 30K downloads, $29 one-time
   
📈 Demand: Rising (Google Trends +45% YoY)
   Reddit: 12 relevant threads/month
   
💰 Market Pricing: $5-15/month typical
```

---

### Feature 3: User Input Scoring

User scores these factors (1-5 scale):

| Factor | Description | Weight |
|--------|-------------|--------|
| Technical Complexity | How hard is this to build? (5 = easy) | 2x |
| Cold Start Problem | Does it need users to attract users? (5 = no) | 2x |
| Regulatory/Trust Risk | Kids, health, finance, dating? (5 = low risk) | 1.5x |
| Data Availability | Do you have access to needed data? (5 = yes) | 1x |
| Your Excitement | How pumped are you? (5 = very) | 1.5x |
| Unfair Advantage | Do you have unique insight/access? (5 = yes) | 1.5x |
| Time to MVP | Can you ship in 2 weeks? (5 = yes) | 1x |
| Validated Problem | Have you talked to real users? (5 = yes, validated) | 1.5x |

**Scoring Scale:**
- 1 = Very Low / Very Hard / No
- 2 = Low / Hard
- 3 = Medium / Moderate
- 4 = High / Easy
- 5 = Very High / Very Easy / Yes

---

### Feature 4: Scoring Engine

**Calculation:**

```
AI Factors (auto-scored, 1-5 each):
- Market Size Score
- Competition Score (less = higher)
- Demand Score
- Revenue Potential Score

User Factors (weighted):
- Technical Complexity × 2
- Cold Start Problem × 2
- Regulatory Risk × 1.5
- Data Availability × 1
- Excitement × 1.5
- Unfair Advantage × 1.5
- Time to MVP × 1
- Validated Problem × 1.5

Total Weighted Score → Normalized to 100
```

**Grade Scale:**
| Score | Grade | Meaning |
|-------|-------|---------|
| 90-100 | A | Strong - Build this |
| 80-89 | B+ | Good - Validate and build |
| 70-79 | B | Decent - Needs validation |
| 60-69 | C | Risky - Major concerns |
| Below 60 | D/F | Skip - Don't build this |

---

### Feature 5: AI Recommendation

AI generates personalized recommendation based on scores:

**Example Output:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 SCORE: 78/100 (B+)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ STRENGTHS:
• Strong market demand (Google Trends rising)
• Low competition in your specific niche
• High excitement level - you'll stick with it

⚠️ CONCERNS:
• Two-sided marketplace = cold start problem
• Technical complexity higher than you rated (real-time features)

💡 RECOMMENDATION:
Validate before building. Create a waitlist landing page and 
target 500 signups in 2 weeks. If you hit that, the demand is 
real - proceed with MVP. If not, pivot or skip.

🎯 NEXT STEPS:
1. Create landing page (use Carrd or Lovable)
2. Post in 3 relevant Reddit communities
3. Set 2-week validation deadline
4. If validated, start Phase 1 of build
```

---

### Feature 6: Idea Comparison Dashboard

Compare multiple ideas side-by-side:

| Idea | Score | Grade | Top Strength | Top Risk | Recommendation |
|------|-------|-------|--------------|----------|----------------|
| Speed Dating App | 62 | C | Large TAM | Cold start + complexity | Skip |
| School Filter App | 81 | B+ | High demand | Regulatory (kids) | Validate |
| Black Professionals Finder | 85 | A | Unfair advantage | Cold start | Build this one |

**Dashboard Features:**
- Sort by score, grade, or any factor
- Filter by grade (show only A/B ideas)
- Highlight top recommendation

---

### Feature 7: Export & Share

| Export Option | Format |
|---------------|--------|
| PDF Report | Full analysis for all ideas |
| Markdown | Copy-paste for Notion |
| Share Link | Public URL (optional) |
| Twitter/LinkedIn | Auto-generated "I'm validating..." post |

---

## Out of Scope (v2+)

| Feature | Version |
|---------|---------|
| Detailed competitor deep-dives | v2 |
| Auto-generated landing page | v2 |
| Integration with Launch Tracker | v2 |
| Team collaboration | v2 |
| Saved history across devices | v2 (requires auth) |
| Historical trend analysis | v2 |
| Industry-specific templates | v2 |

---

## Technical Architecture

### Tech Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Frontend | React / Next.js | Built with v0, deploys to Vercel |
| Hosting | Vercel | Free tier, instant deploys |
| AI | Claude API (Anthropic) | Best reasoning, web search capable |
| Web Search | Anthropic web search or Serper API | For market research |
| Database | Local Storage (MVP) | No auth needed for MVP |
| Auth | None (MVP) | Add Supabase Auth in v2 |

### API Integrations

| API | Purpose | Cost |
|-----|---------|------|
| Anthropic Claude | AI scoring + recommendations | ~$0.01-0.05 per idea |
| Web Search (via Claude or Serper) | Market research | Included or ~$0.01 per search |
| Google Trends (unofficial) | Demand signals | Free |

### Data Model (MVP - Local Storage)

```javascript
{
  ideas: [
    {
      id: "uuid",
      name: "Idea Name",
      description: "One-liner",
      problem: "Problem it solves",
      targetUser: "Who it's for",
      monetization: "subscription",
      
      // AI-generated scores
      aiScores: {
        marketSize: { score: 4, reasoning: "...", sources: [] },
        competition: { score: 3, reasoning: "...", competitors: [] },
        demand: { score: 4, reasoning: "...", trendData: {} },
        revenuePotential: { score: 3, reasoning: "..." }
      },
      
      // User-input scores
      userScores: {
        technicalComplexity: 3,
        coldStartProblem: 2,
        regulatoryRisk: 4,
        dataAvailability: 5,
        excitement: 5,
        unfairAdvantage: 4,
        timeToMvp: 3,
        validatedProblem: 2
      },
      
      // Calculated
      totalScore: 78,
      grade: "B+",
      recommendation: "...",
      
      createdAt: "2026-02-07T..."
    }
  ]
}
```

---

## User Interface

### Screen 1: Home / New Idea

```
┌─────────────────────────────────────────────────┐
│  🚀 ShipOrSkip                                  │
│  ─────────────────────────────────────────────  │
│                                                 │
│  Should you build it? Let's find out.           │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │ Idea Name                                 │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │ Describe your idea in one sentence...     │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │ What problem does it solve?               │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │ Who is it for?                            │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  How will it make money?                        │
│  [Subscription ▼]                               │
│                                                 │
│  [ Analyze This Idea → ]                        │
│                                                 │
│  ─────────────────────────────────────────────  │
│  Already analyzed ideas? [View Dashboard]       │
└─────────────────────────────────────────────────┘
```

### Screen 2: AI Researching (Loading)

```
┌─────────────────────────────────────────────────┐
│  🔍 Researching "Black Professionals Finder"    │
│  ─────────────────────────────────────────────  │
│                                                 │
│  ✅ Analyzing market size...                    │
│  ✅ Finding competitors...                      │
│  ⏳ Checking demand signals...                  │
│  ○ Evaluating revenue potential...              │
│                                                 │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 60%            │
│                                                 │
│  This usually takes 30-60 seconds.              │
└─────────────────────────────────────────────────┘
```

### Screen 3: User Scoring

```
┌─────────────────────────────────────────────────┐
│  📝 Your Turn: Score These Factors              │
│  ─────────────────────────────────────────────  │
│                                                 │
│  AI found promising data. Now help us           │
│  understand YOUR situation.                     │
│                                                 │
│  Technical Complexity                           │
│  How hard is this to build?                     │
│  [1] [2] [3] [4] [5]                           │
│   Hard ←────────→ Easy                          │
│                                                 │
│  Cold Start Problem                             │
│  Does it need users to attract users?           │
│  [1] [2] [3] [4] [5]                           │
│   Yes ←─────────→ No                            │
│                                                 │
│  ... (6 more factors)                           │
│                                                 │
│  [ Get My Score → ]                             │
└─────────────────────────────────────────────────┘
```

### Screen 4: Results

```
┌─────────────────────────────────────────────────┐
│  🎯 Results: Black Professionals Finder         │
│  ─────────────────────────────────────────────  │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │        SCORE: 85/100                    │    │
│  │           Grade: A                      │    │
│  │      ✅ Recommendation: BUILD           │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  📊 AI RESEARCH                                 │
│  ├─ Market Size: $2.1B ████████░░ 4/5          │
│  ├─ Competition: Low ██████████ 5/5            │
│  ├─ Demand: Rising ████████░░ 4/5              │
│  └─ Revenue Potential: High ████████░░ 4/5     │
│                                                 │
│  👤 YOUR SCORES                                 │
│  ├─ Complexity: Medium ██████░░░░ 3/5          │
│  ├─ Cold Start: Moderate ████░░░░░░ 2/5        │
│  ├─ Excitement: High ██████████ 5/5            │
│  └─ Unfair Advantage: Yes ████████░░ 4/5       │
│                                                 │
│  💡 RECOMMENDATION                              │
│  ──────────────────────────────────────────    │
│  Strong opportunity. You have domain expertise  │
│  (unfair advantage) and high motivation. The    │
│  cold start risk is real but manageable -       │
│  start with a city-specific launch to build     │
│  density before expanding.                      │
│                                                 │
│  🎯 NEXT STEPS                                  │
│  1. Validate with 10 user interviews            │
│  2. Build landing page + waitlist               │
│  3. Launch city-specific MVP                    │
│                                                 │
│  [Add Another Idea]  [View All Ideas]  [Export] │
└─────────────────────────────────────────────────┘
```

### Screen 5: Comparison Dashboard

```
┌─────────────────────────────────────────────────┐
│  📊 Idea Comparison Dashboard                   │
│  ─────────────────────────────────────────────  │
│                                                 │
│  ⭐ TOP PICK: Black Professionals Finder (85)   │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │ Idea                │ Score │ Grade │ → │    │
│  ├─────────────────────┼───────┼───────┼───┤    │
│  │ Black Prof Finder   │  85   │  A    │ ▶ │    │
│  │ School Filter App   │  81   │  B+   │ ▶ │    │
│  │ Speed Dating App    │  62   │  C    │ ▶ │    │
│  │ Goal Countdown      │  54   │  D    │ ▶ │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  [+ Add New Idea]              [Export All PDF] │
└─────────────────────────────────────────────────┘
```

---

## Success Metrics

### MVP Launch Targets (First 30 Days)

| Metric | Target | How Measured |
|--------|--------|--------------|
| Ideas evaluated | 100 | Database count |
| Unique users | 50 | Unique sessions |
| Return users | 20% | Users who add 2+ ideas |
| Time to result | < 2 min | Analytics |
| Share/export rate | 10% | Button clicks |

### North Star Metric
**Ideas evaluated per week** - indicates product value and engagement

---

## Pricing Strategy

### MVP: Free
- Unlimited ideas (local storage)
- Full AI analysis
- Export to PDF

### Future (v2):
| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | 3 ideas/month, no save |
| Pro | $9/mo | Unlimited, cloud save, history |
| Lifetime | $29 | Pro forever |

---

## Go-to-Market

### Launch Channels
| Channel | Approach |
|---------|----------|
| Product Hunt | Launch day campaign |
| Indie Hackers | "Show IH" post |
| Reddit | r/SideProject, r/Entrepreneur, r/nocode |
| Twitter/X | Build in public thread |
| LinkedIn | Your network |

### Positioning
"The idea validator for solo builders. Stop building the wrong thing."

---

## Timeline

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| Build UI in v0 | 2-3 days | Working frontend |
| Connect Claude API | 1-2 days | AI research working |
| Scoring engine | 1 day | Weighted calculations |
| Polish + test | 1-2 days | Bug fixes, UX tweaks |
| Soft launch | Day 7 | Share with network |
| Product Hunt | Day 14 | Public launch |

**Total: ~2 weeks to launch**

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| AI research inaccurate | Medium | High | Show sources, let users adjust |
| API costs spike | Low | Medium | Cache results, rate limit |
| Users don't return | Medium | Medium | Email capture, save history in v2 |
| Competitors copy | Low | Low | Move fast, build community |

---

## Open Questions

1. Should we require email signup for MVP or stay friction-free?
2. What's the right balance of AI-scored vs user-scored factors?
3. Should we show competitor details or keep it high-level?
4. Partner with Lovable/Cursor for distribution?

---

## Appendix: Competitor Analysis

| Competitor | What They Do | Gap We Fill |
|------------|--------------|-------------|
| Notion templates | Generic idea capture | No AI, no scoring |
| Business Model Canvas | Strategy framework | Manual, no research |
| Javelin Board | Lean validation | Complex, enterprise-focused |
| None specific | - | AI-powered idea scoring for solo builders |

---

*Document Version: 1.0*
*Last Updated: February 2026*
*Owner: Journey Analytics*
