import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { activitiesApi } from '../../lib/api'
import { useUndoStore } from '../../store/undoStore'
import { useToast } from '../ui/toast'
import { Button } from '../ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog'
import { formatDate } from '../../lib/utils'
import { AIReviewDialog } from './AIReviewDialog'
import type { JobSearchActivity } from '../../types'
import { Trash2, Edit } from 'lucide-react'

interface ActivityTableProps {
  activities: JobSearchActivity[]
  totalCount: number
}

export function ActivityTable({ activities, totalCount }: ActivityTableProps) {
  const queryClient = useQueryClient()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [reviewingActivity, setReviewingActivity] = useState<JobSearchActivity | null>(null)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [activityToDelete, setActivityToDelete] = useState<JobSearchActivity | null>(null)
  
  const undoStore = useUndoStore()
  const { addToast } = useToast()

  const deleteMutation = useMutation({
    mutationFn: (id: string) => activitiesApi.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['activities'] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
      
      // Find deleted activity for undo
      const deletedActivity = activities.find(a => a.id === id)
      if (deletedActivity) {
        const undoId = undoStore.addDeleted(deletedActivity)
        
        // Show undo toast
        addToast({
          title: 'Activity deleted',
          description: `${deletedActivity.company_name} - ${deletedActivity.job_title}`,
          variant: 'success',
          action: {
            label: 'Undo',
            onClick: () => handleUndo(undoId),
          },
          duration: 5000,
        })
      }
      
      setDeletingId(null)
      setConfirmDialogOpen(false)
      setActivityToDelete(null)
    },
  })

  const restoreMutation = useMutation({
    mutationFn: (activity: JobSearchActivity) => {
      const { id, ...activityData } = activity
      return activitiesApi.create(activityData as any)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
      addToast({
        title: 'Activity restored',
        variant: 'success',
      })
    },
  })

  const handleDeleteClick = (activity: JobSearchActivity) => {
    setActivityToDelete(activity)
    setConfirmDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (activityToDelete) {
      setDeletingId(activityToDelete.id)
      deleteMutation.mutate(activityToDelete.id)
    }
  }

  const handleUndo = (undoId: string) => {
    const activity = undoStore.undo(undoId)
    if (activity) {
      restoreMutation.mutate(activity)
    }
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No activities yet. Click "Add Activity" to get started!
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4 font-medium">Date</th>
            <th className="text-left p-4 font-medium">Company</th>
            <th className="text-left p-4 font-medium">Job Title</th>
            <th className="text-left p-4 font-medium">Type</th>
            <th className="text-left p-4 font-medium">Status</th>
            <th className="text-right p-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity) => (
            <tr key={activity.id} className="border-b hover:bg-muted/50">
              <td className="p-4">{formatDate(activity.date)}</td>
              <td className="p-4 font-medium">{activity.company_name}</td>
              <td className="p-4">{activity.job_title}</td>
              <td className="p-4">
                <span className="px-2 py-1 text-xs rounded-full bg-secondary">
                  {activity.activity_type.replace('_', ' ')}
                </span>
              </td>
              <td className="p-4">
                {activity.status && (
                  <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                    {activity.status.replace('_', ' ')}
                  </span>
                )}
              </td>
              <td className="p-4">
                <div className="flex justify-end gap-2">
                  {activity.ai_parsed && (activity.ai_confidence || 0) < 0.7 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setReviewingActivity(activity)}
                      title="Review AI-parsed data"
                    >
                      <Edit className="h-4 w-4 text-orange-500" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteClick(activity)}
                    disabled={deletingId === activity.id}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {totalCount > activities.length && (
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Showing {activities.length} of {totalCount} activities
        </div>
      )}
      
      {reviewingActivity && (
        <AIReviewDialog
          open={!!reviewingActivity}
          onOpenChange={(open) => !open && setReviewingActivity(null)}
          activity={reviewingActivity}
        />
      )}

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Activity?</AlertDialogTitle>
            <AlertDialogDescription>
              {activityToDelete && (
                <>
                  Are you sure you want to delete the activity for{' '}
                  <strong>{activityToDelete.company_name}</strong> -{' '}
                  <strong>{activityToDelete.job_title}</strong>?
                  <br />
                  <br />
                  You can undo this action within 5 minutes.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}



