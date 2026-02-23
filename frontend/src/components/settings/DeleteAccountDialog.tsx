import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/authStore'
import { useNavigate } from 'react-router-dom'
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
import { Input } from '../ui/input'
import { useToast } from '../ui/toast'
import { AlertTriangle } from 'lucide-react'

interface DeleteAccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteAccountDialog({ open, onOpenChange }: DeleteAccountDialogProps) {
  const { addToast } = useToast()
  const { logout } = useAuthStore()
  const navigate = useNavigate()
  const [confirmText, setConfirmText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('delete-user-account', {
        body: { confirm: 'DELETE' },
      })

      if (error) throw error
      return data
    },
    onSuccess: async () => {
      addToast({
        title: 'Account deleted',
        description: 'Your account and all data have been permanently deleted.',
        variant: 'success',
      })

      await logout()
      navigate('/auth')
    },
    onError: (error: any) => {
      addToast({
        title: 'Deletion failed',
        description: error.message || 'Failed to delete account',
        variant: 'error',
      })
      setIsDeleting(false)
    },
  })

  const handleDelete = () => {
    if (confirmText !== 'DELETE') {
      addToast({
        title: 'Invalid confirmation',
        description: 'Please type DELETE to confirm',
        variant: 'error',
      })
      return
    }

    setIsDeleting(true)
    deleteMutation.mutate()
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Account
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              This action cannot be undone. This will permanently delete:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>All your job search activities</li>
              <li>Your preferences and settings</li>
              <li>Gmail connection and tokens</li>
              <li>All imported data</li>
              <li>Your account</li>
            </ul>
            <p className="mt-4 font-semibold">
              Type <strong>DELETE</strong> to confirm:
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type DELETE to confirm"
            className="w-full"
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setConfirmText('')}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={confirmText !== 'DELETE' || isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Deleting...' : 'Delete Account'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}







