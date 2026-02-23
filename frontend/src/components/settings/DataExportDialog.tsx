import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { useToast } from '../ui/toast'
import { Download, Loader2 } from 'lucide-react'

interface DataExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DataExportDialog({ open, onOpenChange }: DataExportDialogProps) {
  const { addToast } = useToast()
  const [exporting, setExporting] = useState(false)
  const [format, setFormat] = useState<'json' | 'csv'>('json')

  const handleExport = async () => {
    setExporting(true)
    try {
      const { data, error } = await supabase.functions.invoke('export-user-data', {
        body: { format },
      })

      if (error) throw error

      // Create download link
      const blob = format === 'csv'
        ? new Blob([data], { type: 'text/csv' })
        : new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `job-search-data-${Date.now()}.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      addToast({
        title: 'Export successful',
        description: `Your data has been exported as ${format.toUpperCase()}`,
        variant: 'success',
      })

      onOpenChange(false)
    } catch (error: any) {
      addToast({
        title: 'Export failed',
        description: error.message || 'Failed to export data',
        variant: 'error',
      })
    } finally {
      setExporting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Your Data</DialogTitle>
          <DialogDescription>
            Download all your job search data in JSON or CSV format for backup or compliance purposes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Export Format</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="json"
                  checked={format === 'json'}
                  onChange={(e) => setFormat(e.target.value as 'json' | 'csv')}
                />
                JSON (Complete data)
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="csv"
                  checked={format === 'csv'}
                  onChange={(e) => setFormat(e.target.value as 'json' | 'csv')}
                />
                CSV (Activities only)
              </label>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-md">
            <p className="text-sm text-muted-foreground">
              The export includes:
            </p>
            <ul className="text-sm text-muted-foreground mt-2 list-disc list-inside">
              <li>All job search activities</li>
              <li>User preferences</li>
              <li>Email import history</li>
              <li>Custom activity types</li>
              <li>Audit logs (recent)</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={exporting}>
            {exporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}







