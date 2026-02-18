/**
 * Hook for fetching kanban items by user
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getKanbanItems, getTeamKanbanItems, addKanbanItem, updateKanbanItemPosition, updateKanbanItemNotes, deleteKanbanItem } from '../api/goalsOkrApi'
import type { KanbanItemDTO } from '../api/goalsOkrApi'

/**
 * Get kanban items by user
 */
export function useKanbanItems(userId: number | null) {
  return useQuery({
    queryKey: ['goals-okr', 'kanban-items', 'user', userId],
    queryFn: () => getKanbanItems(userId!),
    enabled: userId !== null,
  })
}

/**
 * Hook for adding a kanban item
 */
export function useAddKanbanItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: { userId: number; itemType: 'GOAL' | 'OBJECTIVE' | 'KEY_RESULT' | 'INITIATIVE'; itemId: number }) =>
      addKanbanItem(request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'kanban-items', 'user', variables.userId] })
      if (variables.itemType === 'OBJECTIVE') {
        queryClient.invalidateQueries({ queryKey: ['goals-okr', 'userObjectiveInstances'] })
      }
    },
  })
}

/**
 * Hook for updating kanban item position
 */
export function useUpdateKanbanItemPosition() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ itemId, columnName, position }: { itemId: number; columnName: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE'; position: number }) =>
      updateKanbanItemPosition(itemId, columnName, position),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'kanban-items', 'user', data.userId] })
    },
  })
}

/**
 * Hook for updating kanban item notes
 */
export function useUpdateKanbanItemNotes() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ itemId, notes }: { itemId: number; notes: string | null }) =>
      updateKanbanItemNotes(itemId, notes),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'kanban-items', 'user', data.userId] })
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'kanban-item', data.id] })
    },
  })
}

/**
 * Hook for deleting a kanban item
 */
export function useDeleteKanbanItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ itemId, userId }: { itemId: number; userId: number }) =>
      deleteKanbanItem(itemId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'kanban-items', 'user', variables.userId] })
    },
  })
}

/**
 * Get team kanban items (read-only, from team owner)
 */
export function useTeamKanbanItems(teamId: number | null) {
  return useQuery({
    queryKey: ['goals-okr', 'kanban-items', 'team', teamId],
    queryFn: () => getTeamKanbanItems(teamId!),
    enabled: teamId !== null,
  })
}
