import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { activitiesApi } from '../../lib/api'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select } from '../ui/select'
import { Textarea } from '../ui/textarea'
import type { JobSearchActivity, ActivityType, ActivityStatus } from '../../types'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

interface AIReviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  activity: JobSearchActivity
}

export function AIReviewDialog({ open, onOpenChange, activity }: AIReviewDialogProps) {
  const queryClient = useQueryClient()
  const [editedActivity, setEditedActivity] = useState({
    company_name: activity.company_name,
    job_title: activity.job_title,
    date: activity.date,
    activity_type: activity.activity_type,
    status: activity.status || '',
    job_description_url: activity.job_description_url || '',
    notes: activity.notes || '',
  })

  const updateMutation = useMutation({
    mutationFn: (updates: Partial<JobSearchActivity>) =>
      activitiesApi.update({ id: activity.id, ...updates }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
      onOpenChange(false)
    },
  })

  const handleSave = () => {
    updateMutation.mutate({
      company_name: editedActivity.company_name,
      job_title: editedActivity.job_title,
      date: editedActivity.date,
      activity_type: editedActivity.activity_type as ActivityType,
      status: editedActivity.status as ActivityStatus | undefined,
      job_description_url: editedActivity.job_description_url || undefined,
      notes: editedActivity.notes || undefined,
      ai_parsed: false, // Mark as manually reviewed
    })
  }

  const confidence = activity.ai_confidence || 0
  const isLowConfidence = confidence < 0.7

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isLowConfidence ? (
              <>
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Review AI-Parsed Activity
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Edit Activity
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isLowConfidence && (
              <div className="mt-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-md">
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  This activity was parsed by AI with {Math.round(confidence * 100)}% confidence.
                  Please review and correct any errors.
                </p>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={editedActivity.date}
                onChange={(e) =>
                  setEditedActivity({ ...editedActivity, date: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="activity_type">Activity Type *</Label>
              <Select
                id="activity_type"
                value={editedActivity.activity_type}
                onChange={(e) =>
                  setEditedActivity({
                    ...editedActivity,
                    activity_type: e.target.value as ActivityType,
                  })
                }
              >
                <option value="application">Application</option>
                <option value="interview">Interview</option>
                <option value="networking">Networking</option>
                <option value="job_fair">Job Fair</option>
                <option value="resume_submission">Resume Submission</option>
                <option value="phone_call">Phone Call</option>
                <option value="email_inquiry">Email Inquiry</option>
                <option value="recruiter_contact">Recruiter Contact</option>
                <option value="other">Other</option>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company_name">Company Name *</Label>
            <Input
              id="company_name"
              value={editedActivity.company_name}
              onChange={(e) =>
                setEditedActivity({
                  ...editedActivity,
                  company_name: e.target.value,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="job_title">Job Title *</Label>
            <Input
              id="job_title"
              value={editedActivity.job_title}
              onChange={(e) =>
                setEditedActivity({
                  ...editedActivity,
                  job_title: e.target.value,
                })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Application Status</Label>
              <Select
                id="status"
                value={editedActivity.status}
                onChange={(e) =>
                  setEditedActivity({
                    ...editedActivity,
                    status: e.target.value,
                  })
                }
              >
                <option value="">None</option>
                <option value="application">Application</option>
                <option value="assessment">Assessment</option>
                <option value="hr_screen">HR Screen</option>
                <option value="hiring_manager">Hiring Manager</option>
                <option value="final_round">Final Round</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="job_description_url">Job Description URL</Label>
              <Input
                id="job_description_url"
                type="url"
                value={editedActivity.job_description_url}
                onChange={(e) =>
                  setEditedActivity({
                    ...editedActivity,
                    job_description_url: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={editedActivity.notes}
              onChange={(e) =>
                setEditedActivity({
                  ...editedActivity,
                  notes: e.target.value,
                })
              }
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}







