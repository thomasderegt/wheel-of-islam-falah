/**
 * Hook for fetching and managing user-specific goals
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUserGoals, createUserGoal } from '../api/goalsOkrApi'
import type { UserGoalDTO } from '../api/goalsOkrApi'

/**
 * Get user-specific goals by user
 */
export function useUserGoals(userId: number | null) {
  return useQuery({
    queryKey: ['goals-okr', 'user-goals', 'user', userId],
    queryFn: () => getUserGoals(userId!),
    enabled: userId !== null,
  })
}

/**
 * Hook for creating a user-specific goal
 */
export function useCreateUserGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, ...request }: { userId: number; title: string; description?: string; lifeDomainId?: number }) =>
      createUserGoal(userId, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'user-goals', 'user', variables.userId] })
    },
  })
}
