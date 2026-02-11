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
