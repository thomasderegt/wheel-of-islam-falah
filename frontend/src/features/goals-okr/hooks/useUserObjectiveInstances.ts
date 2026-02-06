/**
 * Hook for fetching user objective instances
 */

import { useQuery } from '@tanstack/react-query'
import { getUserObjectiveInstances } from '../api/goalsOkrApi'

/**
 * Get user objective instances for a user
 */
export function useUserObjectiveInstances(userId: number | null) {
  return useQuery({
    queryKey: ['goals-okr', 'userObjectiveInstances', 'user', userId],
    queryFn: () => getUserObjectiveInstances(userId!),
    enabled: userId !== null,
  })
}
