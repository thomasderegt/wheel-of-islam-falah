/**
 * Hook for fetching initiatives by user objective instance
 */

import { useQuery } from '@tanstack/react-query'
import { getInitiativesByUserObjectiveInstance } from '../api/goalsOkrApi'

/**
 * Get initiatives by user objective instance
 */
export function useInitiativesByUserObjectiveInstance(userObjectiveInstanceId: number | null) {
  return useQuery({
    queryKey: ['goals-okr', 'initiatives', 'userObjectiveInstance', userObjectiveInstanceId],
    queryFn: () => getInitiativesByUserObjectiveInstance(userObjectiveInstanceId!),
    enabled: userObjectiveInstanceId !== null,
  })
}
