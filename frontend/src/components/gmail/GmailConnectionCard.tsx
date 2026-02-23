import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { gmailApi } from '../../lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { useToast } from '../ui/toast'
import { Mail, CheckCircle2, Loader2, RefreshCw } from 'lucide-react'

export function GmailConnectionCard() {
  const { addToast } = useToast()
  const queryClient = useQueryClient()
  const [isConnecting, setIsConnecting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  // Check Gmail connection status
  const { data: isConnected, refetch: checkConnection } = useQuery({
    queryKey: ['gmail-connection'],
    queryFn: gmailApi.checkConnection,
    refetchInterval: 30000, // Check every 30 seconds
  })

  // Get OAuth config
  const { data: oauthConfig } = useQuery({
    queryKey: ['gmail-oauth-config'],
    queryFn: gmailApi.getOAuthConfig,
    enabled: !isConnected,
  })

  // Handle Gmail OAuth connection
  const handleConnectGmail = async () => {
    if (!oauthConfig?.clientId) {
      addToast({
        title: 'Gmail not configured',
        description: 'Gmail OAuth is not set up. Please configure Gmail Client ID in Supabase secrets.',
        variant: 'error',
      })
      return
    }

    setIsConnecting(true)
    try {
      // Build OAuth URL
      const redirectUri = `${window.location.origin}/auth/gmail/callback`
      const scope = 'https://www.googleapis.com/auth/gmail.readonly'
      const responseType = 'code'
      const accessType = 'offline'
      const prompt = 'consent'

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(oauthConfig.clientId)}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=${responseType}&` +
        `scope=${encodeURIComponent(scope)}&` +
        `access_type=${accessType}&` +
        `prompt=${prompt}`

      // Redirect to Google OAuth
      window.location.href = authUrl
    } catch (error: any) {
      addToast({
        title: 'Connection failed',
        description: error.message || 'Failed to connect Gmail',
        variant: 'error',
      })
      setIsConnecting(false)
    }
  }

  // Handle email import
  const importMutation = useMutation({
    mutationFn: (daysAgo: number) => gmailApi.importEmails(daysAgo),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['activities'] })
      queryClient.invalidateQueries({ queryKey: ['weekly-summary'] })
      addToast({
        title: 'Import successful',
        description: `Imported ${data.activitiesCreated || 0} activities from Gmail`,
        variant: 'success',
      })
      setIsImporting(false)
    },
    onError: (error: any) => {
      addToast({
        title: 'Import failed',
        description: error.message || 'Failed to import emails',
        variant: 'error',
      })
      setIsImporting(false)
    },
  })

  const handleImportEmails = (daysAgo: number = 30) => {
    setIsImporting(true)
    importMutation.mutate(daysAgo)
  }

  // Handle OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const error = urlParams.get('error')

    if (error) {
      addToast({
        title: 'Gmail connection cancelled',
        description: 'You cancelled the Gmail connection',
        variant: 'error',
      })
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname)
      return
    }

    if (code && window.location.pathname === '/auth/gmail/callback') {
      setIsConnecting(true)
      gmailApi.connectGmail(code)
        .then(() => {
          addToast({
            title: 'Gmail connected',
            description: 'Successfully connected your Gmail account',
            variant: 'success',
          })
          checkConnection()
          // Clean URL
          window.history.replaceState({}, document.title, '/')
        })
        .catch((err: any) => {
          addToast({
            title: 'Connection failed',
            description: err.message || 'Failed to connect Gmail',
            variant: 'error',
          })
        })
        .finally(() => {
          setIsConnecting(false)
        })
    }
  }, [checkConnection, addToast])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Gmail Integration
        </CardTitle>
        <CardDescription>
          Connect your Gmail to automatically import job application emails
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConnected ? (
          <>
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Gmail Connected</span>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleImportEmails(30)}
                disabled={isImporting}
              >
                {isImporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Import Last 30 Days
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleImportEmails(7)}
                disabled={isImporting}
              >
                Import Last 7 Days
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Emails are automatically parsed and imported as job search activities
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Connect your Gmail account to automatically import job application emails and track your activities.
            </p>
            <Button
              onClick={handleConnectGmail}
              disabled={isConnecting || !oauthConfig?.clientId}
              className="w-full"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Connect Gmail
                </>
              )}
            </Button>
            {!oauthConfig?.clientId && (
              <p className="text-xs text-destructive">
                Gmail OAuth not configured. Please set GMAIL_CLIENT_ID in Supabase secrets.
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}







