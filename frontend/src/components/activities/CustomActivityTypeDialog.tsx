import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { customActivityTypesApi } from '../../lib/api'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { useToast } from '../ui/toast'

const customTypeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be 50 characters or less'),
  description: z.string().optional(),
})

type CustomTypeForm = z.infer<typeof customTypeSchema>

interface CustomActivityTypeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTypeAdded?: (typeName: string) => void
}

export function CustomActivityTypeDialog({ open, onOpenChange, onTypeAdded }: CustomActivityTypeDialogProps) {
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  const form = useForm<CustomTypeForm>({
    resolver: zodResolver(customTypeSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const createMutation = useMutation({
    mutationFn: (data: CustomTypeForm) => customActivityTypesApi.create(data.name, data.description),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['custom-activity-types'] })
      addToast({
        title: 'Custom activity type added',
        description: `"${data.name}" is now available`,
        variant: 'success',
      })
      form.reset()
      onTypeAdded?.(data.name)
      onOpenChange(false)
    },
    onError: (error: any) => {
      addToast({
        title: 'Error',
        description: error.message || 'Failed to add custom activity type',
        variant: 'error',
      })
    },
  })

  const onSubmit = (data: CustomTypeForm) => {
    createMutation.mutate(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Custom Activity Type</DialogTitle>
          <DialogDescription>
            Create a custom activity type to track specific job search activities
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="custom-type-name">Name *</Label>
            <Input
              id="custom-type-name"
              placeholder="e.g., Informational Interview"
              {...form.register('name')}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom-type-description">Description (Optional)</Label>
            <Textarea
              id="custom-type-description"
              placeholder="Brief description of this activity type"
              rows={3}
              {...form.register('description')}
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
              {createMutation.isPending ? 'Adding...' : 'Add Type'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}







