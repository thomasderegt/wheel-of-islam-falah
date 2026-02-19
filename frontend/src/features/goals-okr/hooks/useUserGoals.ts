/**
 * Hook for fetching and managing user-specific goals
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUserGoals, createUserGoal, createPersonalGoal, createCustomObjective } from '../api/goalsOkrApi'
import type { UserGoalDTO } from '../api/goalsOkrApi'

/**
 * Get user-specific goals by user (OLD APPROACH - kept for backward compatibility)
 * @deprecated Use UserGoalInstances instead
 */
export function useUserGoals(userId: number | null) {
  return useQuery({
    queryKey: ['goals-okr', 'user-goals', 'user', userId],
    queryFn: () => getUserGoals(userId!),
    enabled: userId !== null,
  })
}

/**
 * Hook for creating a personal goal.
 * @deprecated Goal layer removed – this mutation will throw. Use Kanban to add objectives.
 */
export function useCreatePersonalGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, ...request }: { userId: number; title: string; description?: string; lifeDomainId: number }) =>
      createPersonalGoal(userId, request),
    onSuccess: (_, variables) => {
      // Invalidate kanban items since a new item is automatically added
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'kanban-items', 'user', variables.userId] })
      // Invalidate user goal instances
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'user-goal-instances', 'user', variables.userId] })
    },
  })
}

/**
 * Hook for creating a custom objective (Objective template + UserObjectiveInstance + Kanban item)
 */
export function useCreateCustomObjective() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, ...request }: { userId: number; lifeDomainId: number; title: string; description?: string }) =>
      createCustomObjective(userId, request),
    onSuccess: (_, variables) => {
      // Invalidate kanban items since a new item is automatically added
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'kanban-items', 'user', variables.userId] })
      // Invalidate user objective instances
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'user-objective-instances'] })
      // Invalidate objectives list so the new custom objective appears
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'objectives'] })
    },
  })
}

/** @deprecated Use useCreateCustomObjective instead */
export const useCreatePersonalObjective = useCreateCustomObjective

/**
 * Hook for creating a user-specific goal (OLD APPROACH - kept for backward compatibility)
 * @deprecated Use useCreatePersonalGoal instead
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
