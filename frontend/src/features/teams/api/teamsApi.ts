/**
 * Teams API - API calls for teams module
 */

import apiClient from '@/shared/api/client'

// ========== Types ==========

export interface TeamDTO {
  id: number
  name: string
  description?: string | null
  ownerId: number
  status: 'ACTIVE' | 'ARCHIVED'
  createdAt: string
  updatedAt: string
}

export interface TeamMemberDTO {
  id: number
  teamId: number
  userId: number
  role: 'OWNER' | 'ADMIN' | 'MEMBER'
  status: 'ACTIVE' | 'INVITED' | 'LEFT'
  invitedById?: number | null
  joinedAt?: string | null
  createdAt: string
}

export interface TeamInvitationDTO {
  id: number
  teamId: number
  email: string
  role: 'OWNER' | 'ADMIN' | 'MEMBER'
  invitedById: number
  token: string
  expiresAt: string
  acceptedAt?: string | null
  createdAt: string
}

export interface MyTeamInvitationDTO {
  id: number
  teamId: number
  teamName: string
  role: 'OWNER' | 'ADMIN' | 'MEMBER'
  invitedById: number
  inviterName: string
  token: string
  expiresAt: string
  createdAt: string
}

export interface TeamKanbanShareDTO {
  id: number
  teamId: number
  ownerUserId: number
  sharedAt: string
  unsharedAt?: string | null
  createdAt: string
  updatedAt: string
}

// ========== API Calls ==========

/**
 * Create a new team
 * POST /api/v2/users/teams
 */
export async function createTeam(request: {
  name: string
  description?: string
}): Promise<TeamDTO> {
  const response = await apiClient.post<TeamDTO>(
    '/api/v2/users/teams',
    request
  )
  return response.data
}

/**
 * Get a team by ID
 * GET /api/v2/users/teams/{teamId}
 */
export async function getTeam(teamId: number): Promise<TeamDTO> {
  const response = await apiClient.get<TeamDTO>(
    `/api/v2/users/teams/${teamId}`
  )
  return response.data
}

/**
 * Get all teams for a user
 * GET /api/v2/users/teams/user/{userId}
 */
export async function getTeamsByUser(userId: number): Promise<TeamDTO[]> {
  const response = await apiClient.get<TeamDTO[]>(
    `/api/v2/users/teams/user/${userId}`
  )
  return response.data
}

/**
 * Get all pending invitations for a team
 * GET /api/v2/users/teams/{teamId}/invitations
 */
export async function getTeamInvitations(teamId: number): Promise<TeamInvitationDTO[]> {
  const response = await apiClient.get<TeamInvitationDTO[]>(
    `/api/v2/users/teams/${teamId}/invitations`
  )
  return response.data
}

/**
 * Get all members of a team
 * GET /api/v2/users/teams/{teamId}/members
 */
export async function getTeamMembers(teamId: number): Promise<TeamMemberDTO[]> {
  const response = await apiClient.get<TeamMemberDTO[]>(
    `/api/v2/users/teams/${teamId}/members`
  )
  return response.data
}

/**
 * Invite a team member
 * POST /api/v2/users/teams/{teamId}/members/invite
 */
export async function inviteTeamMember(
  teamId: number,
  request: {
    email: string
    role?: 'OWNER' | 'ADMIN' | 'MEMBER'
  }
): Promise<TeamInvitationDTO> {
  const response = await apiClient.post<TeamInvitationDTO>(
    `/api/v2/users/teams/${teamId}/members/invite`,
    request
  )
  return response.data
}

/**
 * Get invitations for the current user
 * GET /api/v2/users/team-invitations
 */
export async function getMyInvitations(): Promise<MyTeamInvitationDTO[]> {
  const response = await apiClient.get<MyTeamInvitationDTO[]>(
    '/api/v2/users/team-invitations'
  )
  return response.data
}

/**
 * Accept a team invitation
 * POST /api/v2/users/teams/invitations/{token}/accept
 */
export async function acceptTeamInvitation(
  token: string
): Promise<TeamMemberDTO> {
  const response = await apiClient.post<TeamMemberDTO>(
    `/api/v2/users/teams/invitations/${token}/accept`
  )
  return response.data
}

/**
 * Decline a team invitation
 * POST /api/v2/users/teams/invitations/{token}/decline
 */
export async function declineTeamInvitation(token: string): Promise<void> {
  await apiClient.post(`/api/v2/users/teams/invitations/${token}/decline`)
}

/**
 * Share team kanban board
 * POST /api/v2/users/teams/{teamId}/kanban/share
 */
export async function shareTeamKanban(teamId: number): Promise<TeamKanbanShareDTO> {
  const response = await apiClient.post<TeamKanbanShareDTO>(
    `/api/v2/users/teams/${teamId}/kanban/share`
  )
  return response.data
}

/**
 * Unshare team kanban board
 * POST /api/v2/users/teams/{teamId}/kanban/unshare
 */
export async function unshareTeamKanban(teamId: number): Promise<TeamKanbanShareDTO> {
  const response = await apiClient.post<TeamKanbanShareDTO>(
    `/api/v2/users/teams/${teamId}/kanban/unshare`
  )
  return response.data
}

/**
 * Get team kanban share status
 * GET /api/v2/users/teams/{teamId}/kanban/share
 */
export async function getTeamKanbanShare(teamId: number): Promise<TeamKanbanShareDTO | null> {
  try {
    const response = await apiClient.get<TeamKanbanShareDTO>(
      `/api/v2/users/teams/${teamId}/kanban/share`
    )
    return response.data
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null // Not shared
    }
    throw error
  }
}
