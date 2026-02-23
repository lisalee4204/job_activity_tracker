import { useQuery } from '@tanstack/react-query'
import { analyticsApi } from '../lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { ArrowLeft, Briefcase, Building2, MessageSquare, TrendingUp } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

const ACTIVITY_COLORS: Record<string, string> = {
  application: '#3b82f6',
  interview: '#10b981',
  networking: '#8b5cf6',
  job_fair: '#f59e0b',
  resume_submission: '#6366f1',
  phone_call: '#ec4899',
  email_inquiry: '#14b8a6',
  recruiter_contact: '#f97316',
  other: '#94a3b8',
}

const ACTIVITY_LABELS: Record<string, string> = {
  application: 'Applications',
  interview: 'Interviews',
  networking: 'Networking',
  job_fair: 'Job Fairs',
  resume_submission: 'Resume Submissions',
  phone_call: 'Phone Calls',
  email_inquiry: 'Email Inquiries',
  recruiter_contact: 'Recruiter Contact',
  other: 'Other',
}

const STATUS_LABELS: Record<string, string> = {
  application: 'Applied',
  assessment: 'Assessment',
  hr_screen: 'HR Screen',
  hiring_manager: 'Hiring Manager',
  final_round: 'Final Round',
  offer: 'Offer',
  rejected: 'Rejected',
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string
  value: number
  description: string
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

export function SummaryPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['overall-stats'],
    queryFn: analyticsApi.getOverallStats,
  })

  const { data: insights, isLoading: insightsLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: analyticsApi.getInsights,
  })

  const { data: historicalSummaries, isLoading: historicalLoading } = useQuery({
    queryKey: ['historical-summaries'],
    queryFn: () => analyticsApi.getHistoricalWeeklySummaries(8),
  })

  const activityChartData = stats
    ? Object.entries(stats.activityBreakdown)
        .map(([type, count]) => ({
          name: ACTIVITY_LABELS[type] || type,
          count,
          type,
        }))
        .sort((a, b) => b.count - a.count)
    : []

  const weeklyChartData = historicalSummaries
    ? [...historicalSummaries]
        .reverse()
        .map((s) => ({
          week: new Date(s.week_start).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
          activities: s.activity_count,
        }))
    : []

  const priorityColors: Record<string, string> = {
    high: 'border-red-500 bg-red-50',
    medium: 'border-yellow-500 bg-yellow-50',
    low: 'border-blue-500 bg-blue-50',
  }

  const categoryIcons: Record<string, string> = {
    strategy: '🎯',
    trend: '📈',
    opportunity: '💡',
    improvement: '🔧',
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => window.location.href = '/'}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Job Search Summary</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Overall Stats */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Overall Statistics</h2>
          {statsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard
                title="Total Activities"
                value={stats?.totalActivities || 0}
                description="All logged activities"
                icon={TrendingUp}
              />
              <StatCard
                title="Companies Reached"
                value={stats?.uniqueCompanies || 0}
                description="Unique companies contacted"
                icon={Building2}
              />
              <StatCard
                title="Applications"
                value={stats?.totalApplications || 0}
                description="Jobs applied to"
                icon={Briefcase}
              />
              <StatCard
                title="Interviews"
                value={stats?.totalInterviews || 0}
                description="Interviews completed"
                icon={MessageSquare}
              />
            </div>
          )}
        </section>

        {/* Pipeline Status */}
        {stats && stats.totalApplications > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Application Pipeline</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-4">
                  {Object.entries(stats.statusBreakdown).map(([status, count]) => (
                    <div key={status} className="flex flex-col items-center">
                      <div className="text-2xl font-bold">{count as number}</div>
                      <div className="text-sm text-muted-foreground">
                        {STATUS_LABELS[status] || status}
                      </div>
                    </div>
                  ))}
                  {stats.totalOffers > 0 && (
                    <div className="ml-auto flex flex-col items-center text-green-600">
                      <div className="text-2xl font-bold">{stats.totalOffers}</div>
                      <div className="text-sm">Offers</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Activity Breakdown Chart */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Activity Breakdown</h2>
            <Card>
              <CardHeader>
                <CardDescription>Activities by type across your entire job search</CardDescription>
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                  </div>
                ) : activityChartData.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No activity data yet</p>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={activityChartData} layout="vertical" margin={{ left: 16 }}>
                      <XAxis type="number" allowDecimals={false} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={130}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip formatter={(v) => [v, 'Activities']} />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {activityChartData.map((entry) => (
                          <Cell
                            key={entry.type}
                            fill={ACTIVITY_COLORS[entry.type] || '#94a3b8'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Weekly Activity History */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Weekly Activity History</h2>
            <Card>
              <CardHeader>
                <CardDescription>Activities logged per week (last 8 weeks)</CardDescription>
              </CardHeader>
              <CardContent>
                {historicalLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                  </div>
                ) : weeklyChartData.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No weekly history yet</p>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={weeklyChartData}>
                      <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                      <YAxis allowDecimals={false} />
                      <Tooltip formatter={(v) => [v, 'Activities']} />
                      <Bar dataKey="activities" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </section>
        </div>

        {/* AI Insights */}
        <section>
          <h2 className="text-xl font-semibold mb-4">AI Insights</h2>
          {insightsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : !insights || insights.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No insights available yet. Log more activities to receive personalized recommendations.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {insights.map((insight, i) => (
                <Card
                  key={i}
                  className={`border-l-4 ${priorityColors[insight.priority] || ''}`}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <span>{categoryIcons[insight.category] || '💡'}</span>
                      {insight.title}
                    </CardTitle>
                    <CardDescription className="capitalize">
                      {insight.category} · {insight.priority} priority
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
