/**
 * Hooks for teams
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createTeam,
  getTeam,
  getTeamsByUser,
  getTeamMembers,
  getTeamInvitations,
  getMyInvitations,
  inviteTeamMember,
  acceptTeamInvitation,
  declineTeamInvitation,
} from '../api/teamsApi'
import type { TeamDTO, TeamMemberDTO, TeamInvitationDTO } from '../api/teamsApi'

/**
 * Get teams by user
 */
export function useTeamsByUser(userId: number | null) {
  return useQuery({
    queryKey: ['teams', 'user', userId],
    queryFn: () => getTeamsByUser(userId!),
    enabled: userId !== null,
  })
}

/**
 * Get a team by ID
 */
export function useTeam(teamId: number | null) {
  return useQuery({
    queryKey: ['teams', teamId],
    queryFn: () => getTeam(teamId!),
    enabled: teamId !== null,
  })
}

/**
 * Get team members
 */
export function useTeamMembers(teamId: number | null) {
  return useQuery({
    queryKey: ['teams', teamId, 'members'],
    queryFn: () => getTeamMembers(teamId!),
    enabled: teamId !== null,
  })
}

/**
 * Get pending team invitations (only for OWNER/ADMIN)
 */
export function useTeamInvitations(teamId: number | null) {
  return useQuery({
    queryKey: ['teams', teamId, 'invitations'],
    queryFn: () => getTeamInvitations(teamId!),
    enabled: teamId !== null,
  })
}

/**
 * Get invitations for the current user (invitations received by me)
 */
export function useMyInvitations() {
  return useQuery({
    queryKey: ['teams', 'my-invitations'],
    queryFn: getMyInvitations,
  })
}

/**
 * Hook for creating a team
 */
export function useCreateTeam() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: { name: string; description?: string }) =>
      createTeam(request),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
      queryClient.invalidateQueries({ queryKey: ['teams', 'user', data.ownerId] })
    },
  })
}

/**
 * Hook for inviting a team member
 */
export function useInviteTeamMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      teamId,
      email,
      role,
    }: {
      teamId: number
      email: string
      role?: 'OWNER' | 'ADMIN' | 'MEMBER'
    }) => inviteTeamMember(teamId, { email, role }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['teams', variables.teamId, 'members'] })
      queryClient.invalidateQueries({ queryKey: ['teams', variables.teamId, 'invitations'] })
    },
  })
}

/**
 * Hook for accepting a team invitation
 */
export function useAcceptTeamInvitation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (token: string) => acceptTeamInvitation(token),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
      queryClient.invalidateQueries({ queryKey: ['teams', data.teamId, 'members'] })
      queryClient.invalidateQueries({ queryKey: ['teams', 'my-invitations'] })
    },
  })
}

/**
 * Hook for declining a team invitation
 */
export function useDeclineTeamInvitation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (token: string) => declineTeamInvitation(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams', 'my-invitations'] })
    },
  })
}
