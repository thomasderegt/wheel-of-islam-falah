/**
 * Hooks for creating custom objectives (goal layer removed).
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCustomObjective } from '../api/goalsOkrApi'

/**
 * Hook for creating a custom objective (Objective template + UserObjectiveInstance + Kanban item)
 */
export function useCreateCustomObjective() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, ...request }: { userId: number; lifeDomainId: number; title: string; description?: string }) =>
      createCustomObjective(userId, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'kanban-items', 'user', variables.userId] })
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'user-objective-instances'] })
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'objectives'] })
    },
  })
}

/** @deprecated Use useCreateCustomObjective instead */
export const useCreatePersonalObjective = useCreateCustomObjective
