import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { activitiesApi, customActivityTypesApi } from '../../lib/api'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select } from '../ui/select'
import { Textarea } from '../ui/textarea'
import { CustomActivityTypeDialog } from './CustomActivityTypeDialog'
import type { ActivityType, ActivityStatus, CreateActivityInput } from '../../types'
import { formatDateInput } from '../../lib/utils'
import { Plus } from 'lucide-react'

const activitySchema = z.object({
  date: z.string().min(1, 'Date is required'),
  company_name: z.string().min(1, 'Company name is required'),
  job_title: z.string().min(1, 'Job title is required'),
  activity_type: z.string().min(1, 'Activity type is required'),
  status: z.enum([
    'application',
    'assessment',
    'hr_screen',
    'hiring_manager',
    'final_round',
    'offer',
    'rejected',
  ]).optional(),
  job_description_url: z.string().url().optional().or(z.literal('')),
  contact_person: z.string().optional(),
  contact_method: z.string().optional(),
  notes: z.string().optional(),
})

type ActivityForm = z.infer<typeof activitySchema>

interface ActivityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  activityId?: string
}

export function ActivityDialog({ open, onOpenChange, activityId }: ActivityDialogProps) {
  const queryClient = useQueryClient()
  const [customTypeDialogOpen, setCustomTypeDialogOpen] = useState(false)
  
  // Fetch custom activity types
  const { data: customTypes = [] } = useQuery({
    queryKey: ['custom-activity-types'],
    queryFn: customActivityTypesApi.getAll,
  })

  const form = useForm<ActivityForm>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      date: formatDateInput(new Date()),
      company_name: '',
      job_title: '',
      activity_type: 'application',
      status: undefined,
      job_description_url: '',
      contact_person: '',
      contact_method: '',
      notes: '',
    },
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateActivityInput) => activitiesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
      form.reset()
      onOpenChange(false)
    },
  })

  const onSubmit = (data: ActivityForm) => {
    createMutation.mutate({
      date: data.date,
      company_name: data.company_name,
      job_title: data.job_title,
      activity_type: data.activity_type as ActivityType,
      status: data.status as ActivityStatus | undefined,
      job_description_url: data.job_description_url || undefined,
      contact_person: data.contact_person || undefined,
      contact_method: data.contact_method || undefined,
      notes: data.notes || undefined,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Job Search Activity</DialogTitle>
          <DialogDescription>
            Log a new job search activity to track your progress
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                {...form.register('date')}
              />
              {form.formState.errors.date && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.date.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="activity_type">Activity Type *</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setCustomTypeDialogOpen(true)}
                  className="h-7 text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Custom
                </Button>
              </div>
              <Select id="activity_type" {...form.register('activity_type')}>
                <optgroup label="Standard Types">
                  <option value="application">Application</option>
                  <option value="interview">Interview</option>
                  <option value="networking">Networking</option>
                  <option value="job_fair">Job Fair</option>
                  <option value="resume_submission">Resume Submission</option>
                  <option value="phone_call">Phone Call</option>
                  <option value="email_inquiry">Email Inquiry</option>
                  <option value="recruiter_contact">Recruiter Contact</option>
                  <option value="other">Other</option>
                </optgroup>
                {customTypes.length > 0 && (
                  <optgroup label="Custom Types">
                    {customTypes.map((type) => (
                      <option key={type.id} value={type.name}>
                        {type.name}
                      </option>
                    ))}
                  </optgroup>
                )}
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company_name">Company Name *</Label>
            <Input
              id="company_name"
              placeholder="Acme Corp"
              {...form.register('company_name')}
            />
            {form.formState.errors.company_name && (
              <p className="text-sm text-destructive">
                {form.formState.errors.company_name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="job_title">Job Title *</Label>
            <Input
              id="job_title"
              placeholder="Software Engineer"
              {...form.register('job_title')}
            />
            {form.formState.errors.job_title && (
              <p className="text-sm text-destructive">
                {form.formState.errors.job_title.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Application Status</Label>
              <Select id="status" {...form.register('status')}>
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
                placeholder="https://..."
                {...form.register('job_description_url')}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_person">Contact Person</Label>
              <Input
                id="contact_person"
                placeholder="John Doe"
                {...form.register('contact_person')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_method">Contact Method</Label>
              <Input
                id="contact_method"
                placeholder="Email, Phone, LinkedIn"
                {...form.register('contact_method')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes about this activity..."
              rows={4}
              {...form.register('notes')}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Saving...' : 'Save Activity'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>

      <CustomActivityTypeDialog
        open={customTypeDialogOpen}
        onOpenChange={setCustomTypeDialogOpen}
        onTypeAdded={(typeName) => {
          form.setValue('activity_type', typeName)
        }}
      />
    </Dialog>
  )
}



