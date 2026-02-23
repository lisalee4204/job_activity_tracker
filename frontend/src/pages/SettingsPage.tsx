import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { preferencesApi } from '../lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { DataExportDialog } from '../components/settings/DataExportDialog'
import { DeleteAccountDialog } from '../components/settings/DeleteAccountDialog'
import { useToast } from '../components/ui/toast'
import { Download, Trash2, Save } from 'lucide-react'

export function SettingsPage() {
  const { addToast } = useToast()
  const queryClient = useQueryClient()
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [weeklyGoal, setWeeklyGoal] = useState(5)

  const { data: preferences, isLoading } = useQuery({
    queryKey: ['preferences'],
    queryFn: preferencesApi.get,
    onSuccess: (data) => {
      if (data?.weekly_goal) {
        setWeeklyGoal(data.weekly_goal)
      }
    },
  })

  const updateMutation = useMutation({
    mutationFn: (goal: number) => preferencesApi.update({ weekly_goal: goal }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preferences'] })
      queryClient.invalidateQueries({ queryKey: ['weekly-summary'] })
      addToast({
        title: 'Settings saved',
        variant: 'success',
      })
    },
  })

  const handleSave = () => {
    if (weeklyGoal < 1 || weeklyGoal > 100) {
      addToast({
        title: 'Invalid goal',
        description: 'Weekly goal must be between 1 and 100',
        variant: 'error',
      })
      return
    }
    updateMutation.mutate(weeklyGoal)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="space-y-6">
        {/* Weekly Goal */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Goal</CardTitle>
            <CardDescription>
              Set your target number of job search activities per week
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="weekly-goal">Activities per Week</Label>
              <Input
                id="weekly-goal"
                type="number"
                min="1"
                max="100"
                value={weeklyGoal}
                onChange={(e) => setWeeklyGoal(parseInt(e.target.value) || 5)}
              />
              <p className="text-sm text-muted-foreground">
                Recommended: 5-10 activities per week for unemployment compliance
              </p>
            </div>
            <Button onClick={handleSave} disabled={updateMutation.isPending}>
              <Save className="h-4 w-4 mr-2" />
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>

        {/* Data Export */}
        <Card>
          <CardHeader>
            <CardTitle>Data Export</CardTitle>
            <CardDescription>
              Download all your data for backup or compliance purposes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => setExportDialogOpen(true)}>
              <Download className="h-4 w-4 mr-2" />
              Export My Data
            </Button>
          </CardContent>
        </Card>

        {/* Account Deletion */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Permanently delete your account and all data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>

      <DataExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
      />

      <DeleteAccountDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </div>
  )
}







