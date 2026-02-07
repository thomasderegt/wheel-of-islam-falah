/**
 * Hook for fetching and managing user-specific key results
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUserKeyResultsByUserObjective, createUserKeyResult } from '../api/goalsOkrApi'
import type { UserKeyResultDTO } from '../api/goalsOkrApi'

/**
 * Get user-specific key results by user objective
 */
export function useUserKeyResultsByUserObjective(userObjectiveId: number | null) {
  return useQuery({
    queryKey: ['goals-okr', 'user-key-results', 'user-objective', userObjectiveId],
    queryFn: () => getUserKeyResultsByUserObjective(userObjectiveId!),
    enabled: userObjectiveId !== null,
  })
}

/**
 * Hook for creating a user-specific key result
 */
export function useCreateUserKeyResult() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, ...request }: { userId: number; userObjectiveId: number; title: string; description?: string; targetValue?: number; unit?: string }) =>
      createUserKeyResult(userId, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'user-key-results', 'user-objective', variables.userObjectiveId] })
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'user-objectives', 'user-goal'] })
    },
  })
}
