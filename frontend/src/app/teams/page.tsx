'use client'

/**
 * Teams List Page
 * Shows all teams the user is a member of
 */

import { useAuth } from '@/features/auth'
import { ProtectedRoute } from '@/features/auth'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import { Button } from '@/shared/components/ui/button'
import { useTeamsByUser, useMyInvitations, useAcceptTeamInvitation, useDeclineTeamInvitation } from '@/features/teams'
import { CreateTeamDialog } from '@/features/teams/components/CreateTeamDialog'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Users, Calendar, Mail, Check, X, Clock } from 'lucide-react'
import { Loading } from '@/shared/components/ui/Loading'
import Link from 'next/link'
import { getErrorMessage } from '@/shared/api/errors'

export default function TeamsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  const { data: teams, isLoading, error } = useTeamsByUser(user?.id ?? null)
  const { data: myInvitations } = useMyInvitations()
  const acceptMutation = useAcceptTeamInvitation()
  const declineMutation = useDeclineTeamInvitation()

  const handleCreateSuccess = (teamId: number) => {
    router.push(`/teams/${teamId}`)
  }

  const handleAccept = (token: string) => {
    acceptMutation.mutate(token, {
      onSuccess: (data) => router.push(`/teams/${data.teamId}`),
    })
  }

  const handleDecline = (token: string) => {
    declineMutation.mutate(token)
  }

  const getRoleLabel = (role: string) => {
    if (role === 'OWNER') return 'Owner'
    if (role === 'ADMIN') return 'Admin'
    return 'Member'
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col">
          <Navbar variant="landing" />
          <main className="flex-1 flex flex-col p-8">
            <Container className="max-w-6xl mx-auto">
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
          <Container className="max-w-6xl mx-auto">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">Teams</h1>
                  <p className="text-muted-foreground mt-1">
                    Beheer je teams en werk samen met anderen
                  </p>
                </div>
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nieuw Team
                </Button>
              </div>

              {/* Uitnodigingen voor jou */}
              {myInvitations && myInvitations.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Mail className="mr-2 h-5 w-5" />
                    Uitnodigingen voor jou ({myInvitations.length})
                  </h2>
                  <div className="border rounded-lg divide-y">
                    {myInvitations.map((invitation) => (
                      <div
                        key={invitation.id}
                        className="p-4 flex items-center justify-between gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{invitation.teamName}</div>
                          <div className="text-sm text-muted-foreground">
                            Uitgenodigd door {invitation.inviterName} • Rol: {getRoleLabel(invitation.role)}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1 flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            Verloopt {new Date(invitation.expiresAt).toLocaleDateString('nl-NL')}
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDecline(invitation.token)}
                            disabled={declineMutation.isPending}
                          >
                            <X className="mr-1 h-4 w-4" />
                            Weigeren
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleAccept(invitation.token)}
                            disabled={acceptMutation.isPending}
                          >
                            <Check className="mr-1 h-4 w-4" />
                            Accepteren
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                  <p className="font-semibold mb-2">Er is een fout opgetreden bij het laden van je teams.</p>
                  <p className="text-sm mb-2">
                    {getErrorMessage(error)}
                  </p>
                  {process.env.NODE_ENV === 'development' && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs font-semibold mb-1">Debug details</summary>
                      <pre className="text-xs bg-red-50 p-2 rounded overflow-auto max-h-40">
                        {JSON.stringify(error, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Team Management */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Team Management
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {/* Nieuw Team Aanmaken card */}
                  <button
                    type="button"
                    onClick={() => setCreateDialogOpen(true)}
                    className="flex flex-col items-center justify-center p-6 border border-dashed rounded-lg hover:border-primary hover:bg-muted/50 transition-all text-center w-full"
                  >
                    <Plus className="h-12 w-12 text-muted-foreground mb-4" />
                    <span className="text-lg font-semibold">Nieuw Team Aanmaken</span>
                    <span className="text-sm text-muted-foreground mt-1">
                      Maak een team aan om te beginnen met samenwerken
                    </span>
                  </button>

                  {/* Team cards */}
                  {teams?.map((team) => (
                    <Link
                      key={team.id}
                      href={`/teams/${team.id}`}
                      className="block p-6 border rounded-lg hover:border-primary hover:shadow-md transition-all"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h3 className="text-lg font-semibold">{team.name}</h3>
                          {team.status === 'ARCHIVED' && (
                            <span className="text-xs px-2 py-1 bg-muted rounded">
                              Gearchiveerd
                            </span>
                          )}
                        </div>
                        
                        {team.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {team.description}
                          </p>
                        )}
                        
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="mr-1 h-3 w-3" />
                          Aangemaakt {new Date(team.createdAt).toLocaleDateString('nl-NL')}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </main>

        {/* Create Team Dialog */}
        <CreateTeamDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onSuccess={handleCreateSuccess}
        />
      </div>
    </ProtectedRoute>
  )
}
