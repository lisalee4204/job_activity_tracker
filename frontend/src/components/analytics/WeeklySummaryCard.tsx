import { useQuery } from '@tanstack/react-query'
import { activitiesApi, preferencesApi } from '../../lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { getWeekStart, getUserTimezone, formatDateInTimezone } from '../../lib/utils'
import { CheckCircle2, PartyPopper } from 'lucide-react'

interface WeeklySummaryCardProps {
  weeklyGoal: number
}

export function WeeklySummaryCard({ weeklyGoal }: WeeklySummaryCardProps) {
  const timezone = getUserTimezone()
  const weekStart = getWeekStart(new Date(), timezone)

  const { data: summary, isLoading } = useQuery({
    queryKey: ['weekly-summary', weekStart.toISOString()],
    queryFn: () => activitiesApi.getWeeklySummary(weekStart),
  })

  const activityCount = summary?.activity_count || 0
  const progress = Math.min((activityCount / weeklyGoal) * 100, 100)
  const isCompliant = summary?.meets_goal ?? activityCount >= weeklyGoal
  const goalExceeded = summary?.goal_exceeded ?? activityCount > weeklyGoal

  return (
    <Card>
      <CardHeader>
        <CardTitle>This Week's Progress</CardTitle>
        <CardDescription>
          Week of {formatDateInTimezone(weekStart, timezone)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  {activityCount} / {weeklyGoal} activities
                </span>
                <span
                  className={`text-sm font-bold flex items-center gap-1 ${
                    goalExceeded 
                      ? 'text-green-600' 
                      : isCompliant 
                        ? 'text-green-600' 
                        : 'text-orange-600'
                  }`}
                >
                  {goalExceeded ? (
                    <>
                      <PartyPopper className="h-4 w-4" />
                      Goal Exceeded!
                    </>
                  ) : isCompliant ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Compliant
                    </>
                  ) : (
                    'In Progress'
                  )}
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    isCompliant ? 'bg-green-600' : 'bg-primary'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {summary && summary.unique_companies > 0 && (
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <div className="text-2xl font-bold">{summary.unique_companies}</div>
                  <div className="text-sm text-muted-foreground">Companies</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{summary.activity_types_count}</div>
                  <div className="text-sm text-muted-foreground">Activity Types</div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}



