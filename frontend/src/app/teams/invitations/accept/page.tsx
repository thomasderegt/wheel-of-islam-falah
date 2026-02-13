'use client'

/**
 * Accept Team Invitation Page
 * Handles accepting team invitations via token
 */

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { useAuth } from '@/features/auth'
import { ProtectedRoute } from '@/features/auth'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import { Button } from '@/shared/components/ui/button'
import { useAcceptTeamInvitation } from '@/features/teams'
import { Loading } from '@/shared/components/ui/Loading'
import { getErrorMessage } from '@/shared/api/errors'
import { CheckCircle, XCircle, Mail } from 'lucide-react'

function AcceptInvitationContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const token = searchParams?.get('token') || null

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [teamId, setTeamId] = useState<number | null>(null)

  const acceptMutation = useAcceptTeamInvitation()

  useEffect(() => {
    // Wait for authentication
    if (!isAuthenticated) {
      return
    }

    // Check if token exists
    if (!token) {
      setStatus('error')
      setError('Geen invitation token gevonden in de URL.')
      return
    }

    // Auto-accept invitation if authenticated
    if (status === 'idle' && isAuthenticated && token) {
      handleAccept()
    }
  }, [isAuthenticated, token, status])

  const handleAccept = async () => {
    if (!token) {
      setError('Geen invitation token gevonden.')
      setStatus('error')
      return
    }

    setStatus('loading')
    setError(null)

    try {
      const result = await acceptMutation.mutateAsync(token)
      setTeamId(result.teamId)
      setStatus('success')
      
      // Redirect to team page after 2 seconds
      setTimeout(() => {
        router.push(`/teams/${result.teamId}`)
      }, 2000)
    } catch (err) {
      setError(getErrorMessage(err))
      setStatus('error')
    }
  }

  if (!isAuthenticated) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col">
          <Navbar variant="landing" />
          <main className="flex-1 flex flex-col p-8">
            <Container className="max-w-2xl mx-auto">
              <Loading />
            </Container>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar variant="landing" />
        
        <main className="flex-1 flex flex-col p-8">
          <Container className="max-w-2xl mx-auto">
            <div className="space-y-6">
              {status === 'loading' && (
                <div className="text-center py-12">
                  <Loading />
                  <p className="mt-4 text-muted-foreground">
                    Invitation accepteren...
                  </p>
                </div>
              )}

              {status === 'success' && (
                <div className="text-center py-12 space-y-4">
                  <div className="flex justify-center">
                    <CheckCircle className="h-16 w-16 text-green-600" />
                  </div>
                  <h1 className="text-2xl font-bold">Uitnodiging Geaccepteerd!</h1>
                  <p className="text-muted-foreground">
                    Je bent nu lid van het team. Je wordt doorgestuurd naar de team pagina...
                  </p>
                  {teamId && (
                    <Button onClick={() => router.push(`/teams/${teamId}`)}>
                      Naar Team Pagina
                    </Button>
                  )}
                </div>
              )}

              {status === 'error' && (
                <div className="text-center py-12 space-y-4">
                  <div className="flex justify-center">
                    <XCircle className="h-16 w-16 text-red-600" />
                  </div>
                  <h1 className="text-2xl font-bold">Fout bij Accepteren</h1>
                  <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    {error || 'Er is een fout opgetreden bij het accepteren van de uitnodiging.'}
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Mogelijke oorzaken:
                    </p>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                      <li>De uitnodiging is verlopen (geldig voor 7 dagen)</li>
                      <li>De uitnodiging is al geaccepteerd</li>
                      <li>Je bent al lid van dit team</li>
                      <li>De uitnodiging link is ongeldig</li>
                    </ul>
                  </div>
                  <div className="flex gap-4 justify-center">
                    <Button variant="outline" onClick={() => router.push('/teams')}>
                      Naar Teams
                    </Button>
                    <Button onClick={handleAccept}>
                      Opnieuw Proberen
                    </Button>
                  </div>
                </div>
              )}

              {status === 'idle' && !token && (
                <div className="text-center py-12 space-y-4">
                  <div className="flex justify-center">
                    <Mail className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <h1 className="text-2xl font-bold">Geen Token Gevonden</h1>
                  <p className="text-muted-foreground">
                    Er is geen invitation token gevonden in de URL.
                  </p>
                  <Button onClick={() => router.push('/teams')}>
                    Naar Teams
                  </Button>
                </div>
              )}
            </div>
          </Container>
        </main>
      </div>
    </ProtectedRoute>
  )
}

export default function AcceptInvitationPage() {
  return (
    <Suspense fallback={
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col">
          <Navbar variant="landing" />
          <main className="flex-1 flex flex-col p-8">
            <Container className="max-w-2xl mx-auto">
              <Loading />
            </Container>
          </main>
        </div>
      </ProtectedRoute>
    }>
      <AcceptInvitationContent />
    </Suspense>
  )
}
