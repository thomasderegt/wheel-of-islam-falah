/**
 * Hook for fetching and managing user-specific objectives
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUserObjectivesByUserGoal, createUserObjective } from '../api/goalsOkrApi'
import type { UserObjectiveDTO } from '../api/goalsOkrApi'

/**
 * Get user-specific objectives by user goal
 */
export function useUserObjectivesByUserGoal(userGoalId: number | null) {
  return useQuery({
    queryKey: ['goals-okr', 'user-objectives', 'user-goal', userGoalId],
    queryFn: () => getUserObjectivesByUserGoal(userGoalId!),
    enabled: userGoalId !== null,
  })
}

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
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'user-goals', 'user', variables.userId] })
    },
  })
}
