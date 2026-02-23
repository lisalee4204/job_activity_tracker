# Job Search Activity Tracker

A comprehensive job search tracking application that helps job seekers log, monitor, and analyze their job search activities while staying compliant for unemployment compensation claims audits.

## 🚀 Features

- **Activity Management**: Manual entry and Gmail integration for automatic tracking
- **Analytics Dashboard**: Weekly summaries, goal tracking, and visual insights
- **AI-Powered Insights**: Personalized recommendations to improve job search strategy
- **Data Export**: CSV and PDF export capabilities
- **Gmail Integration**: Automatic import of job applications from email confirmations

## 📋 Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Supabase account (for backend)
- Google Cloud Console project (for Gmail API and Google Sign-In)
- Lovable AI API key (for email parsing and insights)

## 🏗️ Project Structure

```
job-activity-tracker/
├── frontend/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities and configurations
│   │   ├── types/          # TypeScript type definitions
│   │   └── store/          # State management
│   ├── public/             # Static assets
│   └── package.json
├── backend/                 # Supabase backend
│   ├── supabase/
│   │   ├── migrations/     # Database migrations
│   │   └── functions/      # Edge functions
│   └── docs/               # Backend documentation
├── templates/              # Excel/Google Sheets templates
├── docs/                   # Project documentation
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: React Router v6
- **State Management**: React Query (TanStack Query) + Zustand
- **Charts**: Recharts
- **PDF Generation**: jsPDF + jsPDF-autotable
- **Icons**: Lucide React

### Backend
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth
- **Edge Functions**: Deno-based serverless functions
- **Storage**: Supabase Storage
- **Real-time**: Supabase Realtime

## 📦 Installation

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your Supabase credentials
npm run dev
```

### Backend Setup

1. Create a Supabase project
2. Run migrations:
   ```bash
   cd backend
   supabase db push
   ```
3. Deploy edge functions:
   ```bash
   supabase functions deploy
   ```

## 🔧 Configuration

See [CONFIGURATION.md](./docs/CONFIGURATION.md) for detailed setup instructions.

## 📚 Documentation

- [Architecture Overview](./docs/ARCHITECTURE.md)
- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE_SCHEMA.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Contributing Guide](./docs/CONTRIBUTING.md)

## 🧪 Testing

```bash
# Run frontend tests
cd frontend
npm test

# Run backend tests
cd backend
npm test
```

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

See [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for contribution guidelines.



