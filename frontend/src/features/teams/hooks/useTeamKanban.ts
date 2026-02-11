/**
 * Hooks for team kanban sharing
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { shareTeamKanban, unshareTeamKanban, getTeamKanbanShare } from '../api/teamsApi'
import type { TeamKanbanShareDTO } from '../api/teamsApi'

/**
 * Get team kanban share status
 */
export function useTeamKanbanShare(teamId: number | null) {
  return useQuery({
    queryKey: ['teams', 'kanban-share', teamId],
    queryFn: () => getTeamKanbanShare(teamId!),
    enabled: teamId !== null,
  })
}

/**
 * Share team kanban board
 */
export function useShareTeamKanban() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (teamId: number) => shareTeamKanban(teamId),
    onSuccess: (_, teamId) => {
      queryClient.invalidateQueries({ queryKey: ['teams', 'kanban-share', teamId] })
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'kanban-items', 'team', teamId] })
    },
  })
}

/**
 * Unshare team kanban board
 */
export function useUnshareTeamKanban() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (teamId: number) => unshareTeamKanban(teamId),
    onSuccess: (_, teamId) => {
      queryClient.invalidateQueries({ queryKey: ['teams', 'kanban-share', teamId] })
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'kanban-items', 'team', teamId] })
    },
  })
}
