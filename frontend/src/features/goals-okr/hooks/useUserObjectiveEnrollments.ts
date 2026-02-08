/**
 * Hook for fetching user objective enrollments
 */

import { useQuery } from '@tanstack/react-query'
import { getUserObjectiveEnrollments } from '../api/goalsOkrApi'

/**
 * Get user objective enrollments for a user
 */
export function useUserObjectiveEnrollments(userId: number | null) {
  return useQuery({
    queryKey: ['goals-okr', 'userObjectiveEnrollments', 'user', userId],
    queryFn: () => getUserObjectiveEnrollments(userId!),
    enabled: userId !== null,
  })
}
