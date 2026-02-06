/**
 * Hook for fetching kanban items by user
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getKanbanItems, addKanbanItem, updateKanbanItemPosition, deleteKanbanItem } from '../api/goalsOkrApi'
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
