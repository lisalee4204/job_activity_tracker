import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../store/authStore'
import { activitiesApi, preferencesApi, demoApi } from '../lib/api'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { ActivityDialog } from '../components/activities/ActivityDialog'
import { ActivityTable } from '../components/activities/ActivityTable'
import { WeeklySummaryCard } from '../components/analytics/WeeklySummaryCard'
import { GmailConnectionCard } from '../components/gmail/GmailConnectionCard'
import { useToast } from '../components/ui/toast'
import { BarChart2, LogOut, Plus, Settings, Sparkles, Trash2 } from 'lucide-react'

export function DashboardPage() {
  const { user, logout } = useAuthStore()
  const { addToast } = useToast()
  const [activityDialogOpen, setActivityDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ['activities', 1],
    queryFn: () => activitiesApi.getAll(1, 20),
  })

  const { data: preferences } = useQuery({
    queryKey: ['preferences'],
    queryFn: preferencesApi.get,
  })

  const weeklyGoal = preferences?.weekly_goal || 5

  // Check if user has any activities
  const hasActivities = activities && activities.data && activities.data.length > 0

  const seedDemoMutation = useMutation({
    mutationFn: demoApi.seedDemoData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] })
      queryClient.invalidateQueries({ queryKey: ['weekly-summary'] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
      addToast({
        title: 'Demo data loaded!',
        description: 'Sample activities have been added to your dashboard',
        variant: 'success',
      })
    },
    onError: (error: any) => {
      console.error('Demo data error:', error)
      addToast({
        title: 'Failed to load demo data',
        description: error.message || error.error?.message || 'Something went wrong',
        variant: 'error',
      })
    },
  })

  const clearDemoMutation = useMutation({
    mutationFn: demoApi.clearDemoData,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['activities'] })
      queryClient.invalidateQueries({ queryKey: ['weekly-summary'] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
      addToast({
        title: 'Demo data cleared!',
        description: `Removed ${data.deletedCount} demo activities`,
        variant: 'success',
      })
    },
    onError: (error: any) => {
      console.error('Clear demo error:', error)
      addToast({
        title: 'Failed to clear demo data',
        description: error.message || 'Something went wrong',
        variant: 'error',
      })
    },
  })

  const handleLogout = async () => {
    await logout()
  }

  const handleSeedDemo = () => {
    if (confirm('This will add 60+ sample activities to your account. Continue?')) {
      seedDemoMutation.mutate()
    }
  }

  const handleClearDemo = () => {
    if (confirm('This will remove all demo activities. Your real activities will not be affected. Continue?')) {
      clearDemoMutation.mutate()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Job Search Activity Tracker</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <div className="flex gap-2">
            {!hasActivities && (
              <Button 
                variant="outline" 
                onClick={handleSeedDemo}
                disabled={seedDemoMutation.isPending}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {seedDemoMutation.isPending ? 'Loading Demo Data...' : 'Load Demo Data'}
              </Button>
            )}
            {hasActivities && (
              <Button 
                variant="outline" 
                onClick={handleClearDemo}
                disabled={clearDemoMutation.isPending}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {clearDemoMutation.isPending ? 'Clearing...' : 'Clear Demo Data'}
              </Button>
            )}
            <Button onClick={() => setActivityDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/summary'}>
              <BarChart2 className="h-4 w-4 mr-2" />
              Summary
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/settings'}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        <div className="grid gap-6 mb-8">
          <WeeklySummaryCard weeklyGoal={weeklyGoal} />
          <GmailConnectionCard />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Your job search activities and applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activitiesLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <ActivityTable
                activities={activities?.data || []}
                totalCount={activities?.count || 0}
              />
            )}
          </CardContent>
        </Card>
      </main>

      <ActivityDialog
        open={activityDialogOpen}
        onOpenChange={setActivityDialogOpen}
      />
    </div>
  )
}



