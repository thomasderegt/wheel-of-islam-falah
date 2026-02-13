'use client'

/**
 * Team Detail Page
 * Shows team details, members, and allows inviting new members
 */

import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/features/auth'
import { ProtectedRoute } from '@/features/auth'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import { Button } from '@/shared/components/ui/button'
import { useTeam, useTeamMembers, useTeamInvitations } from '@/features/teams'
import type { TeamInvitationDTO } from '@/features/teams'
import { InviteMemberDialog } from '@/features/teams/components/InviteMemberDialog'
import { useState } from 'react'
import { ArrowLeft, Users, Mail, Calendar, Crown, Shield, User, Clock, Copy, Check } from 'lucide-react'
import { Loading } from '@/shared/components/ui/Loading'

function PendingInvitationRow({
  invitation,
  getRoleLabel,
}: {
  invitation: TeamInvitationDTO
  getRoleLabel: (role: string) => string
}) {
  const [copied, setCopied] = useState(false)
  const inviteLink =
    typeof window !== 'undefined'
      ? `${window.location.origin}/teams/invitations/accept?token=${invitation.token}`
      : ''

  const handleCopy = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="p-4 flex items-center justify-between">
      <div>
        <div className="font-medium">{invitation.email}</div>
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <span>{getRoleLabel(invitation.role)}</span>
          <span>•</span>
          <span className="flex items-center">
            <Clock className="mr-1 h-3 w-3" />
            Verloopt {new Date(invitation.expiresAt).toLocaleDateString('nl-NL')}
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="shrink-0"
      >
        {copied ? (
          <>
            <Check className="mr-2 h-4 w-4 text-green-600" />
            Gekopieerd
          </>
        ) : (
          <>
            <Copy className="mr-2 h-4 w-4" />
            Kopieer link
          </>
        )}
      </Button>
    </div>
  )
}

export default function TeamDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const teamId = Number(params.teamId)
  
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)

  const { data: team, isLoading: isLoadingTeam, error: teamError } = useTeam(teamId)
  const { data: members, isLoading: isLoadingMembers, error: membersError } = useTeamMembers(teamId)
  const userMember = members?.find(m => m.userId === user?.id)
  const canInvite = userMember?.role === 'OWNER' || userMember?.role === 'ADMIN'
  const { data: invitations, isLoading: isLoadingInvitations } = useTeamInvitations(canInvite ? teamId : null)

  const isLoading = isLoadingTeam || isLoadingMembers
  const error = teamError || membersError

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'OWNER':
        return <Crown className="h-4 w-4 text-yellow-600" />
      case 'ADMIN':
        return <Shield className="h-4 w-4 text-blue-600" />
      default:
        return <User className="h-4 w-4 text-gray-600" />
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'OWNER':
        return 'Owner'
      case 'ADMIN':
        return 'Admin'
      default:
        return 'Member'
    }
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

  if (error || !team) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col">
          <Navbar variant="landing" />
          <main className="flex-1 flex flex-col p-8">
            <Container className="max-w-6xl mx-auto">
              <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                Team niet gevonden of je hebt geen toegang.
              </div>
              <Button
                variant="outline"
                onClick={() => router.push('/teams')}
                className="mt-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Terug naar Teams
              </Button>
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
              {/* Back Button */}
              <Button
                variant="ghost"
                onClick={() => router.push('/teams')}
                className="mb-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Terug naar Teams
              </Button>

              {/* Team Header */}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold">{team.name}</h1>
                    {team.description && (
                      <p className="text-muted-foreground mt-2">{team.description}</p>
                    )}
                    <div className="flex items-center text-sm text-muted-foreground mt-2">
                      <Calendar className="mr-1 h-4 w-4" />
                      Aangemaakt {new Date(team.createdAt).toLocaleDateString('nl-NL')}
                    </div>
                  </div>
                  {canInvite && (
                    <Button onClick={() => setInviteDialogOpen(true)}>
                      <Users className="mr-2 h-4 w-4" />
                      Lid Uitnodigen
                    </Button>
                  )}
                </div>
              </div>

              {/* Members Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Leden ({members?.length || 0})
                  </h2>
                </div>

                {isLoadingMembers ? (
                  <Loading />
                ) : members && members.length > 0 ? (
                  <div className="border rounded-lg divide-y">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="p-4 flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          {getRoleIcon(member.role)}
                          <div>
                            <div className="font-medium">
                              {member.userId === user?.id ? 'Jij' : `User ${member.userId}`}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {getRoleLabel(member.role)}
                              {member.joinedAt && (
                                <> • Lid sinds {new Date(member.joinedAt).toLocaleDateString('nl-NL')}</>
                              )}
                            </div>
                          </div>
                        </div>
                        {member.status === 'INVITED' && (
                          <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                            Uitgenodigd
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border border-dashed rounded-lg">
                    <Users className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Nog geen leden</p>
                  </div>
                )}
              </div>

              {/* Pending Invitations Section (only for OWNER/ADMIN) */}
              {canInvite && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Mail className="mr-2 h-5 w-5" />
                    Uitnodigingen in behandeling ({invitations?.length || 0})
                  </h2>

                  {isLoadingInvitations ? (
                    <Loading />
                  ) : invitations && invitations.length > 0 ? (
                    <div className="border rounded-lg divide-y">
                      {invitations.map((invitation) => (
                        <PendingInvitationRow
                          key={invitation.id}
                          invitation={invitation}
                          getRoleLabel={getRoleLabel}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 border border-dashed rounded-lg">
                      <Mail className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground text-sm">
                        Geen uitnodigingen in behandeling
                      </p>
                      <p className="text-muted-foreground text-xs mt-1">
                        Uitgenodigde personen verschijnen hier tot ze de uitnodiging accepteren
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Container>
        </main>

        {/* Invite Member Dialog */}
        {canInvite && (
          <InviteMemberDialog
            open={inviteDialogOpen}
            onOpenChange={setInviteDialogOpen}
            teamId={teamId}
            onSuccess={() => {
              // Query will automatically refetch
            }}
          />
        )}
      </div>
    </ProtectedRoute>
  )
}
