/**
 * Hooks for user key result instances and custom key results
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getUserKeyResultInstancesByUserObjectiveInstance,
  createCustomKeyResult,
} from '../api/goalsOkrApi'

/**
 * Get user key result instances by user objective instance
 */
export function useUserKeyResultInstancesByUserObjectiveInstance(
  userObjectiveInstanceId: number | null
) {
  return useQuery({
    queryKey: ['goals-okr', 'user-key-result-instances', 'user-objective-instance', userObjectiveInstanceId],
    queryFn: () => getUserKeyResultInstancesByUserObjectiveInstance(userObjectiveInstanceId!),
    enabled: userObjectiveInstanceId !== null,
  })
}

/**
 * Hook for creating a custom key result (KeyResult + UserKeyResultInstance + Kanban)
 */
export function useCreateCustomKeyResult() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      userId,
      userObjectiveInstanceId,
      title,
      description,
      targetValue,
      unit,
    }: {
      userId: number
      userObjectiveInstanceId: number
      title: string
      description?: string
      targetValue: number
      unit: string
    }) =>
      createCustomKeyResult(userId, {
        userObjectiveInstanceId,
        title,
        description,
        targetValue,
        unit,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['goals-okr', 'user-key-result-instances', 'user-objective-instance', variables.userObjectiveInstanceId],
      })
      queryClient.invalidateQueries({
        queryKey: ['goals-okr', 'userKeyResultInstances', 'userObjectiveInstance', variables.userObjectiveInstanceId],
      })
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'kanban-items'] })
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'user-objective-instances'] })
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'keyResults'] })
    },
  })
}
