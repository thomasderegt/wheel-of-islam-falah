/**
 * Hook for creating user-specific objectives (goal layer removed).
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createUserObjective } from '../api/goalsOkrApi'

/**
 * Hook for creating a user-specific objective
 */
export function useCreateUserObjective() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, ...request }: { userId: number; userGoalId: number; title: string; description?: string }) =>
      createUserObjective(userId, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'user-objectives', 'user-goal', variables.userGoalId] })
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'user-objective-instances'] })
    },
  })
}
